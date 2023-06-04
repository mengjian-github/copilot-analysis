if (process.addAsyncListener) throw new Error("Don't require polyfill unless needed");
var r = require(76372);
var i = require(42249);
var o = r.wrap;
var s = r.massWrap;
var a = require(89090);
var c = require(73837);
var l = i.gte(process.version, "6.0.0");
var u = i.gte(process.version, "7.0.0");
var p = i.gte(process.version, "8.0.0");
var d = i.gte(process.version, "11.0.0");
var h = require(41808);
function f(e) {
  return function () {
    this.on("connection", function (e) {
      if (e._handle) {
        e._handle.onread = a(e._handle.onread);
      }
    });
    try {
      return e.apply(this, arguments);
    } finally {
      if (this._handle && this._handle.onconnection) {
        this._handle.onconnection = a(this._handle.onconnection);
      }
    }
  };
}
function m(e) {
  if (e && e._handle) {
    var t = e._handle;
    if (t._originalOnread) {
      t._originalOnread = t.onread;
    }
    t.onread = a(t._originalOnread);
  }
}
if (u && !h._normalizeArgs) {
  h._normalizeArgs = function (e) {
    if (0 === e.length) return [{}, null];
    var t;
    var n;
    var r = e[0];
    var i = {};
    if ("object" == typeof r && null !== r) {
      i = r;
    } else {
      if ("string" == typeof (t = r) && !1 === (n = t, (n = Number(n)) >= 0 && n)) {
        i.path = r;
      } else {
        i.port = r;
        if (e.length > 1 && "string" == typeof e[1]) {
          i.host = e[1];
        }
      }
    }
    var o = e[e.length - 1];
    return "function" != typeof o ? [i, null] : [i, o];
  };
} else {
  if (u || h._normalizeConnectArgs) {
    h._normalizeConnectArgs = function (e) {
      var t;
      var n = {};
      if ("object" == typeof e[0] && null !== e[0]) {
        n = e[0];
      } else {
        if ("string" == typeof e[0] && !1 === (t = e[0], (t = Number(t)) >= 0 && t)) {
          n.path = e[0];
        } else {
          n.port = e[0];
          if ("string" == typeof e[1]) {
            n.host = e[1];
          }
        }
      }
      var r = e[e.length - 1];
      return "function" == typeof r ? [n, r] : [n];
    };
  }
}
if ("_setUpListenHandle" in h.Server.prototype) {
  o(h.Server.prototype, "_setUpListenHandle", f);
} else {
  o(h.Server.prototype, "_listen2", f);
}
o(h.Socket.prototype, "connect", function (e) {
  return function () {
    var t;
    if ((t = p && Array.isArray(arguments[0]) && Object.getOwnPropertySymbols(arguments[0]).length > 0 ? arguments[0] : u ? h._normalizeArgs(arguments) : h._normalizeConnectArgs(arguments))[1]) {
      t[1] = a(t[1]);
    }
    var n = e.apply(this, t);
    m(this);
    return n;
  };
});
var g = require(13685);
o(g.Agent.prototype, "addRequest", function (e) {
  return function (t) {
    var n = t.onSocket;
    t.onSocket = a(function (e) {
      m(e);
      return n.apply(this, arguments);
    });
    return e.apply(this, arguments);
  };
});
var y = require(32081);
function _(e) {
  if (Array.isArray(e.stdio)) {
    e.stdio.forEach(function (e) {
      if (e && e._handle) {
        e._handle.onread = a(e._handle.onread);
        o(e._handle, "close", O);
      }
    });
  }
  if (e._handle) {
    e._handle.onexit = a(e._handle.onexit);
  }
}
if (y.ChildProcess) {
  o(y.ChildProcess.prototype, "spawn", function (e) {
    return function () {
      var t = e.apply(this, arguments);
      _(this);
      return t;
    };
  });
} else {
  s(y, ["execFile", "fork", "spawn"], function (e) {
    return function () {
      var t = e.apply(this, arguments);
      _(t);
      return t;
    };
  });
}
if (process._fatalException) {
  process._originalNextTick = process.nextTick;
}
var v = [];
if (process._nextDomainTick) {
  v.push("_nextDomainTick");
}
if (process._tickDomainCallback) {
  v.push("_tickDomainCallback");
}
s(process, v, N);
o(process, "nextTick", O);
var b = ["setTimeout", "setInterval"];
if (global.setImmediate) {
  b.push("setImmediate");
}
var E = require(39512);
var w = global.setTimeout === E.setTimeout;
s(E, b, O);
if (w) {
  s(global, b, O);
}
var T = require(9523);
s(T, ["lookup", "resolve", "resolve4", "resolve6", "resolveCname", "resolveMx", "resolveNs", "resolveTxt", "resolveSrv", "reverse"], N);
if (T.resolveNaptr) {
  o(T, "resolveNaptr", N);
}
var S;
var x;
var C = require(57147);
s(C, ["watch", "rename", "truncate", "chown", "fchown", "chmod", "fchmod", "stat", "lstat", "fstat", "link", "symlink", "readlink", "realpath", "unlink", "rmdir", "mkdir", "readdir", "close", "open", "utimes", "futimes", "fsync", "write", "read", "readFile", "writeFile", "appendFile", "watchFile", "unwatchFile", "exists"], N);
if (C.lchown) {
  o(C, "lchown", N);
}
if (C.lchmod) {
  o(C, "lchmod", N);
}
if (C.ftruncate) {
  o(C, "ftruncate", N);
}
try {
  S = require(59796);
} catch (e) {}
if (S && S.Deflate && S.Deflate.prototype) {
  var I = Object.getPrototypeOf(S.Deflate.prototype);
  if (I._transform) {
    o(I, "_transform", N);
  } else {
    if (I.write && I.flush && I.end) {
      s(I, ["write", "flush", "end"], N);
    }
  }
}
try {
  x = require(6113);
} catch (e) {}
if (x) {
  var A = ["pbkdf2", "randomBytes"];
  if (d) {
    A.push("pseudoRandomBytes");
  }
  s(x, A, N);
}
var k = !!global.Promise && "function Promise() { [native code] }" === Promise.toString() && "function toString() { [native code] }" === Promise.toString.toString();
if (k) {
  var P = process.addAsyncListener({
    create: function () {
      k = !1;
    }
  });
  global.Promise.resolve(!0).then(function () {
    k = !1;
  });
  process.removeAsyncListener(P);
}
function N(e) {
  var t = function () {
    var t;
    var n = arguments.length - 1;
    if ("function" == typeof arguments[n]) {
      t = Array(arguments.length);
      for (var r = 0; r < arguments.length - 1; r++) t[r] = arguments[r];
      t[n] = a(arguments[n]);
    }
    return e.apply(this, t || arguments);
  };
  switch (e.length) {
    case 1:
      return function (n) {
        return 1 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n));
      };
    case 2:
      return function (n, r) {
        return 2 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof r && (r = a(r)), e.call(this, n, r));
      };
    case 3:
      return function (n, r, i) {
        return 3 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof i && (i = a(i)), e.call(this, n, r, i));
      };
    case 4:
      return function (n, r, i, o) {
        return 4 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof o && (o = a(o)), e.call(this, n, r, i, o));
      };
    case 5:
      return function (n, r, i, o, s) {
        return 5 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof s && (s = a(s)), e.call(this, n, r, i, o, s));
      };
    case 6:
      return function (n, r, i, o, s, c) {
        return 6 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof c && (c = a(c)), e.call(this, n, r, i, o, s, c));
      };
    default:
      return t;
  }
}
function O(e) {
  var t = function () {
    var t;
    if ("function" == typeof arguments[0]) {
      (t = Array(arguments.length))[0] = a(arguments[0]);
      for (var n = 1; n < arguments.length; n++) t[n] = arguments[n];
    }
    return e.apply(this, t || arguments);
  };
  switch (e.length) {
    case 1:
      return function (n) {
        return 1 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n));
      };
    case 2:
      return function (n, r) {
        return 2 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r));
      };
    case 3:
      return function (n, r, i) {
        return 3 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, i));
      };
    case 4:
      return function (n, r, i, o) {
        return 4 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, i, o));
      };
    case 5:
      return function (n, r, i, o, s) {
        return 5 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, i, o, s));
      };
    case 6:
      return function (n, r, i, o, s, c) {
        return 6 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, i, o, s, c));
      };
    default:
      return t;
  }
}
if (k) {
  (function () {
    var e = global.Promise;
    function t(n) {
      if (!(this instanceof t)) return e(n);
      if ("function" != typeof n) return new e(n);
      var i;
      var o;
      var s = new e(function (e, t) {
        i = this;
        o = [function (t) {
          r(s, !1);
          return e(t);
        }, function (e) {
          r(s, !1);
          return t(e);
        }];
      });
      s.__proto__ = t.prototype;
      try {
        n.apply(i, o);
      } catch (e) {
        o[1](e);
      }
      return s;
    }
    function r(e, t) {
      if (e.__asl_wrapper && !t) {
        e.__asl_wrapper = a(i);
      }
    }
    function i(t, n, o, s) {
      var a;
      try {
        return {
          returnVal: a = n.call(t, o),
          error: !1
        };
      } catch (e) {
        return {
          errorVal: e,
          error: !0
        };
      } finally {
        if (a instanceof e) {
          s.__asl_wrapper = function () {
            return (a.__asl_wrapper || i).apply(this, arguments);
          };
        } else {
          r(s, !0);
        }
      }
    }
    function s(e) {
      return function () {
        var t = this;
        var n = e.apply(t, Array.prototype.map.call(arguments, r));
        n.__asl_wrapper = function (e, r, o, s) {
          return t.__asl_wrapper ? (t.__asl_wrapper(e, function () {}, null, n), n.__asl_wrapper(e, r, o, s)) : i(e, r, o, s);
        };
        return n;
        function r(e) {
          return "function" != typeof e ? e : a(function (r) {
            var o = (t.__asl_wrapper || i)(this, e, r, n);
            if (o.error) throw o.errorVal;
            return o.returnVal;
          });
        }
      };
    }
    c.inherits(t, e);
    o(e.prototype, "then", s);
    if (e.prototype.chain) {
      o(e.prototype, "chain", s);
    }
    if (l) {
      global.Promise = require(68286)(e, r);
    } else {
      ["all", "race", "reject", "resolve", "accept", "defer"].forEach(function (n) {
        if ("function" == typeof e[n]) {
          t[n] = e[n];
        }
      });
      global.Promise = t;
    }
  })();
}