import { CLIENT_PKG, CONFIG_FILE, NAME } from "./const";

export const InvalidCommand = `Invalid command: \`%s\`, run \`${NAME} --help\` for all commands`;

export const NotSignedIn = "Not logged in! Log in with command `login <token>`";
export const SignedInAs = "Logged in as `%s <%s>`";

export const InvalidToken = "Invalid token, make sure you copied it correctly!";
export const InvalidTokenFormat =
	"Invalid token format, make sure you copied it correctly!";

export const NoDicoFoundDeveloper =
	"No dico found where you at least have the `Developer` role";

export const Unauthorized =
	"You're no allowed to perform this action on the current dico, check with your admins";

export const DicoJSONNotFound = `\`${CONFIG_FILE}\` not found at \`%s\``;
export const DicoJSONAlreadyExists = `\`${CONFIG_FILE}\` already exists at \`%s\`!`;

export const NoSourceFilesFound = `No source files found with current \`sources\` option. Double-check your \`${CONFIG_FILE}\` and try again!`;

export const CommandSuccessful = `\`${NAME} %s\` successful!`;
export const CommandWithForce = `Running \`${NAME} %s\` with \`force\` flag`;
export const CommandWithFlagCommand = `Running \`${NAME} %s\` with \`%s\` flag, performing \`${NAME} %s\` first:`;
export const NowStartingCommand = `Now starting command \`${NAME} %s\`:`;

export const ProductionDicoNotInSync = `Production dico is not in sync with local \`${CONFIG_FILE}\``;

export const IsDicoClientInstalled =
	"Are you sure `@dico/client` is installed in your project?";

export const FrameworkDetected = `We detected that you are running \`%s\``;

export const ClientAlreadyInstalledSkip = `\`${CLIENT_PKG}\` is already installed, skipping install step...`;

export const PkgJSONNotDetected = `We couldn't detect your \`package.json\`, you'll have to install \`${CLIENT_PKG}\` manually`;

export const NoAutomaticClientInstall = `Alright, we won't install \`${CLIENT_PKG}\` for you, you'll have to install it manually`;

export const InstallClientManually = `To install \`${CLIENT_PKG}\` manually check out the dedicated documentation page: https://docs.dico.app/installing-the-client`;

export const AutomaticClientInstallSuccess = `\`${CLIENT_PKG}\` install successful!`;
