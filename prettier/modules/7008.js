require.d(exports, {
  M: () => i,
  r: () => r
});
var r = {
  get: function (e, t) {
    if (null != e) return e[t];
  },
  keys: function (e) {
    return null == e ? [] : Object.keys(e);
  }
};
var i = {
  set: function (e, t, n) {
    if (null != e) {
      e[t] = n;
    }
  }
};