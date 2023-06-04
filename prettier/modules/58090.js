var r = require(25740);
var i = require(29962);
var o = function () {
  function e(t, n) {
    this.traceFlag = e.DEFAULT_TRACE_FLAG;
    this.version = e.DEFAULT_VERSION;
    if (t && "string" == typeof t) {
      if (t.split(",").length > 1) this.traceId = r.w3cTraceId(), this.spanId = r.w3cTraceId().substr(0, 16);else {
        var o = t.trim().split("-"),
          s = o.length;
        s >= 4 ? (this.version = o[0], this.traceId = o[1], this.spanId = o[2], this.traceFlag = o[3]) : (this.traceId = r.w3cTraceId(), this.spanId = r.w3cTraceId().substr(0, 16)), this.version.match(/^[0-9a-f]{2}$/g) || (this.version = e.DEFAULT_VERSION, this.traceId = r.w3cTraceId()), "00" === this.version && 4 !== s && (this.traceId = r.w3cTraceId(), this.spanId = r.w3cTraceId().substr(0, 16)), "ff" === this.version && (this.version = e.DEFAULT_VERSION, this.traceId = r.w3cTraceId(), this.spanId = r.w3cTraceId().substr(0, 16)), this.version.match(/^0[0-9a-f]$/g) || (this.version = e.DEFAULT_VERSION), this.traceFlag.match(/^[0-9a-f]{2}$/g) || (this.traceFlag = e.DEFAULT_TRACE_FLAG, this.traceId = r.w3cTraceId()), e.isValidTraceId(this.traceId) || (this.traceId = r.w3cTraceId()), e.isValidSpanId(this.spanId) || (this.spanId = r.w3cTraceId().substr(0, 16), this.traceId = r.w3cTraceId()), this.parentId = this.getBackCompatRequestId();
      }
    } else if (n) {
      this.parentId = n.slice();
      var a = i.getRootId(n);
      e.isValidTraceId(a) || (this.legacyRootId = a, a = r.w3cTraceId()), -1 !== n.indexOf("|") && (n = n.substring(1 + n.substring(0, n.length - 1).lastIndexOf("."), n.length - 1)), this.traceId = a, this.spanId = n;
    } else this.traceId = r.w3cTraceId(), this.spanId = r.w3cTraceId().substr(0, 16);
  }
  e.isValidTraceId = function (e) {
    return e.match(/^[0-9a-f]{32}$/) && "00000000000000000000000000000000" !== e;
  };
  e.isValidSpanId = function (e) {
    return e.match(/^[0-9a-f]{16}$/) && "0000000000000000" !== e;
  };
  e.formatOpenTelemetryTraceFlags = function (e) {
    var t = "0" + e.toString(16);
    return t.substring(t.length - 2);
  };
  e.prototype.getBackCompatRequestId = function () {
    return "|" + this.traceId + "." + this.spanId + ".";
  };
  e.prototype.toString = function () {
    return this.version + "-" + this.traceId + "-" + this.spanId + "-" + this.traceFlag;
  };
  e.prototype.updateSpanId = function () {
    this.spanId = r.w3cTraceId().substr(0, 16);
  };
  e.DEFAULT_TRACE_FLAG = "01";
  e.DEFAULT_VERSION = "00";
  return e;
}();
module.exports = o;