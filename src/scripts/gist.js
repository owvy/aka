const https = require("https");

const log = require("../utils/log");
const { fileExists, readFile, writeFile } = require("../utils/global-folder");

const GIST_FILE = "aka-gist.json";

const HTTPS_OPTIONS = {
	headers: {
		"User-Agent": "curl/7.30.0",
		Host: "api.github.com",
		Accept: "*/*",
	},
};

const getUrl = (id) => `https://api.github.com/gists/${id}`;

const hasLocalGist = () => fileExists(GIST_FILE);

const getLocalGist = () => JSON.parse(readFile(GIST_FILE));

const saveLocalGist = (data) => {
	try {
		writeFile(GIST_FILE, data);
		log.success(
			"Gist cloned/updated",
			log.c`new commands are available at: {green aka list} `,
		);
	} catch (err) {
		log.error("Could not save gist", err);
	}
};

const cloneGist = (id) => {
	if (!id) {
		return log.error(
			"You got a problem",
			log.c`you need the gist id: aka clone {dim [gist_id]}`,
		);
	}

	https.get(getUrl(id), HTTPS_OPTIONS, (res) => {
		const { statusCode } = res;
		let data = "";
		res.on("data", (d) => {
			data += d;
		});

		res.on("end", () => {
			if (statusCode === 200) {
				// @todo - check if the data contains aka.yml
				return saveLocalGist(data);
			}
			const { message } = JSON.parse(data);
			return log.error(`You got a problem: ${message}`);
		});

		res.on("error", (err) => log.error("You got a problem", err));
	});

	return null;
};

const updateGist = () => {
	if (hasLocalGist()) {
		const { id } = getLocalGist();
		return cloneGist(id);
	}
	return log.error("No Gist found", "you need to clone a gist first");
};

module.exports = {
	cloneGist,
	updateGist,
	getLocalGist,
	hasLocalGist,
};
