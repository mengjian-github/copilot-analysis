Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueHash = exports.ValueHashError = void 0;
class ValueHashError extends Error {
  constructor(e) {
    super("Hash: Unable to hash value");
    this.value = e;
  }
}
exports.ValueHashError = ValueHashError;
(function (e) {
  let t;
  !function (e) {
    e[e.Undefined = 0] = "Undefined";
    e[e.Null = 1] = "Null";
    e[e.Boolean = 2] = "Boolean";
    e[e.Number = 3] = "Number";
    e[e.String = 4] = "String";
    e[e.Object = 5] = "Object";
    e[e.Array = 6] = "Array";
    e[e.Date = 7] = "Date";
    e[e.Uint8Array = 8] = "Uint8Array";
    e[e.Symbol = 9] = "Symbol";
    e[e.BigInt = 10] = "BigInt";
  }(t || (t = {}));
  let r = globalThis.BigInt("14695981039346656037");
  const [i, o] = [globalThis.BigInt("1099511628211"), globalThis.BigInt("2") ** globalThis.BigInt("64")];
  const s = globalThis.Array.from({
    length: 256
  }).map((e, t) => globalThis.BigInt(t));
  const a = new globalThis.Float64Array(1);
  const c = new globalThis.DataView(a.buffer);
  const l = new globalThis.Uint8Array(a.buffer);
  function u(e) {
    return e instanceof globalThis.Date;
  }
  function p(e) {
    return e instanceof globalThis.Uint8Array;
  }
  function d(e) {
    return globalThis.Array.isArray(e);
  }
  function h(e) {
    if (d(e)) !function (e) {
      f(t.Array);
      for (const t of e) h(t);
    }(e);else if (function (e) {
      return "boolean" == typeof e;
    }(e)) !function (e) {
      f(t.Boolean);
      f(e ? 1 : 0);
    }(e);else if (function (e) {
      return "bigint" == typeof e;
    }(e)) !function (e) {
      f(t.BigInt);
      c.setBigInt64(0, e);
      for (const e of l) f(e);
    }(e);else if (u(e)) !function (e) {
      f(t.Date);
      h(e.getTime());
    }(e);else if (function (e) {
      return null === e;
    }(e)) f(t.Null);else if (function (e) {
      return "number" == typeof e;
    }(e)) !function (e) {
      f(t.Number);
      c.setFloat64(0, e);
      for (const e of l) f(e);
    }(e);else if (function (e) {
      return "object" == typeof e && null !== e && !d(e) && !u(e) && !p(e);
    }(e)) !function (e) {
      f(t.Object);
      for (const t of globalThis.Object.keys(e).sort()) {
        h(t);
        h(e[t]);
      }
    }(e);else if (function (e) {
      return "string" == typeof e;
    }(e)) !function (e) {
      f(t.String);
      for (let t = 0; t < e.length; t++) f(e.charCodeAt(t));
    }(e);else if (function (e) {
      return "symbol" == typeof e;
    }(e)) !function (e) {
      f(t.Symbol);
      h(e.description);
    }(e);else if (p(e)) !function (e) {
      f(t.Uint8Array);
      for (let t = 0; t < e.length; t++) f(e[t]);
    }(e);else {
      if (!function (e) {
        return void 0 === e;
      }(e)) throw new ValueHashError(e);
      f(t.Undefined);
    }
  }
  function f(e) {
    r ^= s[e];
    r = r * i % o;
  }
  e.Create = function (e) {
    r = globalThis.BigInt("14695981039346656037");
    h(e);
    return r;
  };
})(exports.ValueHash || (exports.ValueHash = {}));