require.d(exports, {
  Rd: () => p,
  TG: () => u,
  J_: () => d
});
var r = "object" == typeof globalThis ? globalThis : global;
var i = "1.4.1";
var o = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
var s = function (e) {
  var t = new Set([e]);
  var n = new Set();
  var r = e.match(o);
  if (!r) return function () {
    return !1;
  };
  var i = +r[1];
  var s = +r[2];
  var a = +r[3];
  if (null != r[4]) return function (t) {
    return t === e;
  };
  function c(e) {
    n.add(e);
    return !1;
  }
  function l(e) {
    t.add(e);
    return !0;
  }
  return function (e) {
    if (t.has(e)) return !0;
    if (n.has(e)) return !1;
    var r = e.match(o);
    if (!r) return c(e);
    var u = +r[1];
    var p = +r[2];
    var d = +r[3];
    return null != r[4] || i !== u ? c(e) : 0 === i ? s === p && a <= d ? l(e) : c(e) : s <= p ? l(e) : c(e);
  };
}(i);
var a = i.split(".")[0];
var c = Symbol.for("opentelemetry.js.api." + a);
var l = r;
function u(e, t, n, r) {
  var o;
  if (void 0 === r) {
    r = !1;
  }
  var s = l[c] = null !== (o = l[c]) && void 0 !== o ? o : {
    version: i
  };
  if (!r && s[e]) {
    var a = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + e);
    n.error(a.stack || a.message);
    return !1;
  }
  return s.version !== i ? (a = new Error("@opentelemetry/api: Registration of version v" + s.version + " for " + e + " does not match previously registered API v" + i), n.error(a.stack || a.message), !1) : (s[e] = t, n.debug("@opentelemetry/api: Registered a global for " + e + " v" + i + "."), !0);
}
function p(e) {
  var t;
  var n;
  var r = null === (t = l[c]) || void 0 === t ? void 0 : t.version;
  if (r && s(r)) return null === (n = l[c]) || void 0 === n ? void 0 : n[e];
}
function d(e, t) {
  t.debug("@opentelemetry/api: Unregistering a global for " + e + " v" + i + ".");
  var n = l[c];
  if (n) {
    delete n[e];
  }
}