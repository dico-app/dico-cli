import * as rc from "rc9";
import { RC_FILE } from "../const";
import { ConfigRC } from "../types";

/**
 * Read config file
 */
export const read = (): ConfigRC => {
	return rc.readUser(RC_FILE);
};

/**
 * Write config file
 */
export const write = (config: ConfigRC): void => {
	rc.writeUser(config, RC_FILE);
};

/**
 * Update config file
 */
export const update = (config: ConfigRC): void => {
	rc.updateUser(config, RC_FILE);
};
