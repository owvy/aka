const chalk = require("chalk");

const log = console.log;

const clonedSuccessful = () =>
	log(chalk`
log: {green Gist successfully clone}
try: {cyan aka {underline list}}
`);

const noGistFound = () => {
	log(chalk`
  log: {red Gist not found}
  try: {green aka {underline clone} GIST_ID}
  `);
};

module.exports = {
	clonedSuccessful,
	noGistFound,
};
