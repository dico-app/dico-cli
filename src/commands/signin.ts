import { CAC } from "cac";
import { logger } from "../lib";
import * as dicorc from "../core/dicorc";
import exit from "exit";

export const signin = async (_: CAC, token: string): Promise<void> => {
	if (token.length !== 64) {
		logger.error("Invalid token format, make sure you copied it correctly!");
		exit(1);
	}

	try {
		const user = await dicorc.signin(token);
		console.log("");
		logger.success("Logged in as `%s <%s>`\n", user?.fullname, user?.email);
	} catch (error) {
		if (error.status === 401) {
			logger.error("Invalid token, make sure you copied it correctly!");
			exit(1);
		} else {
			throw error;
		}
	}
};
