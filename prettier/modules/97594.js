var r = require(55912);
var i = require(37651);
module.exports = function (e, t, n, o) {
  var s = n.keyedList ? n.keyedList[n.index] : n.index;
  n.jobs[s] = function (e, t, n, i) {
    return 2 == e.length ? e(n, r(i)) : e(n, t, r(i));
  }(t, s, e[s], function (e, t) {
    if (s in n.jobs) {
      delete n.jobs[s];
      if (e) {
        i(n);
      } else {
        n.results[s] = t;
      }
      o(e, n.results);
    }
  });
};