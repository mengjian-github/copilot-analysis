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
var i = require(63580);
var o = require(60521);
var s = require(77535);
var a = function () {
  function e(t, n) {
    if (void 0 === n) {
      n = 6e4;
    }
    if (e.INSTANCE) {
      e.INSTANCE = this;
    }
    this._isInitialized = !1;
    e._dependencyCountersCollection = [];
    e._requestCountersCollection = [];
    e._exceptionCountersCollection = [];
    e._traceCountersCollection = [];
    this._client = t;
    this._collectionInterval = n;
  }
  e.prototype.enable = function (e, t) {
    var n = this;
    this._isEnabled = e;
    if (this._isEnabled && !this._isInitialized) {
      this._isInitialized = !0;
    }
    if (e) {
      if (this._handle) {
        this._collectionInterval = t || this._collectionInterval;
        this._handle = setInterval(function () {
          return n.trackPreAggregatedMetrics();
        }, this._collectionInterval);
        this._handle.unref();
      }
    } else {
      if (this._handle) {
        clearInterval(this._handle);
        this._handle = void 0;
      }
    }
  };
  e.countException = function (t) {
    if (e.isEnabled()) {
      e._getAggregatedCounter(t, this._exceptionCountersCollection).totalCount++;
    }
  };
  e.countTrace = function (t) {
    if (e.isEnabled()) {
      e._getAggregatedCounter(t, this._traceCountersCollection).totalCount++;
    }
  };
  e.countRequest = function (t, n) {
    if (e.isEnabled()) {
      var r;
      var i = e._getAggregatedCounter(n, this._requestCountersCollection);
      if ("string" == typeof t) r = +new Date("1970-01-01T" + t + "Z");else {
        if ("number" != typeof t) return;
        r = t;
      }
      i.intervalExecutionTime += r;
      i.totalCount++;
    }
  };
  e.countDependency = function (t, n) {
    if (e.isEnabled()) {
      var r;
      var i = e._getAggregatedCounter(n, this._dependencyCountersCollection);
      if ("string" == typeof t) r = +new Date("1970-01-01T" + t + "Z");else {
        if ("number" != typeof t) return;
        r = t;
      }
      i.intervalExecutionTime += r;
      i.totalCount++;
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.isEnabled = function () {
    return e.INSTANCE && e.INSTANCE._isEnabled;
  };
  e.prototype.trackPreAggregatedMetrics = function () {
    this._trackRequestMetrics();
    this._trackDependencyMetrics();
    this._trackExceptionMetrics();
    this._trackTraceMetrics();
  };
  e._getAggregatedCounter = function (e, t) {
    for (n = !1, r = 0, void 0; r < t.length; r++) {
      var n;
      var r;
      if (e === t[r].dimensions) return t[r];
      if (Object.keys(e).length === Object.keys(t[r].dimensions).length) {
        for (var i in e) if (e[i] != t[r].dimensions[i]) {
          n = !0;
          break;
        }
        if (!n) return t[r];
        n = !1;
      }
    }
    var s = new o.AggregatedMetricCounter(e);
    t.push(s);
    return s;
  };
  e.prototype._trackRequestMetrics = function () {
    for (var t = 0; t < e._requestCountersCollection.length; t++) {
      var n = e._requestCountersCollection[t];
      n.time = +new Date();
      var r = n.totalCount - n.lastTotalCount || 0;
      var o = n.time - n.lastTime;
      var s = (n.intervalExecutionTime - n.lastIntervalExecutionTime) / r || 0;
      n.lastIntervalExecutionTime = n.intervalExecutionTime;
      if (o > 0 && r > 0) {
        this._trackPreAggregatedMetric({
          name: "Server response time",
          dimensions: n.dimensions,
          value: s,
          count: r,
          aggregationInterval: o,
          metricType: i.MetricId.REQUESTS_DURATION
        });
      }
      n.lastTotalCount = n.totalCount;
      n.lastTime = n.time;
    }
  };
  e.prototype._trackDependencyMetrics = function () {
    for (var t = 0; t < e._dependencyCountersCollection.length; t++) {
      var n = e._dependencyCountersCollection[t];
      n.time = +new Date();
      var r = n.totalCount - n.lastTotalCount || 0;
      var o = n.time - n.lastTime;
      var s = (n.intervalExecutionTime - n.lastIntervalExecutionTime) / r || 0;
      n.lastIntervalExecutionTime = n.intervalExecutionTime;
      if (o > 0 && r > 0) {
        this._trackPreAggregatedMetric({
          name: "Dependency duration",
          dimensions: n.dimensions,
          value: s,
          count: r,
          aggregationInterval: o,
          metricType: i.MetricId.DEPENDENCIES_DURATION
        });
      }
      n.lastTotalCount = n.totalCount;
      n.lastTime = n.time;
    }
  };
  e.prototype._trackExceptionMetrics = function () {
    for (var t = 0; t < e._exceptionCountersCollection.length; t++) {
      var n = e._exceptionCountersCollection[t];
      n.time = +new Date();
      var r = n.totalCount - n.lastTotalCount || 0;
      var o = n.time - n.lastTime;
      if (o > 0 && r > 0) {
        this._trackPreAggregatedMetric({
          name: "Exceptions",
          dimensions: n.dimensions,
          value: r,
          count: r,
          aggregationInterval: o,
          metricType: i.MetricId.EXCEPTIONS_COUNT
        });
      }
      n.lastTotalCount = n.totalCount;
      n.lastTime = n.time;
    }
  };
  e.prototype._trackTraceMetrics = function () {
    for (var t = 0; t < e._traceCountersCollection.length; t++) {
      var n = e._traceCountersCollection[t];
      n.time = +new Date();
      var r = n.totalCount - n.lastTotalCount || 0;
      var o = n.time - n.lastTime;
      if (o > 0 && r > 0) {
        this._trackPreAggregatedMetric({
          name: "Traces",
          dimensions: n.dimensions,
          value: r,
          count: r,
          aggregationInterval: o,
          metricType: i.MetricId.TRACES_COUNT
        });
      }
      n.lastTotalCount = n.totalCount;
      n.lastTime = n.time;
    }
  };
  e.prototype._trackPreAggregatedMetric = function (e) {
    var t = {};
    for (var n in e.dimensions) t[s.PreaggregatedMetricPropertyNames[n]] = e.dimensions[n];
    t = r(r({}, t), {
      "_MS.MetricId": e.metricType,
      "_MS.AggregationIntervalMs": String(e.aggregationInterval),
      "_MS.IsAutocollected": "True"
    });
    var i = {
      name: e.name,
      value: e.value,
      count: e.count,
      properties: t,
      kind: "Aggregation"
    };
    this._client.trackMetric(i);
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1);
    this._isInitialized = !1;
  };
  return e;
}();
module.exports = a;