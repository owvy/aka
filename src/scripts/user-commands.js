const shell = require("shelljs");

const { getLocalVars, parseVars } = require("./variables");

const log = require("../utils/log");

const replaceTemplate = (cmd, variables) => {
	const template = /{([^{]+)}/g;
	return cmd.replace(template, (ignore, key) => {
		const value = variables[key];
		return value == null ? ignore : value;
	});
};

const shellExec = (rawCmd, argv) => {
	const variables = { ...getLocalVars(), ...parseVars(argv) };
	const cmd = replaceTemplate(rawCmd, variables);
	shell.exec(cmd);
};

const execUserCommands = (akaScript, argv) => {
	// If Command contains args but none of them were passed
	if (akaScript.args && argv.length === 0) {
		log.error("Command needs argv");
	}

	// Run Nested Commands
	// e.g: aka first-cmd nested-cmd
	if (akaScript.args) {
		const [nestedCmd] = argv;
		const command = akaScript.args[nestedCmd];
		return shellExec(command, argv);
	}

	// One level command
	// e.g: aka clean-file
	return shellExec(akaScript.run, argv);
};

module.exports = {
	execUserCommands,
};
