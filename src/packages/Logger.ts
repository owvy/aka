import { Signale } from "signale";

const options = {
	uppercaseLabel: true,
	types: {
		santa: {
			badge: "🎅",
			color: "blue",
			label: "Variables",
			logLevel: "info",
		},
	},
};

const logger = new Signale(options);

export default logger;
