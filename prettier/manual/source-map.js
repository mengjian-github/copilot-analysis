module = require.nmd(module);
var r,
  i = require(49125).SourceMapConsumer,
  o = require(71017);
try {
  (r = require(57147)).existsSync && r.readFileSync || (r = null);
} catch (e) {}
var s = require(55420);
function a(e, t) {
  return e.require(t);
}
var c = !1,
  l = !1,
  u = !1,
  p = "auto",
  d = {},
  h = {},
  f = /^data:application\/json[^,]+base64,/,
  m = [],
  g = [];
function y() {
  return "browser" === p || "node" !== p && "undefined" != typeof window && "function" == typeof XMLHttpRequest && !(window.require && window.module && window.process && "renderer" === window.process.type);
}
function _(e) {
  return function (t) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n](t);
      if (r) return r;
    }
    return null;
  };
}
var v = _(m);
function b(e, t) {
  if (!e) return t;
  var n = o.dirname(e),
    r = /^\w+:\/\/[^\/]*/.exec(n),
    i = r ? r[0] : "",
    s = n.slice(i.length);
  return i && /^\/\w\:/.test(s) ? (i += "/") + o.resolve(n.slice(i.length), t).replace(/\\/g, "/") : i + o.resolve(n.slice(i.length), t);
}
m.push(function (e) {
  if (e = e.trim(), /^file:/.test(e) && (e = e.replace(/file:\/\/\/(\w:)?/, function (e, t) {
    return t ? "" : "/";
  })), e in d) return d[e];
  var t = "";
  try {
    if (r) r.existsSync(e) && (t = r.readFileSync(e, "utf8"));else {
      var n = new XMLHttpRequest();
      n.open("GET", e, !1), n.send(null), 4 === n.readyState && 200 === n.status && (t = n.responseText);
    }
  } catch (e) {}
  return d[e] = t;
});
var E = _(g);
function w(e) {
  var t = h[e.source];
  if (!t) {
    var n = E(e.source);
    n ? (t = h[e.source] = {
      url: n.url,
      map: new i(n.map)
    }).map.sourcesContent && t.map.sources.forEach(function (e, n) {
      var r = t.map.sourcesContent[n];
      if (r) {
        var i = b(t.url, e);
        d[i] = r;
      }
    }) : t = h[e.source] = {
      url: null,
      map: null
    };
  }
  if (t && t.map && "function" == typeof t.map.originalPositionFor) {
    var r = t.map.originalPositionFor(e);
    if (null !== r.source) return r.source = b(t.url, r.source), r;
  }
  return e;
}
function T(e) {
  var t = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(e);
  if (t) {
    var n = w({
      source: t[2],
      line: +t[3],
      column: t[4] - 1
    });
    return "eval at " + t[1] + " (" + n.source + ":" + n.line + ":" + (n.column + 1) + ")";
  }
  return (t = /^eval at ([^(]+) \((.+)\)$/.exec(e)) ? "eval at " + t[1] + " (" + T(t[2]) + ")" : e;
}
function S() {
  var e,
    t = "";
  if (this.isNative()) t = "native";else {
    !(e = this.getScriptNameOrSourceURL()) && this.isEval() && (t = this.getEvalOrigin(), t += ", "), t += e || "<anonymous>";
    var n = this.getLineNumber();
    if (null != n) {
      t += ":" + n;
      var r = this.getColumnNumber();
      r && (t += ":" + r);
    }
  }
  var i = "",
    o = this.getFunctionName(),
    s = !0,
    a = this.isConstructor();
  if (this.isToplevel() || a) a ? i += "new " + (o || "<anonymous>") : o ? i += o : (i += t, s = !1);else {
    var c = this.getTypeName();
    "[object Object]" === c && (c = "null");
    var l = this.getMethodName();
    o ? (c && 0 != o.indexOf(c) && (i += c + "."), i += o, l && o.indexOf("." + l) != o.length - l.length - 1 && (i += " [as " + l + "]")) : i += c + "." + (l || "<anonymous>");
  }
  return s && (i += " (" + t + ")"), i;
}
function x(e) {
  var t = {};
  return Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach(function (n) {
    t[n] = /^(?:is|get)/.test(n) ? function () {
      return e[n].call(e);
    } : e[n];
  }), t.toString = S, t;
}
function C(e, t) {
  if (void 0 === t && (t = {
    nextPosition: null,
    curPosition: null
  }), e.isNative()) return t.curPosition = null, e;
  var n = e.getFileName() || e.getScriptNameOrSourceURL();
  if (n) {
    var r = e.getLineNumber(),
      i = e.getColumnNumber() - 1,
      o = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/.test("object" == typeof process && null !== process ? process.version : "") ? 0 : 62;
    1 === r && i > o && !y() && !e.isEval() && (i -= o);
    var s = w({
      source: n,
      line: r,
      column: i
    });
    t.curPosition = s;
    var a = (e = x(e)).getFunctionName;
    return e.getFunctionName = function () {
      return null == t.nextPosition ? a() : t.nextPosition.name || a();
    }, e.getFileName = function () {
      return s.source;
    }, e.getLineNumber = function () {
      return s.line;
    }, e.getColumnNumber = function () {
      return s.column + 1;
    }, e.getScriptNameOrSourceURL = function () {
      return s.source;
    }, e;
  }
  var c = e.isEval() && e.getEvalOrigin();
  return c ? (c = T(c), (e = x(e)).getEvalOrigin = function () {
    return c;
  }, e) : e;
}
function I(e, t) {
  u && (d = {}, h = {});
  for (var n = (e.name || "Error") + ": " + (e.message || ""), r = {
      nextPosition: null,
      curPosition: null
    }, i = [], o = t.length - 1; o >= 0; o--) i.push("\n    at " + C(t[o], r)), r.nextPosition = r.curPosition;
  return r.curPosition = r.nextPosition = null, n + i.reverse().join("");
}
function A(e) {
  var t = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(e.stack);
  if (t) {
    var n = t[1],
      i = +t[2],
      o = +t[3],
      s = d[n];
    if (!s && r && r.existsSync(n)) try {
      s = r.readFileSync(n, "utf8");
    } catch (e) {
      s = "";
    }
    if (s) {
      var a = s.split(/(?:\r\n|\r|\n)/)[i - 1];
      if (a) return n + ":" + i + "\n" + a + "\n" + new Array(o).join(" ") + "^";
    }
  }
  return null;
}
function k(e) {
  var t = A(e),
    n = function () {
      if ("object" == typeof process && null !== process) return process.stderr;
    }();
  n && n._handle && n._handle.setBlocking && n._handle.setBlocking(!0), t && (console.error(), console.error(t)), console.error(e.stack), "object" == typeof process && null !== process && "function" == typeof process.exit && process.exit(1);
}
g.push(function (e) {
  var t,
    n = function (e) {
      var t;
      if (y()) try {
        var n = new XMLHttpRequest();
        n.open("GET", e, !1), n.send(null), t = 4 === n.readyState ? n.responseText : null;
        var r = n.getResponseHeader("SourceMap") || n.getResponseHeader("X-SourceMap");
        if (r) return r;
      } catch (e) {}
      t = v(e);
      for (var i, o, s = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/gm; o = s.exec(t);) i = o;
      return i ? i[1] : null;
    }(e);
  if (!n) return null;
  if (f.test(n)) {
    var r = n.slice(n.indexOf(",") + 1);
    t = s(r, "base64").toString(), n = e;
  } else n = b(e, n), t = v(n);
  return t ? {
    url: n,
    map: t
  } : null;
});
var P = m.slice(0),
  N = g.slice(0);
exports.wrapCallSite = C, exports.getErrorSource = A, exports.mapSourcePosition = w, exports.retrieveSourceMap = E, exports.install = function (t) {
  if ((t = t || {}).environment && (p = t.environment, -1 === ["node", "browser", "auto"].indexOf(p))) throw new Error("environment " + p + " was unknown. Available options are {auto, browser, node}");
  if (t.retrieveFile && (t.overrideRetrieveFile && (m.length = 0), m.unshift(t.retrieveFile)), t.retrieveSourceMap && (t.overrideRetrieveSourceMap && (g.length = 0), g.unshift(t.retrieveSourceMap)), t.hookRequire && !y()) {
    var n = a(module, "module"),
      r = n.prototype._compile;
    r.__sourceMapSupport || (n.prototype._compile = function (e, t) {
      return d[t] = e, h[t] = void 0, r.call(this, e, t);
    }, n.prototype._compile.__sourceMapSupport = !0);
  }
  if (u || (u = "emptyCacheBetweenOperations" in t && t.emptyCacheBetweenOperations), c || (c = !0, Error.prepareStackTrace = I), !l) {
    var i = !("handleUncaughtExceptions" in t) || t.handleUncaughtExceptions;
    try {
      !1 === a(module, "worker_threads").isMainThread && (i = !1);
    } catch (e) {}
    i && "object" == typeof process && null !== process && "function" == typeof process.on && (l = !0, o = process.emit, process.emit = function (e) {
      if ("uncaughtException" === e) {
        var t = arguments[1] && arguments[1].stack,
          n = this.listeners(e).length > 0;
        if (t && !n) return k(arguments[1]);
      }
      return o.apply(this, arguments);
    });
  }
  var o;
}, exports.resetRetrieveHandlers = function () {
  m.length = 0, g.length = 0, m = P.slice(0), g = N.slice(0), E = _(g), v = _(m);
};