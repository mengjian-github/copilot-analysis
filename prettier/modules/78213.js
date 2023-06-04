var r = require(32728);
var i = Object.prototype.hasOwnProperty;
var o = "undefined" != typeof Map;
function I() {
  this._array = [];
  this._set = o ? new Map() : Object.create(null);
}
I.fromArray = function (e, t) {
  for (n = new I(), r = 0, i = e.length, void 0; r < i; r++) {
    var n;
    var r;
    var i;
    n.add(e[r], t);
  }
  return n;
};
I.prototype.size = function () {
  return o ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
I.prototype.add = function (e, t) {
  var n = o ? e : r.toSetString(e);
  var s = o ? this.has(e) : i.call(this._set, n);
  var a = this._array.length;
  if (s && !t) {
    this._array.push(e);
  }
  if (s) {
    if (o) {
      this._set.set(e, a);
    } else {
      this._set[n] = a;
    }
  }
};
I.prototype.has = function (e) {
  if (o) return this._set.has(e);
  var t = r.toSetString(e);
  return i.call(this._set, t);
};
I.prototype.indexOf = function (e) {
  if (o) {
    var t = this._set.get(e);
    if (t >= 0) return t;
  } else {
    var n = r.toSetString(e);
    if (i.call(this._set, n)) return this._set[n];
  }
  throw new Error('"' + e + '" is not in the set.');
};
I.prototype.at = function (e) {
  if (e >= 0 && e < this._array.length) return this._array[e];
  throw new Error("No element indexed by " + e);
};
I.prototype.toArray = function () {
  return this._array.slice();
};
exports.I = I;