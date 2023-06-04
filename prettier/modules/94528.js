module.exports = function (e, t) {
  var n = !Array.isArray(e);
  var r = {
    index: 0,
    keyedList: n || t ? Object.keys(e) : null,
    jobs: {},
    results: n ? {} : [],
    size: n ? Object.keys(e).length : e.length
  };
  if (t) {
    r.keyedList.sort(n ? t : function (n, r) {
      return t(e[n], e[r]);
    });
  }
  return r;
};