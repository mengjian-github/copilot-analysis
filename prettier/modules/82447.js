module.exports = function (e) {
  function t(e) {
    let n;
    let i;
    let o;
    let s = null;
    function a(...e) {
      if (!a.enabled) return;
      const r = a;
      const i = Number(new Date());
      const o = i - (n || i);
      r.diff = o;
      r.prev = n;
      r.curr = i;
      n = i;
      e[0] = t.coerce(e[0]);
      if ("string" != typeof e[0]) {
        e.unshift("%O");
      }
      let s = 0;
      e[0] = e[0].replace(/%([a-zA-Z%])/g, (n, i) => {
        if ("%%" === n) return "%";
        s++;
        const o = t.formatters[i];
        if ("function" == typeof o) {
          const t = e[s];
          n = o.call(r, t);
          e.splice(s, 1);
          s--;
        }
        return n;
      });
      t.formatArgs.call(r, e);
      (r.log || t.log).apply(r, e);
    }
    a.namespace = e;
    a.useColors = t.useColors();
    a.color = t.selectColor(e);
    a.extend = r;
    a.destroy = t.destroy;
    Object.defineProperty(a, "enabled", {
      enumerable: !0,
      configurable: !1,
      get: () => null !== s ? s : (i !== t.namespaces && (i = t.namespaces, o = t.enabled(e)), o),
      set: e => {
        s = e;
      }
    });
    if ("function" == typeof t.init) {
      t.init(a);
    }
    return a;
  }
  function r(e, n) {
    const r = t(this.namespace + (void 0 === n ? ":" : n) + e);
    r.log = this.log;
    return r;
  }
  function i(e) {
    return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*");
  }
  t.debug = t;
  t.default = t;
  t.coerce = function (e) {
    return e instanceof Error ? e.stack || e.message : e;
  };
  t.disable = function () {
    const e = [...t.names.map(i), ...t.skips.map(i).map(e => "-" + e)].join(",");
    t.enable("");
    return e;
  };
  t.enable = function (e) {
    let n;
    t.save(e);
    t.namespaces = e;
    t.names = [];
    t.skips = [];
    const r = ("string" == typeof e ? e : "").split(/[\s,]+/);
    const i = r.length;
    for (n = 0; n < i; n++) if (r[n]) {
      if ("-" === (e = r[n].replace(/\*/g, ".*?"))[0]) {
        t.skips.push(new RegExp("^" + e.slice(1) + "$"));
      } else {
        t.names.push(new RegExp("^" + e + "$"));
      }
    }
  };
  t.enabled = function (e) {
    if ("*" === e[e.length - 1]) return !0;
    let n;
    let r;
    for (n = 0, r = t.skips.length; n < r; n++) if (t.skips[n].test(e)) return !1;
    for (n = 0, r = t.names.length; n < r; n++) if (t.names[n].test(e)) return !0;
    return !1;
  };
  t.humanize = require(57824);
  t.destroy = function () {
    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  };
  Object.keys(e).forEach(n => {
    t[n] = e[n];
  });
  t.names = [];
  t.skips = [];
  t.formatters = {};
  t.selectColor = function (e) {
    let n = 0;
    for (let t = 0; t < e.length; t++) {
      n = (n << 5) - n + e.charCodeAt(t);
      n |= 0;
    }
    return t.colors[Math.abs(n) % t.colors.length];
  };
  t.enable(t.load());
  return t;
};