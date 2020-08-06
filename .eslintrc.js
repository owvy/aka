module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	extends: [
		"airbnb-base",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	plugins: ["@typescript-eslint"],
	rules: {
		"import/extensions": "OFF",
		"@typescript-eslint/explicit-module-boundary-types": "OFF",
	},
	settings: {
		"import/resolver": {
			node: {
				extensions: [".ts"],
			},
		},
	},
};
