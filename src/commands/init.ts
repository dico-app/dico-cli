import { CAC } from "cac";
// @ts-expect-error it's our fork and we don't care
import UpdateRenderer from "@lihbr/listr-update-renderer";
import Listr, { ListrTaskWrapper } from "listr";
import { Observable } from "rxjs";
import inquirer from "inquirer";

import { lineBreak, logger } from "../lib";
import * as client from "../core/client";
import * as dicojson from "../core/dicojson";
import { Dico, Role } from "../types";
import * as messages from "../messages";
import { DEFAULT_SOURCES_PATTERN, DEFAULT_TIMEOUT } from "../const";
import exit from "exit";

class InitError extends Error {}

const getDicos = new Listr(
	[
		{
			title: "Looking for dicos...",
			// @ts-expect-error listr types are broken
			task: (ctx: { dicos: Dico[] }, task: ListrTaskWrapper) =>
				new Observable(observer => {
					Promise.all([
						client.dico.select.all.run(),
						new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
					])
						.then(([dicos, _]) => {
							const filteredDicos = dicos.filter(dico =>
								[Role.Admin, Role.Developer].includes(dico.current_user_role)
							);

							if (!filteredDicos.length) {
								observer.error(new InitError(messages.NoDicoFoundDeveloper));
							}

							if (dicos.length === 1) {
								task.title = "One dico found";
							} else {
								task.title = `${dicos.length} dicos found`;
							}

							ctx.dicos = dicos;
							observer.complete();
						})
						.catch(error => {
							observer.error(error);
						});
				})
		}
	],
	{ renderer: UpdateRenderer }
);

const pickDico = {
	run: async (dicos: Dico[]) =>
		await inquirer.prompt<{ dico: Dico }>([
			{
				type: "list",
				name: "dico",
				message: "Pick the dico you wish to init in current working direcotry:",
				choices: dicos.map(dico => ({
					name: `${dico.slug} (${dico.name})`,
					value: dico
				})),
				loop: false,
				pageSize: 12
			}
		])
};

const initConfig = {
	run: async (dico: Dico) =>
		await new Listr(
			[
				{
					title: "Creating `dico.config.json`...",
					// @ts-expect-error listr types are broken
					task: (ctx: { config: ConfigJSON }, task: ListrTaskWrapper) =>
						new Observable(observer => {
							Promise.all([
								client.structure.select.byDicoSlug.run(dico.slug),
								new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
							])
								.then(([structure, _]) => {
									const config = {
										dico: dico.slug,
										sources: DEFAULT_SOURCES_PATTERN,
										schema: structure.schema,
										updated_at: structure.updated_at
									};

									try {
										dicojson.write(config);
									} catch (error) {
										observer.error(error);
									}

									task.title = "`dico.config.json` created!";
									ctx.config = config;
									observer.complete();
								})
								.catch(error => {
									observer.error(error);
								});
						})
				}
			],
			{ renderer: UpdateRenderer }
		).run()
};

export const init = async (
	_: CAC,
	__: { [key: string]: never }
): Promise<void> => {
	if (dicojson.exists()) {
		logger.error(messages.DicoJSONAlreadyExists, dicojson.getPath());
		exit(1);
	}

	lineBreak();
	const { dicos } = await getDicos.run();
	const { dico } = await pickDico.run(dicos);
	await initConfig.run(dico);
	lineBreak();
};
