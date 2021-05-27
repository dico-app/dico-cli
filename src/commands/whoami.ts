import { CAC } from "cac";
import * as dicorc from "../core/dicorc";
import { logger } from "../lib";

export const whoami = async (
	_: CAC,
	__: { [key: string]: never }
): Promise<void> => {
	if (await dicorc.isSignedIn()) {
		const { user } = dicorc.read();
		console.log("");
		logger.info("Logged in as `%s <%s>`\n", user?.fullname, user?.email);
	} else {
		console.log("");
		logger.info("Not logged in! Log in with command `login <token>`\n");
	}
};
