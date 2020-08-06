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

declare type AkaCmd = {
	basePath?: string;
	desc?: string;
	run: string | Record<string, string> | Record<string, AkaRun>;
};
