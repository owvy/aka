const https = require("https");
const YAML = require("yaml");

const log = require("../utils/log");
const { fileExists, readFile, writeFile } = require("../utils/global-folder");

const GIST_FILE = "aka-gist.json";
const AKA_FILE = "aka.yml";

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

const getLocalCommands = () => {
	try {
		const { files } = getLocalGist();
		const { content } = files[AKA_FILE];
		return YAML.parse(content);
	} catch (err) {
		// Silent Error at this point as this function is called on init
		// and it pollute the terminal
	}
	return {};
};

const isValidGist = (data) => {
	// eslint-disable-next-line camelcase
	const { files, html_url: htmlUrl } = JSON.parse(data);
	const akaFile = files[AKA_FILE];

	if (!akaFile) {
		log.error(
			"Missing File",
			`your gist is missing {underline aka.yml} file, please check your gists:`,
			`url: ${htmlUrl}`,
		);
		return false;
	}

	try {
		YAML.parse(akaFile.content);
		return true;
	} catch (err) {
		log.error("YAML Error", "Looks like your yaml has some error", err);
		return false;
	}
};

const saveLocalGist = (data) => {
	try {
		writeFile(GIST_FILE, data);
		log.success(
			"Gist cloned/updated",
			`new commands are available at: {green aka list} `,
		);
	} catch (err) {
		log.error("Could not save gist", err);
	}
};

const cloneGist = (id) => {
	if (!id) {
		return log.error(
			"You got a problem",
			`you need the gist id: aka clone {dim [gist_id]}`,
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
				return isValidGist(data) ? saveLocalGist(data) : null;
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
	getLocalCommands,
	hasLocalGist,
};
