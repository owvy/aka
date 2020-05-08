const commandLineUsage = require("command-line-usage");
const chalk = require("chalk");

const summaryWithArgs = (cmd, option) => {
	const args = Object.keys(option.args)
		.map((arg) => `\n.... {bold aka ${cmd}} {underline ${arg}}`)
		.join(", ");
	return `{dim ${option.desc}}: ${args}`;
};

const createDesc = (name, option) => {
	if (option.args) {
		return {
			name,
			summary: "-> " + summaryWithArgs(name, option),
		};
	}
	return {
		name,
		summary: "-> " + chalk.dim(option.desc),
	};
};

const printUsage = (cmdList) => {
	const content = Object.keys(cmdList).map((key) =>
		createDesc(key, cmdList[key])
	);

	const usage = commandLineUsage([
		{
			header: chalk.blue("Synopsis"),
			content: "aka [command]",
		},
		{
			header: chalk.magenta("Default Command"),
			content: "aka [command]",
		},
		{
			header: chalk.green("Command List"),
			content: content,
		},
	]);
	console.log(usage);
};

module.exports = printUsage;
