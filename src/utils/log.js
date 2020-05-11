const chalk = require("chalk");
const shell = require("shelljs");

const print = shell.echo;
const cxt = (str) => chalk(Object.assign([], { raw: [str] }));

const messageFactory = ({ msg, prefix, steps }) => {
	print("| ", prefix, cxt(msg));
	if (steps) {
		steps.forEach((s) => s && print("| ", cxt(s)));
	}
};

const error = (msg, ...steps) => {
	const prefix = chalk.bold.red("error:");
	messageFactory({ prefix, msg, steps });
};

const info = (msg, ...steps) => {
	const prefix = chalk.bold.blue("info:");
	messageFactory({ prefix, msg, steps });
};

const success = (msg, ...steps) => {
	const prefix = chalk.bold.green("success:");
	messageFactory({ prefix, msg, steps });
};

module.exports = {
	error,
	info,
	success,
	print,
};
