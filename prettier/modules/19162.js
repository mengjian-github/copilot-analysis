var r = require(97594);
var i = require(94528);
var o = require(25353);
module.exports = function (e, t, n) {
  for (var s = i(e); s.index < (s.keyedList || e).length;) {
    r(e, t, s, function (e, t) {
      if (e) {
        n(e, t);
      } else {
        if (0 !== Object.keys(s.jobs).length) {
          n(null, s.results);
        }
      }
    });
    s.index++;
  }
  return o.bind(s, n);
};