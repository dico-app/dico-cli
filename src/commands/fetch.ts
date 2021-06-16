import { CAC } from "cac";
import execa from "execa";
import exit from "exit";
import { logger } from "../lib";
import * as messages from "../messages";

export const fetch = async (_: CAC, base = "./"): Promise<void> => {
	try {
		execa.sync("node_modules/.bin/dico-fetch", [base], {
			stdin: process.stdin,
			stdout: process.stdout,
			stderr: process.stderr
		});
	} catch (error) {
		logger.fatal(error.message);
		logger.info(messages.IsDicoClientInstalled);
		exit(1);
	}
};
