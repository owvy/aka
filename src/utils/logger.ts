import { Signale } from "signale";

const options = {
	uppercaseLabel: true,
	displayDate: true,
	types: {
		keys: {
			badge: "🔑",
			color: "blue",
			label: "Variables",
			logLevel: "info",
		},
	},
};

const logger = new Signale(options);

export default logger;
