function r(...e) {
  return JSON.stringify(e, (e, t) => "object" == typeof t ? t : String(t));
}
function i(e, t = {}) {
  const {
    hash: n = r,
    cache: i = new Map()
  } = t;
  return function (...t) {
    const r = n.apply(this, t);
    if (i.has(r)) return i.get(r);
    let o = e.apply(this, t);
    if (o instanceof Promise) {
      o = o.catch(e => {
        throw i.delete(r), e;
      });
    }
    i.set(r, o);
    return o;
  };
}
require.r(exports);
require.d(exports, {
  default: () => i,
  defaultHash: () => r
});