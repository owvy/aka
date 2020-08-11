import * as commander from "commander";
import { isString, isArray, isObject } from "lodash";

import conditionally from "../utils/conditionally";
import { shellExec } from "../utils/shell";
import { getAkaConfig } from "../utils/gists";

const buildLocalCommands = (program: commander.Command) => {
	const akaConfig = getAkaConfig();

	conditionally<AkaConfig, unknown>({
		if: (config) => Object.prototype.hasOwnProperty.call(config, "alias"),
		then: ({ alias }) => {
			const aliasKeys = Object.keys(alias ?? {});
			aliasKeys.forEach((key) => {
				const { run, desc, basePath } = alias[key];

				const userCommands = program //
					.command(key)
					.arguments("[vars...]");

				if (isString(run) || isArray(run)) {
					userCommands
						.description(desc ?? "")
						.action(({ args: vars }) => shellExec(run, { vars, basePath }));
				}

				if (isObject(run) && !isArray(run)) {
					Object.keys(run).forEach((nestedKey) => {
						const nestedRun = run[nestedKey];

						userCommands
							.command(nestedKey)
							.description(nestedRun.desc ?? "")
							.action(({ args: vars }) => {
								const cmd = isString(nestedRun) ? nestedRun : nestedRun.run;
								shellExec(cmd, { vars, basePath });
							});
					});
				}
			});
		},
		else: () => null,
	})(akaConfig);
};

export default buildLocalCommands;
