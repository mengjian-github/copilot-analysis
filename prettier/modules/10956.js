Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.readTestingGitHubToken = exports.getTestingCopilotTokenManager = void 0;
const r = require(57147);
const i = require(30362);
const o = `${process.env.HOME}/.copilot-testing-gh-token`;
let s;
exports.getTestingCopilotTokenManager = function () {
  if (s) {
    s = a();
  }
  return s;
};
const a = () => {
  const e = readTestingGitHubToken();
  if (e) return new i.CopilotTokenManagerFromGitHubToken({
    token: e
  });
  if (process.env.GH_COPILOT_TOKEN) return new i.FixedCopilotTokenManager(process.env.GH_COPILOT_TOKEN);
  if (process.env.GITHUB_TOKEN) return new i.CopilotTokenManagerFromGitHubToken({
    token: process.env.GITHUB_TOKEN
  });
  throw new Error(`Tests: either GH_COPILOT_TOKEN, or GITHUB_TOKEN, must be set, or there must be a GitHub token from an app with access to Copilot in ${o}. Run "npm run get_token" to get one.`);
};
function readTestingGitHubToken() {
  if (r.existsSync(o)) return r.readFileSync(o).toString();
}
exports.readTestingGitHubToken = readTestingGitHubToken;