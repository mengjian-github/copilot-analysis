Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.HelixFetcher = void 0;
const r = require(79825);
const i = require(6149);
const o = require(51133);
const s = require(82279);
const a = require(25704);
class HelixFetcher extends s.Fetcher {
  constructor(e) {
    super();
    this.ctx = e;
    this.createSocketFactory = (e, t) => async n => {
      const r = await this.certificateConfigurator.createTunnelSettings(e);
      const o = i.httpOverHttp({
        proxy: r
      });
      n.rejectUnauthorized = t;
      await this.certificateConfigurator.applyToRequestOptions(n);
      return new Promise((t, i) => {
        this.fixTunnelErrorHandling(n, i);
        const s = setTimeout(() => {
          i({
            message: `tunneling socket could not be established, proxy socket connection timeout while connecting to ${r.host}:${r.port}`
          });
        }, e.connectionTimeoutInMs ?? 1e4);
        o.createSocket(n, e => {
          clearTimeout(s);
          t(e);
        });
      });
    };
    this.fetchApi = this.createFetchApi(e);
    this.certificateConfigurator = new a.RootCertificateConfigurator(e);
  }
  fixTunnelErrorHandling(e, t) {
    if (e.request?.emit) {
      e.request = {};
      e.request.emit = function (e, n) {
        t(n);
      };
    }
  }
  set proxySettings(e) {
    this._proxySettings = e;
    this.fetchApi = this.createFetchApi(this.ctx);
  }
  get proxySettings() {
    return this._proxySettings;
  }
  set rejectUnauthorized(e) {
    super.rejectUnauthorized = e;
    this.fetchApi = this.createFetchApi(this.ctx);
  }
  get rejectUnauthorized() {
    return super.rejectUnauthorized;
  }
  createFetchApi(e) {
    const t = e.get(o.BuildInfo);
    if (!1 === super.rejectUnauthorized) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    return r.context({
      userAgent: `GithubCopilot/${t.getVersion()}`,
      socketFactory: this._proxySettings ? this.createSocketFactory(this._proxySettings, super.rejectUnauthorized) : void 0,
      rejectUnauthorized: super.rejectUnauthorized
    });
  }
  async fetch(e, t) {
    const n = {
      ...t,
      body: t.body ? t.body : t.json,
      signal: t.signal
    };
    await this.certificateConfigurator.applyToRequestOptions(n);
    const r = await this.fetchApi.fetch(e, n);
    return new s.Response(r.status, r.statusText, r.headers, () => r.text(), () => r.json(), async () => r.body);
  }
  disconnectAll() {
    return this.fetchApi.reset();
  }
  makeAbortController() {
    return new r.AbortController();
  }
}
exports.HelixFetcher = HelixFetcher;