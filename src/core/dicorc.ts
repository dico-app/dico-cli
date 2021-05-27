import * as rc from "rc9";
import { RC_FILE } from "../const";

export interface Config {
	user?: {
		token: string;
		fullname: string;
		email: string;
	};
	endpoint?: string;
}

/**
 * Read config file
 */
export const read = (): Config => {
	return rc.readUser(RC_FILE);
};

/**
 * Write config file
 */
export const write = (config: Config): void => {
	rc.writeUser(config, RC_FILE);
};

/**
 * Update config file
 */
export const update = (config: Config): void => {
	rc.updateUser(config, RC_FILE);
};
