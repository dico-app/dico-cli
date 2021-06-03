import fs from "fs";
import path from "path";

import * as dicojson from "./dicojson";
import globby from "globby";
import { SOURCES_EXTRACT_REGEX } from "../const";
import { ProjectKey } from "../types";

export const findSources = async (sources?: string[]): Promise<string[]> => {
	if (!sources) {
		sources = dicojson.read().sources;
	}

	const paths = await globby(sources);

	return paths;
};

export const crawlFile = (relativePath: string): ProjectKey[] => {
	const absolutePath = path.join(process.cwd(), relativePath);

	const blob = fs.readFileSync(absolutePath, "utf8");

	const matches: ProjectKey[] = [];

	const regex = new RegExp(SOURCES_EXTRACT_REGEX);
	let line = 1;
	let index = 0;
	let match;
	while ((match = regex.exec(blob))) {
		const section = blob.slice(index, match.index).split("\n");
		line += section.length - 1;
		index = match.index;
		matches.push({
			key: match[0],
			file: relativePath,
			line,
			column: (section.pop() || "").length + 1
		});
	}

	return matches;
};
