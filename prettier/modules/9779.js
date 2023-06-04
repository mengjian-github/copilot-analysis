var r = require(73837);
var i = require(12781).Stream;
var o = require(63463);
function s() {
  this.writable = !1;
  this.readable = !0;
  this.dataSize = 0;
  this.maxDataSize = 2097152;
  this.pauseStreams = !0;
  this._released = !1;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = !1;
  this._pendingNext = !1;
}
module.exports = s;
r.inherits(s, i);
s.create = function (e) {
  var t = new this();
  for (var n in e = e || {}) t[n] = e[n];
  return t;
};
s.isStreamLike = function (e) {
  return "function" != typeof e && "string" != typeof e && "boolean" != typeof e && "number" != typeof e && !Buffer.isBuffer(e);
};
s.prototype.append = function (e) {
  if (s.isStreamLike(e)) {
    if (!(e instanceof o)) {
      var t = o.create(e, {
        maxDataSize: 1 / 0,
        pauseStream: this.pauseStreams
      });
      e.on("data", this._checkDataSize.bind(this));
      e = t;
    }
    this._handleErrors(e);
    if (this.pauseStreams) {
      e.pause();
    }
  }
  this._streams.push(e);
  return this;
};
s.prototype.pipe = function (e, t) {
  i.prototype.pipe.call(this, e, t);
  this.resume();
  return e;
};
s.prototype._getNext = function () {
  this._currentStream = null;
  if (this._insideLoop) this._pendingNext = !0;else {
    this._insideLoop = !0;
    try {
      do {
        this._pendingNext = !1, this._realGetNext();
      } while (this._pendingNext);
    } finally {
      this._insideLoop = !1;
    }
  }
};
s.prototype._realGetNext = function () {
  var e = this._streams.shift();
  if (void 0 !== e) {
    if ("function" == typeof e) {
      e(function (e) {
        if (s.isStreamLike(e)) {
          e.on("data", this._checkDataSize.bind(this));
          this._handleErrors(e);
        }
        this._pipeNext(e);
      }.bind(this));
    } else {
      this._pipeNext(e);
    }
  } else {
    this.end();
  }
};
s.prototype._pipeNext = function (e) {
  this._currentStream = e;
  if (s.isStreamLike(e)) return e.on("end", this._getNext.bind(this)), void e.pipe(this, {
    end: !1
  });
  var t = e;
  this.write(t);
  this._getNext();
};
s.prototype._handleErrors = function (e) {
  var t = this;
  e.on("error", function (e) {
    t._emitError(e);
  });
};
s.prototype.write = function (e) {
  this.emit("data", e);
};
s.prototype.pause = function () {
  if (this.pauseStreams) {
    if (this.pauseStreams && this._currentStream && "function" == typeof this._currentStream.pause) {
      this._currentStream.pause();
    }
    this.emit("pause");
  }
};
s.prototype.resume = function () {
  if (this._released) {
    this._released = !0;
    this.writable = !0;
    this._getNext();
  }
  if (this.pauseStreams && this._currentStream && "function" == typeof this._currentStream.resume) {
    this._currentStream.resume();
  }
  this.emit("resume");
};
s.prototype.end = function () {
  this._reset();
  this.emit("end");
};
s.prototype.destroy = function () {
  this._reset();
  this.emit("close");
};
s.prototype._reset = function () {
  this.writable = !1;
  this._streams = [];
  this._currentStream = null;
};
s.prototype._checkDataSize = function () {
  this._updateDataSize();
  if (!(this.dataSize <= this.maxDataSize)) {
    var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(e));
  }
};
s.prototype._updateDataSize = function () {
  this.dataSize = 0;
  var e = this;
  this._streams.forEach(function (t) {
    if (t.dataSize) {
      e.dataSize += t.dataSize;
    }
  });
  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};
s.prototype._emitError = function (e) {
  this._reset();
  this.emit("error", e);
};