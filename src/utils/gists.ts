import * as https from "https";
import * as YAML from "yaml";

import logger from "./logger";
import Files from "./files";
import conditionally from "./conditionally";

const GIST_FILE = "aka-local_gist.json";
const AKA_FILE = "aka.yml";

const HTTPS_OPTIONS = {
	headers: {
		"User-Agent": "curl/7.30.0",
		Host: "api.github.com",
		Accept: "*/*",
	},
};

export const getRemoteGist = (id: string) =>
	new Promise<Gist>((resolve, reject) => {
		https.get(`https://api.github.com/gists/${id}`, HTTPS_OPTIONS, (res) => {
			const { statusCode } = res;
			let data = "";
			res.on("data", (d) => {
				data += d;
			});

			res.on("end", () => {
				if (statusCode === 200) {
					return resolve(JSON.parse(data) as Gist);
				}

				const { message } = JSON.parse(data);
				return reject(message);
			});

			res.on("error", reject);

			res.on("error", () => logger.error("You got a problem"));
		});
	});

export const localGistExist = () => Files.exists(GIST_FILE);

export const getLocalGist = () => JSON.parse(Files.read(GIST_FILE)) as Gist;

export const saveLocalGist = (data: Gist) => Files.write(GIST_FILE, JSON.stringify(data));

export const isValidGist = conditionally<Gist, boolean>({
	if: (data) => data.files[AKA_FILE] !== null,
	then: (data) => {
		YAML.parse(data.files[AKA_FILE].content);
		return true;
	},
	else: ({ html_url: htmlUrl }) => {
		logger.error("Gist file is missing aka.yml, please check your gist: %s", htmlUrl);
		return false;
	},
	fail: (err) => {
		logger.error(err);
		return false;
	},
});

export const getAkaConfig = () => {
	return conditionally<unknown, AkaConfig>({
		if: localGistExist,
		then: () => {
			const gist = getLocalGist();
			const alias = YAML.parse(gist.files[AKA_FILE].content) as AkaAliasMap;
			return {
				alias,
				id: gist.id,
			};
		},
		else: () => {
			// Soft error,
			return {} as AkaConfig;
		},
		fail: () => logger.error("Could not read local config"),
	})(null);
};
