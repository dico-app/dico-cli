import { CAC } from "cac";
import { logger } from "../lib";
import * as user from "../core/user";

export const signout = (_: CAC, __: { [key: string]: never }): void => {
	user.signout();
	console.log("");
	logger.success("Logged out\n");
};
