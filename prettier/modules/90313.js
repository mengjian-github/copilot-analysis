Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.assignDefaults = void 0;
const r = require(93487);
const i = require(76776);
function o(e, t, n) {
  const {
    gen: o,
    compositeRule: s,
    data: a,
    opts: c
  } = e;
  if (void 0 === n) return;
  const l = r._`${a}${r.getProperty(t)}`;
  if (s) return void i.checkStrictMode(e, `default is ignored for: ${l}`);
  let u = r._`${l} === undefined`;
  if ("empty" === c.useDefaults) {
    u = r._`${u} || ${l} === null || ${l} === ""`;
  }
  o.if(u, r._`${l} = ${r.stringify(n)}`);
}
exports.assignDefaults = function (e, t) {
  const {
    properties: n,
    items: r
  } = e.schema;
  if ("object" === t && n) for (const t in n) o(e, t, n[t].default);else if ("array" === t && Array.isArray(r)) {
    r.forEach((t, n) => o(e, n, t.default));
  }
};