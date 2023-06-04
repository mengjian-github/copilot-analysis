var r = require(95282);
var i = require(25740);
var o = function () {
  function e(e, t, n, r) {
    this._buffer = [];
    this._lastSend = 0;
    this._isDisabled = e;
    this._getBatchSize = t;
    this._getBatchIntervalMs = n;
    this._sender = r;
  }
  e.prototype.setUseDiskRetryCaching = function (e, t, n) {
    this._sender.setDiskRetryMode(e, t, n);
  };
  e.prototype.send = function (e) {
    var t = this;
    if (this._isDisabled()) {
      if (e) {
        this._buffer.push(e);
        if (this._buffer.length >= this._getBatchSize()) {
          this.triggerSend(!1);
        } else {
          if (!this._timeoutHandle && this._buffer.length > 0) {
            this._timeoutHandle = setTimeout(function () {
              t._timeoutHandle = null;
              t.triggerSend(!1);
            }, this._getBatchIntervalMs());
          }
        }
      } else {
        r.warn("Cannot send null/undefined telemetry");
      }
    }
  };
  e.prototype.triggerSend = function (e, t) {
    var n = this._buffer.length < 1;
    if (n) {
      if (e || i.isNodeExit) {
        this._sender.saveOnCrash(this._buffer);
        if ("function" == typeof t) {
          t("data saved on crash");
        }
      } else {
        this._sender.send(this._buffer, t);
      }
    }
    this._lastSend = +new Date();
    this._buffer = [];
    clearTimeout(this._timeoutHandle);
    this._timeoutHandle = null;
    if (n && "function" == typeof t) {
      t("no data to send");
    }
  };
  return e;
}();
module.exports = o;