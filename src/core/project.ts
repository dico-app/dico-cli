import fs from "fs";
import path from "path";

import * as dicojson from "./dicojson";
import globby from "globby";
import { SOURCES_EXTRACT_REGEX } from "../const";

export const findSources = async (sources?: string[]): Promise<string[]> => {
	if (!sources) {
		sources = dicojson.read().sources;
	}

	const paths = await globby(sources);

	return paths;
};

export const crawlFile = (relativePath: string): string[] => {
	const absolutePath = path.join(process.cwd(), relativePath);

	const blob = fs.readFileSync(absolutePath, "utf8");

	const matches = blob.match(SOURCES_EXTRACT_REGEX);

	return matches ? matches : [];
};
