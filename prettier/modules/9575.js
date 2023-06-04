const {
  Readable: r
} = require(12781);
const i = require(24404);
const {
  types: {
    isAnyArrayBuffer: o
  }
} = require(73837);
const s = require(8348);
const a = require(15158)("helix-fetch:core");
const {
  RequestAbortedError: c
} = require(1787);
const l = require(49803);
const u = require(97262);
const p = require(43769);
const {
  isPlainObject: d
} = require(4544);
const {
  isFormData: h,
  FormDataSerializer: f
} = require(99407);
const {
  version: m
} = require(55258);
const g = "h2";
const y = "h2c";
const _ = "http/1.0";
const v = "http/1.1";
const b = 100;
const E = 36e5;
const w = [g, v, _];
const T = `helix-fetch/${m}`;
const S = {
  method: "GET",
  compress: !0,
  decode: !0
};
let x = 0;
const C = p();
const I = (e, t) => new Promise((n, r) => {
  const {
    signal: o
  } = t;
  let s;
  const l = () => {
    o.removeEventListener("abort", l);
    const e = new c();
    r(e);
    if (s) {
      s.destroy(e);
    }
  };
  if (o) {
    if (o.aborted) return void r(new c());
    o.addEventListener("abort", l);
  }
  const u = +e.port || 443;
  const p = t => {
    if (o) {
      o.removeEventListener("abort", l);
    }
    if (t instanceof c) {
      a(`connecting to ${e.hostname}:${u} failed with: ${t.message}`);
      r(t);
    }
  };
  s = i.connect(u, e.hostname, t);
  s.once("secureConnect", () => {
    if (o) {
      o.removeEventListener("abort", l);
    }
    s.off("error", p);
    x += 1;
    s.id = x;
    s.secureConnecting = !1;
    a(`established TLS connection: #${s.id} (${s.servername})`);
    n(s);
  });
  s.once("error", p);
});
module.exports = {
  request: async (e, t, n) => {
    const i = new URL(t);
    const s = {
      ...S,
      ...(n || {})
    };
    let c;
    if ("string" == typeof s.method) {
      s.method = s.method.toUpperCase();
    }
    s.headers = (e => {
      const t = {};
      Object.keys(e).forEach(n => {
        t[n.toLowerCase()] = e[n];
      });
      return t;
    })(s.headers || {});
    if (void 0 === s.headers.host) {
      s.headers.host = i.host;
    }
    if (e.userAgent && void 0 === s.headers["user-agent"]) {
      s.headers["user-agent"] = e.userAgent;
    }
    if (s.body instanceof URLSearchParams) c = "application/x-www-form-urlencoded; charset=utf-8", s.body = s.body.toString();else if (h(s.body)) {
      const e = new f(s.body);
      c = e.contentType(), s.body = e.stream(), void 0 === s.headers["transfer-encoding"] && void 0 === s.headers["content-length"] && (s.headers["content-length"] = String(e.length()));
    } else "string" == typeof s.body || s.body instanceof String ? c = "text/plain; charset=utf-8" : d(s.body) ? (s.body = JSON.stringify(s.body), c = "application/json") : o(s.body) && (s.body = Buffer.from(s.body));
    if (void 0 === s.headers["content-type"] && void 0 !== c) {
      s.headers["content-type"] = c;
    }
    if (null != s.body) {
      if (s.body instanceof r) {
        if ("string" == typeof s.body || s.body instanceof String || Buffer.isBuffer(s.body)) {
          s.body = String(s.body);
        }
        if (void 0 === s.headers["transfer-encoding"] && void 0 === s.headers["content-length"]) {
          s.headers["content-length"] = String(Buffer.isBuffer(s.body) ? s.body.length : Buffer.byteLength(s.body, "utf-8"));
        }
      }
    }
    if (void 0 === s.headers.accept) {
      s.headers.accept = "*/*";
    }
    if (null == s.body && ["POST", "PUT"].includes(s.method)) {
      s.headers["content-length"] = "0";
    }
    if (s.compress && void 0 === s.headers["accept-encoding"]) {
      s.headers["accept-encoding"] = "gzip,deflate,br";
    }
    const {
      signal: p
    } = s;
    const {
      protocol: m,
      socket: b = null
    } = e.socketFactory ? await (async (e, t, n, r) => {
      const i = "https:" === t.protocol;
      let o;
      o = t.port ? t.port : i ? 443 : 80;
      const s = {
        ...n,
        host: t.host,
        port: o
      };
      const a = await e(s);
      if (i) {
        const e = {
          ...s,
          ALPNProtocols: r
        };
        e.socket = a;
        const n = await I(t, e);
        return {
          protocol: n.alpnProtocol || v,
          socket: n
        };
      }
      return {
        protocol: a.alpnProtocol || v,
        socket: a
      };
    })(e.socketFactory, i, s, e.alpnProtocols) : await (async (e, t, n) => {
      const r = `${t.protocol}//${t.host}`;
      let i = e.alpnCache.get(r);
      if (i) return {
        protocol: i
      };
      switch (t.protocol) {
        case "http:":
          i = v;
          e.alpnCache.set(r, i);
          return {
            protocol: i
          };
        case "http2:":
          i = y;
          e.alpnCache.set(r, i);
          return {
            protocol: i
          };
        case "https:":
          break;
        default:
          throw new TypeError(`unsupported protocol: ${t.protocol}`);
      }
      const {
        options: {
          rejectUnauthorized: o,
          h1: s = {},
          h2: a = {}
        }
      } = e;
      const c = !(!1 === o || !1 === s.rejectUnauthorized || !1 === a.rejectUnauthorized);
      const l = {
        servername: t.hostname,
        ALPNProtocols: e.alpnProtocols,
        signal: n,
        rejectUnauthorized: c
      };
      const u = await (async (e, t) => {
        let n = await C.acquire(e.origin);
        try {
          if (n) {
            n = await I(e, t);
          }
          return n;
        } finally {
          C.release(e.origin, n);
        }
      })(t, l);
      i = u.alpnProtocol;
      if (i) {
        i = v;
      }
      e.alpnCache.set(r, i);
      return {
        protocol: i,
        socket: u
      };
    })(e, i, p);
    switch (a(`${i.host} -> ${m}`), m) {
      case g:
        try {
          return await u.request(e, i, b ? {
            ...s,
            socket: b
          } : s);
        } catch (t) {
          const {
            code: n,
            message: r
          } = t;
          throw "ERR_HTTP2_ERROR" === n && "Protocol error" === r && e.alpnCache.delete(`${i.protocol}//${i.host}`), t;
        }
      case y:
        return u.request(e, new URL(`http://${i.host}${i.pathname}${i.hash}${i.search}`), b ? {
          ...s,
          socket: b
        } : s);
      case _:
      case v:
        return l.request(e, i, b ? {
          ...s,
          socket: b
        } : s);
      default:
        throw new TypeError(`unsupported protocol: ${m}`);
    }
  },
  setupContext: e => {
    const {
      options: {
        alpnProtocols: t = w,
        alpnCacheTTL: n = E,
        alpnCacheSize: r = b,
        userAgent: i = T,
        socketFactory: o
      }
    } = e;
    e.alpnProtocols = t;
    e.alpnCache = new s({
      max: r,
      ttl: n
    });
    e.userAgent = i;
    e.socketFactory = o;
    l.setupContext(e);
    u.setupContext(e);
  },
  resetContext: async e => (e.alpnCache.clear(), Promise.all([l.resetContext(e), u.resetContext(e)])),
  RequestAbortedError: c,
  ALPN_HTTP2: g,
  ALPN_HTTP2C: y,
  ALPN_HTTP1_1: v,
  ALPN_HTTP1_0: _
};