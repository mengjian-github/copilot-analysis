var r = require(26547);
var i = require(71576).StringDecoder;
module.exports = function (e, t, n) {
  var o = new i();
  var s = "";
  var a = n && n.maxLength;
  var c = !n || !1 !== n.trailing;
  function l(e, n) {
    if (t) {
      try {
        n = t(n);
      } catch (t) {
        return e.emit("error", t);
      }
      if (void 0 !== n) {
        e.queue(n);
      }
    } else e.queue(n);
  }
  function u(t, n) {
    var r = ((null != s ? s : "") + n).split(e);
    s = r.pop();
    if (a && s.length > a) return t.emit("error", new Error("maximum buffer reached"));
    for (var i = 0; i < r.length; i++) l(t, r[i]);
  }
  if ("function" == typeof e) {
    t = e;
    e = null;
  }
  if (e) {
    e = /\r?\n/;
  }
  return r(function (e) {
    u(this, o.write(e));
  }, function () {
    if (o.end) {
      u(this, o.end());
    }
    if (c && null != s) {
      l(this, s);
    }
    this.queue(null);
  });
};