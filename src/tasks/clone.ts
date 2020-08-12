import { getRemoteGist, isValidGist, saveLocalGist } from "../utils/gists";
import conditionally from "../utils/conditionally";
import logger from "../utils/logger";

export const clone = async (id: string) => {
	const data = await getRemoteGist(id);

	conditionally({
		if: isValidGist,
		then: (gist) => {
			saveLocalGist(gist);
			logger.success("Local gist is up-to-date");
		},
		else: () => {
			// silent
		},
		fail: (err) => logger.fatal("Could not clone gist", err),
	})(data);
};

export default clone;
