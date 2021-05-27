import { CAC } from "cac";
import exit from "exit";
import { NAME } from "../const";
import { logger } from "../lib";

export const _default = (cli: CAC, _: { [key: string]: never }): void => {
	const command = cli.args.join(" ");

	if (command) {
		logger.error(
			"Invalid command: `%s`, run `%s --help` for all commands",
			command,
			NAME
		);
		exit(1);
	} else {
		cli.outputHelp();
	}
};
