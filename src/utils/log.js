const chalk = require("chalk");

// eslint-disable-next-line no-console
const print = console.log;

const messageFactory = ({ msg, prefix, steps }) => {
	print("| ", prefix, chalk.bold(msg));
	if (steps) {
		steps.forEach((s) => s && print("| ", chalk.white(s)));
	}
};

const error = (msg, ...steps) => {
	const prefix = chalk.red("error:");
	messageFactory({ prefix, msg, steps });
};

const info = (msg, ...steps) => {
	const prefix = chalk.blue("info:");
	messageFactory({ prefix, msg, steps });
};

const success = (msg, ...steps) => {
	const prefix = chalk.green("success:");
	messageFactory({ prefix, msg, steps });
};

module.exports = {
	c: chalk,
	error,
	info,
	success,
	print,
};
