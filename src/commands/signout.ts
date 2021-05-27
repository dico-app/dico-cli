import { CAC } from "cac";
import { logger } from "../lib";
import * as dicorc from "../core/dicorc";

export const signout = (_: CAC, __: { [key: string]: never }): void => {
	dicorc.signout();
	console.log("");
	logger.success("Logged out\n");
};
