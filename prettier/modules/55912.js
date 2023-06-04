var r = require(9265);
module.exports = function (e) {
  var t = !1;
  r(function () {
    t = !0;
  });
  return function (n, i) {
    if (t) {
      e(n, i);
    } else {
      r(function () {
        e(n, i);
      });
    }
  };
};