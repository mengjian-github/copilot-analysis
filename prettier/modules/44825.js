var r;
var i;
var o;
function s(e) {
  var t;
  var s;
  var c;
  var l;
  var u;
  var p;
  var d;
  var h;
  var f;
  if (null == e) {
    e = {};
  }
  t = r || e.disabled ? require(34738) : (null != (s = e.fallback) ? s : !i) ? require(33876) : require(95748);
  if (c = e.store) {
    if (Array.isArray(c)) {
      c = [c];
    }
  } else {
    c = [];
  }
  t = t[(l = e.async) ? "async" : "sync"](c);
  u = l ? function (e) {
    Promise.resolve(e).then(m);
  } : m;
  if (!1 !== e.unique) {
    p = require(54846)();
  }
  d = o(e.format);
  if (Array.isArray(e.ondata)) {
    e.ondata = e.ondata.push.bind(e.ondata);
  }
  if (e.save || e.$ave) {
    h = require(12790)(e);
  }
  if (e.inject) {
    f = require(97039)(e.inject);
  }
  if (e.generator) return (l ? function () {
    var e, t;
    return (e = {})[null != (t = Symbol.asyncIterator) ? t : "@"] = a, e.return = y, e.next = v, e;
  } : function () {
    var e;
    return (e = {})[Symbol.iterator] = a, e.return = y, e.next = _, e;
  })();
  function m(t) {
    if (h) {
      h(t);
    }
    if (t) {
      if (f) {
        f(t);
      }
      if ("function" == typeof e.ondata) {
        e.ondata(d(t));
      }
    } else {
      if ("function" == typeof e.onend) {
        e.onend();
      }
    }
  }
  function g(e) {
    u(e);
    return {
      done: !e,
      value: null != e ? d(e) : e
    };
  }
  function y(e) {
    t.done();
    return {
      done: !0,
      value: e
    };
  }
  function _() {
    for (var e; (e = t.next()) && p && !p(e););
    return g(e);
  }
  function v() {
    return function e() {
      return Promise.resolve().then(t.next).then(function (t) {
        return t && p && !p(t) ? e() : g(t);
      });
    }();
  }
  t.run(function (e) {
    if (e && p && !p(e)) {
      u(e);
    }
  });
}
function a() {
  return this;
}
module.exports = s;
s.disabled = r = "win32" !== process.platform;
s.nApi = i = !!process.versions.napi && s === require(64459) && !(s.electron = require(59134)());
s.der2 = o = require(49568);
s.hash = function () {
  return (s.hash = require(30298)).apply(this, arguments);
};
s.inject = function () {
  return (s.inject = require(97039).inject).apply(this, arguments);
};
s.exe = function () {
  return (s.exe = require(33876).exe).apply(this, arguments);
};
(function (e, t) {
  for (var n in t) e[n] = t[n];
})(s, require(14320));
if (r || s !== require(70604)) {
  s({
    inject: !0,
    $ave: !0,
    async: !0
  });
}