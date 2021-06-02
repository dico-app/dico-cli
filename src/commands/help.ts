import chalk from "chalk";
import { PACKAGE, VERSION } from "../const";
import * as dicorc from "../core/dicorc";

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
	const config = dicorc.read();
	sections.unshift({
		body: `\n📚 Dico CLI\n  ${chalk.cyanBright(
			"Read the docs:"
		)} https://docs.dico.app/cli\n  ${chalk.cyan(
			"Any questions, issues?"
		)} https://github.com/dico-app/dico-cli/discussions${
			config.endpoint
				? `\n  ${chalk.magentaBright("Endpoint override:")} ${config.endpoint}`
				: ""
		}`
	});
};
