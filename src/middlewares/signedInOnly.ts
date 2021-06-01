import * as user from "../core/user";
import { MiddlewareError } from "../lib";
import * as messages from "../messages";

export const signedInOnly = async (): Promise<void> => {
	if (!(await user.isSignedIn())) {
		throw new MiddlewareError(messages.NotSignedIn);
	}
};
