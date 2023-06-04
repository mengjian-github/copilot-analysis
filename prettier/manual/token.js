Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.refreshToken = exports.CopilotTokenManagerFromGitHubToken = exports.FixedCopilotTokenManager = exports.CopilotTokenManager = exports.CopilotToken = exports.authFromGitHubToken = exports.nowSeconds = exports.TOKEN_REFRESHED_EVENT = void 0;
  const r = require(82361),
    i = require(51133),
    o = require(68281),
    s = require(29899),
    a = require(42512),
    c = require(82279),
    l = require(41547),
    u = require(6333),
    p = require(47057),
    d = require(1402),
    h = new s.Logger(s.LogLevel.INFO, "auth");
  let f = 0;
  function m() {
    return Math.floor(Date.now() / 1e3);
  }
  async function g(e, t) {
    (0, u.telemetry)(e, "auth.new_login");
    const n = await async function (e, t) {
      const n = e.get(a.NetworkConfiguration).getTokenUrl(t);
      try {
        return await e.get(c.Fetcher).fetch(n, {
          headers: {
            Authorization: `token ${t.token}`,
            ...(0, i.editorVersionHeaders)(e)
          }
        });
      } catch (t) {
        throw e.get(o.UserErrorNotifier).notifyUser(e, t), t;
      }
    }(e, t);
    if (!n) return h.info(e, "Failed to get copilot token"), (0, u.telemetryError)(e, "auth.request_failed"), {
      kind: "failure",
      reason: "FailedToGetToken"
    };
    const r = await n.json();
    if (!r) return h.info(e, "Failed to get copilot token"), (0, u.telemetryError)(e, "auth.request_read_failed"), {
      kind: "failure",
      reason: "FailedToGetToken"
    };
    if (_(e, r.user_notification, t), 401 === n.status) return h.info(e, "Failed to get copilot token due to 401 status"), (0, u.telemetryError)(e, "auth.unknown_401"), {
      kind: "failure",
      reason: "HTTP401"
    };
    if (!n.ok || !r.token) {
      h.info(e, `Invalid copilot token: missing token: ${n.status} ${n.statusText}`), (0, u.telemetryError)(e, "auth.invalid_token", u.TelemetryData.createAndMarkAsIssued({
        status: n.status.toString(),
        status_text: n.statusText
      }));
      const i = r.error_details;
      return _(e, i, t), {
        kind: "failure",
        reason: "NotAuthorized",
        ...i
      };
    }
    const s = r.expires_at;
    r.expires_at = m() + r.refresh_in + 60;
    const {
        token: l,
        organization_list: p,
        ...f
      } = r,
      g = new v(l, p);
    return e.get(d.CopilotTokenNotifier).emit("onCopilotToken", g, f), (0, u.telemetry)(e, "auth.new_token", u.TelemetryData.createAndMarkAsIssued({}, {
      adjusted_expires_at: r.expires_at,
      expires_at: s,
      current_time: m()
    })), {
      kind: "success",
      ...r
    };
  }
  exports.TOKEN_REFRESHED_EVENT = "token_refreshed", exports.nowSeconds = m, exports.authFromGitHubToken = g;
  const y = new Map();
  function _(e, t, n) {
    if (!t) return;
    const r = m();
    y.get(t.message) || (y.set(t.message, r), e.get(l.NotificationSender).showWarningMessage(t.message, {
      title: t.title
    }, {
      title: "Dismiss"
    }).catch(t => {
      console.error(t), h.exception(e, t, "Error while sending notification");
    }).then(async r => {
      const o = r?.title === t.title,
        s = o || "Dismiss" === r?.title;
      if (o) {
        const n = e.get(i.EditorAndPluginInfo).getEditorPluginInfo(),
          r = t.url.replace("{EDITOR}", encodeURIComponent(n.name + "_" + n.version));
        await e.get(p.UrlOpener).open(r);
      }
      "notification_id" in t && s && (await async function (e, t, n) {
        const r = e.get(a.NetworkConfiguration).getNotificationUrl(n),
          o = await e.get(c.Fetcher).fetch(r, {
            headers: {
              Authorization: `token ${n.token}`,
              ...(0, i.editorVersionHeaders)(e)
            },
            method: "POST",
            body: JSON.stringify({
              notification_id: t
            })
          });
        o && o.ok || h.error(e, `Failed to send notification result to GitHub: ${o?.status} ${o?.statusText}`);
      }(e, t.notification_id, n));
    }));
  }
  class v {
    constructor(e, t) {
      this.token = e, this.organization_list = t, this.tokenMap = this.parseToken(e);
    }
    parseToken(e) {
      const t = new Map(),
        n = e?.split(":")[0],
        r = n?.split(";");
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
  exports.CopilotToken = v;
  class b {
    constructor() {
      this.tokenRefreshEventEmitter = new r.EventEmitter();
    }
  }
  function E(e, n, r) {
    const i = m();
    f > 0 || (f++, setTimeout(async () => {
      let r,
        o = "";
      try {
        f--, await n.getCopilotToken(e, !0), r = "success", n.tokenRefreshEventEmitter.emit(exports.TOKEN_REFRESHED_EVENT);
      } catch (e) {
        r = "failure", o = e.toString();
      }
      const s = u.TelemetryData.createAndMarkAsIssued({
        result: r
      }, {
        time_taken: m() - i,
        refresh_count: f
      });
      o && (s.properties.reason = o), (0, u.telemetry)(e, "auth.token_refresh", s);
    }, 1e3 * r));
  }
  exports.CopilotTokenManager = b, exports.FixedCopilotTokenManager = class extends b {
    constructor(e) {
      super(), this.token = e, this.wasReset = !1;
    }
    async getGitHubToken() {
      return Promise.resolve("token");
    }
    async getCopilotToken(e, t) {
      return new v(this.token);
    }
    resetCopilotToken(e, t) {
      this.wasReset = !0;
    }
    async checkCopilotToken(e) {
      return {
        status: "OK"
      };
    }
  }, exports.CopilotTokenManagerFromGitHubToken = class extends b {
    constructor(e) {
      super(), this.githubToken = e, this.copilotToken = void 0;
    }
    async getGitHubToken() {
      return Promise.resolve(this.githubToken.token);
    }
    async getCopilotToken(e, t) {
      if (!this.copilotToken || this.copilotToken.expires_at < m() || t) {
        const t = await g(e, this.githubToken);
        if ("failure" === t.kind) throw Error(`Failed to get copilot token: ${t.reason.toString()} ${t.message ?? ""}`);
        this.copilotToken = {
          ...t
        }, E(e, this, t.refresh_in);
      }
      return new v(this.copilotToken.token, this.copilotToken.organization_list);
    }
    async checkCopilotToken(e) {
      if (!this.copilotToken || this.copilotToken.expires_at < m()) {
        const t = await g(e, this.githubToken);
        if ("failure" === t.kind) return t;
        this.copilotToken = {
          ...t
        }, E(e, this, t.refresh_in);
      }
      return {
        status: "OK"
      };
    }
    resetCopilotToken(e, t) {
      void 0 !== t && (0, u.telemetry)(e, "auth.reset_token_" + t), h.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`), this.copilotToken = void 0;
    }
  }, exports.refreshToken = E;