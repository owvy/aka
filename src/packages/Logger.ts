import * as chalk from "chalk";
import * as shell from "shelljs";

type MessageFactory = {
	msg: string;
	prefix: string;
	steps: string[];
};

const cxt = (str: string) => chalk(Object.assign([], { raw: [str] }));

export const print = shell.echo;

const messageFactory = ({ msg, prefix, steps = [] }: MessageFactory) => {
	print("| ", prefix, cxt(msg));
	steps.forEach((s) => s && print("| ", cxt(s)));
};

export const error = (msg: string, ...steps: string[]) => {
	const prefix = chalk.bold.red("error:");
	messageFactory({ prefix, msg, steps });
};

export const info = (msg: string, ...steps: string[]) => {
	const prefix = chalk.bold.blue("info:");
	messageFactory({ prefix, msg, steps });
};

export const success = (msg: string, ...steps: string[]) => {
	const prefix = chalk.bold.green("success:");
	messageFactory({ prefix, msg, steps });
};
