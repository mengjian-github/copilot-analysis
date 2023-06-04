var r = this && this.__awaiter || function (e, t, n, r) {
  return new (n || (n = Promise))(function (i, o) {
    function s(e) {
      try {
        c(r.next(e));
      } catch (e) {
        o(e);
      }
    }
    function a(e) {
      try {
        c(r.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function c(e) {
      var t;
      if (e.done) {
        i(e.value);
      } else {
        (t = e.value, t instanceof n ? t : new n(function (e) {
          e(t);
        })).then(s, a);
      }
    }
    c((r = r.apply(e, t || [])).next());
  });
};
var i = this && this.__importDefault || function (e) {
  return e && e.__esModule ? e : {
    default: e
  };
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
const o = i(require(41808));
const s = i(require(24404));
const a = i(require(57310));
const c = i(require(39491));
const l = i(require(15158));
const u = require(88054);
const p = i(require(59829));
const d = l.default("https-proxy-agent:agent");
class h extends u.Agent {
  constructor(e) {
    let t;
    t = "string" == typeof e ? a.default.parse(e) : e;
    if (!t) throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
    d("creating new HttpsProxyAgent instance: %o", t);
    super(t);
    const n = Object.assign({}, t);
    var r;
    this.secureProxy = t.secureProxy || "string" == typeof (r = n.protocol) && /^https:?$/i.test(r);
    n.host = n.hostname || n.host;
    if ("string" == typeof n.port) {
      n.port = parseInt(n.port, 10);
    }
    if (!n.port && n.host) {
      n.port = this.secureProxy ? 443 : 80;
    }
    if (this.secureProxy && !("ALPNProtocols" in n)) {
      n.ALPNProtocols = ["http 1.1"];
    }
    if (n.host && n.path) {
      delete n.path;
      delete n.pathname;
    }
    this.proxy = n;
  }
  callback(e, t) {
    return r(this, void 0, void 0, function* () {
      const {
        proxy: n,
        secureProxy: r
      } = this;
      let i;
      if (r) {
        d("Creating `tls.Socket`: %o", n);
        i = s.default.connect(n);
      } else {
        d("Creating `net.Socket`: %o", n);
        i = o.default.connect(n);
      }
      const a = Object.assign({}, n.headers);
      let l = `CONNECT ${t.host}:${t.port} HTTP/1.1\r\n`;
      if (n.auth) {
        a["Proxy-Authorization"] = `Basic ${Buffer.from(n.auth).toString("base64")}`;
      }
      let {
        host: u,
        port: h,
        secureEndpoint: m
      } = t;
      if (function (e, t) {
        return Boolean(!t && 80 === e || t && 443 === e);
      }(h, m)) {
        u += `:${h}`;
      }
      a.Host = u;
      a.Connection = "close";
      for (const e of Object.keys(a)) l += `${e}: ${a[e]}\r\n`;
      const g = p.default(i);
      i.write(`${l}\r\n`);
      const {
        statusCode: y,
        buffered: _
      } = yield g;
      if (200 === y) {
        e.once("socket", f);
        if (t.secureEndpoint) {
          d("Upgrading socket connection to TLS");
          const e = t.servername || t.host;
          return s.default.connect(Object.assign(Object.assign({}, function (e, ...t) {
            const n = {};
            let r;
            for (r in e) t.includes(r) || (n[r] = e[r]);
            return n;
          }(t, "host", "hostname", "path", "port")), {
            socket: i,
            servername: e
          }));
        }
        return i;
      }
      i.destroy();
      const v = new o.default.Socket({
        writable: !1
      });
      v.readable = !0;
      e.once("socket", e => {
        d("replaying proxy buffer for failed request");
        c.default(e.listenerCount("data") > 0);
        e.push(_);
        e.push(null);
      });
      return v;
    });
  }
}
function f(e) {
  e.resume();
}
exports.default = h;