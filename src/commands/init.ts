import { CAC } from "cac";
// @ts-expect-error it's our fork and we don't care
import UpdateRenderer from "@lihbr/listr-update-renderer";
import Listr, { ListrTaskWrapper } from "listr";
import { Observable } from "rxjs";
import inquirer from "inquirer";

import { lineBreak, logger } from "../lib";
import * as client from "../core/client";
import * as dicojson from "../core/dicojson";
import * as pkgjson from "../core/pkgjson";
import { Dico, Role } from "../types";
import * as messages from "../messages";
import {
	CLIENT_PKG,
	CONFIG_FILE,
	DEFAULT_SOURCES_PATTERN,
	DEFAULT_TIMEOUT
} from "../const";
import exit from "exit";
import chalk from "chalk";

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
					title: `Creating ${chalk.cyan(CONFIG_FILE)}...`,
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

									task.title = `${chalk.cyan(CONFIG_FILE)} created`;
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

const askInstallClient = {
	run: async () =>
		await inquirer.prompt<{ yes: boolean }>([
			{
				type: "confirm",
				name: "yes",
				message: `Would you like us to install and configure ${chalk.cyan(
					CLIENT_PKG
				)} (our client library) for you?\n  This will edit your ${chalk.cyan(
					"package.json"
				)} file and create the client for you`
			}
		])
};

const installClient = {
	run: async (manifest: pkgjson.Manifest) =>
		await new Listr(
			[
				{
					title: `Installing ${chalk.cyan(CLIENT_PKG)} with ${chalk.cyan(
						pkgjson.getPackageManager() === "npm" ? "npm" : "Yarn"
					)}...`,
					// @ts-expect-error listr types are broken
					task: (_: pkgjson.Manifest, task: ListrTaskWrapper) =>
						new Observable(observer => {
							Promise.all([
								pkgjson.installClient(),
								new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
							])
								.then(([_, __]) => {
									task.title = `${chalk.cyan(CLIENT_PKG)} installed`;
									observer.complete();
								})
								.catch(error => {
									observer.error(error);
								});
						})
				},
				{
					title: `Updating ${chalk.cyan("package.json")} scripts...`,
					// @ts-expect-error listr types are broken
					task: (_: pkgjson.Manifest, task: ListrTaskWrapper) =>
						new Observable(observer => {
							Promise.all([
								pkgjson.updateScripts(manifest),
								new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
							])
								.then(([_, __]) => {
									task.title = `${chalk.cyan("package.json")} scripts updated`;
									observer.complete();
								})
								.catch(error => {
									observer.error(error);
								});
						})
				},
				{
					title: `Creating ${chalk.cyan(
						`dico.${pkgjson.isTypeScript() ? "ts" : "js"}`
					)}...`,
					// @ts-expect-error listr types are broken
					task: (_: pkgjson.Manifest, task: ListrTaskWrapper) =>
						new Observable(observer => {
							Promise.all([
								pkgjson.createDicoFile(manifest),
								new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
							])
								.then(([_, __]) => {
									task.title = `${chalk.cyan(
										`dico.${pkgjson.isTypeScript() ? "ts" : "js"}`
									)} created`;
									observer.complete();
								})
								.catch(error => {
									observer.error(error);
								});
						})
				}
			],
			{ renderer: UpdateRenderer }
		).run(manifest)
};

export const init = async (
	_: CAC,
	options: { [key: string]: unknown }
): Promise<void> => {
	if (!options.force && dicojson.exists()) {
		logger.error(messages.DicoJSONAlreadyExists, dicojson.getPath());
		exit(1);
	}

	if (options.force) {
		logger.warn(messages.CommandWithForce, "init");
	} else {
		lineBreak();
	}
	const { dicos } = await getDicos.run();
	const { dico } = await pickDico.run(dicos);
	await initConfig.run(dico);
	lineBreak();

	// Try setup project if possible
	if (pkgjson.exists()) {
		if (!pkgjson.isInstalled()) {
			const manifest = pkgjson.detectFramework();
			logger.info(messages.FrameworkDetected, manifest.name);
			const { yes } = await askInstallClient.run();
			if (yes) {
				await installClient.run(manifest);
				logger.success(messages.AutomaticClientInstallSuccess);
			} else {
				logger.success(messages.NoAutomaticClientInstall);
				logger.info(messages.InstallClientManually);
			}
		} else {
			logger.info(messages.ClientAlreadyInstalledSkip);
		}
	} else {
		logger.info(messages.PkgJSONNotDetected);
		logger.info(messages.InstallClientManually);
	}

	lineBreak();

	logger.success(messages.CommandSuccessful, "init");
	lineBreak();
};
