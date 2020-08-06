import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import * as shell from "shelljs";

const AKA_DIR = path.join(os.homedir(), ".config", "@owvy");

const getPath = (fileName: string) => {
	if (!fs.existsSync(AKA_DIR)) {
		fs.mkdirSync(AKA_DIR);
	}
	return path.join(AKA_DIR, fileName);
};

export const fileExists = (fileName: string) => fs.existsSync(getPath(fileName));

export const createFile = (fileName: string) =>
	fs.closeSync(fs.openSync(getPath(fileName), "a"));

export const writeFile = (fileName: string, data: string) => {
	createFile(fileName);
	fs.writeFileSync(getPath(fileName), data);
};

export const readFile = (fileName: string) => {
	createFile(fileName);
	return fs.readFileSync(getPath(fileName), "utf8");
};

export const openFile = (fileName: string) => {
	createFile(fileName);
	shell.exec(`open ${getPath(fileName)}`);
};
