var r = require(3832);
require(36607);
require(28991);
require(97116);
var i;
var o = r.pkcs5 = r.pkcs5 || {};
if (r.util.isNodejs && !r.options.usePureJavaScript) {
  i = require(6113);
}
module.exports = r.pbkdf2 = o.pbkdf2 = function (e, t, n, o, s, a) {
  if ("function" == typeof s) {
    a = s;
    s = null;
  }
  if (r.util.isNodejs && !r.options.usePureJavaScript && i.pbkdf2 && (null === s || "object" != typeof s) && (i.pbkdf2Sync.length > 4 || !s || "sha1" === s)) return "string" != typeof s && (s = "sha1"), e = Buffer.from(e, "binary"), t = Buffer.from(t, "binary"), a ? 4 === i.pbkdf2Sync.length ? i.pbkdf2(e, t, n, o, function (e, t) {
    if (e) return a(e);
    a(null, t.toString("binary"));
  }) : i.pbkdf2(e, t, n, o, s, function (e, t) {
    if (e) return a(e);
    a(null, t.toString("binary"));
  }) : 4 === i.pbkdf2Sync.length ? i.pbkdf2Sync(e, t, n, o).toString("binary") : i.pbkdf2Sync(e, t, n, o, s).toString("binary");
  if (null == s) {
    s = "sha1";
  }
  if ("string" == typeof s) {
    if (!(s in r.md.algorithms)) throw new Error("Unknown hash algorithm: " + s);
    s = r.md[s].create();
  }
  var c = s.digestLength;
  if (o > 4294967295 * c) {
    var l = new Error("Derived key is too long.");
    if (a) return a(l);
    throw l;
  }
  var u = Math.ceil(o / c);
  var p = o - (u - 1) * c;
  var d = r.hmac.create();
  d.start(s, e);
  var h;
  var f;
  var m;
  var g = "";
  if (!a) {
    for (var y = 1; y <= u; ++y) {
      d.start(null, null);
      d.update(t);
      d.update(r.util.int32ToBytes(y));
      h = m = d.digest().getBytes();
      for (var _ = 2; _ <= n; ++_) {
        d.start(null, null);
        d.update(m);
        f = d.digest().getBytes();
        h = r.util.xorBytes(h, f, c);
        m = f;
      }
      g += y < u ? h : h.substr(0, p);
    }
    return g;
  }
  function v() {
    if (y > u) return a(null, g);
    d.start(null, null);
    d.update(t);
    d.update(r.util.int32ToBytes(y));
    h = m = d.digest().getBytes();
    _ = 2;
    b();
  }
  function b() {
    if (_ <= n) {
      d.start(null, null);
      d.update(m);
      f = d.digest().getBytes();
      h = r.util.xorBytes(h, f, c);
      m = f;
      ++_;
      return r.util.setImmediate(b);
    }
    g += y < u ? h : h.substr(0, p);
    ++y;
    v();
  }
  y = 1;
  v();
};