import * as YAML from "yaml";
import * as chalk from "chalk";

import * as Logger from "./Logger";
import * as FileSync from "./FileSync";

const VAR_FILE = "aka-variables.yml";

export type VariableMap = Record<string, boolean | string>;

export const parseVars = (argv: string[]) => {
	const vars: VariableMap = {};
	argv.forEach((arg) => {
		const [key, value] = arg.split("=");
		vars[key] = value || true;
	});

	return vars;
};

export const getLocalVars = () => {
	try {
		const data = FileSync.readFile(VAR_FILE);
		return data ? YAML.parse(data, { merge: true }) : {};
	} catch (err) {
		Logger.error("Yaml Error", err.message);
	}

	return null;
};

export const saveVariables = (newVars: string[]) => {
	try {
		const localVars = getLocalVars();
		const yaml = new YAML.Document();

		yaml.contents = { ...localVars, ...parseVars(newVars) };
		FileSync.writeFile(VAR_FILE, JSON.stringify(yaml));
		Logger.success("save and sound", `check the full list: {bold aka var list}`);
	} catch (err) {
		Logger.error("Something went wrong", err);
	}
};

export const printVariableList = () => {
	const vars = getLocalVars();
	if (vars) {
		Logger.print(chalk`| Local Variables:`, "\n|");
		Object.keys(vars).forEach((key) => {
			Logger.print(chalk`| {dim ${key}}: ${vars[key]}`);
		});
	}
};

export const openFile = () => FileSync.openFile(VAR_FILE);
