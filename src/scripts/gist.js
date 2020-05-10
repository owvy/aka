const https = require("https");
const fs = require("fs");

const log = require("../utils/log");
const { GIST_PATH } = require("../utils/const");

const HTTPS_OPTIONS = {
	headers: {
		"User-Agent": "curl/7.30.0",
		Host: "api.github.com",
		Accept: "*/*",
	},
};

const getUrl = (id) => `https://api.github.com/gists/${id}`;

const hasLocalGist = () => fs.existsSync(GIST_PATH);

const getLocalGist = () => JSON.parse(fs.readFileSync(GIST_PATH, "utf8"));

const saveFile = (data) => {
	fs.closeSync(fs.openSync(GIST_PATH, "a"));
	fs.writeFile(GIST_PATH, data, (err) => {
		if (err) return log.error("Could not save gist", err);

		return log.success(
			"Gist cloned/updated",
			log.c`new commands are available at: {green aka list} `,
		);
	});
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
				return saveFile(data);
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
