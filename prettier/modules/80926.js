require.d(exports, {
  a: () => a
});
var r = require(68303);
var i = require(98397);
var o = require(3250);
var s = require(60315);
var a = function () {
  function e() {}
  e.prototype.inject = function (e, t, n) {
    var a = r.u.getBaggage(e);
    if (a && !i.Ll(e)) {
      var c = s.getKeyPairs(a).filter(function (e) {
        return e.length <= o.ef;
      }).slice(0, o.Cx);
      var l = s.serializeKeyPairs(c);
      if (l.length > 0) {
        n.set(t, o.WM, l);
      }
    }
  };
  e.prototype.extract = function (e, t, n) {
    var i = n.get(t, o.WM);
    var a = Array.isArray(i) ? i.join(o.bU) : i;
    if (!a) return e;
    var c = {};
    return 0 === a.length ? e : (a.split(o.bU).forEach(function (e) {
      var t = s.parsePairKeyValue(e);
      if (t) {
        var n = {
          value: t.value
        };
        if (t.metadata) {
          n.metadata = t.metadata;
        }
        c[t.key] = n;
      }
    }), 0 === Object.entries(c).length ? e : r.u.setBaggage(e, r.u.createBaggage(c)));
  };
  e.prototype.fields = function () {
    return [o.WM];
  };
  return e;
}();