import { CAC } from "cac";
import { lineBreak, logger } from "../lib";
import * as user from "../core/user";

export const signout = (_: CAC, __: { [key: string]: unknown }): void => {
	user.signout();
	lineBreak();
	logger.success("Logged out\n");
};
