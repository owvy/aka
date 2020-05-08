const commandLineCommands = require("command-line-commands");

const Gist = require("./Gist");
const { Cli, DefaultCmd } = require("./Cli");

const log = require("./utils/log");
const runScript = require("./utils/run-script");
const printUsage = require("./utils/printUsage");

async function Aka() {
	Gist.isEmpty(() => {
		const cli = Cli();

		cli.onDefault(() => {
			log.info(
				"No script register yet",
				log.c`Clone a gist first: {blue aka clone} {underline {white GIST_ID}}`
			);
		});

		cli.onError(() => {
			const cmd = Object.keys(DefaultCmd)
				.map((k) => DefaultCmd[k])
				.join(" | ");
			log.error(
				"Invalid Command",
				log.c`try the available cmds: {blue $ aka ${cmd}}`
			);
		});
	});

	Gist.hasGist(async () => {
		const akaScripts = await Gist.read();
		const cli = Cli(Object.keys(akaScripts));

		cli.onDefault(() => printUsage(akaScripts));

		cli.onRun((command, argv) => {
			const props = akaScripts[command];
			runScript(props, argv);
		});

		cli.onError(() => {
			const cmd = [
				...Object.values(DefaultCmd),
				...Object.keys(akaScripts),
			].join(log.c`{dim , }`);

			log.error(
				"Invalid Command",
				log.c`try the available: {blue $ aka ${cmd}}`,
				log.c`to see the whole list: {bold $ aka} `
			);
		});
	});
}

Aka();
