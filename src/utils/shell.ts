import * as shell from "shelljs";
import { isArray } from "lodash";

import * as VARS from "../tasks/variables";

type ExecOptions = {
	vars: string[];
	basePath?: string;
};

const replaceTemplate = (cmd: string, variables: VARS.VariableMap) => {
	const template = /{([^{]+)}/g;
	return cmd.replace(template, (ignore, key) => {
		const value = variables[key];
		return value == null ? ignore : value;
	});
};

export const shellExec = (rawCmd: string | string[], { vars, basePath }: ExecOptions) => {
	const variables = { ...VARS.getVars(), ...VARS.parseArgs(vars) };
	const commands = isArray(rawCmd) ? rawCmd.join(";") : rawCmd;
	const cmd = replaceTemplate(commands, variables);

	if (basePath) {
		shell.cd(replaceTemplate(basePath, variables));
	}

	shell.exec(cmd);
};

export default { shellExec };
