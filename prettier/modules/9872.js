const {
  validateHeaderName: r,
  validateHeaderValue: i
} = require(13685);
const {
  isPlainObject: o
} = require(4544);
const s = Symbol("Headers internals");
const a = e => {
  const t = "string" != typeof e ? String(e) : e;
  if ("function" == typeof r) r(t);else if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(t)) {
    const e = new TypeError(`Header name must be a valid HTTP token [${t}]`);
    throw Object.defineProperty(e, "code", {
      value: "ERR_INVALID_HTTP_TOKEN"
    }), e;
  }
  return t.toLowerCase();
};
const c = (e, t) => {
  const n = "string" != typeof e ? String(e) : e;
  if ("function" == typeof i) i(t, n);else if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(n)) {
    const e = new TypeError(`Invalid character in header content ["${t}"]`);
    throw Object.defineProperty(e, "code", {
      value: "ERR_INVALID_CHAR"
    }), e;
  }
  return n;
};
class l {
  constructor(e = {}) {
    this[s] = {
      map: new Map()
    };
    if (e instanceof l) e.forEach((e, t) => {
      this.append(t, e);
    });else if (Array.isArray(e)) e.forEach(([e, t]) => {
      this.append(e, t);
    });else if (o(e)) for (const [t, n] of Object.entries(e)) this.append(t, n);
  }
  set(e, t) {
    this[s].map.set(a(e), c(t, e));
  }
  has(e) {
    return this[s].map.has(a(e));
  }
  get(e) {
    const t = this[s].map.get(a(e));
    return void 0 === t ? null : t;
  }
  append(e, t) {
    const n = a(e);
    const r = c(t, e);
    const i = this[s].map.get(n);
    this[s].map.set(n, i ? `${i}, ${r}` : r);
  }
  delete(e) {
    this[s].map.delete(a(e));
  }
  forEach(e, t) {
    for (const n of this.keys()) e.call(t, this.get(n), n);
  }
  keys() {
    return Array.from(this[s].map.keys()).sort();
  }
  *values() {
    for (const e of this.keys()) yield this.get(e);
  }
  *entries() {
    for (const e of this.keys()) yield [e, this.get(e)];
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  plain() {
    return Object.fromEntries(this[s].map);
  }
}
Object.defineProperties(l.prototype, ["append", "delete", "entries", "forEach", "get", "has", "keys", "set", "values"].reduce((e, t) => (e[t] = {
  enumerable: !0
}, e), {}));
module.exports = {
  Headers: l
};