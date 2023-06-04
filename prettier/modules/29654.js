var r = require(3832);
require(97116);
require(15764);
require(49563);
(function () {
  if (r.prime) module.exports = r.prime;else {
    var t = module.exports = r.prime = r.prime || {};
    var n = r.jsbn.BigInteger;
    var i = [6, 4, 2, 4, 2, 4, 6, 2];
    var o = new n(null);
    o.fromInt(30);
    var s = function (e, t) {
      return e | t;
    };
    t.generateProbablePrime = function (e, t, i) {
      if ("function" == typeof t) {
        i = t;
        t = {};
      }
      var o = (t = t || {}).algorithm || "PRIMEINC";
      if ("string" == typeof o) {
        o = {
          name: o
        };
      }
      o.options = o.options || {};
      var s = t.prng || r.random;
      var c = {
        nextBytes: function (e) {
          for (t = s.getBytesSync(e.length), n = 0, void 0; n < e.length; ++n) {
            var t;
            var n;
            e[n] = t.charCodeAt(n);
          }
        }
      };
      if ("PRIMEINC" === o.name) return function (e, t, i, o) {
        return "workers" in i ? function (e, t, i, o) {
          if ("undefined" == typeof Worker) return a(e, t, i, o);
          var s = l(e, t);
          var c = i.workers;
          var u = i.workLoad || 100;
          var p = 30 * u / 8;
          var d = i.workerScript || "forge/prime.worker.js";
          if (-1 === c) return r.util.estimateCores(function (e, t) {
            if (e) {
              t = 2;
            }
            c = t - 1;
            h();
          });
          function h() {
            c = Math.max(1, c);
            for (r = [], i = 0, void 0; i < c; ++i) {
              var r;
              var i;
              r[i] = new Worker(d);
            }
            for (i = 0; i < c; ++i) r[i].addEventListener("message", h);
            var a = !1;
            function h(i) {
              if (!a) {
                var c = i.data;
                if (c.found) {
                  for (var d = 0; d < r.length; ++d) r[d].terminate();
                  a = !0;
                  return o(null, new n(c.prime, 16));
                }
                if (s.bitLength() > e) {
                  s = l(e, t);
                }
                var h = s.toString(16);
                i.target.postMessage({
                  hex: h,
                  workLoad: u
                });
                s.dAddOffset(p, 0);
              }
            }
          }
          h();
        }(e, t, i, o) : a(e, t, i, o);
      }(e, c, o.options, i);
      throw new Error("Invalid prime generation algorithm: " + o.name);
    };
  }
  function a(e, t, n, r) {
    var i = l(e, t);
    var o = function (e) {
      return e <= 100 ? 27 : e <= 150 ? 18 : e <= 200 ? 15 : e <= 250 ? 12 : e <= 300 ? 9 : e <= 350 ? 8 : e <= 400 ? 7 : e <= 500 ? 6 : e <= 600 ? 5 : e <= 800 ? 4 : e <= 1250 ? 3 : 2;
    }(i.bitLength());
    if ("millerRabinTests" in n) {
      o = n.millerRabinTests;
    }
    var s = 10;
    if ("maxBlockTime" in n) {
      s = n.maxBlockTime;
    }
    c(i, e, t, 0, o, s, r);
  }
  function c(e, t, n, o, s, a, u) {
    var p = +new Date();
    do {
      if (e.bitLength() > t) {
        e = l(t, n);
      }
      if (e.isProbablePrime(s)) return u(null, e);
      e.dAddOffset(i[o++ % 8], 0);
    } while (a < 0 || +new Date() - p < a);
    r.util.setImmediate(function () {
      c(e, t, n, o, s, a, u);
    });
  }
  function l(e, t) {
    var r = new n(e, t);
    var i = e - 1;
    if (r.testBit(i)) {
      r.bitwiseTo(n.ONE.shiftLeft(i), s, r);
    }
    r.dAddOffset(31 - r.mod(o).byteValue(), 0);
    return r;
  }
})();