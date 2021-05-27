import chalk from "chalk";
import { PACKAGE, VERSION } from "../lib";

interface HelpSection {
	title?: string;
	body: string;
}

export const help = (sections: HelpSection[]): void => {
	sections[0].title = `Version`;
	sections[0].body = `  ${PACKAGE}@${VERSION}`;
	sections[sections.length - 1].body = `${
		sections[sections.length - 1].body
	}\n`;

	// Add header
	sections.unshift({
		body: `\n📚 Dico CLI\n  ${chalk.cyanBright(
			"Read the docs:"
		)} https://docs.dico.app/cli`
	});
};
