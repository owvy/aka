const chalk = require("chalk");

const logger = console.log;

const colors = {
	message: chalk.white,
	errorStackInternal: chalk.grey,
	information: chalk.magenta,
	footnote: chalk.gray.dim,
};

const messageFactory = ({ msg, prefix, steps }) => {
	logger("| ", prefix, chalk.bold(msg));
	steps && steps.forEach((s) => logger("| ", colors.message(s)));
	logger("| ");
};

const error = (msg, ...steps) => {
	const prefix = chalk.red("Error:");
	messageFactory({ prefix, msg, steps });
};

const info = (msg, ...steps) => {
	const prefix = chalk.blue("Info:");
	messageFactory({ prefix, msg, steps });
};

const success = (msg, ...steps) => {
	const prefix = chalk.green("Success:");
	messageFactory({ prefix, msg, steps });
};

module.exports = {
	c: chalk,
	colors,
	error,
	info,
	success,
};
