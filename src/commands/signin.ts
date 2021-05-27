import { CAC } from "cac";
import { logger } from "../lib";
import * as user from "../core/user";
import exit from "exit";

export const signin = async (_: CAC, token: string): Promise<void> => {
	if (token.length !== 64) {
		logger.error("Invalid token format, make sure you copied it correctly!");
		exit(1);
	}

	try {
		const signedInUser = await user.signin(token);
		console.log("");
		logger.success(
			"Logged in as `%s <%s>`\n",
			signedInUser?.fullname,
			signedInUser?.email
		);
	} catch (error) {
		if (error.status === 401) {
			logger.error("Invalid token, make sure you copied it correctly!");
			exit(1);
		} else {
			throw error;
		}
	}
};
