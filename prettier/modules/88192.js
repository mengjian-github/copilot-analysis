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
const c = i(require(15158));
const l = i(require(65521));
const u = require(88054);
const p = c.default("http-proxy-agent");
class d extends u.Agent {
  constructor(e) {
    let t;
    t = "string" == typeof e ? a.default.parse(e) : e;
    if (!t) throw new Error("an HTTP(S) proxy server `host` and `port` must be specified!");
    p("Creating new HttpProxyAgent instance: %o", t);
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
      const i = a.default.parse(e.path);
      let c;
      if (i.protocol) {
        i.protocol = "http:";
      }
      if (i.hostname) {
        i.hostname = t.hostname || t.host || null;
      }
      if (null == i.port && (t.port, 1)) {
        i.port = String(t.port);
      }
      if ("80" === i.port) {
        i.port = "";
      }
      e.path = a.default.format(i);
      if (n.auth) {
        e.setHeader("Proxy-Authorization", `Basic ${Buffer.from(n.auth).toString("base64")}`);
      }
      if (r) {
        p("Creating `tls.Socket`: %o", n);
        c = s.default.connect(n);
      } else {
        p("Creating `net.Socket`: %o", n);
        c = o.default.connect(n);
      }
      if (e._header) {
        let t, n;
        p("Regenerating stored HTTP header string for request"), e._header = null, e._implicitHeader(), e.output && e.output.length > 0 ? (p("Patching connection write() output buffer with updated header"), t = e.output[0], n = t.indexOf("\r\n\r\n") + 4, e.output[0] = e._header + t.substring(n), p("Output buffer: %o", e.output)) : e.outputData && e.outputData.length > 0 && (p("Patching connection write() output buffer with updated header"), t = e.outputData[0].data, n = t.indexOf("\r\n\r\n") + 4, e.outputData[0].data = e._header + t.substring(n), p("Output buffer: %o", e.outputData[0].data));
      }
      yield l.default(c, "connect");
      return c;
    });
  }
}
exports.default = d;