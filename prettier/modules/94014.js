var n;
exports = module.exports = SemVer;
n = "object" == typeof process && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? function () {
  var e = Array.prototype.slice.call(arguments, 0);
  e.unshift("SEMVER");
  console.log.apply(console, e);
} : function () {};
exports.SEMVER_SPEC_VERSION = "2.0.0";
var r = Number.MAX_SAFE_INTEGER || 9007199254740991;
var i = exports.re = [];
var o = exports.src = [];
var s = 0;
var a = s++;
o[a] = "0|[1-9]\\d*";
var c = s++;
o[c] = "[0-9]+";
var l = s++;
o[l] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
var u = s++;
o[u] = "(" + o[a] + ")\\.(" + o[a] + ")\\.(" + o[a] + ")";
var p = s++;
o[p] = "(" + o[c] + ")\\.(" + o[c] + ")\\.(" + o[c] + ")";
var d = s++;
o[d] = "(?:" + o[a] + "|" + o[l] + ")";
var h = s++;
o[h] = "(?:" + o[c] + "|" + o[l] + ")";
var f = s++;
o[f] = "(?:-(" + o[d] + "(?:\\." + o[d] + ")*))";
var m = s++;
o[m] = "(?:-?(" + o[h] + "(?:\\." + o[h] + ")*))";
var g = s++;
o[g] = "[0-9A-Za-z-]+";
var y = s++;
o[y] = "(?:\\+(" + o[g] + "(?:\\." + o[g] + ")*))";
var _ = s++;
var v = "v?" + o[u] + o[f] + "?" + o[y] + "?";
o[_] = "^" + v + "$";
var b = "[v=\\s]*" + o[p] + o[m] + "?" + o[y] + "?";
var E = s++;
o[E] = "^" + b + "$";
var w = s++;
o[w] = "((?:<|>)?=?)";
var T = s++;
o[T] = o[c] + "|x|X|\\*";
var S = s++;
o[S] = o[a] + "|x|X|\\*";
var x = s++;
o[x] = "[v=\\s]*(" + o[S] + ")(?:\\.(" + o[S] + ")(?:\\.(" + o[S] + ")(?:" + o[f] + ")?" + o[y] + "?)?)?";
var C = s++;
o[C] = "[v=\\s]*(" + o[T] + ")(?:\\.(" + o[T] + ")(?:\\.(" + o[T] + ")(?:" + o[m] + ")?" + o[y] + "?)?)?";
var I = s++;
o[I] = "^" + o[w] + "\\s*" + o[x] + "$";
var A = s++;
o[A] = "^" + o[w] + "\\s*" + o[C] + "$";
var k = s++;
o[k] = "(?:^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])";
var P = s++;
o[P] = "(?:~>?)";
var N = s++;
o[N] = "(\\s*)" + o[P] + "\\s+";
i[N] = new RegExp(o[N], "g");
var O = s++;
o[O] = "^" + o[P] + o[x] + "$";
var R = s++;
o[R] = "^" + o[P] + o[C] + "$";
var M = s++;
o[M] = "(?:\\^)";
var L = s++;
o[L] = "(\\s*)" + o[M] + "\\s+";
i[L] = new RegExp(o[L], "g");
var D = s++;
o[D] = "^" + o[M] + o[x] + "$";
var B = s++;
o[B] = "^" + o[M] + o[C] + "$";
var F = s++;
o[F] = "^" + o[w] + "\\s*(" + b + ")$|^$";
var j = s++;
o[j] = "^" + o[w] + "\\s*(" + v + ")$|^$";
var U = s++;
o[U] = "(\\s*)" + o[w] + "\\s*(" + b + "|" + o[x] + ")";
i[U] = new RegExp(o[U], "g");
var $ = s++;
o[$] = "^\\s*(" + o[x] + ")\\s+-\\s+(" + o[x] + ")\\s*$";
var V = s++;
o[V] = "^\\s*(" + o[C] + ")\\s+-\\s+(" + o[C] + ")\\s*$";
var H = s++;
o[H] = "(<|>)?=?\\s*\\*";
for (var q = 0; q < 35; q++) {
  n(q, o[q]);
  if (i[q]) {
    i[q] = new RegExp(o[q]);
  }
}
function parse(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1
    };
  }
  if (e instanceof SemVer) return e;
  if ("string" != typeof e) return null;
  if (e.length > 256) return null;
  if (!(t.loose ? i[E] : i[_]).test(e)) return null;
  try {
    return new SemVer(e, t);
  } catch (e) {
    return null;
  }
}
function SemVer(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1
    };
  }
  if (e instanceof SemVer) {
    if (e.loose === t.loose) return e;
    e = e.version;
  } else if ("string" != typeof e) throw new TypeError("Invalid Version: " + e);
  if (e.length > 256) throw new TypeError("version is longer than 256 characters");
  if (!(this instanceof SemVer)) return new SemVer(e, t);
  n("SemVer", e, t);
  this.options = t;
  this.loose = !!t.loose;
  var o = e.trim().match(t.loose ? i[E] : i[_]);
  if (!o) throw new TypeError("Invalid Version: " + e);
  this.raw = e;
  this.major = +o[1];
  this.minor = +o[2];
  this.patch = +o[3];
  if (this.major > r || this.major < 0) throw new TypeError("Invalid major version");
  if (this.minor > r || this.minor < 0) throw new TypeError("Invalid minor version");
  if (this.patch > r || this.patch < 0) throw new TypeError("Invalid patch version");
  if (o[4]) {
    this.prerelease = o[4].split(".").map(function (e) {
      if (/^[0-9]+$/.test(e)) {
        var t = +e;
        if (t >= 0 && t < r) return t;
      }
      return e;
    });
  } else {
    this.prerelease = [];
  }
  this.build = o[5] ? o[5].split(".") : [];
  this.format();
}
exports.parse = parse;
exports.valid = function (e, t) {
  var n = parse(e, t);
  return n ? n.version : null;
};
exports.clean = function (e, t) {
  var n = parse(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
exports.SemVer = SemVer;
SemVer.prototype.format = function () {
  this.version = this.major + "." + this.minor + "." + this.patch;
  if (this.prerelease.length) {
    this.version += "-" + this.prerelease.join(".");
  }
  return this.version;
};
SemVer.prototype.toString = function () {
  return this.version;
};
SemVer.prototype.compare = function (e) {
  n("SemVer.compare", this.version, this.options, e);
  if (e instanceof SemVer) {
    e = new SemVer(e, this.options);
  }
  return this.compareMain(e) || this.comparePre(e);
};
SemVer.prototype.compareMain = function (e) {
  if (e instanceof SemVer) {
    e = new SemVer(e, this.options);
  }
  return compareIdentifiers(this.major, e.major) || compareIdentifiers(this.minor, e.minor) || compareIdentifiers(this.patch, e.patch);
};
SemVer.prototype.comparePre = function (e) {
  if (e instanceof SemVer) {
    e = new SemVer(e, this.options);
  }
  if (this.prerelease.length && !e.prerelease.length) return -1;
  if (!this.prerelease.length && e.prerelease.length) return 1;
  if (!this.prerelease.length && !e.prerelease.length) return 0;
  var t = 0;
  do {
    var r = this.prerelease[t];
    var i = e.prerelease[t];
    n("prerelease compare", t, r, i);
    if (void 0 === r && void 0 === i) return 0;
    if (void 0 === i) return 1;
    if (void 0 === r) return -1;
    if (r !== i) return compareIdentifiers(r, i);
  } while (++t);
};
SemVer.prototype.inc = function (e, t) {
  switch (e) {
    case "premajor":
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc("pre", t);
      break;
    case "preminor":
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc("pre", t);
      break;
    case "prepatch":
      this.prerelease.length = 0;
      this.inc("patch", t);
      this.inc("pre", t);
      break;
    case "prerelease":
      if (0 === this.prerelease.length) {
        this.inc("patch", t);
      }
      this.inc("pre", t);
      break;
    case "major":
      if (0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length) {
        this.major++;
      }
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case "minor":
      if (0 === this.patch && 0 !== this.prerelease.length) {
        this.minor++;
      }
      this.patch = 0;
      this.prerelease = [];
      break;
    case "patch":
      if (0 === this.prerelease.length) {
        this.patch++;
      }
      this.prerelease = [];
      break;
    case "pre":
      if (0 === this.prerelease.length) this.prerelease = [0];else {
        for (var n = this.prerelease.length; --n >= 0;) if ("number" == typeof this.prerelease[n]) {
          this.prerelease[n]++;
          n = -2;
        }
        if (-1 === n) {
          this.prerelease.push(0);
        }
      }
      if (t) {
        if (this.prerelease[0] === t) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [t, 0];
          }
        } else {
          this.prerelease = [t, 0];
        }
      }
      break;
    default:
      throw new Error("invalid increment argument: " + e);
  }
  this.format();
  this.raw = this.version;
  return this;
};
exports.inc = function (e, t, n, r) {
  if ("string" == typeof n) {
    r = n;
    n = void 0;
  }
  try {
    return new SemVer(e, n).inc(t, r).version;
  } catch (e) {
    return null;
  }
};
exports.diff = function (e, t) {
  if (eq(e, t)) return null;
  var n = parse(e);
  var r = parse(t);
  var i = "";
  if (n.prerelease.length || r.prerelease.length) {
    i = "pre";
    var o = "prerelease";
  }
  for (var s in n) if (("major" === s || "minor" === s || "patch" === s) && n[s] !== r[s]) return i + s;
  return o;
};
exports.compareIdentifiers = compareIdentifiers;
var G = /^[0-9]+$/;
function compareIdentifiers(e, t) {
  var n = G.test(e);
  var r = G.test(t);
  if (n && r) {
    e = +e;
    t = +t;
  }
  return e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}
