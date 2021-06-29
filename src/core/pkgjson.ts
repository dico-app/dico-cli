import path from "path";
import fs from "fs";
import spawn from "cross-spawn";

import { CLIENT_FETCH, CLIENT_PKG } from "../const";
import { VanillaEsm, VanillaEsmRoot, Vite } from "./createDicoTemplates";
import detectIndent from "detect-indent";

interface PkgLike {
	name: string;
	version: string;
	scripts?: Record<string, string>;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

export interface Manifest {
	name: string;
	pkg: string;
	scripts: string[];
	command: string;
	createDicoDir: string;
	createDicoTemplate: string;
}

const manifests: Record<string, Manifest> = {
	nuxt: {
		name: "Nuxt",
		pkg: "nuxt",
		scripts: ["dev", "generate", "build"],
		command: CLIENT_FETCH,
		createDicoDir: "",
		createDicoTemplate: VanillaEsmRoot
	},
	vite: {
		name: "Vite",
		pkg: "vite",
		scripts: ["dev", "build", "serve"],
		command: CLIENT_FETCH,
		createDicoDir: "src",
		createDicoTemplate: Vite
	},
	next: {
		name: "Next",
		pkg: "next",
		scripts: ["dev", "build"],
		command: CLIENT_FETCH,
		createDicoDir: "",
		createDicoTemplate: VanillaEsmRoot
	},
	gatsby: {
		name: "Gatsby",
		pkg: "gatsby",
		scripts: ["build", "develop"],
		command: CLIENT_FETCH,
		createDicoDir: "src",
		createDicoTemplate: VanillaEsm
	},
	craco: {
		name: "Craco",
		pkg: "@craco/craco",
		scripts: ["start", "build"],
		command: `${CLIENT_FETCH} ./ ./src`,
		createDicoDir: "src",
		createDicoTemplate: VanillaEsmRoot
	},
	cra: {
		name: "Create React App",
		pkg: "react-scripts",
		scripts: ["start", "build"],
		command: `${CLIENT_FETCH} ./ ./src`,
		createDicoDir: "src",
		createDicoTemplate: VanillaEsmRoot
	},
	vanilla: {
		name: "Vanilla",
		pkg: "any",
		scripts: ["dev", "generate", "build"],
		command: CLIENT_FETCH,
		createDicoDir: "src",
		createDicoTemplate: VanillaEsm
	}
};

export const getPath = (): string => {
	return path.join(process.cwd(), "package.json");
};

export const exists = (): boolean => {
	return fs.existsSync(getPath());
};

export const read = (): PkgLike => {
	return JSON.parse(fs.readFileSync(getPath(), "utf8"));
};

export const write = (pkg: PkgLike): void => {
	let indent = "  ";
	if (exists()) {
		indent = detectIndent(fs.readFileSync(getPath(), "utf8")).indent || "  ";
	}

	fs.writeFileSync(getPath(), `${JSON.stringify(pkg, null, indent)}\n`, "utf8");
};

export const getPackageManager = (): string => {
	if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) {
		return "yarn";
	} else {
		return "npm";
	}
};

export const isTypeScript = (): boolean => {
	return fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
};

export const isInstalled = (): boolean => {
	const pkg = read();

	const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

	return CLIENT_PKG in dependencies;
};

export const detectFramework = (): Manifest => {
	const pkg = read();

	const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

	for (const manifest of Object.values(manifests)) {
		if (manifest.name === manifests.vanilla.name) {
			continue;
		} else if (manifest.pkg in dependencies) {
			return manifest;
		}
	}

	return manifests.vanilla;
};

export const installClient = async (): Promise<void> => {
	const pm = getPackageManager();
	const install = pm === "npm" ? "install" : "add";
	await spawn(pm, [install, CLIENT_PKG]);
};

export const updateScripts = async (manifest: Manifest): Promise<void> => {
	const pkg = read();

	if ("scripts" in pkg && typeof pkg.scripts === "object") {
		manifest.scripts.forEach(script => {
			if (
				pkg.scripts &&
				script in pkg.scripts &&
				!pkg.scripts[script].includes(CLIENT_FETCH)
			) {
				pkg.scripts[script] = `${manifest.command} && ${pkg.scripts[script]}`;
			}
		});
	}

	write(pkg);
};

export const createDicoFile = async (manifest: Manifest): Promise<void> => {
	const dirPath = path.join(process.cwd(), manifest.createDicoDir);

	if (fs.existsSync(dirPath)) {
		const filePath = path.join(dirPath, `dico.${isTypeScript() ? "ts" : "js"}`);

		fs.writeFileSync(filePath, manifest.createDicoTemplate, "utf8");
	}
};
