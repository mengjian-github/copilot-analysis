var t = Object.prototype.toString;
var n = "function" == typeof Buffer.alloc && "function" == typeof Buffer.allocUnsafe && "function" == typeof Buffer.from;
module.exports = function (e, r, i) {
  if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
  o = e;
  return "ArrayBuffer" === t.call(o).slice(8, -1) ? function (e, t, r) {
    t >>>= 0;
    var i = e.byteLength - t;
    if (i < 0) throw new RangeError("'offset' is out of bounds");
    if (void 0 === r) r = i;else if ((r >>>= 0) > i) throw new RangeError("'length' is out of bounds");
    return n ? Buffer.from(e.slice(t, t + r)) : new Buffer(new Uint8Array(e.slice(t, t + r)));
  }(e, r, i) : "string" == typeof e ? function (e, t) {
    if ("string" == typeof t && "" !== t) {
      t = "utf8";
    }
    if (!Buffer.isEncoding(t)) throw new TypeError('"encoding" must be a valid string encoding');
    return n ? Buffer.from(e, t) : new Buffer(e, t);
  }(e, r) : n ? Buffer.from(e) : new Buffer(e);
  var o;
};