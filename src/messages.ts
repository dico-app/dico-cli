import { NAME } from "./const";

export const InvalidCommand =
	"Invalid command: `%s`, run `%s --help` for all commands";

export const NotSignedIn = "Not logged in! Log in with command `login <token>`";
export const SignedInAs = "Logged in as `%s <%s>`";

export const InvalidToken = "Invalid token, make sure you copied it correctly!";
export const InvalidTokenFormat =
	"Invalid token format, make sure you copied it correctly!";

export const NoDicoFoundDeveloper =
	"No dico found where you at least have the `Developer` role";

export const DicoJSONNotFound = "`dico.config.json` not found at `%s`";
export const DicoJSONAlreadyExists =
	"`dico.config.json` already exists at `%s`!";

export const NoSourceFilesFound =
	"No source files found with current `sources` option. Double-check your `dico.config.json` and try again!";

export const CommandSuccessful = `\`${NAME} %s\` successful!`;
export const CommandWithForce = `Running \`${NAME} %s\` with \`force\` flag`;
