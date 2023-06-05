Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.postRequest = exports.Response = exports.isAbortError = exports.Fetcher = void 0;
const r = require(79825);
const i = require(73837);
const config = require("./config");
const s = require(94777);
const telemetry = require("./telemetry");
class Fetcher {
  set rejectUnauthorized(e) {
    this._rejectUnauthorized = e;
  }
  get rejectUnauthorized() {
    return this._rejectUnauthorized;
  }
}
exports.Fetcher = Fetcher;
exports.isAbortError = function (e) {
  return e instanceof r.AbortError;
};
exports.Response = class {
  constructor(e, t, n, r, i, o) {
    this.status = e;
    this.statusText = t;
    this.headers = n;
    this.getText = r;
    this.getJson = i;
    this.getBody = o;
    this.ok = this.status >= 200 && this.status < 300;
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
};
exports.postRequest = function (e, t, n, r, l, u, p) {
  const d = {
    Authorization: i.format("Bearer %s", n),
    "X-Request-Id": l,
    "Openai-Organization": "github-copilot",
    "VScode-SessionId": e.get(config.EditorSession).sessionId,
    "VScode-MachineId": e.get(config.EditorSession).machineId,
    ...config.editorVersionHeaders(e)
  };
  e.get(s.HeaderContributors).contributeHeaders(d);
  if (r) {
    d["OpenAI-Intent"] = r;
  }
  const h = {
    method: "POST",
    headers: d,
    json: u,
    timeout: 3e4
  };
  const f = e.get(Fetcher);
  if (p) {
    const t = f.makeAbortController();
    p.onCancellationRequested(() => {
      telemetry.telemetry(e, "networking.cancelRequest", telemetry.TelemetryData.createAndMarkAsIssued({
        headerRequestId: l
      }));
      t.abort();
    });
    h.signal = t.signal;
  }
  return f.fetch(t, h).catch(n => {
    if ("ECONNRESET" == n.code || "ETIMEDOUT" == n.code || "ERR_HTTP2_INVALID_SESSION" == n.code || "ERR_HTTP2_GOAWAY_SESSION" == n.message) {
      telemetry.telemetry(e, "networking.disconnectAll");
      return f.disconnectAll().then(() => f.fetch(t, h));
    }
    throw n;
  });
};