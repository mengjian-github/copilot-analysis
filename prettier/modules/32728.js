exports.getArg = function (e, t, n) {
  if (t in e) return e[t];
  if (3 === arguments.length) return n;
  throw new Error('"' + t + '" is a required argument.');
};
var n = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var r = /^data:.+\,.+$/;
function urlParse(e) {
  var t = e.match(n);
  return t ? {
    scheme: t[1],
    auth: t[2],
    host: t[3],
    port: t[4],
    path: t[5]
  } : null;
}
function urlGenerate(e) {
  var t = "";
  if (e.scheme) {
    t += e.scheme + ":";
  }
  t += "//";
  if (e.auth) {
    t += e.auth + "@";
  }
  if (e.host) {
    t += e.host;
  }
  if (e.port) {
    t += ":" + e.port;
  }
  if (e.path) {
    t += e.path;
  }
  return t;
}
function normalize(e) {
  var n = e;
  var r = urlParse(e);
  if (r) {
    if (!r.path) return e;
    n = r.path;
  }
  for (a = exports.isAbsolute(n), c = n.split(/\/+/), l = 0, u = c.length - 1, void 0; u >= 0; u--) {
    var s;
    var a;
    var c;
    var l;
    var u;
    if ("." === (s = c[u])) {
      c.splice(u, 1);
    } else {
      if (".." === s) {
        l++;
      } else {
        if (l > 0) {
          if ("" === s) {
            c.splice(u + 1, l);
            l = 0;
          } else {
            c.splice(u, 2);
            l--;
          }
        }
      }
    }
  }
  if ("" === (n = c.join("/"))) {
    n = a ? "/" : ".";
  }
  return r ? (r.path = n, urlGenerate(r)) : n;
}
function join(e, t) {
  if ("" === e) {
    e = ".";
  }
  if ("" === t) {
    t = ".";
  }
  var n = urlParse(t);
  var a = urlParse(e);
  if (a) {
    e = a.path || "/";
  }
  if (n && !n.scheme) return a && (n.scheme = a.scheme), urlGenerate(n);
  if (n || t.match(r)) return t;
  if (a && !a.host && !a.path) {
    a.host = t;
    return urlGenerate(a);
  }
  var c = "/" === t.charAt(0) ? t : normalize(e.replace(/\/+$/, "") + "/" + t);
  return a ? (a.path = c, urlGenerate(a)) : c;
}
exports.urlParse = urlParse;
exports.urlGenerate = urlGenerate;
exports.normalize = normalize;
exports.join = join;
exports.isAbsolute = function (e) {
  return "/" === e.charAt(0) || n.test(e);
};
exports.relative = function (e, t) {
  if ("" === e) {
    e = ".";
  }
  e = e.replace(/\/$/, "");
  for (var n = 0; 0 !== t.indexOf(e + "/");) {
    var r = e.lastIndexOf("/");
    if (r < 0) return t;
    if ((e = e.slice(0, r)).match(/^([^\/]+:\/)?\/*$/)) return t;
    ++n;
  }
  return Array(n + 1).join("../") + t.substr(e.length + 1);
};
var c = !("__proto__" in Object.create(null));
function l(e) {
  return e;
}
function u(e) {
  if (!e) return !1;
  var t = e.length;
  if (t < 9) return !1;
  if (95 !== e.charCodeAt(t - 1) || 95 !== e.charCodeAt(t - 2) || 111 !== e.charCodeAt(t - 3) || 116 !== e.charCodeAt(t - 4) || 111 !== e.charCodeAt(t - 5) || 114 !== e.charCodeAt(t - 6) || 112 !== e.charCodeAt(t - 7) || 95 !== e.charCodeAt(t - 8) || 95 !== e.charCodeAt(t - 9)) return !1;
  for (var n = t - 10; n >= 0; n--) if (36 !== e.charCodeAt(n)) return !1;
  return !0;
}
function p(e, t) {
  return e === t ? 0 : null === e ? 1 : null === t ? -1 : e > t ? 1 : -1;
}
exports.toSetString = c ? l : function (e) {
  return u(e) ? "$" + e : e;
};
exports.fromSetString = c ? l : function (e) {
  return u(e) ? e.slice(1) : e;
};
exports.compareByOriginalPositions = function (e, t, n) {
  var r = p(e.source, t.source);
  return 0 !== r || 0 != (r = e.originalLine - t.originalLine) || 0 != (r = e.originalColumn - t.originalColumn) || n || 0 != (r = e.generatedColumn - t.generatedColumn) || 0 != (r = e.generatedLine - t.generatedLine) ? r : p(e.name, t.name);
};
exports.compareByGeneratedPositionsDeflated = function (e, t, n) {
  var r = e.generatedLine - t.generatedLine;
  return 0 !== r || 0 != (r = e.generatedColumn - t.generatedColumn) || n || 0 !== (r = p(e.source, t.source)) || 0 != (r = e.originalLine - t.originalLine) || 0 != (r = e.originalColumn - t.originalColumn) ? r : p(e.name, t.name);
};
exports.compareByGeneratedPositionsInflated = function (e, t) {
  var n = e.generatedLine - t.generatedLine;
  return 0 !== n || 0 != (n = e.generatedColumn - t.generatedColumn) || 0 !== (n = p(e.source, t.source)) || 0 != (n = e.originalLine - t.originalLine) || 0 != (n = e.originalColumn - t.originalColumn) ? n : p(e.name, t.name);
};
exports.parseSourceMapInput = function (e) {
  return JSON.parse(e.replace(/^\)]}'[^\n]*\n/, ""));
};
exports.computeSourceURL = function (e, t, n) {
  t = t || "";
  if (e) {
    if ("/" !== e[e.length - 1] && "/" !== t[0]) {
      e += "/";
    }
    t = e + t;
  }
  if (n) {
    var r = urlParse(n);
    if (!r) throw new Error("sourceMapURL could not be parsed");
    if (r.path) {
      var c = r.path.lastIndexOf("/");
      c >= 0 && (r.path = r.path.substring(0, c + 1));
    }
    t = join(urlGenerate(r), t);
  }
  return normalize(t);
};