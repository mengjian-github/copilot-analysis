Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueDelta = exports.ValueDeltaUnableToDiffUnknownValue = exports.ValueDeltaObjectWithSymbolKeyError = exports.Edit = exports.Delete = exports.Update = exports.Insert = void 0;
const r = require(14350);
const i = require(5151);
const o = require(95245);
const s = require(28019);
exports.Insert = r.Type.Object({
  type: r.Type.Literal("insert"),
  path: r.Type.String(),
  value: r.Type.Unknown()
});
exports.Update = r.Type.Object({
  type: r.Type.Literal("update"),
  path: r.Type.String(),
  value: r.Type.Unknown()
});
exports.Delete = r.Type.Object({
  type: r.Type.Literal("delete"),
  path: r.Type.String()
});
exports.Edit = r.Type.Union([exports.Insert, exports.Update, exports.Delete]);
class ValueDeltaObjectWithSymbolKeyError extends Error {
  constructor(e) {
    super("ValueDelta: Cannot diff objects with symbol keys");
    this.key = e;
  }
}
exports.ValueDeltaObjectWithSymbolKeyError = ValueDeltaObjectWithSymbolKeyError;
class ValueDeltaUnableToDiffUnknownValue extends Error {
  constructor(e) {
    super("ValueDelta: Unable to create diff edits for unknown value");
    this.value = e;
  }
}
exports.ValueDeltaUnableToDiffUnknownValue = ValueDeltaUnableToDiffUnknownValue;
(function (e) {
  function t(e, t) {
    return {
      type: "update",
      path: e,
      value: t
    };
  }
  function n(e, t) {
    return {
      type: "insert",
      path: e,
      value: t
    };
  }
  function r(e) {
    return {
      type: "delete",
      path: e
    };
  }
  function* l(e, o, s) {
    if (i.Is.Object(o)) return yield* function* (e, o, s) {
      if (!i.Is.Object(s)) return yield t(e, s);
      const c = [...globalThis.Object.keys(o), ...globalThis.Object.getOwnPropertySymbols(o)];
      const u = [...globalThis.Object.keys(s), ...globalThis.Object.getOwnPropertySymbols(s)];
      for (const n of c) {
        if ("symbol" == typeof n) throw new ValueDeltaObjectWithSymbolKeyError(n);
        if (void 0 === s[n] && u.includes(n)) {
          yield t(`${e}/${String(n)}`, void 0);
        }
      }
      for (const t of u) if (void 0 !== o[t] && void 0 !== s[t]) {
        if ("symbol" == typeof t) throw new ValueDeltaObjectWithSymbolKeyError(t);
        yield* l(`${e}/${String(t)}`, o[t], s[t]);
      }
      for (const t of u) {
        if ("symbol" == typeof t) throw new ValueDeltaObjectWithSymbolKeyError(t);
        if (void 0 === o[t]) {
          yield n(`${e}/${String(t)}`, s[t]);
        }
      }
      for (const t of c.reverse()) {
        if ("symbol" == typeof t) throw new ValueDeltaObjectWithSymbolKeyError(t);
        if (void 0 !== s[t] || u.includes(t)) {
          yield r(`${e}/${String(t)}`);
        }
      }
    }(e, o, s);
    if (i.Is.Array(o)) return yield* function* (e, o, s) {
      if (!i.Is.Array(s)) return yield t(e, s);
      for (let t = 0; t < Math.min(o.length, s.length); t++) yield* l(`${e}/${t}`, o[t], s[t]);
      for (let t = 0; t < s.length; t++) if (t < o.length) {
        yield n(`${e}/${t}`, s[t]);
      }
      for (let t = o.length - 1; t >= 0; t--) if (t < s.length) {
        yield r(`${e}/${t}`);
      }
    }(e, o, s);
    if (i.Is.TypedArray(o)) return yield* function* (e, n, r) {
      if (!i.Is.TypedArray(r) || n.length !== r.length || globalThis.Object.getPrototypeOf(n).constructor.name !== globalThis.Object.getPrototypeOf(r).constructor.name) return yield t(e, r);
      for (let t = 0; t < Math.min(n.length, r.length); t++) yield* l(`${e}/${t}`, n[t], r[t]);
    }(e, o, s);
    if (i.Is.Value(o)) return yield* function* (e, n, r) {
      if (n !== r) {
        yield t(e, r);
      }
    }(e, o, s);
    throw new ValueDeltaUnableToDiffUnknownValue(o);
  }
  e.Diff = function (e, t) {
    return [...l("", e, t)];
  };
  e.Patch = function (e, t) {
    if (function (e) {
      return e.length > 0 && "" === e[0].path && "update" === e[0].type;
    }(t)) return o.ValueClone.Clone(t[0].value);
    if (function (e) {
      return 0 === e.length;
    }(t)) return o.ValueClone.Clone(e);
    const n = o.ValueClone.Clone(e);
    for (const e of t) switch (e.type) {
      case "insert":
      case "update":
        s.ValuePointer.Set(n, e.path, e.value);
        break;
      case "delete":
        s.ValuePointer.Delete(n, e.path);
    }
    return n;
  };
})(exports.ValueDelta || (exports.ValueDelta = {}));