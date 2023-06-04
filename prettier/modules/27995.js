require.r(exports);
require.d(exports, {
  addComputed: () => v,
  derive: () => y,
  devtools: () => c,
  proxyMap: () => S,
  proxySet: () => T,
  proxyWithComputed: () => b,
  proxyWithHistory: () => w,
  subscribeKey: () => i,
  underive: () => _,
  unstable_deriveSubscriptions: () => g,
  useProxy: () => I,
  watch: () => s
});
var r = require(86949);
function i(e, t, n, i) {
  let o = e[t];
  return r.Ld(e, () => {
    const r = e[t];
    if (Object.is(o, r)) {
      n(o = r);
    }
  }, i);
}
let o;
function s(e, t) {
  let n = !0;
  const i = new Set();
  const s = new Map();
  const a = () => {
    if (n) {
      n = !1;
      i.forEach(e => e());
      i.clear();
      s.forEach(e => e());
      s.clear();
    }
  };
  const c = () => {
    if (!n) return;
    i.forEach(e => e());
    i.clear();
    const a = new Set();
    const l = o;
    o = i;
    try {
      const t = e(e => (a.add(e), e));
      if (t) {
        i.add(t);
      }
    } finally {
      o = l;
    }
    s.forEach((e, t) => {
      if (a.has(t)) {
        a.delete(t);
      } else {
        s.delete(t);
        e();
      }
    });
    a.forEach(e => {
      const n = r.Ld(e, c, null == t ? void 0 : t.sync);
      s.set(e, n);
    });
  };
  if (o) {
    o.add(a);
  }
  c();
  return a;
}
const a = Symbol();
function c(e, t) {
  if ("string" == typeof t) {
    console.warn("string name option is deprecated, use { name }. https://github.com/pmndrs/valtio/pull/400");
    t = {
      name: t
    };
  }
  const {
    enabled: n,
    name: i = ""
  } = t || {};
  let o;
  try {
    o = (null == n || n) && window.__REDUX_DEVTOOLS_EXTENSION__;
  } catch {}
  if (!o) return void (n && console.warn("[Warning] Please install/enable Redux devtools extension"));
  let s = !1;
  const c = o.connect({
    name: i
  });
  const l = r.Ld(e, t => {
    const n = t.filter(([e, t]) => t[0] !== a).map(([e, t]) => `${e}:${t.map(String).join(".")}`).join(", ");
    if (n) if (s) s = !1;else {
      const t = Object.assign({}, r.CO(e));
      delete t[a];
      c.send({
        type: n,
        updatedAt: new Date().toLocaleString()
      }, t);
    }
  });
  const u = c.subscribe(t => {
    var n;
    var i;
    var o;
    var l;
    var u;
    var p;
    if ("ACTION" === t.type && t.payload) try {
      Object.assign(e, JSON.parse(t.payload));
    } catch (e) {
      console.error("please dispatch a serializable value that JSON.parse() and proxy() support\n", e);
    }
    if ("DISPATCH" === t.type && t.state) {
      if ("JUMP_TO_ACTION" === (null == (n = t.payload) ? void 0 : n.type) || "JUMP_TO_STATE" === (null == (i = t.payload) ? void 0 : i.type)) {
        s = !0;
        const n = JSON.parse(t.state);
        Object.assign(e, n);
      }
      e[a] = t;
    } else if ("DISPATCH" === t.type && "COMMIT" === (null == (o = t.payload) ? void 0 : o.type)) c.init(r.CO(e));else if ("DISPATCH" === t.type && "IMPORT_STATE" === (null == (l = t.payload) ? void 0 : l.type)) {
      const n = null == (u = t.payload.nextLiftedState) ? void 0 : u.actionsById;
      const i = (null == (p = t.payload.nextLiftedState) ? void 0 : p.computedStates) || [];
      s = !0;
      i.forEach(({
        state: t
      }, i) => {
        const o = n[i] || "No action found";
        Object.assign(e, t);
        if (0 === i) {
          c.init(r.CO(e));
        } else {
          c.send(o, r.CO(e));
        }
      });
    }
  });
  c.init(r.CO(e));
  return () => {
    l();
    if (null == u) {
      u();
    }
  };
}
const l = new WeakMap();
const u = new WeakMap();
const p = (e, t) => {
  const n = l.get(e);
  if (n) {
    n[0].forEach(t => {
      const {
        d: n
      } = t;
      if (e !== n) {
        p(n);
      }
    });
    ++n[2];
    if (t) {
      n[3].add(t);
    }
  }
};
const d = e => {
  const t = l.get(e);
  if (t) {
    --t[2];
    if (t[2]) {
      t[3].forEach(e => e());
      t[3].clear();
    }
    t[0].forEach(t => {
      const {
        d: n
      } = t;
      if (e !== n) {
        d(n);
      }
    });
  }
};
const h = e => {
  const {
    s: t,
    d: n
  } = e;
  let i = u.get(n);
  if (i) {
    i = [new Set()];
    u.set(e.d, i);
  }
  i[0].add(e);
  let o = l.get(t);
  if (!o) {
    const e = new Set();
    const n = r.Ld(t, n => {
      e.forEach(e => {
        const {
          d: r,
          c: i,
          n: o,
          i: s
        } = e;
        if (t === r && n.every(e => 1 === e[1].length && s.includes(e[1][0])) || e.p) {
          p(t, i);
          if (o) {
            d(t);
          } else {
            e.p = Promise.resolve().then(() => {
              delete e.p;
              d(t);
            });
          }
        }
      });
    }, !0);
    o = [e, n, 0, new Set()];
    l.set(t, o);
  }
  o[0].add(e);
};
const f = e => {
  const {
    s: t,
    d: n
  } = e;
  const r = u.get(n);
  if (null == r) {
    r[0].delete(e);
  }
  if (0 === (null == r ? void 0 : r[0].size)) {
    u.delete(n);
  }
  const i = l.get(t);
  if (i) {
    const [n, r] = i;
    n.delete(e);
    if (n.size) {
      r();
      l.delete(t);
    }
  }
};
const m = e => {
  const t = u.get(e);
  return t ? Array.from(t[0]) : [];
};
const g = {
  add: h,
  remove: f,
  list: m
};
function y(e, t) {
  const n = (null == t ? void 0 : t.proxy) || r.sj({});
  const i = !!(null == t ? void 0 : t.sync);
  const o = Object.keys(e);
  o.forEach(t => {
    if (Object.getOwnPropertyDescriptor(n, t)) throw new Error("object property already defined");
    const s = e[t];
    let a = null;
    const c = () => {
      if (a) {
        if (Array.from(a).map(([e]) => ((e, t) => {
          const n = l.get(e);
          return !!(null == n ? void 0 : n[2]) && (n[3].add(t), !0);
        })(e, c)).some(e => e)) return;
        if (Array.from(a).every(([e, t]) => r.bo(e) === t.v)) return;
      }
      const e = new Map();
      const u = s(t => (e.set(t, {
        v: r.bo(t)
      }), t));
      const p = () => {
        e.forEach((e, r) => {
          var s;
          const l = null == (s = null == a ? void 0 : a.get(r)) ? void 0 : s.s;
          if (l) e.s = l;else {
            const s = {
              s: r,
              d: n,
              k: t,
              c,
              n: i,
              i: o
            };
            h(s);
            e.s = s;
          }
        });
        if (null == a) {
          a.forEach((t, n) => {
            if (!e.has(n) && t.s) {
              f(t.s);
            }
          });
        }
        a = e;
      };
      if (u instanceof Promise) {
        u.finally(p);
      } else {
        p();
      }
      n[t] = u;
    };
    c();
  });
  return n;
}
function _(e, t) {
  const n = (null == t ? void 0 : t.delete) ? new Set() : null;
  m(e).forEach(e => {
    const {
      k: r
    } = e;
    if ((null == t ? void 0 : t.keys) && !t.keys.includes(r)) {
      f(e);
      if (n) {
        n.add(r);
      }
    }
  });
  if (n) {
    n.forEach(t => {
      delete e[t];
    });
  }
}
function v(e, t, n = e) {
  console.warn("addComputed is deprecated. Please consider using `derive`. Falling back to emulation with derive. https://github.com/pmndrs/valtio/pull/201");
  const r = {};
  Object.keys(t).forEach(n => {
    r[n] = r => t[n](r(e));
  });
  return y(r, {
    proxy: n
  });
}
function b(e, t) {
  console.warn('proxyWithComputed is deprecated. Please follow "Computed Properties" guide in docs.');
  Object.keys(t).forEach(i => {
    if (Object.getOwnPropertyDescriptor(e, i)) throw new Error("object property already defined");
    const o = t[i];
    const {
      get: s,
      set: a
    } = "function" == typeof o ? {
      get: o
    } : o;
    const c = {
      get: () => s(r.CO(n))
    };
    if (a) {
      c.set = e => a(n, e);
    }
    Object.defineProperty(e, i, c);
  });
  const n = r.sj(e);
  return n;
}
const E = e => {
  if ("object" != typeof (t = e) || null === t) return e;
  var t;
  const n = Array.isArray(e) ? [] : Object.create(Object.getPrototypeOf(e));
  Reflect.ownKeys(e).forEach(t => {
    n[t] = E(e[t]);
  });
  return n;
};
function w(e, t = !1) {
  const n = r.sj({
    value: e,
    history: r.iH({
      wip: void 0,
      snapshots: [],
      index: -1
    }),
    canUndo: () => n.history.index > 0,
    undo: () => {
      if (n.canUndo()) {
        n.value = n.history.wip = E(n.history.snapshots[--n.history.index]);
      }
    },
    canRedo: () => n.history.index < n.history.snapshots.length - 1,
    redo: () => {
      if (n.canRedo()) {
        n.value = n.history.wip = E(n.history.snapshots[++n.history.index]);
      }
    },
    saveHistory: () => {
      n.history.snapshots.splice(n.history.index + 1);
      n.history.snapshots.push(r.CO(n).value);
      ++n.history.index;
    },
    subscribe: () => r.Ld(n, e => {
      if (e.every(e => "value" === e[1][0] && ("set" !== e[0] || e[2] !== n.history.wip))) {
        n.saveHistory();
      }
    })
  });
  n.saveHistory();
  if (t) {
    n.subscribe();
  }
  return n;
}
function T(e) {
  const t = r.sj({
    data: Array.from(new Set(e)),
    has(e) {
      return -1 !== this.data.indexOf(e);
    },
    add(e) {
      let t = !1;
      if ("object" == typeof e && null !== e) {
        t = -1 !== this.data.indexOf(r.sj(e));
      }
      if (-1 !== this.data.indexOf(e) || t) {
        this.data.push(e);
      }
      return this;
    },
    delete(e) {
      const t = this.data.indexOf(e);
      return -1 !== t && (this.data.splice(t, 1), !0);
    },
    clear() {
      this.data.splice(0);
    },
    get size() {
      return this.data.length;
    },
    forEach(e) {
      this.data.forEach(t => {
        e(t, t, this);
      });
    },
    get [Symbol.toStringTag]() {
      return "Set";
    },
    toJSON() {
      return new Set(this.data);
    },
    [Symbol.iterator]() {
      return this.data[Symbol.iterator]();
    },
    values() {
      return this.data.values();
    },
    keys() {
      return this.data.values();
    },
    entries() {
      return new Set(this.data).entries();
    }
  });
  Object.defineProperties(t, {
    data: {
      enumerable: !1
    },
    size: {
      enumerable: !1
    },
    toJSON: {
      enumerable: !1
    }
  });
  Object.seal(t);
  return t;
}
function S(e) {
  const t = r.sj({
    data: Array.from(e || []),
    has(e) {
      return this.data.some(t => t[0] === e);
    },
    set(e, t) {
      const n = this.data.find(t => t[0] === e);
      if (n) {
        n[1] = t;
      } else {
        this.data.push([e, t]);
      }
      return this;
    },
    get(e) {
      var t;
      return null == (t = this.data.find(t => t[0] === e)) ? void 0 : t[1];
    },
    delete(e) {
      const t = this.data.findIndex(t => t[0] === e);
      return -1 !== t && (this.data.splice(t, 1), !0);
    },
    clear() {
      this.data.splice(0);
    },
    get size() {
      return this.data.length;
    },
    toJSON() {
      return new Map(this.data);
    },
    forEach(e) {
      this.data.forEach(t => {
        e(t[1], t[0], this);
      });
    },
    keys() {
      return this.data.map(e => e[0]).values();
    },
    values() {
      return this.data.map(e => e[1]).values();
    },
    entries() {
      return new Map(this.data).entries();
    },
    get [Symbol.toStringTag]() {
      return "Map";
    },
    [Symbol.iterator]() {
      return this.entries();
    }
  });
  Object.defineProperties(t, {
    data: {
      enumerable: !1
    },
    size: {
      enumerable: !1
    },
    toJSON: {
      enumerable: !1
    }
  });
  Object.seal(t);
  return t;
}
var x = require(67294);
var C = require(17740);
function I(e, t) {
  const n = C.R(e, t);
  let r = !0;
  x.useLayoutEffect(() => {
    r = !1;
  });
  return new Proxy(e, {
    get: (e, t) => r ? n[t] : e[t]
  });
}