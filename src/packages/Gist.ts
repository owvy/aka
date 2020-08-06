import * as https from "https";
import * as YAML from "yaml";

import * as Logger from "./Logger";
import * as FileSync from "./FileSync";

const GIST_FILE = "aka-local_gist.json";
const AKA_FILE = "aka.yml";
const HTTPS_OPTIONS = {
	headers: {
		"User-Agent": "curl/7.30.0",
		Host: "api.github.com",
		Accept: "*/*",
	},
};

const getUrl = (id: string) => `https://api.github.com/gists/${id}`;

const isValidGist = (data: string) => {
	const { files, html_url: htmlUrl } = JSON.parse(data) as Gist;
	const akaFile = files[AKA_FILE];

	if (!akaFile) {
		Logger.error(
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
		Logger.error("YAML Error", "Looks like your yaml has some error", err);
		return false;
	}
};

export const hasLocalGist = () => FileSync.fileExists(GIST_FILE);

export const getLocalGist = (): Gist => JSON.parse(FileSync.readFile(GIST_FILE));

export const getLocalCommands = () => {
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

export const saveLocalGist = (data: string) => {
	try {
		FileSync.writeFile(GIST_FILE, data);
		Logger.success(
			"Gist cloned/updated",
			`new commands are available at: {green aka list} `,
		);
	} catch (err) {
		Logger.error("Could not save gist", err);
	}
};

export const cloneGist = (id: string) => {
	if (!id) {
		return Logger.error(
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
			return Logger.error(`You got a problem: ${message}`);
		});

		res.on("error", (err: string) => Logger.error("You got a problem", err));
	});

	return null;
};

export const updateGist = () => {
	if (hasLocalGist()) {
		const { id } = getLocalGist();
		return cloneGist(id);
	}
	return Logger.error("No Gist found", "you need to clone a gist first");
};
