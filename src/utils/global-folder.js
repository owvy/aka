const os = require("os");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");

const AKA_DIR = path.join(os.homedir(), ".config", "@owvy");

const getPath = (fileName) => {
	if (!fs.existsSync(AKA_DIR)) {
		fs.mkdirSync(AKA_DIR);
	}
	return path.join(AKA_DIR, fileName);
};

const fileExists = (fileName) => fs.existsSync(getPath(fileName));

const createFile = (fileName) => fs.closeSync(fs.openSync(getPath(fileName), "a"));

const writeFile = (fileName, data) => {
	createFile(fileName);
	fs.writeFileSync(getPath(fileName), data);
};

const readFile = (fileName) => {
	createFile(fileName);
	return fs.readFileSync(getPath(fileName), "utf8");
};

const openFile = (fileName) => {
	createFile(fileName);
	return shell.exec(`open ${getPath(fileName)}`);
};

module.exports = {
	createFile,
	writeFile,
	readFile,
	openFile,
	fileExists,
};
