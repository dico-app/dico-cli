import fs from "fs";
import path from "path";
import { JSON_FILE } from "../const";
import { ConfigJSON, ProjectKey } from "../types";
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

// TODO: Better test this
export const createSchema = (
	keys: ProjectKey[]
): {
	schema: ConfigJSON["schema"];
	conflicts: ProjectKey[][];
} => {
	const schema: ConfigJSON["schema"] = {};
	const conflicts: ProjectKey[][] = [];

	const uniqueKeys = keys.filter((keyObj, i, keys) => {
		return keys.findIndex(i => i.key === keyObj.key) === i;
	});

	keyloop: for (const keyObject of uniqueKeys) {
		const parents = keyObject.key.replace(/^\$dico\./, "").split(".");
		let pointer = schema;
		const key = parents.pop() as string;

		const traversedPath: string[] = [];
		for (const parent of parents) {
			traversedPath.push(parent);

			if (!(parent in pointer)) {
				pointer[parent] = {};
			} else if (
				// Conflict with a shorter key
				typeof pointer[parent] === "string"
			) {
				const conflictPath = ["$dico", ...traversedPath].join(".");
				const conflictKeyObj = uniqueKeys.find(i => i.key === conflictPath);
				if (conflictKeyObj) {
					const existing = conflicts.find(i => i[0].key === conflictKeyObj.key);
					if (existing) {
						existing.push(keyObject);
					} else {
						conflicts.push([conflictKeyObj, keyObject]);
					}
				} else {
					conflicts.push([keyObject]);
				}
				continue keyloop;
			} else if (
				// Conflict with a longer key
				traversedPath.length === parents.length &&
				typeof pointer[parent] === "object" &&
				typeof (pointer[parent] as ConfigJSON["schema"])[key] !== "undefined"
			) {
				const conflictKeyObj = uniqueKeys.filter(
					i => i.key !== keyObject.key && i.key.startsWith(keyObject.key)
				);
				conflicts.push([keyObject, ...conflictKeyObj]);
				continue keyloop;
			}

			pointer = pointer[parent] as ConfigJSON["schema"];
		}

		if (!(key in pointer)) {
			pointer[key] = "";
		}
	}

	return { schema, conflicts };
};
