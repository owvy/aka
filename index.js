#! /usr/bin/env node
const shell = require("shelljs");
const commandLineCommands = require("command-line-commands");

const Gist = require("./Gist");
const printUsage = require("./helper");
const { noGistFound } = require("./logger");

const gist = new Gist();

(async () => {
  try {
    const cmdList = await gist.read();
    const registerCmd = [null, "list", "update", ...Object.keys(cmdList)];
    const { command, argv } = commandLineCommands(registerCmd);
    const runner = cmdList[command];

    if (!command || command == "list") return printUsage(cmdList);
    if (command === "update") return gist.update();

    if (runner.args) {
      if (argv.length == 0) {
        console.log(`${command} needs argv`);
        return;
      }
      const argAlias = argv[0];
      const cmd = runner.args[argAlias];
      return shell.exec(cmd);
    }

    shell.exec(runner.alias);
  } catch (err) {
    const { command, argv } = commandLineCommands([null, "clone"]);
    if (!command) noGistFound();
    if (command === "clone") return gist.clone(argv);
  }
})();
