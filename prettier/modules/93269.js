function t() {}
module.exports = function () {
  const e = this._hooks;
  const n = this._state;
  const r = process.nextTick;
  process.nextTick = function () {
    if (!n.enabled) return r.apply(process, arguments);
    const i = new Array(arguments.length);
    for (let e = 0; e < arguments.length; e++) i[e] = arguments[e];
    const o = i[0];
    if ("function" != typeof o) throw new TypeError("callback is not a function");
    const s = new t();
    const a = --n.counter;
    e.init.call(s, a, 0, null, null);
    i[0] = function () {
      e.pre.call(s, a);
      let t = !0;
      try {
        o.apply(this, arguments);
        t = !1;
      } finally {
        if (t && process.listenerCount("uncaughtException") > 0) {
          process.once("uncaughtException", function () {
            e.post.call(s, a, !0);
            e.destroy.call(null, a);
          });
        }
      }
      e.post.call(s, a, !1);
      e.destroy.call(null, a);
    };
    return r.apply(process, i);
  };
};