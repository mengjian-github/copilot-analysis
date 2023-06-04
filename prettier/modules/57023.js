Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
class _CodeOrName {}
exports._CodeOrName = _CodeOrName;
exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
class Name extends _CodeOrName {
  constructor(e) {
    super();
    if (!exports.IDENTIFIER.test(e)) throw new Error("CodeGen: name must be a valid identifier");
    this.str = e;
  }
  toString() {
    return this.str;
  }
  emptyStr() {
    return !1;
  }
  get names() {
    return {
      [this.str]: 1
    };
  }
}
exports.Name = Name;
class _Code extends _CodeOrName {
  constructor(e) {
    super();
    this._items = "string" == typeof e ? [e] : e;
  }
  toString() {
    return this.str;
  }
  emptyStr() {
    if (this._items.length > 1) return !1;
    const e = this._items[0];
    return "" === e || '""' === e;
  }
  get str() {
    var e;
    return null !== (e = this._str) && void 0 !== e ? e : this._str = this._items.reduce((e, t) => `${e}${t}`, "");
  }
  get names() {
    var e;
    return null !== (e = this._names) && void 0 !== e ? e : this._names = this._items.reduce((e, t) => (t instanceof Name && (e[t.str] = (e[t.str] || 0) + 1), e), {});
  }
}
function _(e, ...t) {
  const n = [e[0]];
  let r = 0;
  for (; r < t.length;) {
    addCodeArg(n, t[r]);
    n.push(e[++r]);
  }
  return new _Code(n);
}
exports._Code = _Code;
exports.nil = new _Code("");
exports._ = _;
const s = new _Code("+");
function str(e, ...t) {
  const n = [safeStringify(e[0])];
  let r = 0;
  for (; r < t.length;) {
    n.push(s);
    addCodeArg(n, t[r]);
    n.push(s, safeStringify(e[++r]));
  }
  (function (e) {
    let t = 1;
    for (; t < e.length - 1;) {
      if (e[t] === s) {
        const n = l(e[t - 1], e[t + 1]);
        if (void 0 !== n) {
          e.splice(t - 1, 3, n);
          continue;
        }
        e[t++] = "+";
      }
      t++;
    }
  })(n);
  return new _Code(n);
}
function addCodeArg(e, t) {
  var n;
  if (t instanceof _Code) {
    e.push(...t._items);
  } else {
    if (t instanceof Name) {
      e.push(t);
    } else {
      e.push("number" == typeof (n = t) || "boolean" == typeof n || null === n ? n : safeStringify(Array.isArray(n) ? n.join(",") : n));
    }
  }
}
function l(e, t) {
  if ('""' === t) return e;
  if ('""' === e) return t;
  if ("string" == typeof e) {
    if (t instanceof Name || '"' !== e[e.length - 1]) return;
    return "string" != typeof t ? `${e.slice(0, -1)}${t}"` : '"' === t[0] ? e.slice(0, -1) + t.slice(1) : void 0;
  }
  return "string" != typeof t || '"' !== t[0] || e instanceof Name ? void 0 : `"${e}${t.slice(1)}`;
}
function safeStringify(e) {
  return JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
exports.str = str;
exports.addCodeArg = addCodeArg;
exports.strConcat = function (e, t) {
  return t.emptyStr() ? e : e.emptyStr() ? t : str`${e}${t}`;
};
exports.stringify = function (e) {
  return new _Code(safeStringify(e));
};
exports.safeStringify = safeStringify;
exports.getProperty = function (e) {
  return "string" == typeof e && exports.IDENTIFIER.test(e) ? new _Code(`.${e}`) : _`[${e}]`;
};
exports.getEsmExportName = function (e) {
  if ("string" == typeof e && exports.IDENTIFIER.test(e)) return new _Code(`${e}`);
  throw new Error(`CodeGen: invalid export name: ${e}, use explicit $id name mapping`);
};
exports.regexpCode = function (e) {
  return new _Code(e.toString());
};