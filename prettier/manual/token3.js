Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.VSCodeCopilotTokenManager = exports.ExtensionNotificationSender = void 0;
  const r = require(89496),
    i = require(30362),
    o = require(29899),
    s = require(6333),
    a = require(30047),
    c = new o.Logger(o.LogLevel.INFO, "auth");
  let l = !1;
  exports.ExtensionNotificationSender = class {
    async showWarningMessage(e, ...t) {
      return {
        title: await r.window.showWarningMessage(e, ...t.map(e => e.title))
      };
    }
  };
  class u extends i.CopilotTokenManager {
    constructor() {
      super(), this.copilotToken = void 0;
    }
    async getGitHubToken() {
      return (await (0, a.getSession)())?.accessToken;
    }
    async getCopilotToken(e, t) {
      return (!this.copilotToken || this.copilotToken.expires_at < (0, i.nowSeconds)() || t) && (this.copilotToken = await async function (e) {
        const t = await async function (e) {
          const t = await (0, a.getSession)();
          if (!t) return c.info(e, "GitHub login failed"), (0, s.telemetryError)(e, "auth.github_login_failed"), {
            kind: "failure",
            reason: "GitHubLoginFailed"
          };
          c.debug(e, `Logged in as ${t.account.label}, oauth token ${t.accessToken}`);
          const n = await (0, i.authFromGitHubToken)(e, {
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
          throw l || (l = !0, r.window.showWarningMessage(e)), Error(e);
        }
        if ("failure" === t.kind && "GitHubLoginFailed" === t.reason) throw Error("GitHubLoginFailed");
        if ("failure" === t.kind) throw Error("Failed to get copilot token");
        return t;
      }(e), (0, i.refreshToken)(e, this, this.copilotToken.refresh_in)), new i.CopilotToken(this.copilotToken.token, this.copilotToken.organization_list);
    }
    resetCopilotToken(e, t) {
      void 0 !== t && (0, s.telemetry)(e, "auth.reset_token_" + t), c.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`), this.copilotToken = void 0;
    }
  }
  exports.VSCodeCopilotTokenManager = u;