#! /usr/bin/env node

import { program } from "@caporal/core";
import { isPlainObject } from "lodash";

import * as Gist from "./packages/Gist";
import * as Variables from "./packages/Variables";
import * as CmdRunner from "./packages/CmdRunner";

const noop: () => void = () => null;

// Only for UI proposes, so it can be group on helper
const uiSeparator = () => program.command("   ", "").action(noop);

const isTypeOfString = (runner: AkaCmd["run"]): runner is string => {
	return !isPlainObject(runner);
};

const containRunAsProps = (runner: AkaCmd["run"]): runner is AkaRun => {
	return isPlainObject(runner);
};

program // Disabling Global Options to keep the help/list clear
	.disableGlobalOption("version")
	.disableGlobalOption("silent")
	.disableGlobalOption("quiet")
	.disableGlobalOption("--no-color")
	.disableGlobalOption("verbose")
	.disableGlobalOption("help");

program // Aka
	.bin("aka")
	.name("aka")
	.strict(true)
	.version("2.0.0");

// Gist Commands

const gistCommands = Gist.hasLocalGist() ? Gist.getLocalCommands() : {};
const gistCommandsKeys = Object.keys(gistCommands);

gistCommandsKeys.forEach((rootKey) => {
	const currentCmd = gistCommands[rootKey] as AkaCmd;
	const runner = currentCmd.run;

	if (isTypeOfString(runner)) {
		return program
			.command(rootKey, currentCmd.desc)
			.argument("[vars...]", "")
			.action(({ args }) => {
				const vars = (args.vars ?? []) as string[];
				CmdRunner.shellExec(runner, { vars, basePath: currentCmd.basePath });
			});
	}

	// Only for UI proposes, so it can be group on helper
	uiSeparator();
	program.command(`---- [${rootKey}]`, `<${currentCmd.desc}>`).action(noop);

	Object.keys(runner).forEach((subKey) => {
		const selectedRun = runner[subKey];
		const cmd = `${rootKey} ${subKey}`;
		const desc = containRunAsProps(selectedRun) ? selectedRun.desc : "";
		program
			.command(cmd, desc)
			.argument("[vars...]", "")
			.action(({ args }) => {
				const vars = (args.vars ?? []) as string[];
				const rawCmd = containRunAsProps(selectedRun) ? selectedRun.run : selectedRun;
				CmdRunner.shellExec(rawCmd, { vars, basePath: currentCmd.basePath });
			});
	});

	return uiSeparator();
});

// Print Help with any command is found

program
	.command("-- [GLOBALS]", "")
	.argument("[vars...]", "")
	.default()
	.action(() => program.exec(["help"]));

// Default Commands

program
	.command("clone", "Clone GH Gist")
	.argument("<gist_id>", "pass your gistID to be cloned", { validator: program.STRING })
	.action(({ args }) => {
		const gistId = args.gistId as string;
		Gist.cloneGist(gistId);
	});

program //
	.command("update", "Update Gist")
	.action(() => Gist.updateGist());

program
	.command("var list", "ENV variables")
	.action(() => Variables.printVariableList())
	.command("var", "Create ENV Variables")
	.argument("[vars...]", "vars")
	.action(({ args }) => {
		if (Object.keys(args).length === 0) {
			return Variables.openFile();
		}

		Variables.saveVariables(args.vars as string[]);
	});

program.run();
