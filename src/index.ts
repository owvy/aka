#! /usr/bin/env node

import { program } from "commander";
import { isString, isArray, isObject } from "lodash";

import * as AKA from "./packages/AkaConfig";
import * as VARS from "./packages/Variables";
import { shellExec } from "./packages/Shell";

program //
	.name("aka")
	// .addHelpCommand(false)
	.version("2.1.0");

program
	.command("clone <id>")
	.description("clone a gist into aka")
	.action(AKA.cloneConfig);

program
	.command("update")
	.description("update content from the remote gist")
	.action(AKA.updateConfig);

const varCommand = program //
	.command("var")
	.allowUnknownOption(false);

varCommand //
	.command("log")
	.description("log available variables")
	.action(VARS.logList);

varCommand //
	.command("open")
	.description("open variable file config")
	.action(VARS.openFile);

varCommand
	.command("add <vars...>")
	.description("add new global variable")
	.action(VARS.saveVar);

const { alias } = AKA.getConfig();
const aliasKeys = Object.keys(alias ?? {});

aliasKeys.forEach((key) => {
	const { run, desc, basePath } = alias[key];

	const userCommands = program //
		.command(key)
		.arguments("[vars...]");

	if (isString(run) || isArray(run)) {
		userCommands
			.description(desc ?? "")
			.action(({ args: vars }) => shellExec(run, { vars, basePath }));
	}

	if (isObject(run) && !isArray(run)) {
		Object.keys(run).forEach((nestedKey) => {
			const nestedRun = run[nestedKey];

			userCommands
				.command(nestedKey)
				.description(nestedRun.desc ?? "")
				.action(({ args: vars }) => {
					const cmd = isString(nestedRun) ? nestedRun : nestedRun.run;
					shellExec(cmd, { vars, basePath });
				});
		});
	}
});

program.parse(process.argv);
