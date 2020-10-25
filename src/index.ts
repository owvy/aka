#! /usr/bin/env node

import * as commander from "commander";

import pkg from "../package.json";

import cloneTask from "./tasks/clone";
import updateTask from "./tasks/update";
import helpTask from "./tasks/help";
import buildVariableCommands from "./tasks/variables";
import buildLocalCommands from "./tasks/local-commands";

const { program } = commander;

program //
	.name("aka")
	.addHelpCommand(false)
	.version(pkg.version);

buildLocalCommands(program);

program //
	.command("clone <id>")
	.description("clone a gist into aka")
	.action(cloneTask);

program
	.command("update")
	.description("update content from the remote gist")
	.action(updateTask);

program //
	.command("list", { isDefault: true, hidden: true })
	.action(() => helpTask(program));

program.addCommand(buildVariableCommands());

program.parse(process.argv);
