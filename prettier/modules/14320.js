function each() {
  var e;
  i(arguments, e = {
    unique: !0,
    ondata: function (t) {
      if ("function" == typeof e.$cb) {
        e.$cb(t);
      }
    }
  });
}
function i(e, t) {
  var r;
  var i;
  r = require(44825);
  i = e[0];
  if (null == t.unique) {
    t.unique = !1;
  }
  t.format = null != i ? i : r.der2.x509;
  t.$cb = e[1] || i;
  r(t);
}
exports.all = function () {
  var e;
  i(arguments, {
    ondata: e = []
  });
  return e;
};
exports.each = each;
each.async = function () {
  var e;
  i(arguments, e = {
    async: !0,
    ondata: function (t) {
      if ("function" == typeof e.$cb) {
        e.$cb(void 0, t);
      }
    },
    onend: function () {
      if ("function" == typeof e.$cb) {
        e.$cb();
      }
    }
  });
};