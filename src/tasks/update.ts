import logger from "../utils/logger";
import { getRemoteGist, isValidGist, saveLocalGist, getAkaConfig } from "../utils/gists";
import conditionally from "../utils/conditionally";

const update = async () => {
	const config = getAkaConfig();
	const gist = await getRemoteGist(config.id);

	conditionally({
		if: isValidGist,
		then: (data) => {
			saveLocalGist(data);
			logger.success("Importing config from %s", data.description);
		},
		else: () => logger.fatal("Could not import configuration"),
		fail: (err) => logger.fatal("Could not import aka configuration", err),
	})(gist);
};

export default update;
