function t() {}
module.exports = function () {
  const e = this._hooks;
  const n = this._state;
  const r = global.Promise;
  const i = r.prototype.then;
  function o(t, n, r, i) {
    return "function" != typeof t ? i ? function (t) {
      return function (n) {
        e.destroy.call(null, t);
        return n;
      };
    }(r) : function (t) {
      return function (n) {
        throw e.destroy.call(null, t), n;
      };
    }(r) : function () {
      e.pre.call(n, r);
      try {
        return t.apply(this, arguments);
      } finally {
        e.post.call(n, r, !1);
        e.destroy.call(null, r);
      }
    };
  }
  r.prototype.then = function (r, s) {
    if (!n.enabled) return i.call(this, r, s);
    const a = new t();
    const c = --n.counter;
    e.init.call(a, c, 0, null, null);
    return i.call(this, o(r, a, c, !0), o(s, a, c, !1));
  };
};