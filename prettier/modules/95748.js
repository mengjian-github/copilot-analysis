var r;
var i = exports || this;
function o(e) {
  var t;
  var n;
  n = e.length ? 0 : -1;
  return {
    next: i,
    done: function () {
      if (null != t) {
        t.done();
      }
      t = void 0;
      n = e.length;
    },
    run: function (e) {
      for (var t; t = i();) e(t);
      e();
    }
  };
  function i() {
    for (var i; n < e.length;) {
      if (null == t) {
        t = n < 0 ? r() : r(e[n]);
      }
      if (i = t.next()) return i;
      t.done();
      t = void 0;
      n++;
    }
  }
}
r = require(46837)("./crypt32-" + process.arch);
i.sync = o;
i.async = function (e) {
  var t;
  var n;
  t = o(e);
  n = t.next;
  t.run = function (e) {
    !function t() {
      return Promise.resolve().then(n).then(function (n) {
        if (n) {
          e(n);
          return t();
        }
        e();
      });
    }();
  };
  return t;
};