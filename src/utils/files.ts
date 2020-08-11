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

const exists = (fileName: string) => fs.existsSync(getPath(fileName));

const create = (fileName: string) => fs.closeSync(fs.openSync(getPath(fileName), "a"));

const write = (fileName: string, data: string) => {
	create(fileName);
	fs.writeFileSync(getPath(fileName), data);
};

const read = (fileName: string) => {
	create(fileName);
	return fs.readFileSync(getPath(fileName), "utf8");
};

const open = (fileName: string) => {
	create(fileName);
	shell.exec(`open ${getPath(fileName)}`);
};

export default {
	create,
	exists,
	write,
	read,
	open,
};
