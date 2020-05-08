const https = require("https");
const fs = require("fs");
const YAML = require("yaml");

const log = require("./utils/log");

const AKA_FILE = "aka.yml";
const GIST_PATH = `${__dirname}/../.aka.json`;
const HTTPS_OPTIONS = {
	headers: {
		"User-Agent": "curl/7.30.0",
		Host: "api.github.com",
		Accept: "*/*",
	},
};

class Gist {
	_getUrl(id) {
		return `https://api.github.com/gists/${id}`;
	}

	_getFile() {
		return new Promise((accept, reject) => {
			fs.readFile(GIST_PATH, "utf8", function read(err, data) {
				err ? reject(err) : accept(JSON.parse(data));
			});
		});
	}

	_save(data) {
		fs.writeFile(GIST_PATH, data, (err) => {
			if (err) {
				return log.error("You got an error", err);
			}

			log.success(
				"Gist cloned/updated",
				log.c`new commands are available at: {green aka} `
			);
		});
	}

	isEmpty(callback) {
		try {
			if (!fs.existsSync(GIST_PATH)) callback();
		} catch (err) {}

		return this;
	}

	hasGist(callback) {
		try {
			if (fs.existsSync(GIST_PATH)) callback();
		} catch (err) {}

		return this;
	}

	async read() {
		const { files } = await this._getFile();
		const akaFile = files[AKA_FILE].content;
		const commands = YAML.parse(akaFile);
		return commands;
	}

	async update() {
		const { id } = await this._getFile();
		this.clone(id);
	}

	clone(id) {
		if (!id) {
			log.error(
				"You got a problem",
				log.c`you need the gist id: aka clone {underline GIST_ID}`
			);
		}

		return new Promise((accept) => {
			https.get(this._getUrl(id), HTTPS_OPTIONS, (res) => {
				const { statusCode } = res;
				let data = "";
				res.on("data", (d) => (data += d));

				res.on("end", () => {
					if (statusCode === 200) {
						// @todo - check if the data contains aka.yml
						return this._save(data);
					}

					const { message } = JSON.parse(data);
					log.error(`You got a problem: ${message}`);
				});

				res.on("error", (err) => log.error("You got a problem", err));
			});
		});
	}
}

module.exports = new Gist();
