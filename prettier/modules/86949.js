require.d(exports, {
  CO: () => d,
  Ld: () => p,
  bo: () => u,
  iH: () => h,
  sj: () => l,
  tp: () => f
});
var r = require(72478);
const i = e => "object" == typeof e && null !== e;
const o = new WeakMap();
const s = new WeakSet();
const a = (e = Object.is, t = (e, t) => new Proxy(e, t), n = e => i(e) && !s.has(e) && (Array.isArray(e) || !(Symbol.iterator in e)) && !(e instanceof WeakMap) && !(e instanceof WeakSet) && !(e instanceof Error) && !(e instanceof Number) && !(e instanceof Date) && !(e instanceof String) && !(e instanceof RegExp) && !(e instanceof ArrayBuffer), a = e => {
  switch (e.status) {
    case "fulfilled":
      return e.value;
    case "rejected":
      throw e.reason;
    default:
      throw e;
  }
}, c = new WeakMap(), l = (e, t, n = a) => {
  const i = c.get(e);
  if ((null == i ? void 0 : i[0]) === t) return i[1];
  const u = Array.isArray(e) ? [] : Object.create(Object.getPrototypeOf(e));
  r.jc(u, !0);
  c.set(e, [t, u]);
  Reflect.ownKeys(e).forEach(t => {
    if (Object.getOwnPropertyDescriptor(u, t)) return;
    const i = Reflect.get(e, t);
    const a = {
      value: i,
      enumerable: !0,
      configurable: !0
    };
    if (s.has(i)) r.jc(i, !1);else if (i instanceof Promise) {
      delete a.value;
      a.get = () => n(i);
    } else if (o.has(i)) {
      const [e, t] = o.get(i);
      a.value = l(e, t(), n);
    }
    Object.defineProperty(u, t, a);
  });
  return u;
}, u = new WeakMap(), p = [1, 1], d = a => {
  if (!i(a)) throw new Error("object required");
  const c = u.get(a);
  if (c) return c;
  let h = p[0];
  const f = new Set();
  const m = (e, t = ++p[0]) => {
    if (h !== t) {
      h = t;
      f.forEach(n => n(e, t));
    }
  };
  let g = p[1];
  const y = e => (t, n) => {
    const r = [...t];
    r[1] = [e, ...r[1]];
    m(r, n);
  };
  const _ = new Map();
  const v = e => {
    var t;
    const n = _.get(e);
    if (n) {
      _.delete(e);
      if (null == (t = n[1])) {
        t.call(n);
      }
    }
  };
  const b = Array.isArray(a) ? [] : Object.create(Object.getPrototypeOf(a));
  const E = t(b, {
    deleteProperty(e, t) {
      const n = Reflect.get(e, t);
      v(t);
      const r = Reflect.deleteProperty(e, t);
      if (r) {
        m(["delete", [t], n]);
      }
      return r;
    },
    set(t, a, c, l) {
      const p = Reflect.has(t, a);
      const h = Reflect.get(t, a, l);
      if (p && (e(h, c) || u.has(c) && e(h, u.get(c)))) return !0;
      v(a);
      if (i(c)) {
        c = r.o5(c) || c;
      }
      let g = c;
      if (c instanceof Promise) c.then(e => {
        c.status = "fulfilled";
        c.value = e;
        m(["resolve", [a], e]);
      }).catch(e => {
        c.status = "rejected";
        c.reason = e;
        m(["reject", [a], e]);
      });else {
        if (!o.has(c) && n(c)) {
          g = d(c);
        }
        const e = !s.has(g) && o.get(g);
        if (e) {
          ((e, t) => {
            if (_.has(e)) throw new Error("prop listener already exists");
            if (f.size) {
              const n = t[3](y(e));
              _.set(e, [t, n]);
            } else _.set(e, [t]);
          })(a, e);
        }
      }
      Reflect.set(t, a, g, l);
      m(["set", [a], c, h]);
      return !0;
    }
  });
  u.set(a, E);
  const w = [b, (e = ++p[1]) => (g === e || f.size || (g = e, _.forEach(([t]) => {
    const n = t[1](e);
    if (n > h) {
      h = n;
    }
  })), h), l, e => (f.add(e), 1 === f.size && _.forEach(([e, t], n) => {
    if (t) throw new Error("remove already exists");
    const r = e[3](y(n));
    _.set(n, [e, r]);
  }), () => {
    f.delete(e);
    if (0 === f.size) {
      _.forEach(([e, t], n) => {
        if (t) {
          t();
          _.set(n, [e]);
        }
      });
    }
  })];
  o.set(E, w);
  Reflect.ownKeys(a).forEach(e => {
    const t = Object.getOwnPropertyDescriptor(a, e);
    if ("value" in t) {
      E[e] = a[e];
      delete t.value;
      delete t.writable;
    }
    Object.defineProperty(b, e, t);
  });
  return E;
}) => [d, o, s, e, t, n, a, c, l, u, p];
const [c] = a();
function l(e = {}) {
  return c(e);
}
function u(e) {
  const t = o.get(e);
  return null == t ? void 0 : t[1]();
}
function p(e, t, n) {
  const r = o.get(e);
  let i;
  if (r) {
    console.warn("Please use proxy object");
  }
  const s = [];
  const a = r[3];
  let c = !1;
  const l = a(e => {
    s.push(e);
    if (n) {
      t(s.splice(0));
    } else {
      if (i) {
        i = Promise.resolve().then(() => {
          i = void 0;
          if (c) {
            t(s.splice(0));
          }
        });
      }
    }
  });
  c = !0;
  return () => {
    c = !1;
    l();
  };
}
function d(e, t) {
  const n = o.get(e);
  if (n) {
    console.warn("Please use proxy object");
  }
  const [r, i, s] = n;
  return s(r, i(), t);
}
function h(e) {
  s.add(e);
  return e;
}
const f = a;