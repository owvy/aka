const commandLineCommands = require("command-line-commands");

const Gist = require("./Gist");
const Variables = require("./Variables");

const DefaultCmd = {
	CLONE: "clone",
	VAR: "var",
	UPDATE: "update",
};

const defaultCallback = () => null;

const Cli = (localCommands = []) => {
	let onError = (cb = defaultCallback) => null;
	let onDefault = (cb = defaultCallback) => null;
	let onRun = (cb = defaultCallback) => null;

	try {
		const { command, argv } = commandLineCommands([
			null,
			...Object.values(DefaultCmd),
			...localCommands,
		]);

		const defaultCmd = {
			[DefaultCmd.CLONE]: () => Gist.clone(argv[0]),
			[DefaultCmd.UPDATE]: () => Gist.update(),
			[DefaultCmd.VAR]: () => Variables.exec(argv),
		}[command];

		if (command == null) onDefault = (cb) => cb();
		else if (defaultCmd) defaultCmd();
		else onRun = (cb) => cb(command, argv);
	} catch (err) {
		onError = (cb) => cb(err);
	}

	return {
		onRun,
		onDefault,
		onError,
	};
};

exports.DefaultCmd = DefaultCmd;
exports.Cli = Cli;
