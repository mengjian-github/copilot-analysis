Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getSession = exports.onDidChangeSessionsHandler = exports.SESSION_LOGIN_MESSAGE = exports.AuthProviderId = void 0;
const r = require(89496);
const i = require(30362);
const o = require(44197);
const s = require(86722);
var a;
!function (e) {
  e.GitHub = "github";
  e.GitHubEnterprise = "github-enterprise";
}(a = exports.AuthProviderId || (exports.AuthProviderId = {}));
const c = ["read:user"];
const l = ["user:email"];
exports.SESSION_LOGIN_MESSAGE = "You are not signed in to GitHub. Please sign in to use Copilot.";
let u = !1;
function p() {
  return r.workspace.getConfiguration(o.CopilotConfigPrefix).get("advanced")?.authProvider === a.GitHubEnterprise ? a.GitHubEnterprise : a.GitHub;
}
function d(e) {
  if ("true" === process.env.CODESPACES && process.env.GITHUB_TOKEN) {
    const e = process.env.GITHUB_USER || "codespace-user";
    const t = {
      accessToken: process.env.GITHUB_TOKEN,
      account: {
        label: e
      }
    };
    return Promise.resolve(t);
  }
  const t = p();
  return r.authentication.getSession(t, c, {
    silent: !0
  }).then(n => n || r.authentication.getSession(t, l, {
    createIfNone: e
  }));
}
exports.onDidChangeSessionsHandler = async function (e, n) {
  const o = e.provider;
  const a = p();
  if (o.id === a) {
    const e = n.get(s.StatusReporter);
    if (await r.authentication.getSession(a, l)) {
      e.forceNormal();
      await n.get(i.CopilotTokenManager).getCopilotToken(n, !0);
    } else {
      n.get(i.CopilotTokenManager).resetCopilotToken(n);
      e.setWarning(exports.SESSION_LOGIN_MESSAGE);
    }
  }
};
exports.getSession = async function () {
  let e = await d(!1);
  if (!e && !u) {
    u = !0;
    if ("Sign in to GitHub" !== (await r.window.showInformationMessage("Sign in to use GitHub Copilot.", "Sign in to GitHub"))) throw new Error("GitHubLoginFailed");
    e = await d(!0);
  }
  return e;
};