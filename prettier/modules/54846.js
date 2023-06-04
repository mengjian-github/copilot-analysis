var r;
r = require(6113);
module.exports = function () {
  var e;
  e = new Set();
  return function (t) {
    var n;
    n = r.createHash("sha256").update(t).digest("base64");
    if (!e.has(n)) return e.add(n), !0;
  };
};