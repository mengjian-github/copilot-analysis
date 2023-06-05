Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.VSCodeCopilotTokenManager = exports.ExtensionNotificationSender = void 0;
const vscode = require("vscode");
const token = require("./token");
const logger = require("./logger");
const telemetry = require("./telemetry");
const session = require("./session");
const c = new logger.Logger(logger.LogLevel.INFO, "auth");
let l = !1;
exports.ExtensionNotificationSender = class {
  async showWarningMessage(e, ...t) {
    return {
      title: await vscode.window.showWarningMessage(e, ...t.map(e => e.title))
    };
  }
};
class VSCodeCopilotTokenManager extends token.CopilotTokenManager {
  constructor() {
    super();
    this.copilotToken = void 0;
  }
  async getGitHubToken() {
    return (await session.getSession())?.accessToken;
  }
  async getCopilotToken(e, t) {
    if (!this.copilotToken || this.copilotToken.expires_at < token.nowSeconds() || t) {
      this.copilotToken = await async function (e) {
        const t = await async function (e) {
          const t = await session.getSession();
          if (!t) {
            c.info(e, "GitHub login failed");
            telemetry.telemetryError(e, "auth.github_login_failed");
            return {
              kind: "failure",
              reason: "GitHubLoginFailed"
            };
          }
          c.debug(e, `Logged in as ${t.account.label}, oauth token ${t.accessToken}`);
          const n = await token.authFromGitHubToken(e, {
            token: t.accessToken
          });
          if ("success" == n.kind) {
            const r = n.token;
            c.debug(e, `Copilot HMAC for ${t.account.label}: ${r}`);
          }
          return n;
        }(e);
        if ("failure" === t.kind && "NotAuthorized" === t.reason) throw Error(t.message ?? "User not authorized");
        if ("failure" === t.kind && "HTTP401" === t.reason) {
          const e = "Your GitHub token is invalid. Please sign out from your GitHub account using VSCode UI and try again.";
          throw l || (l = !0, vscode.window.showWarningMessage(e)), Error(e);
        }
        if ("failure" === t.kind && "GitHubLoginFailed" === t.reason) throw Error("GitHubLoginFailed");
        if ("failure" === t.kind) throw Error("Failed to get copilot token");
        return t;
      }(e);
      token.refreshToken(e, this, this.copilotToken.refresh_in);
    }
    return new token.CopilotToken(this.copilotToken.token, this.copilotToken.organization_list);
  }
  resetCopilotToken(e, t) {
    if (void 0 !== t) {
      telemetry.telemetry(e, "auth.reset_token_" + t);
    }
    c.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`);
    this.copilotToken = void 0;
  }
}
exports.VSCodeCopilotTokenManager = VSCodeCopilotTokenManager;