var r;
r = require(78249);
(function () {
  if ("function" == typeof ArrayBuffer) {
    var e = r.lib.WordArray;
    var t = e.init;
    var n = e.init = function (e) {
      if (e instanceof ArrayBuffer) {
        e = new Uint8Array(e);
      }
      if (e instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) {
        e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
      }
      if (e instanceof Uint8Array) {
        for (var n = e.byteLength, r = [], i = 0; i < n; i++) r[i >>> 2] |= e[i] << 24 - i % 4 * 8;
        t.call(this, r, n);
      } else t.apply(this, arguments);
    };
    n.prototype = e;
  }
})();
module.exports = r.lib.WordArray;