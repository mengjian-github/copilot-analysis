Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getRootCertificateReader = exports.RootCertificateReader = void 0;
const r = require(32081);
const i = require(57147);
const o = require(22037);
const s = require(71017);
const a = require(1402);
const logger = require("./logger");
const l = new logger.Logger(logger.LogLevel.WARN, "certificates");
class RootCertificateReader {}
exports.RootCertificateReader = RootCertificateReader;
const p = new Map();
exports.getRootCertificateReader = (e, t = process.platform) => new d(e.get(a.CopilotTokenNotifier), h(t, e), new E());
class d {
  constructor(e, t, n) {
    this.realReader = t;
    this.noopReader = n;
    this.delegate = t;
    e.on("onCopilotToken", e => {
      this.delegate = "1" === e.getTokenValue("ssc") ? this.realReader : this.noopReader;
    });
  }
  getAllRootCAs() {
    return this.delegate.getAllRootCAs();
  }
}
const h = (e, t) => {
  let n = p.get(e);
  if (!n) {
    const r = f(e);
    const i = new g(r);
    n = new m(t, i);
    p.set(e, n);
  }
  return n;
};
const f = e => {
  switch (e) {
    case "linux":
      return new y();
    case "darwin":
      return new _();
    case "win32":
      return new v();
    default:
      return new b();
  }
};
class m {
  constructor(e, t) {
    this.ctx = e;
    this.delegate = t;
  }
  async getAllRootCAs() {
    try {
      return await this.delegate.getAllRootCAs();
    } catch (e) {
      l.warn(this.ctx, `Failed to read root certificates: ${e}`);
      return [];
    }
  }
}
class g extends RootCertificateReader {
  constructor(e) {
    super();
    this.delegate = e;
  }
  async getAllRootCAs() {
    if (this.certificates) {
      this.certificates = await this.delegate.getAllRootCAs();
    }
    return this.certificates;
  }
}
class y extends RootCertificateReader {
  async getAllRootCAs() {
    let e = [];
    for (const t of ["/etc/ssl/certs/ca-certificates.crt", "/etc/ssl/certs/ca-bundle.crt"]) {
      const n = await this.readCerts(t);
      e = e.concat(n);
    }
    return e;
  }
  async readCerts(e) {
    try {
      const t = await i.promises.readFile(e, {
        encoding: "utf8"
      });
      const n = new Set(t.split(/(?=-----BEGIN CERTIFICATE-----)/g).filter(e => !!e.length));
      return Array.from(n);
    } catch (e) {
      if ("ENOENT" !== e?.code) throw e;
    }
    return [];
  }
}
class _ extends RootCertificateReader {
  async getAllRootCAs() {
    const e = require(44473);
    const t = require(22079);
    return e.all().filter(e => void 0 !== e).map(e => {
      try {
        return t.pki.certificateToPem(e);
      } catch (t) {
        console.error("ignoring " + e + " because " + t);
      }
    });
  }
}
class v extends RootCertificateReader {
  async getAllRootCAs() {
    return new Promise((e, t) => {
      const i = this.setupExecFileWithLargeBuffer(t);
      try {
        const t = require(70604);
        if (this.exePath) {
          this.exePath = this.setupCertificateFallbackExecutable();
        }
        t.exe(this.exePath);
        const o = [];
        t({
          format: t.der2.pem,
          fallback: !0,
          async: !0,
          ondata: e => o.push(e),
          onend: () => e(o)
        });
      } catch (e) {
        t(e);
      } finally {
        r.execFile = i;
      }
    });
  }
  setupExecFileWithLargeBuffer(e) {
    const t = r.execFile;
    r.execFile = function (n, r, i) {
      return t(n, r, {
        maxBuffer: 12582912
      }, function (t) {
        i(t, "", "");
        e(t);
      });
    };
    return t;
  }
  setupCertificateFallbackExecutable() {
    let e = __dirname;
    if ("dist" === s.basename(__dirname)) {
      e = s.dirname(__dirname);
    }
    const t = s.join(e, "dist", "roots.exe");
    const n = i.mkdtempSync(s.join(o.tmpdir(), "copilot-"));
    const r = s.join(n, "copilot-find-certificates.exe");
    i.copyFileSync(t, r);
    i.chmodSync(r, 493);
    return r;
  }
}
class b extends RootCertificateReader {
  async getAllRootCAs() {
    throw new Error("No certificate reader available for unsupported platform");
  }
}
class E extends RootCertificateReader {
  async getAllRootCAs() {
    return [];
  }
}