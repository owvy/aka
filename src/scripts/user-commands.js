const shell = require("shelljs");
const YAML = require("yaml");

const { getLocalVars, parseVars } = require("./variables");
const { getLocalGist } = require("./gist");

const log = require("../utils/log");
const { AKA_FILE } = require("../utils/const");

const replaceTemplate = (cmd, variables) => {
	const template = /{([^{]+)}/g;
	return cmd.replace(template, (ignore, key) => {
		const value = variables[key];
		return value == null ? ignore : value;
	});
};

const getUserCommands = () => {
	const { files } = getLocalGist();
	const akaFile = files[AKA_FILE].content;
	const commands = YAML.parse(akaFile);
	return commands;
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
	getUserCommands,
};
