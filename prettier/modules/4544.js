const {
  constants: {
    MAX_LENGTH: r
  }
} = require(14300);
const {
  pipeline: i,
  PassThrough: o
} = require(12781);
const {
  promisify: s
} = require(73837);
const {
  createGunzip: a,
  createInflate: c,
  createBrotliDecompress: l,
  constants: {
    Z_SYNC_FLUSH: u
  }
} = require(59796);
const p = require(15158)("helix-fetch:utils");
const d = s(i);
const h = (e, t) => {
  if (Buffer.isBuffer(e)) return e.length;
  switch (typeof e) {
    case "string":
      return 2 * e.length;
    case "boolean":
      return 4;
    case "number":
      return 8;
    case "symbol":
      return Symbol.keyFor(e) ? 2 * Symbol.keyFor(e).length : 2 * (e.toString().length - 8);
    case "object":
      return Array.isArray(e) ? f(e, t) : m(e, t);
    default:
      return 0;
  }
};
const f = (e, t) => (t.add(e), e.map(e => t.has(e) ? 0 : h(e, t)).reduce((e, t) => e + t, 0));
const m = (e, t) => {
  if (null == e) return 0;
  t.add(e);
  let n = 0;
  const r = [];
  for (const t in e) r.push(t);
  r.push(...Object.getOwnPropertySymbols(e));
  r.forEach(r => {
    n += h(r, t);
    if ("object" == typeof e[r] && null !== e[r]) {
      if (t.has(e[r])) return;
      t.add(e[r]);
    }
    n += h(e[r], t);
  });
  return n;
};
module.exports = {
  decodeStream: (e, t, n, r) => {
    if (!((e, t) => 204 !== e && 304 !== e && 0 != +t["content-length"] && /^\s*(?:(x-)?deflate|(x-)?gzip|br)\s*$/.test(t["content-encoding"]))(e, t)) return n;
    const o = e => {
      if (e) {
        p(`encountered error while decoding stream: ${e}`);
        r(e);
      }
    };
    switch (t["content-encoding"].trim()) {
      case "gzip":
      case "x-gzip":
        return i(n, a({
          flush: u,
          finishFlush: u
        }), o);
      case "deflate":
      case "x-deflate":
        return i(n, c(), o);
      case "br":
        return i(n, l(), o);
      default:
        return n;
    }
  },
  isPlainObject: e => {
    if (!e || "object" != typeof e) return !1;
    if ("[object Object]" !== Object.prototype.toString.call(e)) return !1;
    if (null === Object.getPrototypeOf(e)) return !0;
    let t = e;
    for (; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(e) === t;
  },
  sizeof: e => h(e, new WeakSet()),
  streamToBuffer: async e => {
    const t = new o();
    let n = 0;
    const i = [];
    t.on("data", e => {
      if (n + e.length > r) throw new Error("Buffer.constants.MAX_SIZE exceeded");
      i.push(e);
      n += e.length;
    });
    await d(e, t);
    return Buffer.concat(i, n);
  }
};