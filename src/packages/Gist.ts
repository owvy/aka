import * as https from "https";

import logger from "./Logger";
import * as FileSync from "./FileSync";

const GIST_FILE = "aka-local_gist.json";

const HTTPS_OPTIONS = {
	headers: {
		"User-Agent": "curl/7.30.0",
		Host: "api.github.com",
		Accept: "*/*",
	},
};

export const fetchGist = (id: string) =>
	new Promise<string>((resolve, reject) => {
		https.get(`https://api.github.com/gists/${id}`, HTTPS_OPTIONS, (res) => {
			const { statusCode } = res;
			let data = "";
			res.on("data", (d) => {
				data += d;
			});

			res.on("end", () => {
				if (statusCode === 200) {
					return resolve(data);
				}

				const { message } = JSON.parse(data);
				return reject(message);
			});

			res.on("error", reject);

			res.on("error", () => logger.error("You got a problem"));
		});
	});

export const gistExists = () => FileSync.fileExists(GIST_FILE);

export const getGist = () => JSON.parse(FileSync.readFile(GIST_FILE)) as Gist;

export const writeGist = (data: string) => FileSync.writeFile(GIST_FILE, data);
