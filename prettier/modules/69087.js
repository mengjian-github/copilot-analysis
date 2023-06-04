var r = require(97594);
var i = require(94528);
var o = require(25353);
function s(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
module.exports = function (e, t, n, s) {
  var a = i(e, n);
  r(e, t, a, function n(i, o) {
    if (i) {
      s(i, o);
    } else {
      a.index++;
      if (a.index < (a.keyedList || e).length) {
        r(e, t, a, n);
      } else {
        s(null, a.results);
      }
    }
  });
  return o.bind(a, s);
};
module.exports.ascending = s;
module.exports.descending = function (e, t) {
  return -1 * s(e, t);
};