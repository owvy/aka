const fs = require("fs");
const shell = require("shelljs");
const YAML = require("yaml");

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
	_add(argv) {
		const data = parseVars(argv);
		const ymlDoc =
			"\n" +
			Object.keys(data)
				.map((key) => `${key}: ${data[key]}`)
				.join("\n");

		this._save(ymlDoc);
	}
	_save(data) {
		fs.writeFile(VAR_PATH, data, { flag: "a+" }, (err) => {
			if (err) return console.log(err);
			console.log("Save GLOBAL");
		});
	}
	_open() {
		shell.exec(`open ${VAR_PATH}`);
	}
	_list() {
		const vars = this.getLocal();
		vars &&
			Object.keys(vars).forEach((key) => {
				console.log(key, "=", vars[key]);
			});
	}
	exec(argv) {
		if (argv.length === 0) {
			return this._open();
		}
		if (argv[0] === "list") {
			return this._list();
		}

		return this._add(argv);
	}

	getLocal() {
		try {
			const data = fs.readFileSync(VAR_PATH, "utf8");
			return YAML.parse(data);
		} catch (err) {
			console.log("No Local Vars");
		}
	}

	getFromCli(argv) {
		return parseVars(argv);
	}
}

module.exports = new Variables();
