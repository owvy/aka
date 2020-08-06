import * as shell from "shelljs";
import { isArray } from "lodash";

import * as Variables from "./Variables";

type ExecOptions = {
	vars: string[];
	basePath?: string;
};

export const replaceTemplate = (cmd: string, variables: string[]) => {
	const template = /{([^{]+)}/g;
	return cmd.replace(template, (ignore, key) => {
		const value = variables[key];
		return value == null ? ignore : value;
	});
};

export const shellExec = (rawCmd: string | string[], { vars, basePath }: ExecOptions) => {
	const variables = { ...Variables.getLocalVars(), ...Variables.parseVars(vars) };
	const commands = isArray(rawCmd) ? rawCmd.join(";") : rawCmd;
	const cmd = replaceTemplate(commands, variables);

	if (basePath) {
		shell.cd(replaceTemplate(basePath, variables));
	}

	shell.exec(cmd);
};
