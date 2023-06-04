Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValuePointer = exports.ValuePointerRootDeleteError = exports.ValuePointerRootSetError = void 0;
class ValuePointerRootSetError extends Error {
  constructor(e, t, n) {
    super("ValuePointer: Cannot set root value");
    this.value = e;
    this.path = t;
    this.update = n;
  }
}
exports.ValuePointerRootSetError = ValuePointerRootSetError;
class ValuePointerRootDeleteError extends Error {
  constructor(e, t) {
    super("ValuePointer: Cannot delete root value");
    this.value = e;
    this.path = t;
  }
}
exports.ValuePointerRootDeleteError = ValuePointerRootDeleteError;
(function (e) {
  function t(e) {
    return -1 === e.indexOf("~") ? e : e.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  function* i(e) {
    if ("" === e) return;
    let [n, r] = [0, 0];
    for (let i = 0; i < e.length; i++) if ("/" === e.charAt(i)) {
      if (0 === i) {
        r = i;
        yield t(e.slice(n, r));
      }
      n = i + 1;
    } else {
      r = i;
    }
    yield t(e.slice(n));
  }
  e.Format = i;
  e.Set = function (e, t, r) {
    if ("" === t) throw new ValuePointerRootSetError(e, t, r);
    let [o, s, a] = [null, e, ""];
    for (const e of i(t)) {
      if (void 0 === s[e]) {
        s[e] = {};
      }
      o = s;
      s = s[e];
      a = e;
    }
    o[a] = r;
  };
  e.Delete = function (e, t) {
    if ("" === t) throw new ValuePointerRootDeleteError(e, t);
    let [n, o, s] = [null, e, ""];
    for (const e of i(t)) {
      if (void 0 === o[e] || null === o[e]) return;
      n = o;
      o = o[e];
      s = e;
    }
    if (globalThis.Array.isArray(n)) {
      const e = parseInt(s);
      n.splice(e, 1);
    } else delete n[s];
  };
  e.Has = function (e, t) {
    if ("" === t) return !0;
    let [n, r, o] = [null, e, ""];
    for (const e of i(t)) {
      if (void 0 === r[e]) return !1;
      n = r;
      r = r[e];
      o = e;
    }
    return globalThis.Object.getOwnPropertyNames(n).includes(o);
  };
  e.Get = function (e, t) {
    if ("" === t) return e;
    let n = e;
    for (const e of i(t)) {
      if (void 0 === n[e]) return;
      n = n[e];
    }
    return n;
  };
})(exports.ValuePointer || (exports.ValuePointer = {}));