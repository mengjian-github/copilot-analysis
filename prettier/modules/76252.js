module = require.nmd(module);
var r;
var i = require(49125).SourceMapConsumer;
var o = require(71017);
try {
  if ((r = require(57147)).existsSync && r.readFileSync) {
    r = null;
  }
} catch (e) {}
var s = require(55420);
function a(e, t) {
  return e.require(t);
}
var c = !1;
var l = !1;
var u = !1;
var p = "auto";
var d = {};
var h = {};
var f = /^data:application\/json[^,]+base64,/;
var m = [];
var g = [];
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
  var n = o.dirname(e);
  var r = /^\w+:\/\/[^\/]*/.exec(n);
  var i = r ? r[0] : "";
  var s = n.slice(i.length);
  return i && /^\/\w\:/.test(s) ? (i += "/") + o.resolve(n.slice(i.length), t).replace(/\\/g, "/") : i + o.resolve(n.slice(i.length), t);
}
m.push(function (e) {
  e = e.trim();
  if (/^file:/.test(e)) {
    e = e.replace(/file:\/\/\/(\w:)?/, function (e, t) {
      return t ? "" : "/";
    });
  }
  if (e in d) return d[e];
  var t = "";
  try {
    if (r) {
      if (r.existsSync(e)) {
        t = r.readFileSync(e, "utf8");
      }
    } else {
      var n = new XMLHttpRequest();
      n.open("GET", e, !1);
      n.send(null);
      if (4 === n.readyState && 200 === n.status) {
        t = n.responseText;
      }
    }
  } catch (e) {}
  return d[e] = t;
});
var retrieveSourceMap = _(g);
function mapSourcePosition(e) {
  var t = h[e.source];
  if (!t) {
    var n = retrieveSourceMap(e.source);
    if (n) {
      if ((t = h[e.source] = {
        url: n.url,
        map: new i(n.map)
      }).map.sourcesContent) {
        t.map.sources.forEach(function (e, n) {
          var r = t.map.sourcesContent[n];
          if (r) {
            var i = b(t.url, e);
            d[i] = r;
          }
        });
      }
    } else {
      t = h[e.source] = {
        url: null,
        map: null
      };
    }
  }
  if (t && t.map && "function" == typeof t.map.originalPositionFor) {
    var r = t.map.originalPositionFor(e);
    if (null !== r.source) {
      r.source = b(t.url, r.source);
      return r;
    }
  }
  return e;
}
function T(e) {
  var t = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(e);
  if (t) {
    var n = mapSourcePosition({
      source: t[2],
      line: +t[3],
      column: t[4] - 1
    });
    return "eval at " + t[1] + " (" + n.source + ":" + n.line + ":" + (n.column + 1) + ")";
  }
  return (t = /^eval at ([^(]+) \((.+)\)$/.exec(e)) ? "eval at " + t[1] + " (" + T(t[2]) + ")" : e;
}
function S() {
  var e;
  var t = "";
  if (this.isNative()) t = "native";else {
    if (!(e = this.getScriptNameOrSourceURL()) && this.isEval()) {
      t = this.getEvalOrigin();
      t += ", ";
    }
    t += e || "<anonymous>";
    var n = this.getLineNumber();
    if (null != n) {
      t += ":" + n;
      var r = this.getColumnNumber();
      if (r) {
        t += ":" + r;
      }
    }
  }
  var i = "";
  var o = this.getFunctionName();
  var s = !0;
  var a = this.isConstructor();
  if (this.isToplevel() || a) {
    if (a) {
      i += "new " + (o || "<anonymous>");
    } else {
      if (o) {
        i += o;
      } else {
        i += t;
        s = !1;
      }
    }
  } else {
    var c = this.getTypeName();
    if ("[object Object]" === c) {
      c = "null";
    }
    var l = this.getMethodName();
    if (o) {
      if (c && 0 != o.indexOf(c)) {
        i += c + ".";
      }
      i += o;
      if (l && o.indexOf("." + l) != o.length - l.length - 1) {
        i += " [as " + l + "]";
      }
    } else {
      i += c + "." + (l || "<anonymous>");
    }
  }
  if (s) {
    i += " (" + t + ")";
  }
  return i;
}
function x(e) {
  var t = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach(function (n) {
    t[n] = /^(?:is|get)/.test(n) ? function () {
      return e[n].call(e);
    } : e[n];
  });
  t.toString = S;
  return t;
}
function wrapCallSite(e, t) {
  if (void 0 === t) {
    t = {
      nextPosition: null,
      curPosition: null
    };
  }
  if (e.isNative()) return t.curPosition = null, e;
  var n = e.getFileName() || e.getScriptNameOrSourceURL();
  if (n) {
    var r = e.getLineNumber();
    var i = e.getColumnNumber() - 1;
    var o = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/.test("object" == typeof process && null !== process ? process.version : "") ? 0 : 62;
    if (1 === r && i > o && !y() && !e.isEval()) {
      i -= o;
    }
    var s = mapSourcePosition({
      source: n,
      line: r,
      column: i
    });
    t.curPosition = s;
    var a = (e = x(e)).getFunctionName;
    e.getFunctionName = function () {
      return null == t.nextPosition ? a() : t.nextPosition.name || a();
    };
    e.getFileName = function () {
      return s.source;
    };
    e.getLineNumber = function () {
      return s.line;
    };
    e.getColumnNumber = function () {
      return s.column + 1;
    };
    e.getScriptNameOrSourceURL = function () {
      return s.source;
    };
    return e;
  }
  var c = e.isEval() && e.getEvalOrigin();
  return c ? (c = T(c), (e = x(e)).getEvalOrigin = function () {
    return c;
  }, e) : e;
}
function I(e, t) {
  if (u) {
    d = {};
    h = {};
  }
  for (n = (e.name || "Error") + ": " + (e.message || ""), r = {
    nextPosition: null,
    curPosition: null
  }, i = [], o = t.length - 1, void 0; o >= 0; o--) {
    var n;
    var r;
    var i;
    var o;
    i.push("\n    at " + wrapCallSite(t[o], r));
    r.nextPosition = r.curPosition;
  }
  r.curPosition = r.nextPosition = null;
  return n + i.reverse().join("");
}
function getErrorSource(e) {
  var t = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(e.stack);
  if (t) {
    var n = t[1];
    var i = +t[2];
    var o = +t[3];
    var s = d[n];
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
  var t = getErrorSource(e);
  var n = function () {
    if ("object" == typeof process && null !== process) return process.stderr;
  }();
  if (n && n._handle && n._handle.setBlocking) {
    n._handle.setBlocking(!0);
  }
  if (t) {
    console.error();
    console.error(t);
  }
  console.error(e.stack);
  if ("object" == typeof process && null !== process && "function" == typeof process.exit) {
    process.exit(1);
  }
}
g.push(function (e) {
  var t;
  var n = function (e) {
    var t;
    if (y()) try {
      var n = new XMLHttpRequest();
      n.open("GET", e, !1);
      n.send(null);
      t = 4 === n.readyState ? n.responseText : null;
      var r = n.getResponseHeader("SourceMap") || n.getResponseHeader("X-SourceMap");
      if (r) return r;
    } catch (e) {}
    t = v(e);
    for (s = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/gm, void 0; o = s.exec(t);) {
      var i;
      var o;
      var s;
      i = o;
    }
    return i ? i[1] : null;
  }(e);
  if (!n) return null;
  if (f.test(n)) {
    var r = n.slice(n.indexOf(",") + 1);
    t = s(r, "base64").toString();
    n = e;
  } else {
    n = b(e, n);
    t = v(n);
  }
  return t ? {
    url: n,
    map: t
  } : null;
});
var P = m.slice(0);
var N = g.slice(0);
exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;
exports.install = function (t) {
  if ((t = t || {}).environment && (p = t.environment, -1 === ["node", "browser", "auto"].indexOf(p))) throw new Error("environment " + p + " was unknown. Available options are {auto, browser, node}");
  if (t.retrieveFile) {
    if (t.overrideRetrieveFile) {
      m.length = 0;
    }
    m.unshift(t.retrieveFile);
  }
  if (t.retrieveSourceMap) {
    if (t.overrideRetrieveSourceMap) {
      g.length = 0;
    }
    g.unshift(t.retrieveSourceMap);
  }
  if (t.hookRequire && !y()) {
    var n = a(module, "module"),
      r = n.prototype._compile;
    r.__sourceMapSupport || (n.prototype._compile = function (e, t) {
      return d[t] = e, h[t] = void 0, r.call(this, e, t);
    }, n.prototype._compile.__sourceMapSupport = !0);
  }
  if (u) {
    u = "emptyCacheBetweenOperations" in t && t.emptyCacheBetweenOperations;
  }
  if (c) {
    c = !0;
    Error.prepareStackTrace = I;
  }
  if (!l) {
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
};
exports.resetRetrieveHandlers = function () {
  m.length = 0;
  g.length = 0;
  m = P.slice(0);
  g = N.slice(0);
  retrieveSourceMap = _(g);
  v = _(m);
};