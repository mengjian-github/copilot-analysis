module.exports = (e, t, n) => {
  const r = n => Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    writable: !0
  });
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    get() {
      const e = n();
      r(e);
      return e;
    },
    set(e) {
      r(e);
    }
  });
  return e;
};