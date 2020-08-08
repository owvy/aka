import * as YAML from "yaml";

import logger from "./Logger";
import { conditionally } from "./Utils";
import { gistExists, fetchGist, getGist, writeGist } from "./Gist";

const AKA_FILE = "aka.yml";

const isValidConfig = (data: string) => {
	const { files, html_url: htmlUrl } = JSON.parse(data) as Gist;
	const akaFile = files[AKA_FILE];

	if (!akaFile) {
		logger.error(
			"Gist file is missing aka.yml, please check your gist:",
			`url: ${htmlUrl}`,
		);
		return false;
	}

	try {
		YAML.parse(akaFile.content);
		return true;
	} catch (err) {
		logger.warn("Your config has some error");
		logger.fatal(err);
		return false;
	}
};

const isIdRequired = () => {
	logger.warn(`<id> is required, please pass valid gist id`);
	return "";
};

export const getConfig = () => {
	return conditionally<unknown, AkaConfig>({
		if: gistExists,
		then: () => {
			const gist = getGist();
			const alias = YAML.parse(gist.files[AKA_FILE].content) as AkaAliasMap;
			return {
				alias,
				id: gist.id,
			};
		},
		else: () => {
			// Soft error, it doesn't need to break at app
			// atm of reading local gist
			logger.warn("Aka config is missing");
			return {} as AkaConfig;
		},
		fail: () => logger.error("Could not read local config"),
	})(null);
};

export const cloneConfig = async (id = isIdRequired()) => {
	const data = await fetchGist(id);

	conditionally({
		if: isValidConfig,
		then: (gist) => {
			writeGist(gist);
			logger.success("Local gist is up-to-date");
		},
		else: () => {
			// silent
		},
		fail: (err) => logger.fatal("Could not clone gist", err),
	})(data);
};

export const updateConfig = () => {
	const config = getConfig();
	cloneConfig(config.id);
};
