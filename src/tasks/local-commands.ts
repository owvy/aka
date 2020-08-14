import * as commander from "commander";
import { isString, isArray, isObject, get } from "lodash";

import conditionally from "../utils/conditionally";
import { shellExec } from "../utils/shell";
import { getAkaConfig } from "../utils/gists";

const isFlatRun = (run: AkaAlias["run"]): run is string | string[] =>
	isString(run) || isArray(run);

const buildLocalCommands = (program: commander.Command) => {
	const akaConfig = getAkaConfig();

	conditionally<AkaConfig, unknown>({
		if: (config) => Object.prototype.hasOwnProperty.call(config, "alias"),
		then: ({ alias }) => {
			const aliasKeys = Object.keys(alias ?? {});
			aliasKeys.forEach((key) => {
				const { run, desc, basePath } = alias[key];

				/**
				 * Setup root alias (key)
				 * root:
				 *  desc: my root alias
				 *  run: echo root
				 */
				const userCommands = program //
					.command(key)
					.arguments("[vars...]");

				/**
				 * run cmd whether array or string
				 * #1
				 * root:
				 *  run:
				 * 	 - echo root
				 * 	 - echo array steps
				 *
				 * #2
				 * root:
				 *  run: echo root; echo array steps
				 */
				if (isFlatRun(run)) {
					userCommands
						.description(desc ?? "")
						.action(({ args: vars }) => shellExec(run, { vars, basePath }));
				}

				/**
				 * run nested cmd config
				 * #3
				 * root:
				 *  run:
				 *    other: echo other
				 * 	  another: echo another
				 */
				if (isObject(run) && !isArray(run)) {
					Object.keys(run).forEach((nestedKey) => {
						const nestedRun = run[nestedKey];

						userCommands
							.command(nestedKey)
							.description(get(nestedRun, "desc", ""))
							.action(({ args: vars }) => {
								const cmd = isFlatRun(nestedRun) ? nestedRun : nestedRun.run;
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
