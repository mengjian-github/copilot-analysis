var r = require(32728);
function H() {
  this._array = [];
  this._sorted = !0;
  this._last = {
    generatedLine: -1,
    generatedColumn: 0
  };
}
H.prototype.unsortedForEach = function (e, t) {
  this._array.forEach(e, t);
};
H.prototype.add = function (e) {
  var t;
  var n;
  var i;
  var o;
  var s;
  var a;
  n = e;
  i = (t = this._last).generatedLine;
  o = n.generatedLine;
  s = t.generatedColumn;
  a = n.generatedColumn;
  if (o > i || o == i && a >= s || r.compareByGeneratedPositionsInflated(t, n) <= 0) {
    this._last = e;
    this._array.push(e);
  } else {
    this._sorted = !1;
    this._array.push(e);
  }
};
H.prototype.toArray = function () {
  if (this._sorted) {
    this._array.sort(r.compareByGeneratedPositionsInflated);
    this._sorted = !0;
  }
  return this._array;
};
exports.H = H;