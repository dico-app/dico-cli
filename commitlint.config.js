module.exports = {
	parserPreset: "conventional-changelog-conventionalcommits",
	extends: ["@commitlint/config-conventional"],
	rules: {
		"scope-enum": [2, "always", ["core", "sql", "config", "deps", "misc"]]
	}
};
