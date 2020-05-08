const fs = require("fs");
const shell = require("shelljs");
const YAML = require("yaml");
const chalk = require("chalk");

const log = require("./utils/log");

const VAR_FILE = "variables.yml";
const VAR_PATH = `${__dirname}/../${VAR_FILE}`;

const parseVars = (argv) => {
	const vars = {};
	argv.forEach((arg) => {
		let [key, value] = arg.split("=");
		vars[key] = value || true;
	});

	return vars;
};

class Variables {
	_save(data) {
		//console.log(parseVars(data));
		try {
			const localVars = this.getLocal();
			const yaml = new YAML.Document();
			yaml.contents = { ...localVars, ...parseVars(data) };
			fs.writeFileSync(VAR_PATH, yaml);
			log.success(
				"save and sound",
				log.c`check the full list: {blue aka var {underline list}}`
			);
		} catch (err) {
			log.error("Something went wrong", err);
		}
	}
	_open() {
		fs.closeSync(fs.openSync(VAR_PATH, "a"));
		shell.exec(`open ${VAR_PATH}`);
	}
	_list() {
		const vars = this.getLocal();
		if (vars) {
			console.log(chalk`| Local Variables:`, "\n|");
			Object.keys(vars).forEach((key) => {
				console.log(chalk`| {dim ${key}}: ${vars[key]}`);
			});
		}
	}
	exec(argv) {
		if (argv.length === 0) {
			return this._open();
		}
		if (argv[0] === "list") {
			return this._list();
		}

		return this._save(argv);
	}

	getLocal() {
		try {
			const data = fs.readFileSync(VAR_PATH, "utf8");
			return YAML.parse(data, { merge: true });
		} catch (err) {
			log.error("Yaml Error", err.message);
		}
	}

	getFromCli(argv) {
		return parseVars(argv);
	}
}

module.exports = new Variables();
