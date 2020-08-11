import * as YAML from "yaml";
import * as chalk from "chalk";
import * as commander from "commander";

import logger from "../utils/logger";
import tryCatch from "../utils/tryCatch";
import Files from "../utils/files";

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

export const getVars = tryCatch<void, VariableMap>({
	tryer: () => {
		const data = Files.read(VAR_FILE);
		return data ? YAML.parse(data, { merge: true }) : {};
	},
	catcher: (err) => {
		logger.error("Yaml Error", err);
		return {};
	},
});

const openFile = () => Files.open(VAR_FILE);

const saveVar = tryCatch<string[]>({
	tryer: (newVars) => {
		const localVars = getVars();
		const yaml = new YAML.Document();
		yaml.contents = { ...localVars, ...parseArgs(newVars) };
		Files.write(VAR_FILE, JSON.stringify(yaml));
		logger.success(`${newVars} was created`);
	},
	catcher: (err) => logger.error("Something went wrong", err),
});

const printList = () => {
	const vars = getVars();
	if (vars) {
		logger.keys();

		Object.keys(vars).forEach((key, idx) => {
			logger.log({
				prefix: chalk.dim(`(${idx + 1})`),
				message: chalk`{blue ${key}}{white : ${vars[key]}}`,
			});
		});
	}
};

const buildCommands = () => {
	const varCommands = new commander.Command("var").allowUnknownOption(false);

	varCommands //
		.command("list")
		.description("list available variables")
		.action(printList);

	varCommands //
		.command("open")
		.description("open variable file config")
		.action(openFile);

	varCommands
		.command("add <vars...>")
		.description("add new global variable")
		.action(saveVar);

	return varCommands;
};

export default buildCommands;
