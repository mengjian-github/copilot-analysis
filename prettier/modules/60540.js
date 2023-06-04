!function (e) {
  "use strict";

  function t() {
    for (e = arguments.length, t = Array(e), n = 0, void 0; n < e; n++) {
      var e;
      var t;
      var n;
      t[n] = arguments[n];
    }
    if (t.length > 1) {
      t[0] = t[0].slice(0, -1);
      for (r = t.length - 1, i = 1, void 0; i < r; ++i) {
        var r;
        var i;
        t[i] = t[i].slice(1, -1);
      }
      t[r] = t[r].slice(1);
      return t.join("");
    }
    return t[0];
  }
  function n(e) {
    return "(?:" + e + ")";
  }
  function r(e) {
    return void 0 === e ? "undefined" : null === e ? "null" : Object.prototype.toString.call(e).split(" ").pop().split("]").shift().toLowerCase();
  }
  function i(e) {
    return e.toUpperCase();
  }
  function o(e) {
    var r = "[A-Za-z]";
    var i = "[0-9]";
    var o = t(i, "[A-Fa-f]");
    var s = n(n("%[EFef]" + o + "%" + o + o + "%" + o + o) + "|" + n("%[89A-Fa-f]" + o + "%" + o + o) + "|" + n("%" + o + o));
    var a = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]";
    var c = t("[\\:\\/\\?\\#\\[\\]\\@]", a);
    var l = e ? "[\\uE000-\\uF8FF]" : "[]";
    var u = t(r, i, "[\\-\\.\\_\\~]", e ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]");
    var p = n(r + t(r, i, "[\\+\\-\\.]") + "*");
    var d = n(n(s + "|" + t(u, a, "[\\:]")) + "*");
    var h = (n(n("25[0-5]") + "|" + n("2[0-4]" + i) + "|" + n("1" + i + i) + "|" + n("[1-9]" + i) + "|" + i), n(n("25[0-5]") + "|" + n("2[0-4]" + i) + "|" + n("1" + i + i) + "|" + n("0?[1-9]" + i) + "|0?0?" + i));
    var f = n(h + "\\." + h + "\\." + h + "\\." + h);
    var m = n(o + "{1,4}");
    var g = n(n(m + "\\:" + m) + "|" + f);
    var y = n(n(m + "\\:") + "{6}" + g);
    var _ = n("\\:\\:" + n(m + "\\:") + "{5}" + g);
    var v = n(n(m) + "?\\:\\:" + n(m + "\\:") + "{4}" + g);
    var b = n(n(n(m + "\\:") + "{0,1}" + m) + "?\\:\\:" + n(m + "\\:") + "{3}" + g);
    var E = n(n(n(m + "\\:") + "{0,2}" + m) + "?\\:\\:" + n(m + "\\:") + "{2}" + g);
    var w = n(n(n(m + "\\:") + "{0,3}" + m) + "?\\:\\:" + m + "\\:" + g);
    var T = n(n(n(m + "\\:") + "{0,4}" + m) + "?\\:\\:" + g);
    var S = n(n(n(m + "\\:") + "{0,5}" + m) + "?\\:\\:" + m);
    var x = n(n(n(m + "\\:") + "{0,6}" + m) + "?\\:\\:");
    var C = n([y, _, v, b, E, w, T, S, x].join("|"));
    var I = n(n(u + "|" + s) + "+");
    var A = (n(C + "\\%25" + I), n(C + n("\\%25|\\%(?!" + o + "{2})") + I));
    var k = n("[vV]" + o + "+\\." + t(u, a, "[\\:]") + "+");
    var P = n("\\[" + n(A + "|" + C + "|" + k) + "\\]");
    var N = n(n(s + "|" + t(u, a)) + "*");
    var O = n(P + "|" + f + "(?!" + N + ")|" + N);
    var R = n(i + "*");
    var M = n(n(d + "@") + "?" + O + n("\\:" + R) + "?");
    var L = n(s + "|" + t(u, a, "[\\:\\@]"));
    var D = n(L + "*");
    var B = n(L + "+");
    var F = n(n(s + "|" + t(u, a, "[\\@]")) + "+");
    var j = n(n("\\/" + D) + "*");
    var U = n("\\/" + n(B + j) + "?");
    var $ = n(F + j);
    var V = n(B + j);
    var H = "(?!" + L + ")";
    var q = (n(j + "|" + U + "|" + $ + "|" + V + "|" + H), n(n(L + "|" + t("[\\/\\?]", l)) + "*"));
    var z = n(n(L + "|[\\/\\?]") + "*");
    var K = n(n("\\/\\/" + M + j) + "|" + U + "|" + V + "|" + H);
    var G = n(p + "\\:" + K + n("\\?" + q) + "?" + n("\\#" + z) + "?");
    var W = n(n("\\/\\/" + M + j) + "|" + U + "|" + $ + "|" + H);
    var Q = n(W + n("\\?" + q) + "?" + n("\\#" + z) + "?");
    n(G + "|" + Q);
    n(p + "\\:" + K + n("\\?" + q) + "?");
    n(n("\\/\\/(" + n("(" + d + ")@") + "?(" + O + ")" + n("\\:(" + R + ")") + "?)") + "?(" + j + "|" + U + "|" + V + "|" + H + ")");
    n("\\?(" + q + ")");
    n("\\#(" + z + ")");
    n(n("\\/\\/(" + n("(" + d + ")@") + "?(" + O + ")" + n("\\:(" + R + ")") + "?)") + "?(" + j + "|" + U + "|" + $ + "|" + H + ")");
    n("\\?(" + q + ")");
    n("\\#(" + z + ")");
    n(n("\\/\\/(" + n("(" + d + ")@") + "?(" + O + ")" + n("\\:(" + R + ")") + "?)") + "?(" + j + "|" + U + "|" + V + "|" + H + ")");
    n("\\?(" + q + ")");
    n("\\#(" + z + ")");
    n("(" + d + ")@");
    n("\\:(" + R + ")");
    return {
      NOT_SCHEME: new RegExp(t("[^]", r, i, "[\\+\\-\\.]"), "g"),
      NOT_USERINFO: new RegExp(t("[^\\%\\:]", u, a), "g"),
      NOT_HOST: new RegExp(t("[^\\%\\[\\]\\:]", u, a), "g"),
      NOT_PATH: new RegExp(t("[^\\%\\/\\:\\@]", u, a), "g"),
      NOT_PATH_NOSCHEME: new RegExp(t("[^\\%\\/\\@]", u, a), "g"),
      NOT_QUERY: new RegExp(t("[^\\%]", u, a, "[\\:\\@\\/\\?]", l), "g"),
      NOT_FRAGMENT: new RegExp(t("[^\\%]", u, a, "[\\:\\@\\/\\?]"), "g"),
      ESCAPE: new RegExp(t("[^]", u, a), "g"),
      UNRESERVED: new RegExp(u, "g"),
      OTHER_CHARS: new RegExp(t("[^\\%]", u, c), "g"),
      PCT_ENCODED: new RegExp(s, "g"),
      IPV4ADDRESS: new RegExp("^(" + f + ")$"),
      IPV6ADDRESS: new RegExp("^\\[?(" + C + ")" + n(n("\\%25|\\%(?!" + o + "{2})") + "(" + I + ")") + "?\\]?$")
    };
  }
  var s = o(!1);
  var a = o(!0);
  var c = function (e, t) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e)) return function (e, t) {
      var n = [];
      var r = !0;
      var i = !1;
      var o = void 0;
      try {
        for (a = e[Symbol.iterator](), void 0; !(r = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); r = !0) {
          var s;
          var a;
          ;
        }
      } catch (e) {
        i = !0;
        o = e;
      } finally {
        try {
          if (!r && a.return) {
            a.return();
          }
        } finally {
          if (i) throw o;
        }
      }
      return n;
    }(e, t);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  };
  var l = 2147483647;
  var u = 36;
  var p = /^xn--/;
  var d = /[^\0-\x7E]/;
  var h = /[\x2E\u3002\uFF0E\uFF61]/g;
  var f = {
    overflow: "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input"
  };
  var m = Math.floor;
  var g = String.fromCharCode;
  function y(e) {
    throw new RangeError(f[e]);
  }
  function _(e, t) {
    var n = e.split("@");
    var r = "";
    if (n.length > 1) {
      r = n[0] + "@";
      e = n[1];
    }
    return r + function (e, t) {
      for (n = [], r = e.length, void 0; r--;) {
        var n;
        var r;
        n[r] = t(e[r]);
      }
      return n;
    }((e = e.replace(h, ".")).split("."), t).join(".");
  }
  function v(e) {
    for (t = [], n = 0, r = e.length, void 0; n < r;) {
      var t;
      var n;
      var r;
      var i = e.charCodeAt(n++);
      if (i >= 55296 && i <= 56319 && n < r) {
        var o = e.charCodeAt(n++);
        if (56320 == (64512 & o)) {
          t.push(((1023 & i) << 10) + (1023 & o) + 65536);
        } else {
          t.push(i);
          n--;
        }
      } else t.push(i);
    }
    return t;
  }
  var b = function (e, t) {
    return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
  };
  var E = function (e, t, n) {
    var r = 0;
    for (e = n ? m(e / 700) : e >> 1, e += m(e / t); e > 455; r += u) e = m(e / 35);
    return m(r + 36 * e / (e + 38));
  };
  var w = function (e) {
    var t;
    var n = [];
    var r = e.length;
    var i = 0;
    var o = 128;
    var s = 72;
    var a = e.lastIndexOf("-");
    if (a < 0) {
      a = 0;
    }
    for (var c = 0; c < a; ++c) {
      if (e.charCodeAt(c) >= 128) {
        y("not-basic");
      }
      n.push(e.charCodeAt(c));
    }
    for (var p = a > 0 ? a + 1 : 0; p < r;) {
      for (d = i, h = 1, f = u, void 0;; f += u) {
        var d;
        var h;
        var f;
        if (p >= r) {
          y("invalid-input");
        }
        var g = (t = e.charCodeAt(p++)) - 48 < 10 ? t - 22 : t - 65 < 26 ? t - 65 : t - 97 < 26 ? t - 97 : u;
        if (g >= u || g > m((l - i) / h)) {
          y("overflow");
        }
        i += g * h;
        var _ = f <= s ? 1 : f >= s + 26 ? 26 : f - s;
        if (g < _) break;
        var v = u - _;
        if (h > m(l / v)) {
          y("overflow");
        }
        h *= v;
      }
      var b = n.length + 1;
      s = E(i - d, b, 0 == d);
      if (m(i / b) > l - o) {
        y("overflow");
      }
      o += m(i / b);
      i %= b;
      n.splice(i++, 0, o);
    }
    return String.fromCodePoint.apply(String, n);
  };
  var T = function (e) {
    var t = [];
    var n = (e = v(e)).length;
    var r = 128;
    var i = 0;
    var o = 72;
    var s = !0;
    var a = !1;
    var c = void 0;
    try {
      for (d = e[Symbol.iterator](), void 0; !(s = (p = d.next()).done); s = !0) {
        var p;
        var d;
        var h = p.value;
        if (h < 128) {
          t.push(g(h));
        }
      }
    } catch (e) {
      a = !0;
      c = e;
    } finally {
      try {
        if (!s && d.return) {
          d.return();
        }
      } finally {
        if (a) throw c;
      }
    }
    var f = t.length;
    var _ = f;
    for (f && t.push("-"); _ < n;) {
      var w = l;
      var T = !0;
      var S = !1;
      var x = void 0;
      try {
        for (I = e[Symbol.iterator](), void 0; !(T = (C = I.next()).done); T = !0) {
          var C;
          var I;
          var A = C.value;
          if (A >= r && A < w) {
            w = A;
          }
        }
      } catch (e) {
        S = !0;
        x = e;
      } finally {
        try {
          if (!T && I.return) {
            I.return();
          }
        } finally {
          if (S) throw x;
        }
      }
      var k = _ + 1;
      if (w - r > m((l - i) / k)) {
        y("overflow");
      }
      i += (w - r) * k;
      r = w;
      var P = !0;
      var N = !1;
      var O = void 0;
      try {
        for (M = e[Symbol.iterator](), void 0; !(P = (R = M.next()).done); P = !0) {
          var R;
          var M;
          var L = R.value;
          if (L < r && ++i > l) {
            y("overflow");
          }
          if (L == r) {
            for (var D = i, B = u;; B += u) {
              var F = B <= o ? 1 : B >= o + 26 ? 26 : B - o;
              if (D < F) break;
              var j = D - F,
                U = u - F;
              t.push(g(b(F + j % U, 0))), D = m(j / U);
            }
            t.push(g(b(D, 0))), o = E(i, k, _ == f), i = 0, ++_;
          }
        }
      } catch (e) {
        N = !0;
        O = e;
      } finally {
        try {
          if (!P && M.return) {
            M.return();
          }
        } finally {
          if (N) throw O;
        }
      }
      ++i;
      ++r;
    }
    return t.join("");
  };
  var S = function (e) {
    return _(e, function (e) {
      return d.test(e) ? "xn--" + T(e) : e;
    });
  };
  var x = function (e) {
    return _(e, function (e) {
      return p.test(e) ? w(e.slice(4).toLowerCase()) : e;
    });
  };
  var C = {};
  function I(e) {
    var t = e.charCodeAt(0);
    return t < 16 ? "%0" + t.toString(16).toUpperCase() : t < 128 ? "%" + t.toString(16).toUpperCase() : t < 2048 ? "%" + (t >> 6 | 192).toString(16).toUpperCase() + "%" + (63 & t | 128).toString(16).toUpperCase() : "%" + (t >> 12 | 224).toString(16).toUpperCase() + "%" + (t >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (63 & t | 128).toString(16).toUpperCase();
  }
  function A(e) {
    for (t = "", n = 0, r = e.length, void 0; n < r;) {
      var t;
      var n;
      var r;
      var i = parseInt(e.substr(n + 1, 2), 16);
      if (i < 128) {
        t += String.fromCharCode(i);
        n += 3;
      } else if (i >= 194 && i < 224) {
        if (r - n >= 6) {
          var o = parseInt(e.substr(n + 4, 2), 16);
          t += String.fromCharCode((31 & i) << 6 | 63 & o);
        } else t += e.substr(n, 6);
        n += 6;
      } else if (i >= 224) {
        if (r - n >= 9) {
          var s = parseInt(e.substr(n + 4, 2), 16);
          var a = parseInt(e.substr(n + 7, 2), 16);
          t += String.fromCharCode((15 & i) << 12 | (63 & s) << 6 | 63 & a);
        } else t += e.substr(n, 9);
        n += 9;
      } else {
        t += e.substr(n, 3);
        n += 3;
      }
    }
    return t;
  }
  function k(e, t) {
    function n(e) {
      var n = A(e);
      return n.match(t.UNRESERVED) ? n : e;
    }
    if (e.scheme) {
      e.scheme = String(e.scheme).replace(t.PCT_ENCODED, n).toLowerCase().replace(t.NOT_SCHEME, "");
    }
    if (void 0 !== e.userinfo) {
      e.userinfo = String(e.userinfo).replace(t.PCT_ENCODED, n).replace(t.NOT_USERINFO, I).replace(t.PCT_ENCODED, i);
    }
    if (void 0 !== e.host) {
      e.host = String(e.host).replace(t.PCT_ENCODED, n).toLowerCase().replace(t.NOT_HOST, I).replace(t.PCT_ENCODED, i);
    }
    if (void 0 !== e.path) {
      e.path = String(e.path).replace(t.PCT_ENCODED, n).replace(e.scheme ? t.NOT_PATH : t.NOT_PATH_NOSCHEME, I).replace(t.PCT_ENCODED, i);
    }
    if (void 0 !== e.query) {
      e.query = String(e.query).replace(t.PCT_ENCODED, n).replace(t.NOT_QUERY, I).replace(t.PCT_ENCODED, i);
    }
    if (void 0 !== e.fragment) {
      e.fragment = String(e.fragment).replace(t.PCT_ENCODED, n).replace(t.NOT_FRAGMENT, I).replace(t.PCT_ENCODED, i);
    }
    return e;
  }
  function P(e) {
    return e.replace(/^0*(.*)/, "$1") || "0";
  }
  function N(e, t) {
    var n = e.match(t.IPV4ADDRESS) || [];
    var r = c(n, 2)[1];
    return r ? r.split(".").map(P).join(".") : e;
  }
  function O(e, t) {
    var n = e.match(t.IPV6ADDRESS) || [];
    var r = c(n, 3);
    var i = r[1];
    var o = r[2];
    if (i) {
      for (s = i.toLowerCase().split("::").reverse(), a = c(s, 2), l = a[0], u = a[1], p = u ? u.split(":").map(P) : [], d = l.split(":").map(P), h = t.IPV4ADDRESS.test(d[d.length - 1]), f = h ? 7 : 8, m = d.length - f, g = Array(f), y = 0, void 0; y < f; ++y) {
        var s;
        var a;
        var l;
        var u;
        var p;
        var d;
        var h;
        var f;
        var m;
        var g;
        var y;
        g[y] = p[y] || d[m + y] || "";
      }
      if (h) {
        g[f - 1] = N(g[f - 1], t);
      }
      var _ = g.reduce(function (e, t, n) {
        if (!t || "0" === t) {
          var r = e[e.length - 1];
          if (r && r.index + r.length === n) {
            r.length++;
          } else {
            e.push({
              index: n,
              length: 1
            });
          }
        }
        return e;
      }, []).sort(function (e, t) {
        return t.length - e.length;
      })[0];
      var v = void 0;
      if (_ && _.length > 1) {
        var b = g.slice(0, _.index);
        var E = g.slice(_.index + _.length);
        v = b.join(":") + "::" + E.join(":");
      } else v = g.join(":");
      if (o) {
        v += "%" + o;
      }
      return v;
    }
    return e;
  }
  var R = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
  var M = void 0 === "".match(/(){0}/)[1];
  function L(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    var n = {};
    var r = !1 !== t.iri ? a : s;
    if ("suffix" === t.reference) {
      e = (t.scheme ? t.scheme + ":" : "") + "//" + e;
    }
    var i = e.match(R);
    if (i) {
      if (M) {
        n.scheme = i[1];
        n.userinfo = i[3];
        n.host = i[4];
        n.port = parseInt(i[5], 10);
        n.path = i[6] || "";
        n.query = i[7];
        n.fragment = i[8];
        if (isNaN(n.port)) {
          n.port = i[5];
        }
      } else {
        n.scheme = i[1] || void 0;
        n.userinfo = -1 !== e.indexOf("@") ? i[3] : void 0;
        n.host = -1 !== e.indexOf("//") ? i[4] : void 0;
        n.port = parseInt(i[5], 10);
        n.path = i[6] || "";
        n.query = -1 !== e.indexOf("?") ? i[7] : void 0;
        n.fragment = -1 !== e.indexOf("#") ? i[8] : void 0;
        if (isNaN(n.port)) {
          n.port = e.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? i[4] : void 0;
        }
      }
      if (n.host) {
        n.host = O(N(n.host, r), r);
      }
      if (void 0 !== n.scheme || void 0 !== n.userinfo || void 0 !== n.host || void 0 !== n.port || n.path || void 0 !== n.query) {
        if (void 0 === n.scheme) {
          n.reference = "relative";
        } else {
          if (void 0 === n.fragment) {
            n.reference = "absolute";
          } else {
            n.reference = "uri";
          }
        }
      } else {
        n.reference = "same-document";
      }
      if (t.reference && "suffix" !== t.reference && t.reference !== n.reference) {
        n.error = n.error || "URI is not a " + t.reference + " reference.";
      }
      var o = C[(t.scheme || n.scheme || "").toLowerCase()];
      if (t.unicodeSupport || o && o.unicodeSupport) k(n, r);else {
        if (n.host && (t.domainHost || o && o.domainHost)) try {
          n.host = S(n.host.replace(r.PCT_ENCODED, A).toLowerCase());
        } catch (e) {
          n.error = n.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
        }
        k(n, s);
      }
      if (o && o.parse) {
        o.parse(n, t);
      }
    } else n.error = n.error || "URI can not be parsed.";
    return n;
  }
  function D(e, t) {
    var n = !1 !== t.iri ? a : s;
    var r = [];
    if (void 0 !== e.userinfo) {
      r.push(e.userinfo);
      r.push("@");
    }
    if (void 0 !== e.host) {
      r.push(O(N(String(e.host), n), n).replace(n.IPV6ADDRESS, function (e, t, n) {
        return "[" + t + (n ? "%25" + n : "") + "]";
      }));
    }
    if ("number" != typeof e.port && "string" != typeof e.port) {
      r.push(":");
      r.push(String(e.port));
    }
    return r.length ? r.join("") : void 0;
  }
  var B = /^\.\.?\//;
  var F = /^\/\.(\/|$)/;
  var j = /^\/\.\.(\/|$)/;
  var U = /^\/?(?:.|\n)*?(?=\/|$)/;
  function $(e) {
    for (var t = []; e.length;) if (e.match(B)) e = e.replace(B, "");else if (e.match(F)) e = e.replace(F, "/");else if (e.match(j)) {
      e = e.replace(j, "/");
      t.pop();
    } else if ("." === e || ".." === e) e = "";else {
      var n = e.match(U);
      if (!n) throw new Error("Unexpected dot segment condition");
      var r = n[0];
      e = e.slice(r.length);
      t.push(r);
    }
    return t.join("");
  }
  function V(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    var n = t.iri ? a : s;
    var r = [];
    var i = C[(t.scheme || e.scheme || "").toLowerCase()];
    if (i && i.serialize) {
      i.serialize(e, t);
    }
    if (e.host) if (n.IPV6ADDRESS.test(e.host)) ;else if (t.domainHost || i && i.domainHost) try {
      e.host = t.iri ? x(e.host) : S(e.host.replace(n.PCT_ENCODED, A).toLowerCase());
    } catch (n) {
      e.error = e.error || "Host's domain name can not be converted to " + (t.iri ? "Unicode" : "ASCII") + " via punycode: " + n;
    }
    k(e, n);
    if ("suffix" !== t.reference && e.scheme) {
      r.push(e.scheme);
      r.push(":");
    }
    var o = D(e, t);
    if (void 0 !== o) {
      if ("suffix" !== t.reference) {
        r.push("//");
      }
      r.push(o);
      if (e.path && "/" !== e.path.charAt(0)) {
        r.push("/");
      }
    }
    if (void 0 !== e.path) {
      var c = e.path;
      t.absolutePath || i && i.absolutePath || (c = $(c)), void 0 === o && (c = c.replace(/^\/\//, "/%2F")), r.push(c);
    }
    if (void 0 !== e.query) {
      r.push("?");
      r.push(e.query);
    }
    if (void 0 !== e.fragment) {
      r.push("#");
      r.push(e.fragment);
    }
    return r.join("");
  }
  function H(e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    var r = {};
    if (arguments[3]) {
      e = L(V(e, n), n);
      t = L(V(t, n), n);
    }
    if (!(n = n || {}).tolerant && t.scheme) {
      r.scheme = t.scheme;
      r.userinfo = t.userinfo;
      r.host = t.host;
      r.port = t.port;
      r.path = $(t.path || "");
      r.query = t.query;
    } else {
      if (void 0 !== t.userinfo || void 0 !== t.host || void 0 !== t.port) {
        r.userinfo = t.userinfo;
        r.host = t.host;
        r.port = t.port;
        r.path = $(t.path || "");
        r.query = t.query;
      } else {
        if (t.path) {
          if ("/" === t.path.charAt(0)) {
            r.path = $(t.path);
          } else {
            if (void 0 === e.userinfo && void 0 === e.host && void 0 === e.port || e.path) {
              if (e.path) {
                r.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path;
              } else {
                r.path = t.path;
              }
            } else {
              r.path = "/" + t.path;
            }
            r.path = $(r.path);
          }
          r.query = t.query;
        } else {
          r.path = e.path;
          if (void 0 !== t.query) {
            r.query = t.query;
          } else {
            r.query = e.query;
          }
        }
        r.userinfo = e.userinfo;
        r.host = e.host;
        r.port = e.port;
      }
      r.scheme = e.scheme;
    }
    r.fragment = t.fragment;
    return r;
  }
  function q(e, t) {
    return e && e.toString().replace(t && t.iri ? a.PCT_ENCODED : s.PCT_ENCODED, A);
  }
  var z = {
    scheme: "http",
    domainHost: !0,
    parse: function (e, t) {
      if (e.host) {
        e.error = e.error || "HTTP URIs must have a host.";
      }
      return e;
    },
    serialize: function (e, t) {
      var n = "https" === String(e.scheme).toLowerCase();
      if (e.port !== (n ? 443 : 80) && "" !== e.port) {
        e.port = void 0;
      }
      if (e.path) {
        e.path = "/";
      }
      return e;
    }
  };
  var K = {
    scheme: "https",
    domainHost: z.domainHost,
    parse: z.parse,
    serialize: z.serialize
  };
  function G(e) {
    return "boolean" == typeof e.secure ? e.secure : "wss" === String(e.scheme).toLowerCase();
  }
  var W = {
    scheme: "ws",
    domainHost: !0,
    parse: function (e, t) {
      var n = e;
      n.secure = G(n);
      n.resourceName = (n.path || "/") + (n.query ? "?" + n.query : "");
      n.path = void 0;
      n.query = void 0;
      return n;
    },
    serialize: function (e, t) {
      if (e.port !== (G(e) ? 443 : 80) && "" !== e.port) {
        e.port = void 0;
      }
      if ("boolean" == typeof e.secure) {
        e.scheme = e.secure ? "wss" : "ws";
        e.secure = void 0;
      }
      if (e.resourceName) {
        var n = e.resourceName.split("?"),
          r = c(n, 2),
          i = r[0],
          o = r[1];
        e.path = i && "/" !== i ? i : void 0, e.query = o, e.resourceName = void 0;
      }
      e.fragment = void 0;
      return e;
    }
  };
  var Q = {
    scheme: "wss",
    domainHost: W.domainHost,
    parse: W.parse,
    serialize: W.serialize
  };
  var Z = {};
  var X = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]";
  var Y = "[0-9A-Fa-f]";
  var J = n(n("%[EFef]" + Y + "%" + Y + Y + "%" + Y + Y) + "|" + n("%[89A-Fa-f]" + Y + "%" + Y + Y) + "|" + n("%" + Y + Y));
  var ee = t("[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", '[\\"\\\\]');
  var te = new RegExp(X, "g");
  var ne = new RegExp(J, "g");
  var re = new RegExp(t("[^]", "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", "[\\.]", '[\\"]', ee), "g");
  var ie = new RegExp(t("[^]", X, "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"), "g");
  var oe = ie;
  function se(e) {
    var t = A(e);
    return t.match(te) ? t : e;
  }
  var ae = {
    scheme: "mailto",
    parse: function (e, t) {
      var n = e;
      var r = n.to = n.path ? n.path.split(",") : [];
      n.path = void 0;
      if (n.query) {
        for (var i = !1, o = {}, s = n.query.split("&"), a = 0, c = s.length; a < c; ++a) {
          var l = s[a].split("=");
          switch (l[0]) {
            case "to":
              for (var u = l[1].split(","), p = 0, d = u.length; p < d; ++p) r.push(u[p]);
              break;
            case "subject":
              n.subject = q(l[1], t);
              break;
            case "body":
              n.body = q(l[1], t);
              break;
            default:
              i = !0, o[q(l[0], t)] = q(l[1], t);
          }
        }
        i && (n.headers = o);
      }
      n.query = void 0;
      for (h = 0, f = r.length, void 0; h < f; ++h) {
        var h;
        var f;
        var m = r[h].split("@");
        m[0] = q(m[0]);
        if (t.unicodeSupport) m[1] = q(m[1], t).toLowerCase();else try {
          m[1] = S(q(m[1], t).toLowerCase());
        } catch (e) {
          n.error = n.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
        }
        r[h] = m.join("@");
      }
      return n;
    },
    serialize: function (e, t) {
      var n;
      var r = e;
      var o = null != (n = e.to) ? n instanceof Array ? n : "number" != typeof n.length || n.split || n.setInterval || n.call ? [n] : Array.prototype.slice.call(n) : [];
      if (o) {
        for (s = 0, a = o.length, void 0; s < a; ++s) {
          var s;
          var a;
          var c = String(o[s]);
          var l = c.lastIndexOf("@");
          var u = c.slice(0, l).replace(ne, se).replace(ne, i).replace(re, I);
          var p = c.slice(l + 1);
          try {
            p = t.iri ? x(p) : S(q(p, t).toLowerCase());
          } catch (e) {
            r.error = r.error || "Email address's domain name can not be converted to " + (t.iri ? "Unicode" : "ASCII") + " via punycode: " + e;
          }
          o[s] = u + "@" + p;
        }
        r.path = o.join(",");
      }
      var d = e.headers = e.headers || {};
      if (e.subject) {
        d.subject = e.subject;
      }
      if (e.body) {
        d.body = e.body;
      }
      var h = [];
      for (var f in d) if (d[f] !== Z[f]) {
        h.push(f.replace(ne, se).replace(ne, i).replace(ie, I) + "=" + d[f].replace(ne, se).replace(ne, i).replace(oe, I));
      }
      if (h.length) {
        r.query = h.join("&");
      }
      return r;
    }
  };
  var ce = /^([^\:]+)\:(.*)/;
  var le = {
    scheme: "urn",
    parse: function (e, t) {
      var n = e.path && e.path.match(ce);
      var r = e;
      if (n) {
        var i = t.scheme || r.scheme || "urn";
        var o = n[1].toLowerCase();
        var s = n[2];
        var a = i + ":" + (t.nid || o);
        var c = C[a];
        r.nid = o;
        r.nss = s;
        r.path = void 0;
        if (c) {
          r = c.parse(r, t);
        }
      } else r.error = r.error || "URN can not be parsed.";
      return r;
    },
    serialize: function (e, t) {
      var n = t.scheme || e.scheme || "urn";
      var r = e.nid;
      var i = n + ":" + (t.nid || r);
      var o = C[i];
      if (o) {
        e = o.serialize(e, t);
      }
      var s = e;
      var a = e.nss;
      s.path = (r || t.nid) + ":" + a;
      return s;
    }
  };
  var ue = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
  var pe = {
    scheme: "urn:uuid",
    parse: function (e, t) {
      var n = e;
      n.uuid = n.nss;
      n.nss = void 0;
      if (t.tolerant || n.uuid && n.uuid.match(ue)) {
        n.error = n.error || "UUID is not valid.";
      }
      return n;
    },
    serialize: function (e, t) {
      var n = e;
      n.nss = (e.uuid || "").toLowerCase();
      return n;
    }
  };
  C[z.scheme] = z;
  C[K.scheme] = K;
  C[W.scheme] = W;
  C[Q.scheme] = Q;
  C[ae.scheme] = ae;
  C[le.scheme] = le;
  C[pe.scheme] = pe;
  e.SCHEMES = C;
  e.pctEncChar = I;
  e.pctDecChars = A;
  e.parse = L;
  e.removeDotSegments = $;
  e.serialize = V;
  e.resolveComponents = H;
  e.resolve = function (e, t, n) {
    var r = function (e, t) {
      var n = e;
      if (t) for (var r in t) n[r] = t[r];
      return n;
    }({
      scheme: "null"
    }, n);
    return V(H(L(e, r), L(t, r), r, !0), r);
  };
  e.normalize = function (e, t) {
    if ("string" == typeof e) {
      e = V(L(e, t), t);
    } else {
      if ("object" === r(e)) {
        e = L(V(e, t), t);
      }
    }
    return e;
  };
  e.equal = function (e, t, n) {
    if ("string" == typeof e) {
      e = V(L(e, n), n);
    } else {
      if ("object" === r(e)) {
        e = V(e, n);
      }
    }
    if ("string" == typeof t) {
      t = V(L(t, n), n);
    } else {
      if ("object" === r(t)) {
        t = V(t, n);
      }
    }
    return e === t;
  };
  e.escapeComponent = function (e, t) {
    return e && e.toString().replace(t && t.iri ? a.ESCAPE : s.ESCAPE, I);
  };
  e.unescapeComponent = q;
  Object.defineProperty(e, "__esModule", {
    value: !0
  });
}(exports);