import * as YAML from "yaml";
import * as chalk from "chalk";
import { times } from "lodash";

import logger from "./Logger";
import * as FileSync from "./FileSync";
import { tryCatch } from "./Utils";

const VAR_FILE = "aka-variables.yml";

export type VariableMap = Record<string, string>;

export const parseArgs = (argv: string[] = []) => {
	const vars: VariableMap = {};
	argv.forEach((arg) => {
		const [key, value] = arg.split("=");
		vars[key] = value || "true";
	});

	return vars;
};

export const openFile = () => FileSync.openFile(VAR_FILE);

export const getVars = () =>
	tryCatch<unknown, VariableMap>({
		tryer: () => {
			const data = FileSync.readFile(VAR_FILE);
			return data ? YAML.parse(data, { merge: true }) : {};
		},
		catcher: (err) => {
			logger.error("Yaml Error", err);
			return {};
		},
	})(null);

export const saveVar = tryCatch<string[]>({
	tryer: (newVars) => {
		const localVars = getVars();
		const yaml = new YAML.Document();
		yaml.contents = { ...localVars, ...parseArgs(newVars) };
		FileSync.writeFile(VAR_FILE, JSON.stringify(yaml));
		logger.success(`${newVars} was created`);
	},
	catcher: (err) => logger.error("Something went wrong", err),
});

export const logList = () => {
	const vars = getVars();
	if (vars) {
		logger.santa("\n");

		Object.keys(vars).forEach((key, idx) => {
			logger.log({
				prefix: chalk.dim(`[${idx + 1}]`),
				message: chalk`{blue ${key}}{white : ${vars[key]}}`,
			});
		});
	}
};
