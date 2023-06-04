var r = require(12781).Stream;
var i = require(73837);
function o() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1048576;
  this.pauseStream = !0;
  this._maxDataSizeExceeded = !1;
  this._released = !1;
  this._bufferedEvents = [];
}
module.exports = o;
i.inherits(o, r);
o.create = function (e, t) {
  var n = new this();
  for (var r in t = t || {}) n[r] = t[r];
  n.source = e;
  var i = e.emit;
  e.emit = function () {
    n._handleEmit(arguments);
    return i.apply(e, arguments);
  };
  e.on("error", function () {});
  if (n.pauseStream) {
    e.pause();
  }
  return n;
};
Object.defineProperty(o.prototype, "readable", {
  configurable: !0,
  enumerable: !0,
  get: function () {
    return this.source.readable;
  }
});
o.prototype.setEncoding = function () {
  return this.source.setEncoding.apply(this.source, arguments);
};
o.prototype.resume = function () {
  if (this._released) {
    this.release();
  }
  this.source.resume();
};
o.prototype.pause = function () {
  this.source.pause();
};
o.prototype.release = function () {
  this._released = !0;
  this._bufferedEvents.forEach(function (e) {
    this.emit.apply(this, e);
  }.bind(this));
  this._bufferedEvents = [];
};
o.prototype.pipe = function () {
  var e = r.prototype.pipe.apply(this, arguments);
  this.resume();
  return e;
};
o.prototype._handleEmit = function (e) {
  if (this._released) {
    this.emit.apply(this, e);
  } else {
    if ("data" === e[0]) {
      this.dataSize += e[1].length;
      this._checkIfMaxDataSizeExceeded();
    }
    this._bufferedEvents.push(e);
  }
};
o.prototype._checkIfMaxDataSizeExceeded = function () {
  if (!(this._maxDataSizeExceeded || this.dataSize <= this.maxDataSize)) {
    this._maxDataSizeExceeded = !0;
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(e));
  }
};