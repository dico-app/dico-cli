import fs from "fs";
import path from "path";
import { JSON_FILE } from "../const";
import { ConfigJSON } from "../types";
import * as messages from "../messages";
import detectIndent from "detect-indent";

class DicoJSONError extends Error {}

/**
 * Get config path
 */
export const getPath = (): string => {
	return path.join(process.cwd(), JSON_FILE);
};

export const exists = (): boolean => {
	return fs.existsSync(getPath());
};

/**
 * Read config file
 */
export const read = (): ConfigJSON => {
	if (!exists()) {
		throw new DicoJSONError(messages.DicoJSONNotFound.replace("%s", getPath()));
	}

	return JSON.parse(fs.readFileSync(getPath(), "utf8"));
};

/**
 * Write config file
 */
export const write = (config: ConfigJSON): void => {
	let indent = "  ";
	if (exists()) {
		indent = detectIndent(fs.readFileSync(getPath(), "utf8")).indent || "  ";
	}

	fs.writeFileSync(
		getPath(),
		`${JSON.stringify(config, null, indent)}\n`,
		"utf8"
	);
};
