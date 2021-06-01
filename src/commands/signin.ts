import { CAC } from "cac";
import { lineBreak, logger } from "../lib";
import * as user from "../core/user";
import exit from "exit";
import * as messages from "../messages";

export const signin = async (_: CAC, token: string): Promise<void> => {
	if (token.length !== 64) {
		logger.error(messages.InvalidTokenFormat);
		exit(1);
	}

	try {
		const signedInUser = await user.signin(token);
		lineBreak();
		logger.success(
			messages.SignedInAs,
			signedInUser?.fullname,
			signedInUser?.email
		);
		lineBreak();
	} catch (error) {
		if (error.status === 401) {
			logger.error(messages.InvalidToken);
			exit(1);
		} else {
			throw error;
		}
	}
};
