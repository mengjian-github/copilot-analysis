var r;
module.exports = function () {
  var e;
  var t;
  var i;
  var o;
  if (!r) for (t in e = (r = require(22079)).oids, i = require(509)) {
    o = i[t];
    if (null == e[t]) {
      e[t] = o;
    }
    if (null == e[o]) {
      e[o] = t;
    }
  }
  return r;
};