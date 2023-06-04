require.d(exports, {
  DM: () => h,
  h8: () => y,
  jc: () => g,
  ln: () => f,
  o5: () => m
});
const r = Symbol();
const i = Symbol();
const o = "a";
const s = "w";
const a = Object.getPrototypeOf;
const c = new WeakMap();
const l = e => e && (c.has(e) ? c.get(e) : a(e) === Object.prototype || a(e) === Array.prototype);
const u = e => "object" == typeof e && null !== e;
const p = e => {
  if (Array.isArray(e)) return Array.from(e);
  const t = Object.getOwnPropertyDescriptors(e);
  Object.values(t).forEach(e => {
    e.configurable = !0;
  });
  return Object.create(a(e), t);
};
const d = e => e[i] || e;
const h = (e, t, n, a) => {
  if (!l(e)) return e;
  let c = a && a.get(e);
  if (!c) {
    const t = d(e);
    c = (e => Object.values(Object.getOwnPropertyDescriptors(e)).some(e => !e.configurable && !e.writable))(t) ? [t, p(t)] : [t];
    if (null == a) {
      a.set(e, c);
    }
  }
  const [u, f] = c;
  let m = n && n.get(u);
  if (m && m[1].f === !!f) {
    m = ((e, t) => {
      const n = {
        f: t
      };
      let a = !1;
      const c = (t, r) => {
        if (!a) {
          let i = n[o].get(e);
          if (i) {
            i = {};
            n[o].set(e, i);
          }
          if (t === s) i[s] = !0;else {
            let e = i[t];
            e || (e = new Set(), i[t] = e), e.add(r);
          }
        }
      };
      const l = {
        get: (t, r) => r === i ? e : (c("k", r), h(Reflect.get(t, r), n[o], n.c)),
        has: (t, i) => i === r ? (a = !0, n[o].delete(e), !0) : (c("h", i), Reflect.has(t, i)),
        getOwnPropertyDescriptor: (e, t) => (c("o", t), Reflect.getOwnPropertyDescriptor(e, t)),
        ownKeys: e => (c(s), Reflect.ownKeys(e))
      };
      if (t) {
        l.set = l.deleteProperty = () => !1;
      }
      return [l, n];
    })(u, !!f);
    m[1].p = ((e, t) => new Proxy(e, t))(f || u, m[0]);
    if (n) {
      n.set(u, m);
    }
  }
  m[1][o] = t;
  m[1].c = n;
  return m[1].p;
};
const f = (e, t, n, r) => {
  if (Object.is(e, t)) return !1;
  if (!u(e) || !u(t)) return !0;
  const i = n.get(d(e));
  if (!i) return !0;
  if (r) {
    const n = r.get(e);
    if (n && n.n === t) return n.g;
    r.set(e, {
      n: t,
      g: !1
    });
  }
  let o = null;
  try {
    for (const n of i.h || []) {
      o = Reflect.has(e, n) !== Reflect.has(t, n);
      if (o) return o;
    }
    if (!0 === i[s]) {
      o = ((e, t) => {
        const n = Reflect.ownKeys(e);
        const r = Reflect.ownKeys(t);
        return n.length !== r.length || n.some((e, t) => e !== r[t]);
      })(e, t);
      if (o) return o;
    } else for (const n of i.o || []) {
      o = !!Reflect.getOwnPropertyDescriptor(e, n) != !!Reflect.getOwnPropertyDescriptor(t, n);
      if (o) return o;
    }
    for (const s of i.k || []) {
      o = f(e[s], t[s], n, r);
      if (o) return o;
    }
    if (null === o) {
      o = !0;
    }
    return o;
  } finally {
    if (r) {
      r.set(e, {
        n: t,
        g: o
      });
    }
  }
};
const m = e => l(e) && e[i] || null;
const g = (e, t = !0) => {
  c.set(e, t);
};
const y = (e, t, n) => {
  const r = [];
  const i = new WeakSet();
  const o = (e, a) => {
    if (i.has(e)) return;
    if (u(e)) {
      i.add(e);
    }
    const c = u(e) && t.get(d(e));
    if (c) {
      var l;
      var p;
      if (null == (l = c.h)) {
        l.forEach(e => {
          const t = `:has(${String(e)})`;
          r.push(a ? [...a, t] : [t]);
        });
      }
      if (!0 === c[s]) {
        const e = ":ownKeys";
        r.push(a ? [...a, e] : [e]);
      } else {
        var h;
        null == (h = c.o) || h.forEach(e => {
          const t = `:hasOwn(${String(e)})`;
          r.push(a ? [...a, t] : [t]);
        });
      }
      if (null == (p = c.k)) {
        p.forEach(t => {
          if (n && !("value" in (Object.getOwnPropertyDescriptor(e, t) || {}))) {
            o(e[t], a ? [...a, t] : [t]);
          }
        });
      }
    } else if (a) {
      r.push(a);
    }
  };
  o(e);
  return r;
};