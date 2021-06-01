import { CAC } from "cac";
import exit from "exit";
import { NAME } from "../const";
import { logger } from "../lib";
import * as messages from "../messages";

export const _default = (cli: CAC, _: { [key: string]: never }): void => {
	const command = cli.args.join(" ");

	if (command) {
		logger.error(messages.InvalidCommand, command, NAME);
		exit(1);
	} else {
		cli.outputHelp();
	}
};
