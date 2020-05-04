const commandLineUsage = require("command-line-usage");

const summaryWithArgs = (cmd, option) => {
  const args = Object.keys(option.args)
    .map((arg) => `{bold aka ${cmd}} {underline ${arg}}`)
    .join(", ");
  return `${option.desc}: ${args}`;
};

const createDesc = (name, option) => {
  if (option.args) {
    return {
      name,
      summary: summaryWithArgs(name, option),
    };
  }
  return {
    name,
    summary: option.desc,
  };
};

const printUsage = (cmdList) => {
  const content = Object.keys(cmdList).map((key) =>
    createDesc(key, cmdList[key])
  );

  const usage = commandLineUsage([
    {
      header: "Synopsis",
      content: "$ aka <command>",
    },
    {
      header: "Command List",
      content: content,
    },
  ]);
  console.log(usage);
};

module.exports = printUsage;
