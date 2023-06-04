const r = require(39512);
function i() {}
function o() {}
function s() {}
const a = new Map();
const c = new Map();
const l = new Map();
let u = null;
let p = !1;
function d(e, t, n, i, o, s, a) {
  const c = r[n];
  const l = r[i];
  r[n] = function () {
    if (!t.enabled) return c.apply(r, arguments);
    const n = new Array(arguments.length);
    for (let e = 0; e < arguments.length; e++) n[e] = arguments[e];
    const i = n[0];
    if ("function" != typeof i) throw new TypeError('"callback" argument must be a function');
    const l = new o();
    const d = --t.counter;
    let h;
    e.init.call(l, d, 0, null, null);
    n[0] = function () {
      u = h;
      e.pre.call(l, d);
      let t = !0;
      try {
        i.apply(this, arguments);
        t = !1;
      } finally {
        if (t && process.listenerCount("uncaughtException") > 0) {
          process.once("uncaughtException", function () {
            e.post.call(l, d, !0);
            s.delete(h);
            e.destroy.call(null, d);
          });
        }
      }
      e.post.call(l, d, !1);
      u = null;
      if (a || p) {
        p = !1;
        s.delete(h);
        e.destroy.call(null, d);
      }
    };
    h = c.apply(r, n);
    s.set(h, d);
    return h;
  };
  r[i] = function (t) {
    if (u === t && null !== t) p = !0;else if (s.has(t)) {
      const n = s.get(t);
      s.delete(t);
      e.destroy.call(null, n);
    }
    l.apply(r, arguments);
  };
}
module.exports = function () {
  d(this._hooks, this._state, "setTimeout", "clearTimeout", i, a, !0);
  d(this._hooks, this._state, "setInterval", "clearInterval", o, c, !1);
  d(this._hooks, this._state, "setImmediate", "clearImmediate", s, l, !0);
  global.setTimeout = r.setTimeout;
  global.setInterval = r.setInterval;
  global.setImmediate = r.setImmediate;
  global.clearTimeout = r.clearTimeout;
  global.clearInterval = r.clearInterval;
  global.clearImmediate = r.clearImmediate;
};