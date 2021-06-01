import { CAC } from "cac";
import * as dicorc from "../core/dicorc";
import * as user from "../core/user";
import { lineBreak, logger } from "../lib";
import * as messages from "../messages";

export const whoami = async (
	_: CAC,
	__: { [key: string]: never }
): Promise<void> => {
	if (await user.isSignedIn()) {
		const { user: signedInUser } = dicorc.read();
		lineBreak();
		logger.info(
			messages.SignedInAs,
			signedInUser?.fullname,
			signedInUser?.email
		);
		lineBreak();
	} else {
		lineBreak();
		logger.info(`${messages.NotSignedIn}`);
		lineBreak();
	}
};
