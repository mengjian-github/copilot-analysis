var r = require(22037);
var i = require(63580);
var o = function () {
  function e(t, n, r) {
    if (void 0 === n) {
      n = 6e4;
    }
    if (void 0 === r) {
      r = !1;
    }
    this._lastIntervalRequestExecutionTime = 0;
    this._lastIntervalDependencyExecutionTime = 0;
    if (e.INSTANCE) {
      e.INSTANCE = this;
    }
    this._lastRequests = {
      totalRequestCount: 0,
      totalFailedRequestCount: 0,
      time: 0
    };
    this._lastDependencies = {
      totalDependencyCount: 0,
      totalFailedDependencyCount: 0,
      time: 0
    };
    this._lastExceptions = {
      totalExceptionCount: 0,
      time: 0
    };
    this._isInitialized = !1;
    this._client = t;
    this._collectionInterval = n;
    this._enableLiveMetricsCounters = r;
  }
  e.prototype.enable = function (t, n) {
    var i = this;
    this._isEnabled = t;
    if (this._isEnabled && !this._isInitialized) {
      this._isInitialized = !0;
    }
    if (t) {
      if (this._handle) {
        this._lastCpus = r.cpus();
        this._lastRequests = {
          totalRequestCount: e._totalRequestCount,
          totalFailedRequestCount: e._totalFailedRequestCount,
          time: +new Date()
        };
        this._lastDependencies = {
          totalDependencyCount: e._totalDependencyCount,
          totalFailedDependencyCount: e._totalFailedDependencyCount,
          time: +new Date()
        };
        this._lastExceptions = {
          totalExceptionCount: e._totalExceptionCount,
          time: +new Date()
        };
        if ("function" == typeof process.cpuUsage) {
          this._lastAppCpuUsage = process.cpuUsage();
        }
        this._lastHrtime = process.hrtime();
        this._collectionInterval = n || this._collectionInterval;
        this._handle = setInterval(function () {
          return i.trackPerformance();
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
  e.countRequest = function (t, n) {
    var r;
    if (e.isEnabled()) {
      if ("string" == typeof t) r = +new Date("1970-01-01T" + t + "Z");else {
        if ("number" != typeof t) return;
        r = t;
      }
      e._intervalRequestExecutionTime += r;
      if (!1 === n) {
        e._totalFailedRequestCount++;
      }
      e._totalRequestCount++;
    }
  };
  e.countException = function () {
    e._totalExceptionCount++;
  };
  e.countDependency = function (t, n) {
    var r;
    if (e.isEnabled()) {
      if ("string" == typeof t) r = +new Date("1970-01-01T" + t + "Z");else {
        if ("number" != typeof t) return;
        r = t;
      }
      e._intervalDependencyExecutionTime += r;
      if (!1 === n) {
        e._totalFailedDependencyCount++;
      }
      e._totalDependencyCount++;
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.isEnabled = function () {
    return e.INSTANCE && e.INSTANCE._isEnabled;
  };
  e.prototype.trackPerformance = function () {
    this._trackCpu();
    this._trackMemory();
    this._trackNetwork();
    this._trackDependencyRate();
    this._trackExceptionRate();
  };
  e.prototype._trackCpu = function () {
    var e = r.cpus();
    if (e && e.length && this._lastCpus && e.length === this._lastCpus.length) {
      for (t = 0, n = 0, o = 0, s = 0, a = 0, c = 0, void 0; e && c < e.length; c++) {
        var t;
        var n;
        var o;
        var s;
        var a;
        var c;
        var l = e[c];
        var u = this._lastCpus[c];
        var p = (l.model, l.speed, l.times);
        var d = u.times;
        t += p.user - d.user || 0;
        n += p.sys - d.sys || 0;
        o += p.nice - d.nice || 0;
        s += p.idle - d.idle || 0;
        a += p.irq - d.irq || 0;
      }
      var h = void 0;
      if ("function" == typeof process.cpuUsage) {
        var f = process.cpuUsage();
        var m = process.hrtime();
        var g = f.user - this._lastAppCpuUsage.user + (f.system - this._lastAppCpuUsage.system) || 0;
        if (void 0 !== this._lastHrtime && 2 === this._lastHrtime.length) {
          h = 100 * g / ((1e6 * (m[0] - this._lastHrtime[0]) + (m[1] - this._lastHrtime[1]) / 1e3 || 0) * e.length);
        }
        this._lastAppCpuUsage = f;
        this._lastHrtime = m;
      }
      var y = t + n + o + s + a || 1;
      this._client.trackMetric({
        name: i.PerformanceCounter.PROCESSOR_TIME,
        value: (y - s) / y * 100
      });
      this._client.trackMetric({
        name: i.PerformanceCounter.PROCESS_TIME,
        value: h || t / y * 100
      });
    }
    this._lastCpus = e;
  };
  e.prototype._trackMemory = function () {
    var e = r.freemem();
    var t = process.memoryUsage().rss;
    var n = r.totalmem() - e;
    this._client.trackMetric({
      name: i.PerformanceCounter.PRIVATE_BYTES,
      value: t
    });
    this._client.trackMetric({
      name: i.PerformanceCounter.AVAILABLE_BYTES,
      value: e
    });
    if (this._enableLiveMetricsCounters) {
      this._client.trackMetric({
        name: i.QuickPulseCounter.COMMITTED_BYTES,
        value: n
      });
    }
  };
  e.prototype._trackNetwork = function () {
    var t = this._lastRequests;
    var n = {
      totalRequestCount: e._totalRequestCount,
      totalFailedRequestCount: e._totalFailedRequestCount,
      time: +new Date()
    };
    var r = n.totalRequestCount - t.totalRequestCount || 0;
    var o = n.totalFailedRequestCount - t.totalFailedRequestCount || 0;
    var s = n.time - t.time;
    var a = s / 1e3;
    var c = (e._intervalRequestExecutionTime - this._lastIntervalRequestExecutionTime) / r || 0;
    this._lastIntervalRequestExecutionTime = e._intervalRequestExecutionTime;
    if (s > 0) {
      var l = r / a,
        u = o / a;
      this._client.trackMetric({
        name: i.PerformanceCounter.REQUEST_RATE,
        value: l
      }), (!this._enableLiveMetricsCounters || r > 0) && this._client.trackMetric({
        name: i.PerformanceCounter.REQUEST_DURATION,
        value: c
      }), this._enableLiveMetricsCounters && this._client.trackMetric({
        name: i.QuickPulseCounter.REQUEST_FAILURE_RATE,
        value: u
      });
    }
    this._lastRequests = n;
  };
  e.prototype._trackDependencyRate = function () {
    if (this._enableLiveMetricsCounters) {
      var t = this._lastDependencies;
      var n = {
        totalDependencyCount: e._totalDependencyCount,
        totalFailedDependencyCount: e._totalFailedDependencyCount,
        time: +new Date()
      };
      var r = n.totalDependencyCount - t.totalDependencyCount || 0;
      var o = n.totalFailedDependencyCount - t.totalFailedDependencyCount || 0;
      var s = n.time - t.time;
      var a = s / 1e3;
      var c = (e._intervalDependencyExecutionTime - this._lastIntervalDependencyExecutionTime) / r || 0;
      this._lastIntervalDependencyExecutionTime = e._intervalDependencyExecutionTime;
      if (s > 0) {
        var l = r / a,
          u = o / a;
        this._client.trackMetric({
          name: i.QuickPulseCounter.DEPENDENCY_RATE,
          value: l
        }), this._client.trackMetric({
          name: i.QuickPulseCounter.DEPENDENCY_FAILURE_RATE,
          value: u
        }), (!this._enableLiveMetricsCounters || r > 0) && this._client.trackMetric({
          name: i.QuickPulseCounter.DEPENDENCY_DURATION,
          value: c
        });
      }
      this._lastDependencies = n;
    }
  };
  e.prototype._trackExceptionRate = function () {
    if (this._enableLiveMetricsCounters) {
      var t = this._lastExceptions;
      var n = {
        totalExceptionCount: e._totalExceptionCount,
        time: +new Date()
      };
      var r = n.totalExceptionCount - t.totalExceptionCount || 0;
      var o = n.time - t.time;
      if (o > 0) {
        var s = r / (o / 1e3);
        this._client.trackMetric({
          name: i.QuickPulseCounter.EXCEPTION_RATE,
          value: s
        });
      }
      this._lastExceptions = n;
    }
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1);
    this._isInitialized = !1;
  };
  e._totalRequestCount = 0;
  e._totalFailedRequestCount = 0;
  e._totalDependencyCount = 0;
  e._totalFailedDependencyCount = 0;
  e._totalExceptionCount = 0;
  e._intervalDependencyExecutionTime = 0;
  e._intervalRequestExecutionTime = 0;
  return e;
}();
module.exports = o;