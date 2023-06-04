var r = require(13685);
var i = require(95687);
var o = require(59796);
var s = require(95282);
var a = require(82570);
var c = require(40095);
var l = require(63580);
var u = require(55158);
var p = require(40166);
var d = function () {
  function e(t) {
    var n;
    this._isIkeyValid = !0;
    if (e.INSTANCE) throw new Error("Web snippet injection should be configured from the applicationInsights object");
    e.INSTANCE = this;
    e._aiUrl = l.WEB_INSTRUMENTATION_DEFAULT_SOURCE;
    e._aiDeprecatedUrl = l.WEB_INSTRUMENTATION_DEPRECATED_SOURCE;
    var r = this._getWebSnippetIkey(null === (n = t.config) || void 0 === n ? void 0 : n.webInstrumentationConnectionString);
    this._webInstrumentationIkey = r || t.config.instrumentationKey;
    this._clientWebInstrumentationConfig = t.config.webInstrumentationConfig;
    this._clientWebInstrumentationSrc = t.config.webInstrumentationSrc;
    this._statsbeat = t.getStatsbeat();
  }
  e.prototype.enable = function (t, n) {
    this._isEnabled = t;
    this._webInstrumentationIkey = this._getWebSnippetIkey(n) || this._webInstrumentationIkey;
    e._snippet = this._getWebInstrumentationReplacedStr();
    if (this._isEnabled && !this._isInitialized && this._isIkeyValid) {
      if (this._statsbeat) {
        this._statsbeat.addFeature(l.StatsbeatFeature.WEB_SNIPPET);
      }
      this._initialize();
    } else {
      if (this._isEnabled) {
        if (this._statsbeat) {
          this._statsbeat.removeFeature(l.StatsbeatFeature.WEB_SNIPPET);
        }
      }
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.prototype._getWebSnippetIkey = function (e) {
    var t = null;
    try {
      var n = u.parse(e).instrumentationkey || "";
      if (u.isIkeyValid(n)) {
        this._isIkeyValid = !0;
        t = n;
      } else {
        this._isIkeyValid = !1;
        s.info("Invalid web Instrumentation connection string, web Instrumentation is not enabled.");
      }
    } catch (e) {
      s.info("get web snippet ikey error: " + e);
    }
    return t;
  };
  e.prototype._getWebInstrumentationReplacedStr = function () {
    var e = this._getClientWebInstrumentationConfigStr(this._clientWebInstrumentationConfig);
    var t = c.getOsPrefix();
    var n = c.getResourceProvider();
    var r = this._webInstrumentationIkey + '",\r\n' + e + ' disableIkeyDeprecationMessage: true,\r\n sdkExtension: "' + n + t + "d_n_";
    var i = p.webSnippet.replace("INSTRUMENTATION_KEY", r);
    return this._clientWebInstrumentationSrc ? i.replace(l.WEB_INSTRUMENTATION_DEFAULT_SOURCE + ".2.min.js", this._clientWebInstrumentationSrc) : i;
  };
  e.prototype._getClientWebInstrumentationConfigStr = function (e) {
    var t = "";
    try {
      if (null != e && e.length > 0) {
        e.forEach(function (e) {
          var n = e.name;
          if (void 0 !== n) {
            var r = e.value;
            switch (typeof r) {
              case "function":
              case "object":
                break;
              case "string":
                t += " " + n + ': "' + r + '",\r\n';
                break;
              default:
                t += " " + n + ": " + r + ",\r\n";
            }
          }
        });
      }
    } catch (e) {
      this._isEnabled = !1;
      s.info("Parse client web instrumentation error. Web Instrumentation is disabled");
    }
    return t;
  };
  e.prototype._initialize = function () {
    this._isInitialized = !0;
    var t = r.createServer;
    var n = i.createServer;
    var o = this._isEnabled;
    r.createServer = function (n) {
      var r = n;
      if (r) {
        n = function (t, n) {
          var i = n.write;
          var c = "GET" == t.method;
          n.write = function (t, r, l) {
            try {
              if (o && c) {
                var u = a.getContentEncodingFromHeaders(n);
                var p = void 0;
                if ("string" == typeof r) {
                  p = r;
                }
                if (null == u) e.INSTANCE.ValidateInjection(n, t) && (arguments[0] = e.INSTANCE.InjectWebSnippet(n, t, void 0, p));else if (u.length) {
                  var d = u[0];
                  arguments[0] = e.INSTANCE.InjectWebSnippet(n, t, d);
                }
              }
            } catch (e) {
              s.warn("Inject snippet error: " + e);
            }
            return i.apply(n, arguments);
          };
          var l = n.end;
          n.end = function (t, r, i) {
            if (o && c) try {
              if (o && c) {
                var u = a.getContentEncodingFromHeaders(n);
                var p = void 0;
                if ("string" == typeof r) {
                  p = r;
                }
                if (null == u) e.INSTANCE.ValidateInjection(n, t) && (arguments[0] = e.INSTANCE.InjectWebSnippet(n, t, void 0, p));else if (u.length) {
                  var d = u[0];
                  arguments[0] = e.INSTANCE.InjectWebSnippet(n, t, d);
                }
              }
            } catch (e) {
              s.warn("Inject snipet error: " + e);
            }
            return l.apply(n, arguments);
          };
          return r(t, n);
        };
      }
      return t(n);
    };
    i.createServer = function (t, r) {
      var i = r;
      if (i) {
        r = function (t, n) {
          var r = "GET" == t.method;
          var c = n.write;
          var l = n.end;
          n.write = function (t, i, l) {
            try {
              if (o && r) {
                var u = a.getContentEncodingFromHeaders(n);
                var p = void 0;
                if ("string" == typeof i) {
                  p = i;
                }
                if (null == u) {
                  if (e.INSTANCE.ValidateInjection(n, t)) {
                    arguments[0] = this.InjectWebSnippet(n, t, void 0, p);
                  }
                } else if (u.length) {
                  var d = u[0];
                  arguments[0] = e.INSTANCE.InjectWebSnippet(n, t, d);
                }
              }
            } catch (e) {
              s.warn("Inject snippet error: " + e);
            }
            return c.apply(n, arguments);
          };
          n.end = function (t, i, c) {
            try {
              if (o && r) {
                var u = a.getContentEncodingFromHeaders(n);
                var p = void 0;
                if ("string" == typeof i) {
                  p = i;
                }
                if (null == u) {
                  if (e.INSTANCE.ValidateInjection(n, t)) {
                    arguments[0] = e.INSTANCE.InjectWebSnippet(n, t, void 0, p);
                  }
                } else if (u.length) {
                  var d = u[0];
                  arguments[0] = e.INSTANCE.InjectWebSnippet(n, t, d);
                }
              }
            } catch (e) {
              s.warn("Inject snippet error: " + e);
            }
            return l.apply(n, arguments);
          };
          return i(t, n);
        };
        return n(t, r);
      }
    };
  };
  e.prototype.ValidateInjection = function (t, n) {
    try {
      if (!t || !n || 200 != t.statusCode) return !1;
      if (!a.isContentTypeHeaderHtml(t)) return !1;
      var r = n.slice().toString();
      if (r.indexOf("<head>") >= 0 && r.indexOf("</head>") >= 0 && r.indexOf(e._aiUrl) < 0 && r.indexOf(e._aiDeprecatedUrl) < 0) return !0;
    } catch (e) {
      s.info("validate injections error: " + e);
    }
    return !1;
  };
  e.prototype.InjectWebSnippet = function (t, n, r, i) {
    try {
      if (r) {
        t.removeHeader("Content-Length");
        n = this._getInjectedCompressBuffer(t, n, r);
        t.setHeader("Content-Length", n.length);
      } else {
        var o = n.toString();
        var c = o.indexOf("</head>");
        if (c < 0) return n;
        var l = a.insertSnippetByIndex(c, o, e._snippet);
        if ("string" == typeof n) {
          t.removeHeader("Content-Length");
          n = l;
          t.setHeader("Content-Length", Buffer.byteLength(n));
        } else if (Buffer.isBuffer(n)) {
          var u = i || "utf8";
          if (a.isBufferType(n, u)) {
            t.removeHeader("Content-Length");
            var p = Buffer.from(l).toString(u);
            n = Buffer.from(p, u);
            t.setHeader("Content-Length", n.length);
          }
        }
      }
    } catch (e) {
      s.warn("Failed to inject web snippet and change content-lenght headers. Exception:" + e);
    }
    return n;
  };
  e.prototype._getInjectedCompressBuffer = function (e, t, n) {
    try {
      switch (n) {
        case a.contentEncodingMethod.GZIP:
          var r = o.gunzipSync(t);
          if (this.ValidateInjection(e, r)) {
            var i = this.InjectWebSnippet(e, r);
            t = o.gzipSync(i);
          }
          break;
        case a.contentEncodingMethod.DEFLATE:
          var c = o.inflateSync(t);
          if (this.ValidateInjection(e, c)) {
            var l = this.InjectWebSnippet(e, c);
            t = o.deflateSync(l);
          }
          break;
        case a.contentEncodingMethod.BR:
          var u = a.getBrotliDecompressSync(o);
          var p = a.getBrotliCompressSync(o);
          if (u && p) {
            var d = u(t);
            if (this.ValidateInjection(e, d)) {
              t = p(this.InjectWebSnippet(e, d));
            }
            break;
          }
      }
    } catch (e) {
      s.info("get web injection compress buffer error: " + e);
    }
    return t;
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1);
    this._isInitialized = !1;
  };
  return e;
}();
module.exports = d;