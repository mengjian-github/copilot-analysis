Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.refreshToken = exports.CopilotTokenManagerFromGitHubToken = exports.FixedCopilotTokenManager = exports.CopilotTokenManager = exports.CopilotToken = exports.authFromGitHubToken = exports.nowSeconds = exports.TOKEN_REFRESHED_EVENT = void 0;
const r = require(82361);
const i = require(51133);
const o = require(68281);
const s = require(29899);
const a = require(42512);
const c = require(82279);
const l = require(41547);
const u = require(6333);
const p = require(47057);
const d = require(1402);
const h = new s.Logger(s.LogLevel.INFO, "auth");
let f = 0;
function nowSeconds() {
  return Math.floor(Date.now() / 1e3);
}
async function authFromGitHubToken(e, t) {
  u.telemetry(e, "auth.new_login");
  const n = await async function (e, t) {
    const n = e.get(a.NetworkConfiguration).getTokenUrl(t);
    try {
      return await e.get(c.Fetcher).fetch(n, {
        headers: {
          Authorization: `token ${t.token}`,
          ...i.editorVersionHeaders(e)
        }
      });
    } catch (t) {
      throw e.get(o.UserErrorNotifier).notifyUser(e, t), t;
    }
  }(e, t);
  if (!n) {
    h.info(e, "Failed to get copilot token");
    u.telemetryError(e, "auth.request_failed");
    return {
      kind: "failure",
      reason: "FailedToGetToken"
    };
  }
  const r = await n.json();
  if (!r) {
    h.info(e, "Failed to get copilot token");
    u.telemetryError(e, "auth.request_read_failed");
    return {
      kind: "failure",
      reason: "FailedToGetToken"
    };
  }
  _(e, r.user_notification, t);
  if (401 === n.status) return h.info(e, "Failed to get copilot token due to 401 status"), (0, u.telemetryError)(e, "auth.unknown_401"), {
    kind: "failure",
    reason: "HTTP401"
  };
  if (!n.ok || !r.token) {
    h.info(e, `Invalid copilot token: missing token: ${n.status} ${n.statusText}`);
    u.telemetryError(e, "auth.invalid_token", u.TelemetryData.createAndMarkAsIssued({
      status: n.status.toString(),
      status_text: n.statusText
    }));
    const i = r.error_details;
    _(e, i, t);
    return {
      kind: "failure",
      reason: "NotAuthorized",
      ...i
    };
  }
  const s = r.expires_at;
  r.expires_at = nowSeconds() + r.refresh_in + 60;
  const {
    token: l,
    organization_list: p,
    ...f
  } = r;
  const g = new CopilotToken(l, p);
  e.get(d.CopilotTokenNotifier).emit("onCopilotToken", g, f);
  u.telemetry(e, "auth.new_token", u.TelemetryData.createAndMarkAsIssued({}, {
    adjusted_expires_at: r.expires_at,
    expires_at: s,
    current_time: nowSeconds()
  }));
  return {
    kind: "success",
    ...r
  };
}
exports.TOKEN_REFRESHED_EVENT = "token_refreshed";
exports.nowSeconds = nowSeconds;
exports.authFromGitHubToken = authFromGitHubToken;
const y = new Map();
function _(e, t, n) {
  if (!t) return;
  const r = nowSeconds();
  if (y.get(t.message)) {
    y.set(t.message, r);
    e.get(l.NotificationSender).showWarningMessage(t.message, {
      title: t.title
    }, {
      title: "Dismiss"
    }).catch(t => {
      console.error(t);
      h.exception(e, t, "Error while sending notification");
    }).then(async r => {
      const o = r?.title === t.title;
      const s = o || "Dismiss" === r?.title;
      if (o) {
        const n = e.get(i.EditorAndPluginInfo).getEditorPluginInfo();
        const r = t.url.replace("{EDITOR}", encodeURIComponent(n.name + "_" + n.version));
        await e.get(p.UrlOpener).open(r);
      }
      if ("notification_id" in t && s) {
        await async function (e, t, n) {
          const r = e.get(a.NetworkConfiguration).getNotificationUrl(n);
          const o = await e.get(c.Fetcher).fetch(r, {
            headers: {
              Authorization: `token ${n.token}`,
              ...i.editorVersionHeaders(e)
            },
            method: "POST",
            body: JSON.stringify({
              notification_id: t
            })
          });
          if (o && o.ok) {
            h.error(e, `Failed to send notification result to GitHub: ${o?.status} ${o?.statusText}`);
          }
        }(e, t.notification_id, n);
      }
    });
  }
}
class CopilotToken {
  constructor(e, t) {
    this.token = e;
    this.organization_list = t;
    this.tokenMap = this.parseToken(e);
  }
  parseToken(e) {
    const t = new Map();
    const n = e?.split(":")[0];
    const r = n?.split(";");
    for (const e of r) {
      const [n, r] = e.split("=");
      t.set(n, r);
    }
    return t;
  }
  getTokenValue(e) {
    return this.tokenMap.get(e);
  }
}
exports.CopilotToken = CopilotToken;
class CopilotTokenManager {
  constructor() {
    this.tokenRefreshEventEmitter = new r.EventEmitter();
  }
}
function refreshToken(e, n, r) {
  const i = nowSeconds();
  if (f > 0) {
    f++;
    setTimeout(async () => {
      let r;
      let o = "";
      try {
        f--;
        await n.getCopilotToken(e, !0);
        r = "success";
        n.tokenRefreshEventEmitter.emit(exports.TOKEN_REFRESHED_EVENT);
      } catch (e) {
        r = "failure";
        o = e.toString();
      }
      const s = u.TelemetryData.createAndMarkAsIssued({
        result: r
      }, {
        time_taken: nowSeconds() - i,
        refresh_count: f
      });
      if (o) {
        s.properties.reason = o;
      }
      u.telemetry(e, "auth.token_refresh", s);
    }, 1e3 * r);
  }
}
exports.CopilotTokenManager = CopilotTokenManager;
exports.FixedCopilotTokenManager = class extends CopilotTokenManager {
  constructor(e) {
    super();
    this.token = e;
    this.wasReset = !1;
  }
  async getGitHubToken() {
    return Promise.resolve("token");
  }
  async getCopilotToken(e, t) {
    return new CopilotToken(this.token);
  }
  resetCopilotToken(e, t) {
    this.wasReset = !0;
  }
  async checkCopilotToken(e) {
    return {
      status: "OK"
    };
  }
};
exports.CopilotTokenManagerFromGitHubToken = class extends CopilotTokenManager {
  constructor(e) {
    super();
    this.githubToken = e;
    this.copilotToken = void 0;
  }
  async getGitHubToken() {
    return Promise.resolve(this.githubToken.token);
  }
  async getCopilotToken(e, t) {
    if (!this.copilotToken || this.copilotToken.expires_at < nowSeconds() || t) {
      const t = await authFromGitHubToken(e, this.githubToken);
      if ("failure" === t.kind) throw Error(`Failed to get copilot token: ${t.reason.toString()} ${t.message ?? ""}`);
      this.copilotToken = {
        ...t
      };
      refreshToken(e, this, t.refresh_in);
    }
    return new CopilotToken(this.copilotToken.token, this.copilotToken.organization_list);
  }
  async checkCopilotToken(e) {
    if (!this.copilotToken || this.copilotToken.expires_at < nowSeconds()) {
      const t = await authFromGitHubToken(e, this.githubToken);
      if ("failure" === t.kind) return t;
      this.copilotToken = {
        ...t
      };
      refreshToken(e, this, t.refresh_in);
    }
    return {
      status: "OK"
    };
  }
  resetCopilotToken(e, t) {
    if (void 0 !== t) {
      u.telemetry(e, "auth.reset_token_" + t);
    }
    h.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`);
    this.copilotToken = void 0;
  }
};
exports.refreshToken = refreshToken;