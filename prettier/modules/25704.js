Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.RootCertificateConfigurator = void 0;
const r = require(24404);
const i = require(29094);
exports.RootCertificateConfigurator = class {
  constructor(e) {
    this._certificateReader = e.get(i.RootCertificateReader);
  }
  async createTunnelSettings(e) {
    return {
      ...e,
      ca: await this.getCertificates()
    };
  }
  async getCertificates() {
    const e = await this._certificateReader.getAllRootCAs();
    if (0 !== e.length) return e;
  }
  async applyToRequestOptions(e) {
    const t = await this._certificateReader.getAllRootCAs();
    const n = {
      _vscodeAdditionalCaCerts: t
    };
    e.secureContext = r.createSecureContext(n);
    e.ca = t;
    e.cert = t;
    t.map(t => {
      e.secureContext.context.addCACert(t);
    });
  }
};