require.r(exports);
require.d(exports, {
  getKeyPairs: () => s,
  parseKeyPairsIntoRecord: () => c,
  parsePairKeyValue: () => a,
  serializeKeyPairs: () => o
});
var r = require(92599);
var i = require(3250);
function o(e) {
  return e.reduce(function (e, t) {
    var n = "" + e + ("" !== e ? i.bU : "") + t;
    return n.length > i.H3 ? e : n;
  }, "");
}
function s(e) {
  return e.getAllEntries().map(function (e) {
    var t = function (e, t) {
      var n = "function" == typeof Symbol && e[Symbol.iterator];
      if (!n) return e;
      var r;
      var i;
      var o = n.call(e);
      var s = [];
      try {
        for (; (void 0 === t || t-- > 0) && !(r = o.next()).done;) s.push(r.value);
      } catch (e) {
        i = {
          error: e
        };
      } finally {
        try {
          if (r && !r.done && (n = o.return)) {
            n.call(o);
          }
        } finally {
          if (i) throw i.error;
        }
      }
      return s;
    }(e, 2);
    var n = t[0];
    var r = t[1];
    var o = encodeURIComponent(n) + "=" + encodeURIComponent(r.value);
    if (void 0 !== r.metadata) {
      o += i.bO + r.metadata.toString();
    }
    return o;
  });
}
function a(e) {
  var t = e.split(i.bO);
  if (!(t.length <= 0)) {
    var n = t.shift();
    if (n) {
      var o = n.split(i.Vo);
      if (2 === o.length) {
        var s;
        var a = decodeURIComponent(o[0].trim());
        var c = decodeURIComponent(o[1].trim());
        if (t.length > 0) {
          s = r.u(t.join(i.bO));
        }
        return {
          key: a,
          value: c,
          metadata: s
        };
      }
    }
  }
}
function c(e) {
  return "string" != typeof e || 0 === e.length ? {} : e.split(i.bU).map(function (e) {
    return a(e);
  }).filter(function (e) {
    return void 0 !== e && e.value.length > 0;
  }).reduce(function (e, t) {
    e[t.key] = t.value;
    return e;
  }, {});
}