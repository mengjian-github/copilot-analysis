var r = require(67294);
var i = "function" == typeof Object.is ? Object.is : function (e, t) {
  return e === t && (0 !== e || 1 / e == 1 / t) || e != e && t != t;
};
var o = r.useState;
var s = r.useEffect;
var a = r.useLayoutEffect;
var c = r.useDebugValue;
function l(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !i(e, n);
  } catch (e) {
    return !0;
  }
}
var u = "undefined" == typeof window || void 0 === window.document || void 0 === window.document.createElement ? function (e, t) {
  return t();
} : function (e, t) {
  var n = t();
  var r = o({
    inst: {
      value: n,
      getSnapshot: t
    }
  });
  var i = r[0].inst;
  var u = r[1];
  a(function () {
    i.value = n;
    i.getSnapshot = t;
    if (l(i)) {
      u({
        inst: i
      });
    }
  }, [e, n, t]);
  s(function () {
    if (l(i)) {
      u({
        inst: i
      });
    }
    return e(function () {
      if (l(i)) {
        u({
          inst: i
        });
      }
    });
  }, [e]);
  c(n);
  return n;
};
exports.useSyncExternalStore = void 0 !== r.useSyncExternalStore ? r.useSyncExternalStore : u;