Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.postRequest = exports.Response = exports.isAbortError = exports.Fetcher = void 0;
  const r = require(79825),
    i = require(73837),
    o = require(51133),
    s = require(94777),
    a = require(6333);
  class c {
    set rejectUnauthorized(e) {
      this._rejectUnauthorized = e;
    }
    get rejectUnauthorized() {
      return this._rejectUnauthorized;
    }
  }
  exports.Fetcher = c, exports.isAbortError = function (e) {
    return e instanceof r.AbortError;
  }, exports.Response = class {
    constructor(e, t, n, r, i, o) {
      this.status = e, this.statusText = t, this.headers = n, this.getText = r, this.getJson = i, this.getBody = o, this.ok = this.status >= 200 && this.status < 300;
    }
    async text() {
      return this.getText();
    }
    async json() {
      return this.getJson();
    }
    async body() {
      return this.getBody();
    }
  }, exports.postRequest = function (e, t, n, r, l, u, p) {
    const d = {
      Authorization: i.format("Bearer %s", n),
      "X-Request-Id": l,
      "Openai-Organization": "github-copilot",
      "VScode-SessionId": e.get(o.EditorSession).sessionId,
      "VScode-MachineId": e.get(o.EditorSession).machineId,
      ...(0, o.editorVersionHeaders)(e)
    };
    e.get(s.HeaderContributors).contributeHeaders(d), r && (d["OpenAI-Intent"] = r);
    const h = {
        method: "POST",
        headers: d,
        json: u,
        timeout: 3e4
      },
      f = e.get(c);
    if (p) {
      const t = f.makeAbortController();
      p.onCancellationRequested(() => {
        (0, a.telemetry)(e, "networking.cancelRequest", a.TelemetryData.createAndMarkAsIssued({
          headerRequestId: l
        })), t.abort();
      }), h.signal = t.signal;
    }
    return f.fetch(t, h).catch(n => {
      if ("ECONNRESET" == n.code || "ETIMEDOUT" == n.code || "ERR_HTTP2_INVALID_SESSION" == n.code || "ERR_HTTP2_GOAWAY_SESSION" == n.message) return (0, a.telemetry)(e, "networking.disconnectAll"), f.disconnectAll().then(() => f.fetch(t, h));
      throw n;
    });
  };