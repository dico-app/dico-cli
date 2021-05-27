import * as rc from "rc9";
import { RC_FILE } from "../lib";
import * as client from "./client";

export interface Config {
	user?: {
		token: string;
		fullname: string;
		email: string;
	};
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

/**
 * Sign in used
 */
export const signin = async (
	token: string
): Promise<Required<Config>["user"]> => {
	const user = await client.whoami(token);

	update({ user });

	return user;
};

/**
 * Sign out user
 */
export const signout = (): void => {
	const config = read();

	delete config.user;

	write(config);
};

/**
 * Check if user is signed in
 */
export const isSignedIn = async (): Promise<boolean> => {
	const config = read();

	if (!config.user) {
		return false;
	}

	// Invalid token
	if (config.user.token.length !== 64) {
		signout();

		return false;
	}

	try {
		await client.whoami(config.user.token);
	} catch (error) {
		signout();

		console.log(error);
	}

	return true;
};
