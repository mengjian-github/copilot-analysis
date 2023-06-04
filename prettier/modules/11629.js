var r = this && this.__assign || function () {
  r = Object.assign || function (e) {
    for (n = 1, r = arguments.length, void 0; n < r; n++) {
      var t;
      var n;
      var r;
      for (var i in t = arguments[n]) if (Object.prototype.hasOwnProperty.call(t, i)) {
        e[i] = t[i];
      }
    }
    return e;
  };
  return r.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.AutoCollectNativePerformance = void 0;
var i = require(54470);
var o = require(95282);
var AutoCollectNativePerformance = function () {
  function e(t) {
    this._disabledMetrics = {};
    if (e.INSTANCE) {
      e.INSTANCE.dispose();
    }
    e.INSTANCE = this;
    this._client = t;
  }
  e.prototype.enable = function (t, r, i) {
    var s = this;
    if (void 0 === r) {
      r = {};
    }
    if (void 0 === i) {
      i = 6e4;
    }
    if (null == e._metricsAvailable && t && !this._isInitialized) try {
      var a = require(89166);
      e._emitter = new a(), e._metricsAvailable = !0, o.info("Native metrics module successfully loaded!");
    } catch (t) {
      return void (e._metricsAvailable = !1);
    }
    this._isEnabled = t;
    this._disabledMetrics = r;
    if (this._isEnabled && !this._isInitialized) {
      this._isInitialized = !0;
    }
    if (this._isEnabled && e._emitter) {
      e._emitter.enable(!0, i);
      if (this._handle) {
        this._handle = setInterval(function () {
          return s._trackNativeMetrics();
        }, i);
        this._handle.unref();
      }
    } else {
      if (e._emitter) {
        e._emitter.enable(!1);
        if (this._handle) {
          clearInterval(this._handle);
          this._handle = void 0;
        }
      }
    }
  };
  e.prototype.dispose = function () {
    this.enable(!1);
  };
  e.parseEnabled = function (e, t) {
    var n = t.disableAllExtendedMetrics;
    var i = t.extendedMetricDisablers;
    if (n) return {
      isEnabled: !1,
      disabledMetrics: {}
    };
    if (i) {
      var o = i.split(",");
      var s = {};
      if (o.length > 0) for (a = 0, c = o, void 0; a < c.length; a++) {
        var a;
        var c;
        s[c[a]] = !0;
      }
      return "object" == typeof e ? {
        isEnabled: !0,
        disabledMetrics: r(r({}, e), s)
      } : {
        isEnabled: e,
        disabledMetrics: s
      };
    }
    return "boolean" == typeof e ? {
      isEnabled: e,
      disabledMetrics: {}
    } : {
      isEnabled: !0,
      disabledMetrics: e
    };
  };
  e.prototype._trackNativeMetrics = function () {
    var e = !0;
    if ("object" != typeof this._isEnabled) {
      e = this._isEnabled;
    }
    if (e) {
      this._trackGarbageCollection();
      this._trackEventLoop();
      this._trackHeapUsage();
    }
  };
  e.prototype._trackGarbageCollection = function () {
    var t;
    if (!this._disabledMetrics.gc) {
      var n = e._emitter.getGCData();
      for (var r in n) {
        var o = n[r].metrics;
        var s = r + " Garbage Collection Duration";
        var a = Math.sqrt(o.sumSquares / o.count - Math.pow(o.total / o.count, 2)) || 0;
        this._client.trackMetric({
          name: s,
          value: o.total,
          count: o.count,
          max: o.max,
          min: o.min,
          stdDev: a,
          tagOverrides: (t = {}, t[this._client.context.keys.internalSdkVersion] = "node-nativeperf:" + i.sdkVersion, t)
        });
      }
    }
  };
  e.prototype._trackEventLoop = function () {
    var t;
    if (!this._disabledMetrics.loop) {
      var n = e._emitter.getLoopData().loopUsage;
      if (0 != n.count) {
        var r = Math.sqrt(n.sumSquares / n.count - Math.pow(n.total / n.count, 2)) || 0;
        this._client.trackMetric({
          name: "Event Loop CPU Time",
          value: n.total,
          count: n.count,
          min: n.min,
          max: n.max,
          stdDev: r,
          tagOverrides: (t = {}, t[this._client.context.keys.internalSdkVersion] = "node-nativeperf:" + i.sdkVersion, t)
        });
      }
    }
  };
  e.prototype._trackHeapUsage = function () {
    var e;
    var t;
    var n;
    if (!this._disabledMetrics.heap) {
      var r = process.memoryUsage();
      var o = r.heapUsed;
      var s = r.heapTotal;
      var a = r.rss;
      this._client.trackMetric({
        name: "Memory Usage (Heap)",
        value: o,
        count: 1,
        tagOverrides: (e = {}, e[this._client.context.keys.internalSdkVersion] = "node-nativeperf:" + i.sdkVersion, e)
      });
      this._client.trackMetric({
        name: "Memory Total (Heap)",
        value: s,
        count: 1,
        tagOverrides: (t = {}, t[this._client.context.keys.internalSdkVersion] = "node-nativeperf:" + i.sdkVersion, t)
      });
      this._client.trackMetric({
        name: "Memory Usage (Non-Heap)",
        value: a - s,
        count: 1,
        tagOverrides: (n = {}, n[this._client.context.keys.internalSdkVersion] = "node-nativeperf:" + i.sdkVersion, n)
      });
    }
  };
  return e;
}();
exports.AutoCollectNativePerformance = AutoCollectNativePerformance;