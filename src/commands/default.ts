import { CAC } from "cac";
import exit from "exit";
import { logger } from "../lib";
import * as messages from "../messages";

export const _default = (cli: CAC, _: { [key: string]: unknown }): void => {
	const command = cli.args.join(" ");

	if (command) {
		logger.error(messages.InvalidCommand, command);
		exit(1);
	} else {
		cli.outputHelp();
	}
};
