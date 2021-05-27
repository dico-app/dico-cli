import { CAC } from "cac";
import * as dicorc from "../core/dicorc";
import * as user from "../core/user";
import { logger } from "../lib";

export const whoami = async (
	_: CAC,
	__: { [key: string]: never }
): Promise<void> => {
	if (await user.isSignedIn()) {
		const { user: signedInUser } = dicorc.read();
		console.log("");
		logger.info(
			"Logged in as `%s <%s>`\n",
			signedInUser?.fullname,
			signedInUser?.email
		);
	} else {
		console.log("");
		logger.info("Not logged in! Log in with command `login <token>`\n");
	}
};
