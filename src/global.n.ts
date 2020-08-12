/* eslint-disable camelcase */

declare type Gist = {
	id: string;
	description: string;
	html_url: string;
	files: Record<
		string,
		{
			filename: string;
			content: string;
			language: string;
		}
	>;
};

declare type AkaRun = { run: string; desc: string };

declare type AkaAlias = {
	basePath?: string;
	desc?: string;
	run: string | string[] | Record<string, AkaRun>;
};

declare type AkaAliasMap = Record<string, AkaAlias>;

declare type AkaConfig = {
	id: string;
	alias: AkaAliasMap;
};
