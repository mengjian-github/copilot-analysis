Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.initProxyEnvironment = void 0;
const r = require(41808);
const i = require(57310);
const o = require(89496);
exports.initProxyEnvironment = function (e, t) {
  o.workspace.onDidChangeConfiguration(n => {
    const r = n.affectsConfiguration("http.proxy");
    if (n.affectsConfiguration("http.proxyStrictSSL") || n.affectsConfiguration("http.proxyAuthorization") || r) {
      s(e, t, r);
    }
  });
  s(e, t);
};
const s = (e, t, n) => {
  let s = o.workspace.getConfiguration("http").get("proxy") || function (e) {
    return e.HTTPS_PROXY || e.https_proxy || e.HTTP_PROXY || e.http_proxy || null;
  }(t);
  if (s) {
    const t = {};
    const n = o.workspace.getConfiguration("http").get("proxyAuthorization");
    const a = o.workspace.getConfiguration("http").get("proxyStrictSSL", !0);
    if (n) {
      t["Proxy-Authorization"] = n;
    }
    let c = s;
    const l = s.split(":");
    if (l.length > 2) {
      if (s.includes("[")) {
        const e = s.indexOf("[");
        const t = s.indexOf("]");
        c = s.substring(e + 1, t);
      }
    } else c = l[0];
    const u = r.isIP(c);
    if (4 === u) {
      s = `https://${s}`;
    } else {
      if (6 === u) {
        if (s.includes("[")) {
          if (s.startsWith("https://")) {
            s = `https://${s}`;
          }
        } else {
          s = `https://[${s}]`;
        }
      }
    }
    const {
      hostname: p,
      port: d,
      username: h,
      password: f
    } = function (e) {
      try {
        return new i.URL(e);
      } catch (t) {
        throw new Error(`Invalid proxy URL: '${e}'`);
      }
    }(s);
    const m = h && f && `${decodeURIComponent(h)}:${decodeURIComponent(f)}`;
    e.proxySettings = {
      host: p,
      port: parseInt(d),
      proxyAuth: m,
      headers: t
    };
    e.rejectUnauthorized = a;
  } else if (n && !s) {
    e.proxySettings = void 0;
  }
};