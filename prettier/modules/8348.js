const t = "object" == typeof performance && performance && "function" == typeof performance.now ? performance : Date;
const n = "function" == typeof AbortController ? AbortController : class {
  constructor() {
    this.signal = new o();
  }
  abort() {
    this.signal.dispatchEvent("abort");
  }
};
const r = "function" == typeof AbortSignal;
const i = "function" == typeof n.AbortSignal;
const o = r ? AbortSignal : i ? n.AbortController : class {
  constructor() {
    this.aborted = !1;
    this._listeners = [];
  }
  dispatchEvent(e) {
    if ("abort" === e) {
      this.aborted = !0;
      const t = {
        type: e,
        target: this
      };
      this.onabort(t);
      this._listeners.forEach(e => e(t), this);
    }
  }
  onabort() {}
  addEventListener(e, t) {
    if ("abort" === e) {
      this._listeners.push(t);
    }
  }
  removeEventListener(e, t) {
    if ("abort" === e) {
      this._listeners = this._listeners.filter(e => e !== t);
    }
  }
};
const s = new Set();
const a = (e, t) => {
  const n = `LRU_CACHE_OPTION_${e}`;
  if (u(n)) {
    p(n, `${e} option`, `options.${t}`, g);
  }
};
const c = (e, t) => {
  const n = `LRU_CACHE_METHOD_${e}`;
  if (u(n)) {
    const {
      prototype: r
    } = g;
    const {
      get: i
    } = Object.getOwnPropertyDescriptor(r, e);
    p(n, `${e} method`, `cache.${t}()`, i);
  }
};
const l = (...e) => {
  if ("object" == typeof process && process && "function" == typeof process.emitWarning) {
    process.emitWarning(...e);
  } else {
    console.error(...e);
  }
};
const u = e => !s.has(e);
const p = (e, t, n, r) => {
  s.add(e);
  l(`The ${t} is deprecated. Please use ${n} instead.`, "DeprecationWarning", e, r);
};
const d = e => e && e === Math.floor(e) && e > 0 && isFinite(e);
const h = e => d(e) ? e <= Math.pow(2, 8) ? Uint8Array : e <= Math.pow(2, 16) ? Uint16Array : e <= Math.pow(2, 32) ? Uint32Array : e <= Number.MAX_SAFE_INTEGER ? f : null : null;
class f extends Array {
  constructor(e) {
    super(e);
    this.fill(0);
  }
}
class m {
  constructor(e) {
    if (0 === e) return [];
    const t = h(e);
    this.heap = new t(e);
    this.length = 0;
  }
  push(e) {
    this.heap[this.length++] = e;
  }
  pop() {
    return this.heap[--this.length];
  }
}
class g {
  constructor(e = {}) {
    const {
      max: t = 0,
      ttl: n,
      ttlResolution: r = 1,
      ttlAutopurge: i,
      updateAgeOnGet: o,
      updateAgeOnHas: c,
      allowStale: p,
      dispose: f,
      disposeAfter: y,
      noDisposeOnSet: _,
      noUpdateTTL: v,
      maxSize: b = 0,
      sizeCalculation: E,
      fetchMethod: w,
      fetchContext: T,
      noDeleteOnFetchRejection: S,
      noDeleteOnStaleGet: x
    } = e;
    const {
      length: C,
      maxAge: I,
      stale: A
    } = e instanceof g ? {} : e;
    if (0 !== t && !d(t)) throw new TypeError("max option must be a nonnegative integer");
    const k = t ? h(t) : Array;
    if (!k) throw new Error("invalid max value: " + t);
    this.max = t;
    this.maxSize = b;
    this.sizeCalculation = E || C;
    if (this.sizeCalculation) {
      if (!this.maxSize) throw new TypeError("cannot set sizeCalculation without setting maxSize");
      if ("function" != typeof this.sizeCalculation) throw new TypeError("sizeCalculation set to non-function");
    }
    this.fetchMethod = w || null;
    if (this.fetchMethod && "function" != typeof this.fetchMethod) throw new TypeError("fetchMethod must be a function if specified");
    this.fetchContext = T;
    if (!this.fetchMethod && void 0 !== T) throw new TypeError("cannot set fetchContext without fetchMethod");
    this.keyMap = new Map();
    this.keyList = new Array(t).fill(null);
    this.valList = new Array(t).fill(null);
    this.next = new k(t);
    this.prev = new k(t);
    this.head = 0;
    this.tail = 0;
    this.free = new m(t);
    this.initialFill = 1;
    this.size = 0;
    if ("function" == typeof f) {
      this.dispose = f;
    }
    if ("function" == typeof y) {
      this.disposeAfter = y;
      this.disposed = [];
    } else {
      this.disposeAfter = null;
      this.disposed = null;
    }
    this.noDisposeOnSet = !!_;
    this.noUpdateTTL = !!v;
    this.noDeleteOnFetchRejection = !!S;
    if (0 !== this.maxSize) {
      if (!d(this.maxSize)) throw new TypeError("maxSize must be a positive integer if specified");
      this.initializeSizeTracking();
    }
    this.allowStale = !!p || !!A;
    this.noDeleteOnStaleGet = !!x;
    this.updateAgeOnGet = !!o;
    this.updateAgeOnHas = !!c;
    this.ttlResolution = d(r) || 0 === r ? r : 1;
    this.ttlAutopurge = !!i;
    this.ttl = n || I || 0;
    if (this.ttl) {
      if (!d(this.ttl)) throw new TypeError("ttl must be a positive integer if specified");
      this.initializeTTLTracking();
    }
    if (0 === this.max && 0 === this.ttl && 0 === this.maxSize) throw new TypeError("At least one of max, maxSize, or ttl is required");
    if (!this.ttlAutopurge && !this.max && !this.maxSize) {
      const e = "LRU_CACHE_UNBOUNDED";
      if (u(e)) {
        s.add(e);
        l("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", e, g);
      }
    }
    if (A) {
      a("stale", "allowStale");
    }
    if (I) {
      a("maxAge", "ttl");
    }
    if (C) {
      a("length", "sizeCalculation");
    }
  }
  getRemainingTTL(e) {
    return this.has(e, {
      updateAgeOnHas: !1
    }) ? 1 / 0 : 0;
  }
  initializeTTLTracking() {
    this.ttls = new f(this.max);
    this.starts = new f(this.max);
    this.setItemTTL = (e, n, r = t.now()) => {
      this.starts[e] = 0 !== n ? r : 0;
      this.ttls[e] = n;
      if (0 !== n && this.ttlAutopurge) {
        const t = setTimeout(() => {
          this.isStale(e) && this.delete(this.keyList[e]);
        }, n + 1);
        t.unref && t.unref();
      }
    };
    this.updateItemAge = e => {
      this.starts[e] = 0 !== this.ttls[e] ? t.now() : 0;
    };
    let e = 0;
    const n = () => {
      const n = t.now();
      if (this.ttlResolution > 0) {
        e = n;
        const t = setTimeout(() => e = 0, this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    };
    this.getRemainingTTL = t => {
      const r = this.keyMap.get(t);
      return void 0 === r ? 0 : 0 === this.ttls[r] || 0 === this.starts[r] ? 1 / 0 : this.starts[r] + this.ttls[r] - (e || n());
    };
    this.isStale = t => 0 !== this.ttls[t] && 0 !== this.starts[t] && (e || n()) - this.starts[t] > this.ttls[t];
  }
  updateItemAge(e) {}
  setItemTTL(e, t, n) {}
  isStale(e) {
    return !1;
  }
  initializeSizeTracking() {
    this.calculatedSize = 0;
    this.sizes = new f(this.max);
    this.removeItemSize = e => {
      this.calculatedSize -= this.sizes[e];
      this.sizes[e] = 0;
    };
    this.requireSize = (e, t, n, r) => {
      if (!d(n)) {
        if (!r) throw new TypeError("invalid size value (must be positive integer)");
        if ("function" != typeof r) throw new TypeError("sizeCalculation must be a function");
        n = r(t, e);
        if (!d(n)) throw new TypeError("sizeCalculation return invalid (expect positive integer)");
      }
      return n;
    };
    this.addItemSize = (e, t) => {
      this.sizes[e] = t;
      const n = this.maxSize - this.sizes[e];
      for (; this.calculatedSize > n;) this.evict(!0);
      this.calculatedSize += this.sizes[e];
    };
  }
  removeItemSize(e) {}
  addItemSize(e, t) {}
  requireSize(e, t, n, r) {
    if (n || r) throw new TypeError("cannot set size without setting maxSize on cache");
  }
  *indexes({
    allowStale: e = this.allowStale
  } = {}) {
    if (this.size) for (let t = this.tail; this.isValidIndex(t) && (!e && this.isStale(t) || (yield t), t !== this.head);) t = this.prev[t];
  }
  *rindexes({
    allowStale: e = this.allowStale
  } = {}) {
    if (this.size) for (let t = this.head; this.isValidIndex(t) && (!e && this.isStale(t) || (yield t), t !== this.tail);) t = this.next[t];
  }
  isValidIndex(e) {
    return this.keyMap.get(this.keyList[e]) === e;
  }
  *entries() {
    for (const e of this.indexes()) yield [this.keyList[e], this.valList[e]];
  }
  *rentries() {
    for (const e of this.rindexes()) yield [this.keyList[e], this.valList[e]];
  }
  *keys() {
    for (const e of this.indexes()) yield this.keyList[e];
  }
  *rkeys() {
    for (const e of this.rindexes()) yield this.keyList[e];
  }
  *values() {
    for (const e of this.indexes()) yield this.valList[e];
  }
  *rvalues() {
    for (const e of this.rindexes()) yield this.valList[e];
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  find(e, t = {}) {
    for (const n of this.indexes()) if (e(this.valList[n], this.keyList[n], this)) return this.get(this.keyList[n], t);
  }
  forEach(e, t = this) {
    for (const n of this.indexes()) e.call(t, this.valList[n], this.keyList[n], this);
  }
  rforEach(e, t = this) {
    for (const n of this.rindexes()) e.call(t, this.valList[n], this.keyList[n], this);
  }
  get prune() {
    c("prune", "purgeStale");
    return this.purgeStale;
  }
  purgeStale() {
    let e = !1;
    for (const t of this.rindexes({
      allowStale: !0
    })) if (this.isStale(t)) {
      this.delete(this.keyList[t]);
      e = !0;
    }
    return e;
  }
  dump() {
    const e = [];
    for (const n of this.indexes({
      allowStale: !0
    })) {
      const r = this.keyList[n];
      const i = this.valList[n];
      const o = {
        value: this.isBackgroundFetch(i) ? i.__staleWhileFetching : i
      };
      if (this.ttls) {
        o.ttl = this.ttls[n];
        const e = t.now() - this.starts[n];
        o.start = Math.floor(Date.now() - e);
      }
      if (this.sizes) {
        o.size = this.sizes[n];
      }
      e.unshift([r, o]);
    }
    return e;
  }
  load(e) {
    this.clear();
    for (const [n, r] of e) {
      if (r.start) {
        const e = Date.now() - r.start;
        r.start = t.now() - e;
      }
      this.set(n, r.value, r);
    }
  }
  dispose(e, t, n) {}
  set(e, t, {
    ttl: n = this.ttl,
    start: r,
    noDisposeOnSet: i = this.noDisposeOnSet,
    size: o = 0,
    sizeCalculation: s = this.sizeCalculation,
    noUpdateTTL: a = this.noUpdateTTL
  } = {}) {
    o = this.requireSize(e, t, o, s);
    if (this.maxSize && o > this.maxSize) return this;
    let c = 0 === this.size ? void 0 : this.keyMap.get(e);
    if (void 0 === c) {
      c = this.newIndex();
      this.keyList[c] = e;
      this.valList[c] = t;
      this.keyMap.set(e, c);
      this.next[this.tail] = c;
      this.prev[c] = this.tail;
      this.tail = c;
      this.size++;
      this.addItemSize(c, o);
      a = !1;
    } else {
      const n = this.valList[c];
      if (t !== n) {
        if (this.isBackgroundFetch(n)) {
          n.__abortController.abort();
        } else {
          if (i) {
            this.dispose(n, e, "set");
            if (this.disposeAfter) {
              this.disposed.push([n, e, "set"]);
            }
          }
        }
        this.removeItemSize(c);
        this.valList[c] = t;
        this.addItemSize(c, o);
      }
      this.moveToTail(c);
    }
    if (0 === n || 0 !== this.ttl || this.ttls) {
      this.initializeTTLTracking();
    }
    if (a) {
      this.setItemTTL(c, n, r);
    }
    if (this.disposeAfter) for (; this.disposed.length;) this.disposeAfter(...this.disposed.shift());
    return this;
  }
  newIndex() {
    return 0 === this.size ? this.tail : this.size === this.max && 0 !== this.max ? this.evict(!1) : 0 !== this.free.length ? this.free.pop() : this.initialFill++;
  }
  pop() {
    if (this.size) {
      const e = this.valList[this.head];
      this.evict(!0);
      return e;
    }
  }
  evict(e) {
    const t = this.head;
    const n = this.keyList[t];
    const r = this.valList[t];
    if (this.isBackgroundFetch(r)) {
      r.__abortController.abort();
    } else {
      this.dispose(r, n, "evict");
      if (this.disposeAfter) {
        this.disposed.push([r, n, "evict"]);
      }
    }
    this.removeItemSize(t);
    if (e) {
      this.keyList[t] = null;
      this.valList[t] = null;
      this.free.push(t);
    }
    this.head = this.next[t];
    this.keyMap.delete(n);
    this.size--;
    return t;
  }
  has(e, {
    updateAgeOnHas: t = this.updateAgeOnHas
  } = {}) {
    const n = this.keyMap.get(e);
    return void 0 !== n && !this.isStale(n) && (t && this.updateItemAge(n), !0);
  }
  peek(e, {
    allowStale: t = this.allowStale
  } = {}) {
    const n = this.keyMap.get(e);
    if (void 0 !== n && (t || !this.isStale(n))) {
      const e = this.valList[n];
      return this.isBackgroundFetch(e) ? e.__staleWhileFetching : e;
    }
  }
  backgroundFetch(e, t, r, i) {
    const o = void 0 === t ? void 0 : this.valList[t];
    if (this.isBackgroundFetch(o)) return o;
    const s = new n();
    const a = {
      signal: s.signal,
      options: r,
      context: i
    };
    const c = new Promise(t => t(this.fetchMethod(e, o, a))).then(t => (s.signal.aborted || this.set(e, t, a.options), t), n => {
      if (this.valList[t] === c) {
        if (r.noDeleteOnFetchRejection && void 0 !== c.__staleWhileFetching) {
          this.valList[t] = c.__staleWhileFetching;
        } else {
          this.delete(e);
        }
      }
      if (c.__returned === c) throw n;
    });
    c.__abortController = s;
    c.__staleWhileFetching = o;
    c.__returned = null;
    if (void 0 === t) {
      this.set(e, c, a.options);
      t = this.keyMap.get(e);
    } else {
      this.valList[t] = c;
    }
    return c;
  }
  isBackgroundFetch(e) {
    return e && "object" == typeof e && "function" == typeof e.then && Object.prototype.hasOwnProperty.call(e, "__staleWhileFetching") && Object.prototype.hasOwnProperty.call(e, "__returned") && (e.__returned === e || null === e.__returned);
  }
  async fetch(e, {
    allowStale: t = this.allowStale,
    updateAgeOnGet: n = this.updateAgeOnGet,
    noDeleteOnStaleGet: r = this.noDeleteOnStaleGet,
    ttl: i = this.ttl,
    noDisposeOnSet: o = this.noDisposeOnSet,
    size: s = 0,
    sizeCalculation: a = this.sizeCalculation,
    noUpdateTTL: c = this.noUpdateTTL,
    noDeleteOnFetchRejection: l = this.noDeleteOnFetchRejection,
    fetchContext: u = this.fetchContext,
    forceRefresh: p = !1
  } = {}) {
    if (!this.fetchMethod) return this.get(e, {
      allowStale: t,
      updateAgeOnGet: n,
      noDeleteOnStaleGet: r
    });
    const d = {
      allowStale: t,
      updateAgeOnGet: n,
      noDeleteOnStaleGet: r,
      ttl: i,
      noDisposeOnSet: o,
      size: s,
      sizeCalculation: a,
      noUpdateTTL: c,
      noDeleteOnFetchRejection: l
    };
    let h = this.keyMap.get(e);
    if (void 0 === h) {
      const t = this.backgroundFetch(e, h, d, u);
      return t.__returned = t;
    }
    {
      const r = this.valList[h];
      if (this.isBackgroundFetch(r)) return t && void 0 !== r.__staleWhileFetching ? r.__staleWhileFetching : r.__returned = r;
      if (!p && !this.isStale(h)) {
        this.moveToTail(h);
        if (n) {
          this.updateItemAge(h);
        }
        return r;
      }
      const i = this.backgroundFetch(e, h, d, u);
      return t && void 0 !== i.__staleWhileFetching ? i.__staleWhileFetching : i.__returned = i;
    }
  }
  get(e, {
    allowStale: t = this.allowStale,
    updateAgeOnGet: n = this.updateAgeOnGet,
    noDeleteOnStaleGet: r = this.noDeleteOnStaleGet
  } = {}) {
    const i = this.keyMap.get(e);
    if (void 0 !== i) {
      const o = this.valList[i];
      const s = this.isBackgroundFetch(o);
      if (this.isStale(i)) return s ? t ? o.__staleWhileFetching : void 0 : (r || this.delete(e), t ? o : void 0);
      if (s) return;
      this.moveToTail(i);
      if (n) {
        this.updateItemAge(i);
      }
      return o;
    }
  }
  connect(e, t) {
    this.prev[t] = e;
    this.next[e] = t;
  }
  moveToTail(e) {
    if (e !== this.tail) {
      if (e === this.head) {
        this.head = this.next[e];
      } else {
        this.connect(this.prev[e], this.next[e]);
      }
      this.connect(this.tail, e);
      this.tail = e;
    }
  }
  get del() {
    c("del", "delete");
    return this.delete;
  }
  delete(e) {
    let t = !1;
    if (0 !== this.size) {
      const n = this.keyMap.get(e);
      if (void 0 !== n) {
        t = !0;
        if (1 === this.size) this.clear();else {
          this.removeItemSize(n);
          const t = this.valList[n];
          if (this.isBackgroundFetch(t)) {
            t.__abortController.abort();
          } else {
            this.dispose(t, e, "delete");
            if (this.disposeAfter) {
              this.disposed.push([t, e, "delete"]);
            }
          }
          this.keyMap.delete(e);
          this.keyList[n] = null;
          this.valList[n] = null;
          if (n === this.tail) {
            this.tail = this.prev[n];
          } else {
            if (n === this.head) {
              this.head = this.next[n];
            } else {
              this.next[this.prev[n]] = this.next[n];
              this.prev[this.next[n]] = this.prev[n];
            }
          }
          this.size--;
          this.free.push(n);
        }
      }
    }
    if (this.disposed) for (; this.disposed.length;) this.disposeAfter(...this.disposed.shift());
    return t;
  }
  clear() {
    for (const e of this.rindexes({
      allowStale: !0
    })) {
      const t = this.valList[e];
      if (this.isBackgroundFetch(t)) t.__abortController.abort();else {
        const n = this.keyList[e];
        this.dispose(t, n, "delete");
        if (this.disposeAfter) {
          this.disposed.push([t, n, "delete"]);
        }
      }
    }
    this.keyMap.clear();
    this.valList.fill(null);
    this.keyList.fill(null);
    if (this.ttls) {
      this.ttls.fill(0);
      this.starts.fill(0);
    }
    if (this.sizes) {
      this.sizes.fill(0);
    }
    this.head = 0;
    this.tail = 0;
    this.initialFill = 1;
    this.free.length = 0;
    this.calculatedSize = 0;
    this.size = 0;
    if (this.disposed) for (; this.disposed.length;) this.disposeAfter(...this.disposed.shift());
  }
  get reset() {
    c("reset", "clear");
    return this.clear;
  }
  get length() {
    ((e, t) => {
      const n = `LRU_CACHE_PROPERTY_${e}`;
      if (u(n)) {
        const {
          prototype: t
        } = g;
        const {
          get: r
        } = Object.getOwnPropertyDescriptor(t, e);
        p(n, `${e} property`, "cache.size", r);
      }
    })("length");
    return this.size;
  }
  static get AbortController() {
    return n;
  }
  static get AbortSignal() {
    return o;
  }
}
module.exports = g;