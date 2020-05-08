const shell = require("shelljs");
const Variables = require("../Variables");

const replaceTemplate = (cmd, variables) => {
	const regexp = /{([^{]+)}/g;
	return cmd.replace(regexp, function (ignore, key) {
		return (key = variables[key]) == null ? ignore : key;
	});
};

const exec = (rawCmd, argv) => {
	const variables = {
		...Variables.getLocal(),
		...Variables.getFromCli(argv),
	};
	const cmd = replaceTemplate(rawCmd, variables);
	shell.exec(cmd);
};

const runScript = (akaScript, argv) => {
	// If Command contains args but none of them were passed
	if (akaScript.args && argv.length === 0) {
		console.log(`Command needs argv`);
	}

	// Run Nested Commands
	// e.g: aka first-cmd nested-cmd
	if (akaScript.args) {
		const [nestedCmd] = argv;
		const command = akaScript.args[nestedCmd];
		return exec(command, argv);
	}

	// One level command
	// e.g: aka clean-file
	return exec(akaScript.run, argv);
};

module.exports = runScript;
