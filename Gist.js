const https = require("https");
const fs = require("fs");
const YAML = require("yaml");

const { clonedSuccessful } = require("./logger");

const AKA_FILE = "aka.yml";
const GIST_PATH = `${__dirname}/aka.json`;
const HTTPS_OPTIONS = {
  headers: {
    "User-Agent": "curl/7.30.0",
    Host: "api.github.com",
    Accept: "*/*",
  },
};

class Gist {
  _getUrl(id) {
    return `https://api.github.com/gists/${id}`;
  }

  _getFile() {
    return new Promise((accept, reject) => {
      fs.readFile(GIST_PATH, "utf8", function read(err, data) {
        err ? reject(err) : accept(JSON.parse(data));
      });
    });
  }

  _save(data) {
    fs.writeFile(GIST_PATH, data, (err) => {
      if (err) return console.log(err);
      clonedSuccessful();
    });
  }

  async read() {
    const { files } = await this._getFile();
    const akaFile = files[AKA_FILE].content;
    const commands = YAML.parse(akaFile);
    return commands;
  }

  async update() {
    const { id } = await this._getFile();
    this.clone(id);
  }

  clone(id) {
    return new Promise((accept) => {
      https.get(this._getUrl(id), HTTPS_OPTIONS, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          this._save(data);
          accept(res);
        });
      });
    });
  }
}

module.exports = Gist;
