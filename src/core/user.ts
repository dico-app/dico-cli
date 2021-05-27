import * as client from "./client";
import * as dicorc from "./dicorc";

/**
 * Sign in used
 */
export const signin = async (
	token: string
): Promise<Required<dicorc.Config>["user"]> => {
	const user = await client.whoami(token);

	dicorc.update({ user });

	return user;
};

/**
 * Sign out user
 */
export const signout = (): void => {
	const config = dicorc.read();

	delete config.user;

	dicorc.write(config);
};

/**
 * Check if user is signed in
 */
export const isSignedIn = async (): Promise<boolean> => {
	const config = dicorc.read();

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
		if (error.status === 401) {
			signout();

			return false;
		} else {
			throw error;
		}
	}

	return true;
};
