import chalk from "chalk";
import { CAC } from "cac";
// @ts-expect-error it's our fork and we don't care
import UpdateRenderer from "@lihbr/listr-update-renderer";
import Listr, { ListrTaskWrapper } from "listr";
import { Observable } from "rxjs";

import { lineBreak, logger } from "../lib";
import * as dicojson from "../core/dicojson";
import * as client from "../core/client";
import * as messages from "../messages";
import exit from "exit";
import { DEFAULT_TIMEOUT, JSON_FILE } from "../const";
import { ConfigJSON, ProjectKey } from "../types";
import { build } from "./build";

class PushError extends Error {}

interface PushDicoContext {
	config: ConfigJSON;
	force: boolean;
}

const pushDico = new Listr(
	[
		{
			title: "Checking production dico status...",
			// @ts-expect-error listr types are broken
			task: (ctx: PushDicoContext, task: ListrTaskWrapper) =>
				new Observable(observer => {
					Promise.all([
						client.structure.select.byDicoSlug.run(ctx.config.dico),
						new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
					])
						.then(([structure, _]) => {
							if (structure.updated_at !== ctx.config.updated_at) {
								if (!ctx.force) {
									observer.error(
										new PushError(messages.ProductionDicoNotInSync)
									);
								} else {
									task.title = `${messages.ProductionDicoNotInSync}, ignoring because of \`force\` flag!`;
								}
							}

							task.title = `Production dico is in sync with local \`${JSON_FILE}\``;

							observer.complete();
						})
						.catch(error => {
							observer.error(error);
						});
				})
		},
		{
			title: "Uploading new schema to Dico.app...",
			// @ts-expect-error listr types are broken
			task: (ctx: PushDicoContext, task: ListrTaskWrapper) =>
				new Observable(observer => {
					Promise.all([
						client.structure.update.byDicoSlug.schema.run(
							ctx.config.dico,
							ctx.config.schema
						),
						new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
					])
						.then(([structure, _]) => {
							// Update config file
							const config = dicojson.read();
							config.updated_at = structure.updated_at;
							dicojson.write(config);

							task.title = "New schema uploaded";
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

export const push = async (
	cli: CAC,
	options: { [key: string]: unknown }
): Promise<void> => {
	if (!dicojson.exists()) {
		logger.error(messages.DicoJSONNotFound, dicojson.getPath());
		exit(1);
	}

	if (options.force) {
		logger.warn(messages.CommandWithForce, "init");
	} else {
		lineBreak();
	}

	if (options.build) {
		logger.info(messages.CommandWithFlagCommand, "push", "build", "build");
		await build(cli, {});
		logger.info(messages.NowStartingCommand, "push");
		lineBreak();
	}

	try {
		await pushDico.run({
			config: dicojson.read(),
			force: !!options.force
		});
	} catch (error) {
		// Handle conflicts error
		if (error instanceof PushError && error.message.includes("not in sync")) {
			logger.error(`${error.message}:`);

			logger.info(
				`Sync errors happen when your \`${JSON_FILE}\` file is older than the one available on Dico.app\n  Try merging your branch with the most up-to-date one on git before trying again\n  Alternatively you can use the \`force\` flag to bypass sync errors (not recommended)`
			);
			lineBreak();

			exit(1);
		} else {
			throw error;
		}
	}

	logger.success(messages.CommandSuccessful, "push");
	lineBreak();
};
