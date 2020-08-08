/* eslint-disable camelcase */

declare type Gist = {
	id: string;
	files: Record<
		string,
		{
			content: string;
		}
	>;
	html_url: string;
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
