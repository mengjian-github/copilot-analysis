var r = this && this.__assign || function () {
  r = Object.assign || function (e) {
    for (n = 1, r = arguments.length, void 0; n < r; n++) {
      var t;
      var n;
      var r;
      for (var i in t = arguments[n]) if (Object.prototype.hasOwnProperty.call(t, i)) {
        e[i] = t[i];
      }
    }
    return e;
  };
  return r.apply(this, arguments);
};
var i = require(13685);
var o = require(95687);
var s = require(57310);
var a = require(22057);
var c = require(95282);
var l = require(59036);
var u = require(3063);
var p = function () {
  function e() {
    e._addCloseHandler();
  }
  e.getCookie = function (t, n) {
    var r = "";
    if (t && t.length && "string" == typeof n) for (i = t + "=", o = n.split(";"), s = 0, void 0; s < o.length; s++) {
      var i;
      var o;
      var s;
      n = o[s];
      if ((n = e.trim(n)) && 0 === n.indexOf(i)) {
        r = n.substring(i.length, o[s].length);
        break;
      }
    }
    return r;
  };
  e.trim = function (e) {
    return "string" == typeof e ? e.replace(/^\s+|\s+$/g, "") : "";
  };
  e.int32ArrayToBase64 = function (e) {
    var t = function (e, t) {
      return String.fromCharCode(e >> t & 255);
    };
    var n = e.map(function (e) {
      return t(e, 24) + t(e, 16) + t(e, 8) + t(e, 0);
    }).join("");
    var r = (Buffer.from ? Buffer.from(n, "binary") : new Buffer(n, "binary")).toString("base64");
    return r.substr(0, r.indexOf("="));
  };
  e.random32 = function () {
    return 4294967296 * Math.random() | 0;
  };
  e.randomu32 = function () {
    return e.random32() + 2147483648;
  };
  e.w3cTraceId = function () {
    for (n = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"], r = "", i = 0, void 0; i < 4; i++) {
      var t;
      var n;
      var r;
      var i;
      r += n[15 & (t = e.random32())] + n[t >> 4 & 15] + n[t >> 8 & 15] + n[t >> 12 & 15] + n[t >> 16 & 15] + n[t >> 20 & 15] + n[t >> 24 & 15] + n[t >> 28 & 15];
    }
    var o = n[8 + 4 * Math.random() | 0];
    return r.substr(0, 8) + r.substr(9, 4) + "4" + r.substr(13, 3) + o + r.substr(16, 3) + r.substr(19, 12);
  };
  e.w3cSpanId = function () {
    return e.w3cTraceId().substring(16);
  };
  e.isValidW3CId = function (e) {
    return 32 === e.length && "00000000000000000000000000000000" !== e;
  };
  e.isArray = function (e) {
    return "[object Array]" === Object.prototype.toString.call(e);
  };
  e.isError = function (e) {
    return "[object Error]" === Object.prototype.toString.call(e);
  };
  e.isPrimitive = function (e) {
    var t = typeof e;
    return "string" === t || "number" === t || "boolean" === t;
  };
  e.isDate = function (e) {
    return "[object Date]" === Object.prototype.toString.call(e);
  };
  e.msToTimeSpan = function (e) {
    if (isNaN(e) || e < 0) {
      e = 0;
    }
    var t = (e / 1e3 % 60).toFixed(7).replace(/0{0,4}$/, "");
    var n = "" + Math.floor(e / 6e4) % 60;
    var r = "" + Math.floor(e / 36e5) % 24;
    var i = Math.floor(e / 864e5);
    t = t.indexOf(".") < 2 ? "0" + t : t;
    n = n.length < 2 ? "0" + n : n;
    return (i > 0 ? i + "." : "") + (r = r.length < 2 ? "0" + r : r) + ":" + n + ":" + t;
  };
  e.extractError = function (e) {
    var t = e;
    return {
      message: e.message,
      code: t.code || t.id || ""
    };
  };
  e.extractObject = function (t) {
    return t instanceof Error ? e.extractError(t) : "function" == typeof t.toJSON ? t.toJSON() : t;
  };
  e.validateStringMap = function (t) {
    if ("object" == typeof t) {
      var n = {};
      for (var r in t) {
        var i = "";
        var o = t[r];
        var s = typeof o;
        if (e.isPrimitive(o)) i = o.toString();else if (null === o || "undefined" === s) i = "";else {
          if ("function" === s) {
            c.info("key: " + r + " was function; will not serialize");
            continue;
          }
          var a = e.isArray(o) ? o : e.extractObject(o);
          try {
            i = e.isPrimitive(a) ? a : JSON.stringify(a);
          } catch (e) {
            i = o.constructor.name.toString() + " (Error: " + e.message + ")";
            c.info("key: " + r + ", could not be serialized");
          }
        }
        n[r] = i.substring(0, e.MAX_PROPERTY_LENGTH);
      }
      return n;
    }
    c.info("Invalid properties dropped from payload");
  };
  e.canIncludeCorrelationHeader = function (e, t) {
    var n = e && e.config && e.config.correlationHeaderExcludedDomains;
    if (!n || 0 == n.length || !t) return !0;
    for (var r = 0; r < n.length; r++) {
      var i = new RegExp(n[r].replace(/\./g, ".").replace(/\*/g, ".*"));
      try {
        if (i.test(new s.URL(t).hostname)) return !1;
      } catch (e) {}
    }
    return !0;
  };
  e.getCorrelationContextTarget = function (e, t) {
    var n = e.headers && e.headers[l.requestContextHeader];
    if (n) for (r = n.split(","), i = 0, void 0; i < r.length; ++i) {
      var r;
      var i;
      var o = r[i].split("=");
      if (2 == o.length && o[0] == t) return o[1];
    }
  };
  e.makeRequest = function (t, n, a, l, u, p) {
    if (void 0 === u) {
      u = !0;
    }
    if (void 0 === p) {
      p = !0;
    }
    if (n && 0 === n.indexOf("//")) {
      n = "https:" + n;
    }
    var d = new s.URL(n);
    var h = r(r({}, a), {
      host: d.hostname,
      port: d.port,
      path: d.pathname
    });
    var f = void 0;
    if (u && ("https:" === d.protocol && (f = t.proxyHttpsUrl || void 0), "http:" === d.protocol && (f = t.proxyHttpUrl || void 0), f)) {
      if (0 === f.indexOf("//")) {
        f = "http:" + f;
      }
      try {
        var m = new s.URL(f);
        if ("https:" === m.protocol) {
          c.info("Proxies that use HTTPS are not supported");
          f = void 0;
        } else {
          h = r(r({}, h), {
            host: m.hostname,
            port: m.port || "80",
            path: n,
            headers: r(r({}, h.headers), {
              Host: d.hostname
            })
          });
        }
      } catch (e) {
        c.warn("Wrong proxy URL provided");
      }
    }
    var g = "https:" === d.protocol && !f;
    if (p) {
      if (g && void 0 !== t.httpsAgent) {
        h.agent = t.httpsAgent;
      } else {
        if (g || void 0 === t.httpAgent) {
          if (g) {
            h.agent = e._useKeepAlive ? e.keepAliveAgent : e.tlsRestrictedAgent;
          }
        } else {
          h.agent = t.httpAgent;
        }
      }
    }
    return g ? o.request(h, l) : i.request(h, l);
  };
  e.safeIncludeCorrelationHeader = function (t, n, r) {
    var i;
    if ("string" == typeof r) i = r;else if (r instanceof Array) i = r.join(",");else if (r && "function" == typeof r.toString) try {
      i = r.toString();
    } catch (e) {
      c.warn("Outgoing request-context header could not be read. Correlation of requests may be lost.", e, r);
    }
    if (i) {
      e.addCorrelationIdHeaderFromString(t, n, i);
    } else {
      n.setHeader(l.requestContextHeader, l.requestContextSourceKey + "=" + t.config.correlationId);
    }
  };
  e.dumpObj = function (e) {
    if (e) try {
      var t = Object.prototype.toString.call(e);
      return t + ("[object Error]" === t ? "{ stack: '" + e.stack + "', message: '" + e.message + "', name: '" + e.name + "'" : this.stringify(e));
    } catch (t) {
      return e.toString();
    }
  };
  e.stringify = function (e) {
    try {
      return JSON.stringify(e);
    } catch (t) {
      c.warn("Failed to serialize payload", t, e);
    }
  };
  e.addCorrelationIdHeaderFromString = function (e, t, n) {
    var r = n.split(",");
    var i = l.requestContextSourceKey + "=";
    if (r.some(function (e) {
      return e.substring(0, i.length) === i;
    })) {
      t.setHeader(l.requestContextHeader, n + "," + l.requestContextSourceKey + "=" + e.config.correlationId);
    }
  };
  e._addCloseHandler = function () {
    if (e._listenerAttached) {
      process.on("exit", function () {
        e.isNodeExit = !0;
        e._useKeepAlive = !1;
      });
      e._listenerAttached = !0;
    }
  };
  e._useKeepAlive = !u.JsonConfig.getInstance().noHttpAgentKeepAlive;
  e._listenerAttached = !1;
  e.MAX_PROPERTY_LENGTH = 8192;
  e.keepAliveAgent = new o.Agent({
    keepAlive: !0,
    maxSockets: 25,
    secureOptions: a.SSL_OP_NO_SSLv2 | a.SSL_OP_NO_SSLv3 | a.SSL_OP_NO_TLSv1 | a.SSL_OP_NO_TLSv1_1
  });
  e.tlsRestrictedAgent = new o.Agent({
    secureOptions: a.SSL_OP_NO_SSLv2 | a.SSL_OP_NO_SSLv3 | a.SSL_OP_NO_TLSv1 | a.SSL_OP_NO_TLSv1_1
  });
  e.isNodeExit = !1;
  return e;
}();
module.exports = p;