import * as commander from "commander";
import * as commandLineUsage from "command-line-usage";

const DEFAULT_COMMANDS = ["clone", "update", "var", "list"];

const formatContent = (cmd: commander.Command) => {
	return [
		{
			name: cmd.name(),
			summary: cmd.description() || "{dim --------------------------}",
		},
		...cmd.commands.map((subCmd) => {
			return {
				name: `{dim └──} ${cmd.name()} {dim ${subCmd.name()}}`,
				summary: subCmd.description(),
			};
		}),
	];
};

const help = (program: commander.Command) => {
	const defaultCommands = {
		header: "Default Commands",
		content: [].concat(
			...program.commands
				.filter((cmd) => DEFAULT_COMMANDS.includes(cmd.name()))
				.map(formatContent),
		),
	};

	const availableSection = {
		header: "Available Commands",
		content: [].concat(
			...program.commands
				.filter((cmd) => !DEFAULT_COMMANDS.includes(cmd.name()))
				.map(formatContent),
		),
	};

	const usage = commandLineUsage([
		{
			header: "Synopsis",
			content: "$ aka <command>",
		},
		defaultCommands,
		availableSection,
	]);

	// eslint-disable-next-line no-console
	console.log(usage);
};

export default help;