function compare(e, t, n) {
  return new SemVer(e, n).compare(new SemVer(t, n));
}
function gt(e, t, n) {
  return compare(e, t, n) > 0;
}
function lt(e, t, n) {
  return compare(e, t, n) < 0;
}
function eq(e, t, n) {
  return 0 === compare(e, t, n);
}
function neq(e, t, n) {
  return 0 !== compare(e, t, n);
}
function ee(e, t, n) {
  return compare(e, t, n) >= 0;
}
function te(e, t, n) {
  return compare(e, t, n) <= 0;
}
function ne(e, t, n, r) {
  switch (t) {
    case "===":
      if ("object" == typeof e) {
        e = e.version;
      }
      if ("object" == typeof n) {
        n = n.version;
      }
      return e === n;
    case "!==":
      if ("object" == typeof e) {
        e = e.version;
      }
      if ("object" == typeof n) {
        n = n.version;
      }
      return e !== n;
    case "":
    case "=":
    case "==":
      return eq(e, n, r);
    case "!=":
      return neq(e, n, r);
    case ">":
      return gt(e, n, r);
    case ">=":
      return ee(e, n, r);
    case "<":
      return lt(e, n, r);
    case "<=":
      return te(e, n, r);
    default:
      throw new TypeError("Invalid operator: " + t);
  }
}
function re(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1
    };
  }
  if (e instanceof re) {
    if (e.loose === !!t.loose) return e;
    e = e.value;
  }
  if (!(this instanceof re)) return new re(e, t);
  n("comparator", e, t);
  this.options = t;
  this.loose = !!t.loose;
  this.parse(e);
  if (this.semver === ie) {
    this.value = "";
  } else {
    this.value = this.operator + this.semver.version;
  }
  n("comp", this);
}
exports.rcompareIdentifiers = function (e, t) {
  return compareIdentifiers(t, e);
};
exports.major = function (e, t) {
  return new SemVer(e, t).major;
};
exports.minor = function (e, t) {
  return new SemVer(e, t).minor;
};
exports.patch = function (e, t) {
  return new SemVer(e, t).patch;
};
exports.compare = compare;
exports.compareLoose = function (e, t) {
  return compare(e, t, !0);
};
exports.rcompare = function (e, t, n) {
  return compare(t, e, n);
};
exports.sort = function (e, n) {
  return e.sort(function (e, r) {
    return exports.compare(e, r, n);
  });
};
exports.rsort = function (e, n) {
  return e.sort(function (e, r) {
    return exports.rcompare(e, r, n);
  });
};
exports.gt = gt;
exports.lt = lt;
exports.eq = eq;
exports.neq = neq;
exports.gte = ee;
exports.lte = te;
exports.cmp = ne;
exports.Comparator = re;
var ie = {};
function oe(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1
    };
  }
  if (e instanceof oe) return e.loose === !!t.loose && e.includePrerelease === !!t.includePrerelease ? e : new oe(e.raw, t);
  if (e instanceof re) return new oe(e.value, t);
  if (!(this instanceof oe)) return new oe(e, t);
  this.options = t;
  this.loose = !!t.loose;
  this.includePrerelease = !!t.includePrerelease;
  this.raw = e;
  this.set = e.split(/\s*\|\|\s*/).map(function (e) {
    return this.parseRange(e.trim());
  }, this).filter(function (e) {
    return e.length;
  });
  if (!this.set.length) throw new TypeError("Invalid SemVer Range: " + e);
  this.format();
}
function se(e) {
  return !e || "x" === e.toLowerCase() || "*" === e;
}
function ae(e, t, n, r, i, o, s, a, c, l, u, p, d) {
  return ((t = se(n) ? "" : se(r) ? ">=" + n + ".0.0" : se(i) ? ">=" + n + "." + r + ".0" : ">=" + t) + " " + (a = se(c) ? "" : se(l) ? "<" + (+c + 1) + ".0.0" : se(u) ? "<" + c + "." + (+l + 1) + ".0" : p ? "<=" + c + "." + l + "." + u + "-" + p : "<=" + a)).trim();
}
function ce(e, t, r) {
  for (var i = 0; i < e.length; i++) if (!e[i].test(t)) return !1;
  if (t.prerelease.length && !r.includePrerelease) {
    for (i = 0; i < e.length; i++) {
      n(e[i].semver);
      if (e[i].semver !== ie && e[i].semver.prerelease.length > 0) {
        var o = e[i].semver;
        if (o.major === t.major && o.minor === t.minor && o.patch === t.patch) return !0;
      }
    }
    return !1;
  }
  return !0;
}
function le(e, t, n) {
  try {
    t = new oe(t, n);
  } catch (e) {
    return !1;
  }
  return t.test(e);
}
function ue(e, t, n, r) {
  var i;
  var o;
  var s;
  var a;
  var c;
  switch (e = new SemVer(e, r), t = new oe(t, r), n) {
    case ">":
      i = gt;
      o = te;
      s = lt;
      a = ">";
      c = ">=";
      break;
    case "<":
      i = lt;
      o = ee;
      s = gt;
      a = "<";
      c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (le(e, t, r)) return !1;
  for (var l = 0; l < t.set.length; ++l) {
    var u = t.set[l];
    var p = null;
    var d = null;
    u.forEach(function (e) {
      if (e.semver === ie) {
        e = new re(">=0.0.0");
      }
      p = p || e;
      d = d || e;
      if (i(e.semver, p.semver, r)) {
        p = e;
      } else {
        if (s(e.semver, d.semver, r)) {
          d = e;
        }
      }
    });
    if (p.operator === a || p.operator === c) return !1;
    if ((!d.operator || d.operator === a) && o(e, d.semver)) return !1;
    if (d.operator === c && s(e, d.semver)) return !1;
  }
  return !0;
}
re.prototype.parse = function (e) {
  var t = this.options.loose ? i[F] : i[j];
  var n = e.match(t);
  if (!n) throw new TypeError("Invalid comparator: " + e);
  this.operator = n[1];
  if ("=" === this.operator) {
    this.operator = "";
  }
  if (n[2]) {
    this.semver = new SemVer(n[2], this.options.loose);
  } else {
    this.semver = ie;
  }
};
re.prototype.toString = function () {
  return this.value;
};
re.prototype.test = function (e) {
  n("Comparator.test", e, this.options.loose);
  return this.semver === ie || ("string" == typeof e && (e = new SemVer(e, this.options)), ne(e, this.operator, this.semver, this.options));
};
re.prototype.intersects = function (e, t) {
  if (!(e instanceof re)) throw new TypeError("a Comparator is required");
  var n;
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1
    };
  }
  if ("" === this.operator) return n = new oe(e.value, t), le(this.value, n, t);
  if ("" === e.operator) {
    n = new oe(this.value, t);
    return le(e.semver, n, t);
  }
  var r = !(">=" !== this.operator && ">" !== this.operator || ">=" !== e.operator && ">" !== e.operator);
  var i = !("<=" !== this.operator && "<" !== this.operator || "<=" !== e.operator && "<" !== e.operator);
  var o = this.semver.version === e.semver.version;
  var s = !(">=" !== this.operator && "<=" !== this.operator || ">=" !== e.operator && "<=" !== e.operator);
  var a = ne(this.semver, "<", e.semver, t) && (">=" === this.operator || ">" === this.operator) && ("<=" === e.operator || "<" === e.operator);
  var c = ne(this.semver, ">", e.semver, t) && ("<=" === this.operator || "<" === this.operator) && (">=" === e.operator || ">" === e.operator);
  return r || i || o && s || a || c;
};
exports.Range = oe;
oe.prototype.format = function () {
  this.range = this.set.map(function (e) {
    return e.join(" ").trim();
  }).join("||").trim();
  return this.range;
};
oe.prototype.toString = function () {
  return this.range;
};
oe.prototype.parseRange = function (e) {
  var t = this.options.loose;
  e = e.trim();
  var r = t ? i[V] : i[$];
  e = e.replace(r, ae);
  n("hyphen replace", e);
  e = e.replace(i[U], "$1$2$3");
  n("comparator trim", e, i[U]);
  e = (e = (e = e.replace(i[N], "$1~")).replace(i[L], "$1^")).split(/\s+/).join(" ");
  var o = t ? i[F] : i[j];
  var s = e.split(" ").map(function (e) {
    return function (e, t) {
      n("comp", e, t);
      e = function (e, t) {
        return e.trim().split(/\s+/).map(function (e) {
          return function (e, t) {
            n("caret", e, t);
            var r = t.loose ? i[B] : i[D];
            return e.replace(r, function (t, r, i, o, s) {
              var a;
              n("caret", e, t, r, i, o, s);
              if (se(r)) {
                a = "";
              } else {
                if (se(i)) {
                  a = ">=" + r + ".0.0 <" + (+r + 1) + ".0.0";
                } else {
                  if (se(o)) {
                    a = "0" === r ? ">=" + r + "." + i + ".0 <" + r + "." + (+i + 1) + ".0" : ">=" + r + "." + i + ".0 <" + (+r + 1) + ".0.0";
                  } else {
                    if (s) {
                      n("replaceCaret pr", s);
                      a = "0" === r ? "0" === i ? ">=" + r + "." + i + "." + o + "-" + s + " <" + r + "." + i + "." + (+o + 1) : ">=" + r + "." + i + "." + o + "-" + s + " <" + r + "." + (+i + 1) + ".0" : ">=" + r + "." + i + "." + o + "-" + s + " <" + (+r + 1) + ".0.0";
                    } else {
                      n("no pr");
                      a = "0" === r ? "0" === i ? ">=" + r + "." + i + "." + o + " <" + r + "." + i + "." + (+o + 1) : ">=" + r + "." + i + "." + o + " <" + r + "." + (+i + 1) + ".0" : ">=" + r + "." + i + "." + o + " <" + (+r + 1) + ".0.0";
                    }
                  }
                }
              }
              n("caret return", a);
              return a;
            });
          }(e, t);
        }).join(" ");
      }(e, t);
      n("caret", e);
      e = function (e, t) {
        return e.trim().split(/\s+/).map(function (e) {
          return function (e, t) {
            var r = t.loose ? i[R] : i[O];
            return e.replace(r, function (t, r, i, o, s) {
              var a;
              n("tilde", e, t, r, i, o, s);
              if (se(r)) {
                a = "";
              } else {
                if (se(i)) {
                  a = ">=" + r + ".0.0 <" + (+r + 1) + ".0.0";
                } else {
                  if (se(o)) {
                    a = ">=" + r + "." + i + ".0 <" + r + "." + (+i + 1) + ".0";
                  } else {
                    if (s) {
                      n("replaceTilde pr", s);
                      a = ">=" + r + "." + i + "." + o + "-" + s + " <" + r + "." + (+i + 1) + ".0";
                    } else {
                      a = ">=" + r + "." + i + "." + o + " <" + r + "." + (+i + 1) + ".0";
                    }
                  }
                }
              }
              n("tilde return", a);
              return a;
            });
          }(e, t);
        }).join(" ");
      }(e, t);
      n("tildes", e);
      e = function (e, t) {
        n("replaceXRanges", e, t);
        return e.split(/\s+/).map(function (e) {
          return function (e, t) {
            e = e.trim();
            var r = t.loose ? i[A] : i[I];
            return e.replace(r, function (t, r, i, o, s, a) {
              n("xRange", e, t, r, i, o, s, a);
              var c = se(i);
              var l = c || se(o);
              var u = l || se(s);
              if ("=" === r && u) {
                r = "";
              }
              if (c) {
                t = ">" === r || "<" === r ? "<0.0.0" : "*";
              } else {
                if (r && u) {
                  if (l) {
                    o = 0;
                  }
                  s = 0;
                  if (">" === r) {
                    r = ">=";
                    if (l) {
                      i = +i + 1;
                      o = 0;
                      s = 0;
                    } else {
                      o = +o + 1;
                      s = 0;
                    }
                  } else {
                    if ("<=" === r) {
                      r = "<";
                      if (l) {
                        i = +i + 1;
                      } else {
                        o = +o + 1;
                      }
                    }
                  }
                  t = r + i + "." + o + "." + s;
                } else {
                  if (l) {
                    t = ">=" + i + ".0.0 <" + (+i + 1) + ".0.0";
                  } else {
                    if (u) {
                      t = ">=" + i + "." + o + ".0 <" + i + "." + (+o + 1) + ".0";
                    }
                  }
                }
              }
              n("xRange return", t);
              return t;
            });
          }(e, t);
        }).join(" ");
      }(e, t);
      n("xrange", e);
      e = function (e, t) {
        n("replaceStars", e, t);
        return e.trim().replace(i[H], "");
      }(e, t);
      n("stars", e);
      return e;
    }(e, this.options);
  }, this).join(" ").split(/\s+/);
  if (this.options.loose) {
    s = s.filter(function (e) {
      return !!e.match(o);
    });
  }
  return s.map(function (e) {
    return new re(e, this.options);
  }, this);
};
oe.prototype.intersects = function (e, t) {
  if (!(e instanceof oe)) throw new TypeError("a Range is required");
  return this.set.some(function (n) {
    return n.every(function (n) {
      return e.set.some(function (e) {
        return e.every(function (e) {
          return n.intersects(e, t);
        });
      });
    });
  });
};
exports.toComparators = function (e, t) {
  return new oe(e, t).set.map(function (e) {
    return e.map(function (e) {
      return e.value;
    }).join(" ").trim().split(" ");
  });
};
oe.prototype.test = function (e) {
  if (!e) return !1;
  if ("string" == typeof e) {
    e = new SemVer(e, this.options);
  }
  for (var t = 0; t < this.set.length; t++) if (ce(this.set[t], e, this.options)) return !0;
  return !1;
};
exports.satisfies = le;
exports.maxSatisfying = function (e, t, n) {
  var r = null;
  var i = null;
  try {
    var o = new oe(t, n);
  } catch (e) {
    return null;
  }
  e.forEach(function (e) {
    if (o.test(e)) {
      if (r && -1 !== i.compare(e)) {
        i = new SemVer(r = e, n);
      }
    }
  });
  return r;
};
exports.minSatisfying = function (e, t, n) {
  var r = null;
  var i = null;
  try {
    var o = new oe(t, n);
  } catch (e) {
    return null;
  }
  e.forEach(function (e) {
    if (o.test(e)) {
      if (r && 1 !== i.compare(e)) {
        i = new SemVer(r = e, n);
      }
    }
  });
  return r;
};
exports.minVersion = function (e, t) {
  e = new oe(e, t);
  var n = new SemVer("0.0.0");
  if (e.test(n)) return n;
  n = new SemVer("0.0.0-0");
  if (e.test(n)) return n;
  n = null;
  for (var r = 0; r < e.set.length; ++r) e.set[r].forEach(function (e) {
    var t = new SemVer(e.semver.version);
    switch (e.operator) {
      case ">":
        if (0 === t.prerelease.length) {
          t.patch++;
        } else {
          t.prerelease.push(0);
        }
        t.raw = t.format();
      case "":
      case ">=":
        if (n && !gt(n, t)) {
          n = t;
        }
        break;
      case "<":
      case "<=":
        break;
      default:
        throw new Error("Unexpected operation: " + e.operator);
    }
  });
  return n && e.test(n) ? n : null;
};
exports.validRange = function (e, t) {
  try {
    return new oe(e, t).range || "*";
  } catch (e) {
    return null;
  }
};
exports.ltr = function (e, t, n) {
  return ue(e, t, "<", n);
};
exports.gtr = function (e, t, n) {
  return ue(e, t, ">", n);
};
exports.outside = ue;
exports.prerelease = function (e, t) {
  var n = parse(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
exports.intersects = function (e, t, n) {
  e = new oe(e, n);
  t = new oe(t, n);
  return e.intersects(t);
};
exports.coerce = function (e) {
  if (e instanceof SemVer) return e;
  if ("string" != typeof e) return null;
  var t = e.match(i[k]);
  return null == t ? null : parse(t[1] + "." + (t[2] || "0") + "." + (t[3] || "0"));
};