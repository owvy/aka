#! /usr/bin/env node
const shell = require("shelljs");
const commandLineCommands = require("command-line-commands");

const Gist = require("./Gist");
const printUsage = require("./helper");

const gist = Gist("3daa7998139376abb5eb9c407c980b32");

(async () => {
  const cmdList = await gist.get();
  const registerCmd = [null, ...Object.keys(cmdList)];
  const { command, argv } = commandLineCommands(registerCmd);
  const runner = cmdList[command];

  if (command == null) {
    return printUsage(cmdList);
  }

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
})();
