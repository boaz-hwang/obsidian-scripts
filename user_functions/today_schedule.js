const { execSync } = require("child_process");

module.exports = async function (tp) {
  const scriptPath =
    "/Users/hwang-gyeongchan/Documents/vault/Templates/scripts/external_schedule_fetcher.js";
  const result = execSync(`/opt/homebrew/bin/node "${scriptPath}"`);
  return result.toString();
};
