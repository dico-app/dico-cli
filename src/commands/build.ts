import chalk from "chalk";
import { CAC } from "cac";
// @ts-expect-error it's our fork and we don't care
import UpdateRenderer from "@lihbr/listr-update-renderer";
import Listr, { ListrTaskWrapper } from "listr";
import { Observable } from "rxjs";

import { lineBreak, logger } from "../lib";
import * as dicojson from "../core/dicojson";
import * as project from "../core/project";
import * as messages from "../messages";
import exit from "exit";
import { DEFAULT_TIMEOUT } from "../const";
import { ConfigJSON, ProjectKey } from "../types";

class BuildError extends Error {}

interface BuildDicoContext {
	paths: string[];
	keys: ProjectKey[];
	schema: ConfigJSON["schema"];
	conflicts: ProjectKey[][];
}

const buildDico = new Listr(
	[
		{
			title: "Looking for source files...",
			// @ts-expect-error listr types are broken
			task: (ctx: BuildDicoContext, task: ListrTaskWrapper) =>
				new Observable(observer => {
					Promise.all([
						project.findSources(),
						new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT * 0.5))
					])
						.then(([paths, _]) => {
							if (paths.length === 0) {
								observer.error(new BuildError(messages.NoSourceFilesFound));
							}

							if (paths.length === 1) {
								task.title = "One source file found";
							} else {
								task.title = `${paths.length} source files found`;
							}

							ctx.paths = paths;
							observer.complete();
						})
						.catch(error => {
							observer.error(error);
						});
				})
		},
		{
			title: "Looking for keys in source files...",
			// @ts-expect-error listr types are broken
			task: (ctx: BuildDicoContext, task: ListrTaskWrapper) =>
				new Observable(observer => {
					const promises = [];
					for (let i = 0; i < ctx.paths.length; i++) {
						const path = ctx.paths[i];

						promises.push(
							new Promise<ProjectKey[]>((res, rej) => {
								setTimeout(() => {
									observer.next(`(${i + 1}/${ctx.paths.length}) ${path}`);
									try {
										const keys = project.crawlFile(path);
										res(keys);
									} catch (error) {
										rej(error);
									}
								}, (DEFAULT_TIMEOUT / Math.max(ctx.paths.length, 24)) * i);
							})
						);
					}

					Promise.all(promises)
						.then(keys => {
							const flatKeys = keys.flat();

							const uniqueKeys = flatKeys.filter((keyObj, i, flatKeys) => {
								return flatKeys.findIndex(i => i.key === keyObj.key) === i;
							});

							if (uniqueKeys.length === 1) {
								task.title = "One key found";
							} else {
								task.title = `${uniqueKeys.length} keys found`;
							}

							ctx.keys = uniqueKeys;
							observer.complete();
						})
						.catch(error => {
							observer.error(error);
						});
				})
		},
		{
			title: "Updating schema...",
			// @ts-expect-error listr types are broken
			task: (ctx: BuildDicoContext, task: ListrTaskWrapper) =>
				new Observable(observer => {
					Promise.all([
						new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT * 0.5))
					]).then(_ => {
						try {
							const { schema, conflicts } = dicojson.createSchema(ctx.keys);

							ctx.schema = schema;
							ctx.conflicts = conflicts;

							if (conflicts.length) {
								if (conflicts.length === 1) {
									throw new BuildError(
										`1 conflict detected, fix it and try again`
									);
								} else {
									throw new BuildError(
										`${conflicts.length} conflicts detected, fix them and try again`
									);
								}
							}

							// Update config file
							const config = dicojson.read();
							config.schema = schema;
							dicojson.write(config);

							task.title = "Schema updated";
							observer.complete();
						} catch (error) {
							observer.error(error);
						}
					});
				})
		}
	],
	{ renderer: UpdateRenderer }
);

export const build = async (
	_: CAC,
	options: { [key: string]: unknown }
): Promise<void> => {
	if (!dicojson.exists()) {
		logger.error(messages.DicoJSONNotFound, dicojson.getPath());
		exit(1);
	}

	lineBreak();

	try {
		await buildDico.run();
	} catch (error) {
		// Handle conflicts error
		if (error instanceof BuildError && error.message.includes("conflict")) {
			// @ts-expect-error listr types are broken
			const context: BuildDicoContext = error.context;

			if (!context.conflicts.length) {
				throw error;
			}

			logger.error(`${error.message}:`);
			context.conflicts.forEach(conflict => {
				if (conflict.length === 1) {
					console.log(
						`  Key ${chalk.cyan(conflict[0].key)} (${chalk.cyan(
							`${conflict[0].file}:${conflict[0].line}:${conflict[0].column}`
						)}) is conflicting with at least another unknown declaration, this shouldn't happen`
					);
				} else {
					console.log(
						`  Key ${chalk.cyan(conflict[0].key)} (${chalk.cyan(
							`${conflict[0].file}:${conflict[0].line}:${conflict[0].column}`
						)}) is conflicting with key ${chalk.cyan(
							conflict[1].key
						)} (${chalk.cyan(
							`${conflict[1].file}:${conflict[1].line}:${conflict[1].column}`
						)})${
							conflict.length > 2
								? ` and ${conflict.length - 2} more from that collection...`
								: ""
						}`
					);
				}
			});

			lineBreak();
			logger.info(
				"Conflicts happen when you have a key declared at the same location of a collection"
			);
			lineBreak();

			exit(1);
		} else {
			throw error;
		}
	}

	logger.success(messages.CommandSuccessful, "build");
	lineBreak();
};
