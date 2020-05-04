const https = require("https");
const YAML = require("yaml");

const httpsOptions = {
  headers: {
    "User-Agent": "curl/7.30.0",
    Host: "api.github.com",
    Accept: "*/*",
  },
};

const getUrl = (gistID) => `https://api.github.com/gists/${gistID}`;

const parseData = (data) => {
  const gist = JSON.parse(data);
  const alias = gist.files["aka.yml"];
  return YAML.parse(alias.content);
};

const Gist = (gistID) => {
  const gistURL = getUrl(gistID);

  const get = () =>
    new Promise((accept) => {
      https.get(gistURL, httpsOptions, (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          const res = parseData(data);
          accept(res);
        });
      });
    });

  return {
    get,
  };
};

module.exports = Gist;
