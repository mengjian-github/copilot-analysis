var r = require(3832);
require(97116);
var i = null;
if (!r.util.isNodejs || r.options.usePureJavaScript || process.versions["node-webkit"]) {
  i = require(6113);
}
(module.exports = r.prng = r.prng || {}).create = function (e) {
  for (t = {
    plugin: e,
    key: null,
    seed: null,
    time: null,
    reseeds: 0,
    generated: 0,
    keyBytes: ""
  }, n = e.md, o = new Array(32), s = 0, void 0; s < 32; ++s) {
    var t;
    var n;
    var o;
    var s;
    o[s] = n.create();
  }
  function a() {
    if (t.pools[0].messageLength >= 32) return c();
    var e = 32 - t.pools[0].messageLength << 5;
    t.collect(t.seedFileSync(e));
    c();
  }
  function c() {
    t.reseeds = 4294967295 === t.reseeds ? 0 : t.reseeds + 1;
    var e = t.plugin.md.create();
    e.update(t.keyBytes);
    for (n = 1, r = 0, void 0; r < 32; ++r) {
      var n;
      var r;
      if (t.reseeds % n == 0) {
        e.update(t.pools[r].digest().getBytes());
        t.pools[r].start();
      }
      n <<= 1;
    }
    t.keyBytes = e.digest().getBytes();
    e.start();
    e.update(t.keyBytes);
    var i = e.digest().getBytes();
    t.key = t.plugin.formatKey(t.keyBytes);
    t.seed = t.plugin.formatSeed(i);
    t.generated = 0;
  }
  function l(e) {
    var t = null;
    var n = r.util.globalScope;
    var i = n.crypto || n.msCrypto;
    if (i && i.getRandomValues) {
      t = function (e) {
        return i.getRandomValues(e);
      };
    }
    var o = r.util.createBuffer();
    if (t) for (; o.length() < e;) {
      var s = Math.max(1, Math.min(e - o.length(), 65536) / 4);
      var a = new Uint32Array(Math.floor(s));
      try {
        t(a);
        for (var c = 0; c < a.length; ++c) o.putInt32(a[c]);
      } catch (e) {
        if (!("undefined" != typeof QuotaExceededError && e instanceof QuotaExceededError)) throw e;
      }
    }
    if (o.length() < e) for (d = Math.floor(65536 * Math.random()), void 0; o.length() < e;) {
      var l;
      var u;
      var p;
      var d;
      for (u = 16807 * (65535 & d), u += (32767 & (l = 16807 * (d >> 16))) << 16, d = 4294967295 & (u = (2147483647 & (u += l >> 15)) + (u >> 31)), c = 0; c < 3; ++c) {
        p = d >>> (c << 3);
        p ^= Math.floor(256 * Math.random());
        o.putByte(255 & p);
      }
    }
    return o.getBytes(e);
  }
  t.pools = o;
  t.pool = 0;
  t.generate = function (e, n) {
    if (!n) return t.generateSync(e);
    var i = t.plugin.cipher;
    var o = t.plugin.increment;
    var s = t.plugin.formatKey;
    var a = t.plugin.formatSeed;
    var l = r.util.createBuffer();
    t.key = null;
    (function u(p) {
      if (p) return n(p);
      if (l.length() >= e) return n(null, l.getBytes(e));
      if (t.generated > 1048575) {
        t.key = null;
      }
      if (null === t.key) return r.util.nextTick(function () {
        !function (e) {
          if (t.pools[0].messageLength >= 32) return c(), e();
          var n = 32 - t.pools[0].messageLength << 5;
          t.seedFile(n, function (n, r) {
            if (n) return e(n);
            t.collect(r), c(), e();
          });
        }(u);
      });
      var d = i(t.key, t.seed);
      t.generated += d.length;
      l.putBytes(d);
      t.key = s(i(t.key, o(t.seed)));
      t.seed = a(i(t.key, t.seed));
      r.util.setImmediate(u);
    })();
  };
  t.generateSync = function (e) {
    var n = t.plugin.cipher;
    var i = t.plugin.increment;
    var o = t.plugin.formatKey;
    var s = t.plugin.formatSeed;
    t.key = null;
    for (var c = r.util.createBuffer(); c.length() < e;) {
      if (t.generated > 1048575) {
        t.key = null;
      }
      if (null === t.key) {
        a();
      }
      var l = n(t.key, t.seed);
      t.generated += l.length;
      c.putBytes(l);
      t.key = o(n(t.key, i(t.seed)));
      t.seed = s(n(t.key, t.seed));
    }
    return c.getBytes(e);
  };
  if (i) {
    t.seedFile = function (e, t) {
      i.randomBytes(e, function (e, n) {
        if (e) return t(e);
        t(null, n.toString());
      });
    };
    t.seedFileSync = function (e) {
      return i.randomBytes(e).toString();
    };
  } else {
    t.seedFile = function (e, t) {
      try {
        t(null, l(e));
      } catch (e) {
        t(e);
      }
    };
    t.seedFileSync = l;
  }
  t.collect = function (e) {
    for (n = e.length, r = 0, void 0; r < n; ++r) {
      var n;
      var r;
      t.pools[t.pool].update(e.substr(r, 1));
      t.pool = 31 === t.pool ? 0 : t.pool + 1;
    }
  };
  t.collectInt = function (e, n) {
    for (r = "", i = 0, void 0; i < n; i += 8) {
      var r;
      var i;
      r += String.fromCharCode(e >> i & 255);
    }
    t.collect(r);
  };
  t.registerWorker = function (e) {
    if (e === self) {
      t.seedFile = function (e, t) {
        self.addEventListener("message", function e(n) {
          var r = n.data;
          if (r.forge && r.forge.prng) {
            self.removeEventListener("message", e);
            t(r.forge.prng.err, r.forge.prng.bytes);
          }
        });
        self.postMessage({
          forge: {
            prng: {
              needed: e
            }
          }
        });
      };
    } else {
      e.addEventListener("message", function (n) {
        var r = n.data;
        if (r.forge && r.forge.prng) {
          t.seedFile(r.forge.prng.needed, function (t, n) {
            e.postMessage({
              forge: {
                prng: {
                  err: t,
                  bytes: n
                }
              }
            });
          });
        }
      });
    }
  };
  return t;
};