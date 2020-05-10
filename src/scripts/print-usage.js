const commandLineUsage = require("command-line-usage");
const chalk = require("chalk");

const summaryWithArgs = (cmd, option) => {
	const args = Object.keys(option.args)
		.map((arg) => `{bold aka <${cmd}>} {underline [${arg}]}`)
		.join(", ");
	return `{dim ${option.desc}}: ${args}`;
};

const cmdContent = (name, option) => {
	if (option.args) {
		return {
			name,
			summary: `${summaryWithArgs(name, option)}`,
		};
	}
	return {
		name,
		summary: `${chalk.dim(option.desc)}`,
	};
};

const defaultCommands = [
	{
		name: "clone",
		description: `{dim Clone Gist}`,
	},
	{
		name: "update",
		description: `{dim Update Local Gist}`,
	},
	{
		name: "var",
		description: `{dim Add Global Variables}`,
	},
];

module.exports = function printUsage(userCommands) {
	const userCommandsKeys = Object.keys(userCommands);
	const usage = commandLineUsage([
		{
			header: "Default Commands",
			content: defaultCommands.map((command) => {
				return { name: command.name, summary: command.description };
			}),
		},
		userCommandsKeys.length > 0 && {
			header: "Available Commands",
			content: userCommandsKeys.map((key) => cmdContent(key, userCommands[key])),
		},
	]);
	// eslint-disable-next-line no-console
	console.log(usage);
};
