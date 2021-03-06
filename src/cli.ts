import cac from "cac";
import exit from "exit";
import latestVersion from "latest-version";
import semver from "semver";

import * as commands from "./commands";
import { CLIENT_PKG, CONFIG_FILE, NAME, PACKAGE, VERSION } from "./const";
import { logger, ucFirst } from "./lib";
import * as middlewares from "./middlewares";
import * as messages from "./messages";
import chalk from "chalk";

const cli = cac(NAME);

cli.command("").action(options => {
	commands._default(cli, options);
});

cli.command("login <token>", "Log in to Dico.app").action(async options => {
	await commands.signin(cli, options);
});

cli.command("logout", "Log out of Dico.app").action(options => {
	commands.signout(cli, options);
});

cli.command("whoami", "Display current user").action(async options => {
	await commands.whoami(cli, options);
});

cli
	.command("init", "Init a dico in your project")
	.option("-f, --force", `Override existing ${chalk.cyan(CONFIG_FILE)}`)
	.action(async options => {
		await middlewares.signedInOnly();
		await commands.init(cli, options);
	});

cli.command("build", "Build current project dico").action(async options => {
	await middlewares.signedInOnly();
	await commands.build(cli, options);
});

cli
	.command("push", "Push current dico to Dico.app")
	.option(
		"-b, --build",
		`Also build current project dico (performs ${chalk.cyan(
			"dico build"
		)} before pushing)`
	)
	.option("-f, --force", "Force push, even if not in sync (not recommended)")
	.action(async options => {
		await middlewares.signedInOnly();
		await commands.push(cli, options);
	});

cli
	.command(
		"fetch [...baseOrBaseAndPath]",
		`Fetch current dico from Dico.app using ${chalk.cyan(CLIENT_PKG)}`
	)
	.action(async options => {
		await commands.fetch(cli, options);
	});

cli.version(VERSION);
cli.help(commands.help);

const run = async (): Promise<void> => {
	try {
		cli.parse(process.argv, { run: false });
		await cli.runMatchedCommand();
	} catch (error) {
		if (error.message && typeof error.message === "string") {
			logger.error(ucFirst(error.message));
		} else if (error.status === 401) {
			logger.error(messages.Unauthorized);
		} else {
			logger.fatal("");
			console.log(error);
			console.log("");
		}
		exit(1);
	}

	const version = await latestVersion(PACKAGE);
	if (semver.gt(version, VERSION)) {
		console.log("");
		logger.info(
			`A new version of \`${PACKAGE}\` is available!\n\n  Install it with:\n  $ npm install --global ${PACKAGE}@${version}\n`
		);
	}
};

process.on("unhandledRejection", error => {
	logger.fatal(error);
	exit(2);
});

run();
