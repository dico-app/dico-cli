import pkg from "../package.json";

export const NAME = "dico";
export const PACKAGE = pkg.name;
export const DESCRIPTION = pkg.description;
export const VERSION = pkg.version;
export const RC_FILE = ".dicorc";
export const CONFIG_FILE = "dico.config.json";
export const API_ENDPOINT = "https://api.dico.app/v1";
export const DEFAULT_SOURCES_PATTERN = [
	"src/**/*.(js|jsx)",
	"src/**/*.(ts|tsx)",
	"src/**/*.vue"
];
export const SOURCES_EXTRACT_REGEX = /\$dico(\.[\w\d]+)+/gm;
export const DEFAULT_TIMEOUT = 1000;
