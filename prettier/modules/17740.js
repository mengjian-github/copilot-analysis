require.d(exports, {
  R: () => u
});
var r = require(67294);
var i = require(72478);
var o = require(61688);
var s = require(86949);
const {
  use: a
} = r;
const {
  useSyncExternalStore: c
} = o;
const l = new WeakMap();
function u(e, t) {
  const n = null == t ? void 0 : t.sync;
  const o = r.useRef();
  const u = r.useRef();
  let p = !0;
  const d = c(r.useCallback(t => {
    const r = s.Ld(e, t, n);
    t();
    return r;
  }, [e, n]), () => {
    const t = s.CO(e, a);
    try {
      if (!p && o.current && u.current && !i.ln(o.current, t, u.current, new WeakMap())) return o.current;
    } catch (e) {}
    return t;
  }, () => s.CO(e, a));
  p = !1;
  const h = new WeakMap();
  r.useEffect(() => {
    o.current = d;
    u.current = h;
  });
  ((e, t) => {
    const n = r.useRef();
    r.useEffect(() => {
      n.current = i.h8(e, t, !0);
    });
    r.useDebugValue(n.current);
  })(d, h);
  const f = r.useMemo(() => new WeakMap(), []);
  return i.DM(d, h, f, l);
}