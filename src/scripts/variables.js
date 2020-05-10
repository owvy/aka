const fs = require("fs");
const shell = require("shelljs");
const YAML = require("yaml");
const chalk = require("chalk");

const log = require("../utils/log");
const { VAR_PATH } = require("../utils/const");

const parseVars = (argv) => {
	const vars = {};
	argv.forEach((arg) => {
		const [key, value] = arg.split("=");
		vars[key] = value || true;
	});

	return vars;
};

const getLocalVars = () => {
	try {
		fs.closeSync(fs.openSync(VAR_PATH, "a"));
		const data = fs.readFileSync(VAR_PATH, "utf8");
		return data ? YAML.parse(data, { merge: true }) : {};
	} catch (err) {
		log.error("Yaml Error", err.message);
	}

	return null;
};

const saveVariable = (newVars) => {
	try {
		const localVars = getLocalVars();
		const yaml = new YAML.Document();
		yaml.contents = { ...localVars, ...newVars };
		fs.writeFileSync(VAR_PATH, yaml);
		log.success("save and sound", log.c`check the full list: {bold aka var list}`);
	} catch (err) {
		log.error("Something went wrong", err);
	}
};

const openVariableFile = () => {
	fs.closeSync(fs.openSync(VAR_PATH, "a"));
	shell.exec(`open ${VAR_PATH}`);
};

const printVariableList = () => {
	const vars = getLocalVars();
	if (vars) {
		log.print(chalk`| Local Variables:`, "\n|");
		Object.keys(vars).forEach((key) => {
			log.print(chalk`| {dim ${key}}: ${vars[key]}`);
		});
	}
};

const runVariableCommand = (argv) => {
	if (argv.length === 0) {
		return openVariableFile();
	}
	if (argv[0] === "list") {
		return printVariableList();
	}

	return saveVariable(parseVars(argv));
};

module.exports = {
	runVariableCommand,
	getLocalVars,
	parseVars,
};
