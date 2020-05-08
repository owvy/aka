const commandLineCommands = require("command-line-commands");

const Gist = require("./Gist");
const Cli = require("./Cli");

const log = require("./utils/log");
const runScript = require("./utils/run-script");

async function Aka() {
	Gist.isEmpty(() => {
		const cli = Cli();

		cli.onDefault(() => console.log("Clone commands first"));
		cli.onError(() => console.log("No Gist & Command found"));
	});

	Gist.hasGist(async () => {
		const akaScripts = await Gist.read();
		const cli = Cli(Object.keys(akaScripts));

		cli.onDefault(() => console.log("Print List"));
		cli.onError((err) => console.log("Error", err));

		cli.onRun((command, argv) => {
			const props = akaScripts[command];
			runScript(props, argv);
		});
	});
}

Aka();
