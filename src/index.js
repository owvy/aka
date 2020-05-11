const commandLineCommands = require("command-line-commands");

const { hasLocalGist } = require("./scripts/gist");
const { execUserCommands } = require("./scripts/user-commands");
const { cloneGist, updateGist, getLocalCommands } = require("./scripts/gist");
const { runVariableCommand } = require("./scripts/variables");
const printUsage = require("./scripts/print-usage");

const log = require("./utils/log");

module.exports = () => {
	const userCommands = hasLocalGist() ? getLocalCommands() : {};
	const defaultCommands = ["clone", "var", "update", "list"];
	const validCommands = [null, ...Object.keys(userCommands), ...defaultCommands];

	try {
		const { command, argv } = commandLineCommands(validCommands);
		const cmd = userCommands[command];

		switch (command) {
			case "clone":
				return cloneGist(argv[0]);
			case "update":
				return updateGist();
			case "var":
				return runVariableCommand(argv);
			case null:
			case "list":
				return printUsage(userCommands);
			default:
				execUserCommands(cmd, argv);
		}
	} catch (err) {
		log.error(
			"Invalid Command",
			!hasLocalGist() && `try the available: $ aka${validCommands.join(" ")}`,
			!hasLocalGist() && `gist register yet: aka clone {dim {white [gist_id]}}`,
		);
	}

	return null;
};
