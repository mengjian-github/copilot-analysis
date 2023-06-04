var r;
require.r(exports);
require.d(exports, {
  URI: () => i,
  Utils: () => o
});
(() => {
  var e = {
    470: e => {
      function t(e) {
        if ("string" != typeof e) throw new TypeError("Path must be a string. Received " + JSON.stringify(e));
      }
      function n(e, t) {
        for (r = "", i = 0, o = -1, s = 0, a = 0, void 0; a <= e.length; ++a) {
          var n;
          var r;
          var i;
          var o;
          var s;
          var a;
          if (a < e.length) n = e.charCodeAt(a);else {
            if (47 === n) break;
            n = 47;
          }
          if (47 === n) {
            if (o === a - 1 || 1 === s) ;else if (o !== a - 1 && 2 === s) {
              if (r.length < 2 || 2 !== i || 46 !== r.charCodeAt(r.length - 1) || 46 !== r.charCodeAt(r.length - 2)) if (r.length > 2) {
                var c = r.lastIndexOf("/");
                if (c !== r.length - 1) {
                  if (-1 === c) {
                    r = "";
                    i = 0;
                  } else {
                    i = (r = r.slice(0, c)).length - 1 - r.lastIndexOf("/");
                  }
                  o = a;
                  s = 0;
                  continue;
                }
              } else if (2 === r.length || 1 === r.length) {
                r = "";
                i = 0;
                o = a;
                s = 0;
                continue;
              }
              if (t) {
                if (r.length > 0) {
                  r += "/..";
                } else {
                  r = "..";
                }
                i = 2;
              }
            } else {
              if (r.length > 0) {
                r += "/" + e.slice(o + 1, a);
              } else {
                r = e.slice(o + 1, a);
              }
              i = a - o - 1;
            }
            o = a;
            s = 0;
          } else if (46 === n && -1 !== s) {
            ++s;
          } else {
            s = -1;
          }
        }
        return r;
      }
      var r = {
        resolve: function () {
          for (r = "", i = !1, o = arguments.length - 1, void 0; o >= -1 && !i; o--) {
            var e;
            var r;
            var i;
            var o;
            var s;
            if (o >= 0) {
              s = arguments[o];
            } else {
              if (void 0 === e) {
                e = process.cwd();
              }
              s = e;
            }
            t(s);
            if (0 !== s.length) {
              r = s + "/" + r;
              i = 47 === s.charCodeAt(0);
            }
          }
          r = n(r, !i);
          return i ? r.length > 0 ? "/" + r : "/" : r.length > 0 ? r : ".";
        },
        normalize: function (e) {
          t(e);
          if (0 === e.length) return ".";
          var r = 47 === e.charCodeAt(0);
          var i = 47 === e.charCodeAt(e.length - 1);
          if (0 !== (e = n(e, !r)).length || r) {
            e = ".";
          }
          if (e.length > 0 && i) {
            e += "/";
          }
          return r ? "/" + e : e;
        },
        isAbsolute: function (e) {
          t(e);
          return e.length > 0 && 47 === e.charCodeAt(0);
        },
        join: function () {
          if (0 === arguments.length) return ".";
          for (n = 0, void 0; n < arguments.length; ++n) {
            var e;
            var n;
            var i = arguments[n];
            t(i);
            if (i.length > 0) {
              if (void 0 === e) {
                e = i;
              } else {
                e += "/" + i;
              }
            }
          }
          return void 0 === e ? "." : r.normalize(e);
        },
        relative: function (e, n) {
          t(e);
          t(n);
          if (e === n) return "";
          if ((e = r.resolve(e)) === (n = r.resolve(n))) return "";
          for (var i = 1; i < e.length && 47 === e.charCodeAt(i); ++i);
          for (o = e.length, s = o - i, a = 1, void 0; a < n.length && 47 === n.charCodeAt(a); ++a) {
            var o;
            var s;
            var a;
            ;
          }
          for (c = n.length - a, l = s < c ? s : c, u = -1, p = 0, void 0; p <= l; ++p) {
            var c;
            var l;
            var u;
            var p;
            if (p === l) {
              if (c > l) {
                if (47 === n.charCodeAt(a + p)) return n.slice(a + p + 1);
                if (0 === p) return n.slice(a + p);
              } else if (s > l) {
                if (47 === e.charCodeAt(i + p)) {
                  u = p;
                } else {
                  if (0 === p) {
                    u = 0;
                  }
                }
              }
              break;
            }
            var d = e.charCodeAt(i + p);
            if (d !== n.charCodeAt(a + p)) break;
            if (47 === d) {
              u = p;
            }
          }
          var h = "";
          for (p = i + u + 1; p <= o; ++p) if (p !== o && 47 !== e.charCodeAt(p)) {
            if (0 === h.length) {
              h += "..";
            } else {
              h += "/..";
            }
          }
          return h.length > 0 ? h + n.slice(a + u) : (a += u, 47 === n.charCodeAt(a) && ++a, n.slice(a));
        },
        _makeLong: function (e) {
          return e;
        },
        dirname: function (e) {
          t(e);
          if (0 === e.length) return ".";
          for (n = e.charCodeAt(0), r = 47 === n, i = -1, o = !0, s = e.length - 1, void 0; s >= 1; --s) {
            var n;
            var r;
            var i;
            var o;
            var s;
            if (47 === (n = e.charCodeAt(s))) {
              if (!o) {
                i = s;
                break;
              }
            } else o = !1;
          }
          return -1 === i ? r ? "/" : "." : r && 1 === i ? "//" : e.slice(0, i);
        },
        basename: function (e, n) {
          if (void 0 !== n && "string" != typeof n) throw new TypeError('"ext" argument must be a string');
          t(e);
          var r;
          var i = 0;
          var o = -1;
          var s = !0;
          if (void 0 !== n && n.length > 0 && n.length <= e.length) {
            if (n.length === e.length && n === e) return "";
            var a = n.length - 1;
            var c = -1;
            for (r = e.length - 1; r >= 0; --r) {
              var l = e.charCodeAt(r);
              if (47 === l) {
                if (!s) {
                  i = r + 1;
                  break;
                }
              } else {
                if (-1 === c) {
                  s = !1;
                  c = r + 1;
                }
                if (a >= 0) {
                  if (l === n.charCodeAt(a)) {
                    if (-1 == --a) {
                      o = r;
                    }
                  } else {
                    a = -1;
                    o = c;
                  }
                }
              }
            }
            if (i === o) {
              o = c;
            } else {
              if (-1 === o) {
                o = e.length;
              }
            }
            return e.slice(i, o);
          }
          for (r = e.length - 1; r >= 0; --r) if (47 === e.charCodeAt(r)) {
            if (!s) {
              i = r + 1;
              break;
            }
          } else if (-1 === o) {
            s = !1;
            o = r + 1;
          }
          return -1 === o ? "" : e.slice(i, o);
        },
        extname: function (e) {
          t(e);
          for (n = -1, r = 0, i = -1, o = !0, s = 0, a = e.length - 1, void 0; a >= 0; --a) {
            var n;
            var r;
            var i;
            var o;
            var s;
            var a;
            var c = e.charCodeAt(a);
            if (47 !== c) {
              if (-1 === i) {
                o = !1;
                i = a + 1;
              }
              if (46 === c) {
                if (-1 === n) {
                  n = a;
                } else {
                  if (1 !== s) {
                    s = 1;
                  }
                }
              } else {
                if (-1 !== n) {
                  s = -1;
                }
              }
            } else if (!o) {
              r = a + 1;
              break;
            }
          }
          return -1 === n || -1 === i || 0 === s || 1 === s && n === i - 1 && n === r + 1 ? "" : e.slice(n, i);
        },
        format: function (e) {
          if (null === e || "object" != typeof e) throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
          return function (e, t) {
            var n = t.dir || t.root;
            var r = t.base || (t.name || "") + (t.ext || "");
            return n ? n === t.root ? n + r : n + "/" + r : r;
          }(0, e);
        },
        parse: function (e) {
          t(e);
          var n = {
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: ""
          };
          if (0 === e.length) return n;
          var r;
          var i = e.charCodeAt(0);
          var o = 47 === i;
          if (o) {
            n.root = "/";
            r = 1;
          } else {
            r = 0;
          }
          for (s = -1, a = 0, c = -1, l = !0, u = e.length - 1, p = 0, void 0; u >= r; --u) {
            var s;
            var a;
            var c;
            var l;
            var u;
            var p;
            if (47 !== (i = e.charCodeAt(u))) {
              if (-1 === c) {
                l = !1;
                c = u + 1;
              }
              if (46 === i) {
                if (-1 === s) {
                  s = u;
                } else {
                  if (1 !== p) {
                    p = 1;
                  }
                }
              } else {
                if (-1 !== s) {
                  p = -1;
                }
              }
            } else if (!l) {
              a = u + 1;
              break;
            }
          }
          if (-1 === s || -1 === c || 0 === p || 1 === p && s === c - 1 && s === a + 1) {
            if (-1 !== c) {
              n.base = n.name = 0 === a && o ? e.slice(1, c) : e.slice(a, c);
            }
          } else {
            if (0 === a && o) {
              n.name = e.slice(1, s);
              n.base = e.slice(1, c);
            } else {
              n.name = e.slice(a, s);
              n.base = e.slice(a, c);
            }
            n.ext = e.slice(s, c);
          }
          if (a > 0) {
            n.dir = e.slice(0, a - 1);
          } else {
            if (o) {
              n.dir = "/";
            }
          }
          return n;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
      };
      r.posix = r;
      e.exports = r;
    }
  };
  var t = {};
  function n(r) {
    var i = t[r];
    if (void 0 !== i) return i.exports;
    var o = t[r] = {
      exports: {}
    };
    e[r](o, o.exports, n);
    return o.exports;
  }
  n.d = (e, t) => {
    for (var r in t) if (n.o(t, r) && !n.o(e, r)) {
      Object.defineProperty(e, r, {
        enumerable: !0,
        get: t[r]
      });
    }
  };
  n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  n.r = e => {
    if ("undefined" != typeof Symbol && Symbol.toStringTag) {
      Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
  };
  var i = {};
  (() => {
    var e;
    n.r(i);
    n.d(i, {
      URI: () => f,
      Utils: () => x
    });
    if ("object" == typeof process) e = "win32" === process.platform;else if ("object" == typeof navigator) {
      var t = navigator.userAgent;
      e = t.indexOf("Windows") >= 0;
    }
    var r;
    var o;
    var s = (r = function (e, t) {
      r = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (e, t) {
        e.__proto__ = t;
      } || function (e, t) {
        for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
          e[n] = t[n];
        }
      };
      return r(e, t);
    }, function (e, t) {
      if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
      function n() {
        this.constructor = e;
      }
      r(e, t);
      e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
    });
    var a = /^\w[\w\d+.-]*$/;
    var c = /^\//;
    var l = /^\/\//;
    function u(e, t) {
      if (!e.scheme && t) throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'.concat(e.authority, '", path: "').concat(e.path, '", query: "').concat(e.query, '", fragment: "').concat(e.fragment, '"}'));
      if (e.scheme && !a.test(e.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
      if (e.path) if (e.authority) {
        if (!c.test(e.path)) throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
      } else if (l.test(e.path)) throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
    }
    var p = "";
    var d = "/";
    var h = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    var f = function () {
      function t(e, t, n, r, i, o) {
        if (void 0 === o) {
          o = !1;
        }
        if ("object" == typeof e) {
          this.scheme = e.scheme || p;
          this.authority = e.authority || p;
          this.path = e.path || p;
          this.query = e.query || p;
          this.fragment = e.fragment || p;
        } else {
          this.scheme = function (e, t) {
            return e || t ? e : "file";
          }(e, o);
          this.authority = t || p;
          this.path = function (e, t) {
            switch (e) {
              case "https":
              case "http":
              case "file":
                if (t) {
                  if (t[0] !== d) {
                    t = d + t;
                  }
                } else {
                  t = d;
                }
            }
            return t;
          }(this.scheme, n || p);
          this.query = r || p;
          this.fragment = i || p;
          u(this, o);
        }
      }
      t.isUri = function (e) {
        return e instanceof t || !!e && "string" == typeof e.authority && "string" == typeof e.fragment && "string" == typeof e.path && "string" == typeof e.query && "string" == typeof e.scheme && "string" == typeof e.fsPath && "function" == typeof e.with && "function" == typeof e.toString;
      };
      Object.defineProperty(t.prototype, "fsPath", {
        get: function () {
          return b(this, !1);
        },
        enumerable: !1,
        configurable: !0
      });
      t.prototype.with = function (e) {
        if (!e) return this;
        var t = e.scheme;
        var n = e.authority;
        var r = e.path;
        var i = e.query;
        var o = e.fragment;
        if (void 0 === t) {
          t = this.scheme;
        } else {
          if (null === t) {
            t = p;
          }
        }
        if (void 0 === n) {
          n = this.authority;
        } else {
          if (null === n) {
            n = p;
          }
        }
        if (void 0 === r) {
          r = this.path;
        } else {
          if (null === r) {
            r = p;
          }
        }
        if (void 0 === i) {
          i = this.query;
        } else {
          if (null === i) {
            i = p;
          }
        }
        if (void 0 === o) {
          o = this.fragment;
        } else {
          if (null === o) {
            o = p;
          }
        }
        return t === this.scheme && n === this.authority && r === this.path && i === this.query && o === this.fragment ? this : new g(t, n, r, i, o);
      };
      t.parse = function (e, t) {
        if (void 0 === t) {
          t = !1;
        }
        var n = h.exec(e);
        return n ? new g(n[2] || p, S(n[4] || p), S(n[5] || p), S(n[7] || p), S(n[9] || p), t) : new g(p, p, p, p, p);
      };
      t.file = function (t) {
        var n = p;
        if (e) {
          t = t.replace(/\\/g, d);
        }
        if (t[0] === d && t[1] === d) {
          var r = t.indexOf(d, 2);
          -1 === r ? (n = t.substring(2), t = d) : (n = t.substring(2, r), t = t.substring(r) || d);
        }
        return new g("file", n, t, p, p);
      };
      t.from = function (e) {
        var t = new g(e.scheme, e.authority, e.path, e.query, e.fragment);
        u(t, !0);
        return t;
      };
      t.prototype.toString = function (e) {
        if (void 0 === e) {
          e = !1;
        }
        return E(this, e);
      };
      t.prototype.toJSON = function () {
        return this;
      };
      t.revive = function (e) {
        if (e) {
          if (e instanceof t) return e;
          var n = new g(e);
          n._formatted = e.external;
          n._fsPath = e._sep === m ? e.fsPath : null;
          return n;
        }
        return e;
      };
      return t;
    }();
    var m = e ? 1 : void 0;
    var g = function (e) {
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t._formatted = null;
        t._fsPath = null;
        return t;
      }
      s(t, e);
      Object.defineProperty(t.prototype, "fsPath", {
        get: function () {
          if (this._fsPath) {
            this._fsPath = b(this, !1);
          }
          return this._fsPath;
        },
        enumerable: !1,
        configurable: !0
      });
      t.prototype.toString = function (e) {
        if (void 0 === e) {
          e = !1;
        }
        return e ? E(this, !0) : (this._formatted || (this._formatted = E(this, !1)), this._formatted);
      };
      t.prototype.toJSON = function () {
        var e = {
          $mid: 1
        };
        if (this._fsPath) {
          e.fsPath = this._fsPath;
          e._sep = m;
        }
        if (this._formatted) {
          e.external = this._formatted;
        }
        if (this.path) {
          e.path = this.path;
        }
        if (this.scheme) {
          e.scheme = this.scheme;
        }
        if (this.authority) {
          e.authority = this.authority;
        }
        if (this.query) {
          e.query = this.query;
        }
        if (this.fragment) {
          e.fragment = this.fragment;
        }
        return e;
      };
      return t;
    }(f);
    var y = ((o = {})[58] = "%3A", o[47] = "%2F", o[63] = "%3F", o[35] = "%23", o[91] = "%5B", o[93] = "%5D", o[64] = "%40", o[33] = "%21", o[36] = "%24", o[38] = "%26", o[39] = "%27", o[40] = "%28", o[41] = "%29", o[42] = "%2A", o[43] = "%2B", o[44] = "%2C", o[59] = "%3B", o[61] = "%3D", o[32] = "%20", o);
    function _(e, t, n) {
      for (r = void 0, i = -1, o = 0, void 0; o < e.length; o++) {
        var r;
        var i;
        var o;
        var s = e.charCodeAt(o);
        if (s >= 97 && s <= 122 || s >= 65 && s <= 90 || s >= 48 && s <= 57 || 45 === s || 46 === s || 95 === s || 126 === s || t && 47 === s || n && 91 === s || n && 93 === s || n && 58 === s) {
          if (-1 !== i) {
            r += encodeURIComponent(e.substring(i, o));
            i = -1;
          }
          if (void 0 !== r) {
            r += e.charAt(o);
          }
        } else {
          if (void 0 === r) {
            r = e.substr(0, o);
          }
          var a = y[s];
          if (void 0 !== a) {
            if (-1 !== i) {
              r += encodeURIComponent(e.substring(i, o));
              i = -1;
            }
            r += a;
          } else {
            if (-1 === i) {
              i = o;
            }
          }
        }
      }
      if (-1 !== i) {
        r += encodeURIComponent(e.substring(i));
      }
      return void 0 !== r ? r : e;
    }
    function v(e) {
      for (t = void 0, n = 0, void 0; n < e.length; n++) {
        var t;
        var n;
        var r = e.charCodeAt(n);
        if (35 === r || 63 === r) {
          if (void 0 === t) {
            t = e.substr(0, n);
          }
          t += y[r];
        } else {
          if (void 0 !== t) {
            t += e[n];
          }
        }
      }
      return void 0 !== t ? t : e;
    }
    function b(t, n) {
      var r;
      r = t.authority && t.path.length > 1 && "file" === t.scheme ? "//".concat(t.authority).concat(t.path) : 47 === t.path.charCodeAt(0) && (t.path.charCodeAt(1) >= 65 && t.path.charCodeAt(1) <= 90 || t.path.charCodeAt(1) >= 97 && t.path.charCodeAt(1) <= 122) && 58 === t.path.charCodeAt(2) ? n ? t.path.substr(1) : t.path[1].toLowerCase() + t.path.substr(2) : t.path;
      if (e) {
        r = r.replace(/\//g, "\\");
      }
      return r;
    }
    function E(e, t) {
      var n = t ? v : _;
      var r = "";
      var i = e.scheme;
      var o = e.authority;
      var s = e.path;
      var a = e.query;
      var c = e.fragment;
      if (i) {
        r += i;
        r += ":";
      }
      if (o || "file" === i) {
        r += d;
        r += d;
      }
      if (o) {
        var l = o.indexOf("@");
        if (-1 !== l) {
          var u = o.substr(0, l);
          o = o.substr(l + 1), -1 === (l = u.lastIndexOf(":")) ? r += n(u, !1, !1) : (r += n(u.substr(0, l), !1, !1), r += ":", r += n(u.substr(l + 1), !1, !0)), r += "@";
        }
        -1 === (l = (o = o.toLowerCase()).lastIndexOf(":")) ? r += n(o, !1, !0) : (r += n(o.substr(0, l), !1, !0), r += o.substr(l));
      }
      if (s) {
        if (s.length >= 3 && 47 === s.charCodeAt(0) && 58 === s.charCodeAt(2)) {
          if ((p = s.charCodeAt(1)) >= 65 && p <= 90) {
            s = "/".concat(String.fromCharCode(p + 32), ":").concat(s.substr(3));
          }
        } else if (s.length >= 2 && 58 === s.charCodeAt(1)) {
          var p;
          if ((p = s.charCodeAt(0)) >= 65 && p <= 90) {
            s = "".concat(String.fromCharCode(p + 32), ":").concat(s.substr(2));
          }
        }
        r += n(s, !0, !1);
      }
      if (a) {
        r += "?";
        r += n(a, !1, !1);
      }
      if (c) {
        r += "#";
        r += t ? c : _(c, !1, !1);
      }
      return r;
    }
    function w(e) {
      try {
        return decodeURIComponent(e);
      } catch (t) {
        return e.length > 3 ? e.substr(0, 3) + w(e.substr(3)) : e;
      }
    }
    var T = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
    function S(e) {
      return e.match(T) ? e.replace(T, function (e) {
        return w(e);
      }) : e;
    }
    var x;
    var C = n(470);
    var I = function (e, t, n) {
      if (n || 2 === arguments.length) for (i = 0, o = t.length, void 0; i < o; i++) {
        var r;
        var i;
        var o;
        if (!r && i in t) {
          if (r) {
            r = Array.prototype.slice.call(t, 0, i);
          }
          r[i] = t[i];
        }
      }
      return e.concat(r || Array.prototype.slice.call(t));
    };
    var A = C.posix || C;
    var k = "/";
    !function (e) {
      e.joinPath = function (e) {
        for (t = [], n = 1, void 0; n < arguments.length; n++) {
          var t;
          var n;
          t[n - 1] = arguments[n];
        }
        return e.with({
          path: A.join.apply(A, I([e.path], t, !1))
        });
      };
      e.resolvePath = function (e) {
        for (t = [], n = 1, void 0; n < arguments.length; n++) {
          var t;
          var n;
          t[n - 1] = arguments[n];
        }
        var r = e.path;
        var i = !1;
        if (r[0] !== k) {
          r = k + r;
          i = !0;
        }
        var o = A.resolve.apply(A, I([r], t, !1));
        if (i && o[0] === k && !e.authority) {
          o = o.substring(1);
        }
        return e.with({
          path: o
        });
      };
      e.dirname = function (e) {
        if (0 === e.path.length || e.path === k) return e;
        var t = A.dirname(e.path);
        if (1 === t.length && 46 === t.charCodeAt(0)) {
          t = "";
        }
        return e.with({
          path: t
        });
      };
      e.basename = function (e) {
        return A.basename(e.path);
      };
      e.extname = function (e) {
        return A.extname(e.path);
      };
    }(x || (x = {}));
  })();
  r = i;
})();
const {
  URI: i,
  Utils: o
} = r;