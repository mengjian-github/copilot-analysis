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
var i = this && this.__awaiter || function (e, t, n, r) {
  return new (n || (n = Promise))(function (i, o) {
    function s(e) {
      try {
        c(r.next(e));
      } catch (e) {
        o(e);
      }
    }
    function a(e) {
      try {
        c(r.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function c(e) {
      var t;
      if (e.done) {
        i(e.value);
      } else {
        (t = e.value, t instanceof n ? t : new n(function (e) {
          e(t);
        })).then(s, a);
      }
    }
    c((r = r.apply(e, t || [])).next());
  });
};
var o = this && this.__generator || function (e, t) {
  var n;
  var r;
  var i;
  var o;
  var s = {
    label: 0,
    sent: function () {
      if (1 & i[0]) throw i[1];
      return i[1];
    },
    trys: [],
    ops: []
  };
  o = {
    next: a(0),
    throw: a(1),
    return: a(2)
  };
  if ("function" == typeof Symbol) {
    o[Symbol.iterator] = function () {
      return this;
    };
  }
  return o;
  function a(o) {
    return function (a) {
      return function (o) {
        if (n) throw new TypeError("Generator is already executing.");
        for (; s;) try {
          n = 1;
          if (r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
          switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
            case 0:
            case 1:
              i = o;
              break;
            case 4:
              s.label++;
              return {
                value: o[1],
                done: !1
              };
            case 5:
              s.label++;
              r = o[1];
              o = [0];
              continue;
            case 7:
              o = s.ops.pop();
              s.trys.pop();
              continue;
            default:
              if (!((i = (i = s.trys).length > 0 && i[i.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                s = 0;
                continue;
              }
              if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                s.label = o[1];
                break;
              }
              if (6 === o[0] && s.label < i[1]) {
                s.label = i[1];
                i = o;
                break;
              }
              if (i && s.label < i[2]) {
                s.label = i[2];
                s.ops.push(o);
                break;
              }
              if (i[2]) {
                s.ops.pop();
              }
              s.trys.pop();
              continue;
          }
          o = t.call(e, s);
        } catch (e) {
          o = [6, e];
          r = 0;
        } finally {
          n = i = 0;
        }
        if (5 & o[0]) throw o[1];
        return {
          value: o[0] ? o[1] : void 0,
          done: !0
        };
      }([o, a]);
    };
  }
};
var s = require(22037);
var a = require(99813);
var c = require(95282);
var l = require(82588);
var u = require(63580);
var p = require(55290);
var d = require(32713);
var h = require(69253);
var f = require(54470);
var m = require(64555);
var g = require(25740);
var y = function () {
  function e(e, t) {
    this._attach = u.StatsbeatAttach.sdk;
    this._feature = u.StatsbeatFeature.NONE;
    this._instrumentation = u.StatsbeatInstrumentation.NONE;
    this._isInitialized = !1;
    this._statbeatMetrics = [];
    this._networkStatsbeatCollection = [];
    this._config = e;
    this._context = t || new f();
    var n = this._getConnectionString(e);
    this._statsbeatConfig = new h(n);
    this._statsbeatConfig.samplingPercentage = 100;
    this._sender = new l(this._statsbeatConfig, null, null, null, null, !0, this._shutdownStatsbeat.bind(this));
  }
  e.prototype.enable = function (t) {
    var n = this;
    this._isEnabled = t;
    if (this._isEnabled && !this._isInitialized) {
      this._getCustomProperties();
      this._isInitialized = !0;
    }
    if (t) {
      if (this._handle) {
        this._handle = setInterval(function () {
          n.trackShortIntervalStatsbeats();
        }, e.STATS_COLLECTION_SHORT_INTERVAL);
        this._handle.unref();
      }
      if (this._longHandle) {
        this.trackLongIntervalStatsbeats();
        this._longHandle = setInterval(function () {
          n.trackLongIntervalStatsbeats();
        }, e.STATS_COLLECTION_LONG_INTERVAL);
        this._longHandle.unref();
      }
    } else {
      if (this._handle) {
        clearInterval(this._handle);
        this._handle = null;
      }
      if (this._longHandle) {
        clearInterval(this._longHandle);
        this._longHandle = null;
      }
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.prototype.isEnabled = function () {
    return this._isEnabled;
  };
  e.prototype.setCodelessAttach = function () {
    this._attach = u.StatsbeatAttach.codeless;
  };
  e.prototype.addFeature = function (e) {
    this._feature |= e;
  };
  e.prototype.removeFeature = function (e) {
    this._feature &= ~e;
  };
  e.prototype.addInstrumentation = function (e) {
    this._instrumentation |= e;
  };
  e.prototype.removeInstrumentation = function (e) {
    this._instrumentation &= ~e;
  };
  e.prototype.countRequest = function (e, t, n, r, i) {
    if (this.isEnabled()) {
      var o = this._getNetworkStatsbeatCounter(e, t);
      o.totalRequestCount++;
      o.intervalRequestExecutionTime += n;
      if (!1 === r) {
        if (!i) return;
        var s = o.totalFailedRequestCount.find(function (e) {
          return i === e.statusCode;
        });
        s ? s.count++ : o.totalFailedRequestCount.push({
          statusCode: i,
          count: 1
        });
      } else o.totalSuccesfulRequestCount++;
    }
  };
  e.prototype.countException = function (e, t, n) {
    if (this.isEnabled()) {
      var r = this._getNetworkStatsbeatCounter(e, t);
      var i = r.exceptionCount.find(function (e) {
        return n.name === e.exceptionType;
      });
      if (i) {
        i.count++;
      } else {
        r.exceptionCount.push({
          exceptionType: n.name,
          count: 1
        });
      }
    }
  };
  e.prototype.countThrottle = function (e, t, n) {
    if (this.isEnabled()) {
      var r = this._getNetworkStatsbeatCounter(e, t);
      var i = r.throttleCount.find(function (e) {
        return n === e.statusCode;
      });
      if (i) {
        i.count++;
      } else {
        r.throttleCount.push({
          statusCode: n,
          count: 1
        });
      }
    }
  };
  e.prototype.countRetry = function (e, t, n) {
    if (this.isEnabled()) {
      var r = this._getNetworkStatsbeatCounter(e, t);
      var i = r.retryCount.find(function (e) {
        return n === e.statusCode;
      });
      if (i) {
        i.count++;
      } else {
        r.retryCount.push({
          statusCode: n,
          count: 1
        });
      }
    }
  };
  e.prototype.trackShortIntervalStatsbeats = function () {
    return i(this, void 0, void 0, function () {
      var t;
      var n;
      return o(this, function (r) {
        switch (r.label) {
          case 0:
            r.trys.push([0, 3,, 4]);
            return [4, this._getResourceProvider()];
          case 1:
            r.sent();
            t = {
              os: this._os,
              rp: this._resourceProvider,
              cikey: this._cikey,
              runtimeVersion: this._runtimeVersion,
              language: this._language,
              version: this._sdkVersion,
              attach: this._attach
            };
            this._trackRequestDuration(t);
            this._trackRequestsCount(t);
            return [4, this._sendStatsbeats()];
          case 2:
            r.sent();
            return [3, 4];
          case 3:
            n = r.sent();
            c.info(e.TAG, "Failed to send Statsbeat metrics: " + g.dumpObj(n));
            return [3, 4];
          case 4:
            return [2];
        }
      });
    });
  };
  e.prototype.trackLongIntervalStatsbeats = function () {
    return i(this, void 0, void 0, function () {
      var t;
      var n;
      var r;
      var i;
      var s;
      return o(this, function (o) {
        switch (o.label) {
          case 0:
            o.trys.push([0, 3,, 4]);
            return [4, this._getResourceProvider()];
          case 1:
            o.sent();
            t = {
              os: this._os,
              rp: this._resourceProvider,
              cikey: this._cikey,
              runtimeVersion: this._runtimeVersion,
              language: this._language,
              version: this._sdkVersion,
              attach: this._attach
            };
            n = Object.assign({
              rpId: this._resourceIdentifier
            }, t);
            this._statbeatMetrics.push({
              name: u.StatsbeatCounter.ATTACH,
              value: 1,
              properties: n
            });
            if (this._instrumentation != u.StatsbeatInstrumentation.NONE) {
              r = Object.assign({
                feature: this._instrumentation,
                type: u.StatsbeatFeatureType.Instrumentation
              }, t);
              this._statbeatMetrics.push({
                name: u.StatsbeatCounter.FEATURE,
                value: 1,
                properties: r
              });
            }
            if (this._feature != u.StatsbeatFeature.NONE) {
              i = Object.assign({
                feature: this._feature,
                type: u.StatsbeatFeatureType.Feature
              }, t);
              this._statbeatMetrics.push({
                name: u.StatsbeatCounter.FEATURE,
                value: 1,
                properties: i
              });
            }
            return [4, this._sendStatsbeats()];
          case 2:
            o.sent();
            return [3, 4];
          case 3:
            s = o.sent();
            c.info(e.TAG, "Failed to send Statsbeat metrics: " + g.dumpObj(s));
            return [3, 4];
          case 4:
            return [2];
        }
      });
    });
  };
  e.prototype._getNetworkStatsbeatCounter = function (e, t) {
    for (n = this._getShortHost(t), r = 0, void 0; r < this._networkStatsbeatCollection.length; r++) {
      var n;
      var r;
      if (e === this._networkStatsbeatCollection[r].endpoint && n === this._networkStatsbeatCollection[r].host) return this._networkStatsbeatCollection[r];
    }
    var i = new m.NetworkStatsbeat(e, n);
    this._networkStatsbeatCollection.push(i);
    return i;
  };
  e.prototype._trackRequestDuration = function (e) {
    for (var t = 0; t < this._networkStatsbeatCollection.length; t++) {
      var n = this._networkStatsbeatCollection[t];
      n.time = +new Date();
      var r = n.totalRequestCount - n.lastRequestCount || 0;
      var i = n.intervalRequestExecutionTime - n.lastIntervalRequestExecutionTime;
      var o = i > 0 && i / r || 0;
      n.lastIntervalRequestExecutionTime = n.intervalRequestExecutionTime;
      if (r > 0) {
        var s = Object.assign({
          endpoint: this._networkStatsbeatCollection[t].endpoint,
          host: this._networkStatsbeatCollection[t].host
        }, e);
        this._statbeatMetrics.push({
          name: u.StatsbeatCounter.REQUEST_DURATION,
          value: o,
          properties: s
        });
      }
      n.lastRequestCount = n.totalRequestCount;
      n.lastTime = n.time;
    }
  };
  e.prototype._getShortHost = function (e) {
    var t = e;
    try {
      var n = new RegExp(/^https?:\/\/(?:www\.)?([^\/.-]+)/).exec(e);
      if (null != n && n.length > 1) {
        t = n[1];
      }
      t = t.replace(".in.applicationinsights.azure.com", "");
    } catch (e) {}
    return t;
  };
  e.prototype._trackRequestsCount = function (e) {
    for (n = this, i = function (i) {
      t = o._networkStatsbeatCollection[i];
      var s = Object.assign({
        endpoint: t.endpoint,
        host: t.host
      }, e);
      if (t.totalSuccesfulRequestCount > 0) {
        o._statbeatMetrics.push({
          name: u.StatsbeatCounter.REQUEST_SUCCESS,
          value: t.totalSuccesfulRequestCount,
          properties: s
        });
        t.totalSuccesfulRequestCount = 0;
      }
      if (t.totalFailedRequestCount.length > 0) {
        t.totalFailedRequestCount.forEach(function (e) {
          s = Object.assign(r(r({}, s), {
            statusCode: e.statusCode
          }));
          n._statbeatMetrics.push({
            name: u.StatsbeatCounter.REQUEST_FAILURE,
            value: e.count,
            properties: s
          });
        });
        t.totalFailedRequestCount = [];
      }
      if (t.retryCount.length > 0) {
        t.retryCount.forEach(function (e) {
          s = Object.assign(r(r({}, s), {
            statusCode: e.statusCode
          }));
          n._statbeatMetrics.push({
            name: u.StatsbeatCounter.RETRY_COUNT,
            value: e.count,
            properties: s
          });
        });
        t.retryCount = [];
      }
      if (t.throttleCount.length > 0) {
        t.throttleCount.forEach(function (e) {
          s = Object.assign(r(r({}, s), {
            statusCode: e.statusCode
          }));
          n._statbeatMetrics.push({
            name: u.StatsbeatCounter.THROTTLE_COUNT,
            value: e.count,
            properties: s
          });
        });
        t.throttleCount = [];
      }
      if (t.exceptionCount.length > 0) {
        t.exceptionCount.forEach(function (e) {
          s = Object.assign(r(r({}, s), {
            exceptionType: e.exceptionType
          }));
          n._statbeatMetrics.push({
            name: u.StatsbeatCounter.EXCEPTION_COUNT,
            value: e.count,
            properties: s
          });
        });
        t.exceptionCount = [];
      }
    }, o = this, s = 0, void 0; s < this._networkStatsbeatCollection.length; s++) {
      var t;
      var n;
      var i;
      var o;
      var s;
      i(s);
    }
  };
  e.prototype._sendStatsbeats = function () {
    return i(this, void 0, void 0, function () {
      var e;
      var t;
      var n;
      var r;
      return o(this, function (i) {
        switch (i.label) {
          case 0:
            for (e = [], t = 0; t < this._statbeatMetrics.length; t++) {
              n = {
                name: this._statbeatMetrics[t].name,
                value: this._statbeatMetrics[t].value,
                properties: this._statbeatMetrics[t].properties
              };
              (r = a.createEnvelope(n, p.TelemetryType.Metric, null, this._context, this._statsbeatConfig)).name = u.StatsbeatTelemetryName;
              e.push(r);
            }
            this._statbeatMetrics = [];
            return [4, this._sender.send(e)];
          case 1:
            i.sent();
            return [2];
        }
      });
    });
  };
  e.prototype._getCustomProperties = function () {
    this._language = "node";
    this._cikey = this._config.instrumentationKey;
    this._sdkVersion = f.sdkVersion;
    this._os = s.type();
    this._runtimeVersion = process.version;
  };
  e.prototype._getResourceProvider = function () {
    var e = this;
    return new Promise(function (t, n) {
      var r = !1;
      e._resourceProvider = u.StatsbeatResourceProvider.unknown;
      e._resourceIdentifier = u.StatsbeatResourceProvider.unknown;
      if (process.env.WEBSITE_SITE_NAME) {
        e._resourceProvider = u.StatsbeatResourceProvider.appsvc;
        e._resourceIdentifier = process.env.WEBSITE_SITE_NAME;
        if (process.env.WEBSITE_HOME_STAMPNAME) {
          e._resourceIdentifier += "/" + process.env.WEBSITE_HOME_STAMPNAME;
        }
      } else {
        if (process.env.FUNCTIONS_WORKER_RUNTIME) {
          e._resourceProvider = u.StatsbeatResourceProvider.functions;
          if (process.env.WEBSITE_HOSTNAME) {
            e._resourceIdentifier = process.env.WEBSITE_HOSTNAME;
          }
        } else {
          if (e._config) {
            if (void 0 === e._isVM || 1 == e._isVM) {
              r = !0;
              d.AzureVirtualMachine.getAzureComputeMetadata(e._config, function (n) {
                e._isVM = n.isVM;
                if (e._isVM) {
                  e._resourceProvider = u.StatsbeatResourceProvider.vm;
                  e._resourceIdentifier = n.id + "/" + n.subscriptionId;
                  if (n.osType) {
                    e._os = n.osType;
                  }
                }
                t();
              });
            } else {
              e._resourceProvider = u.StatsbeatResourceProvider.unknown;
            }
          }
        }
      }
      if (r) {
        t();
      }
    });
  };
  e.prototype._shutdownStatsbeat = function () {
    this.enable(!1);
  };
  e.prototype._getConnectionString = function (t) {
    for (n = t.endpointUrl, r = ["westeurope", "northeurope", "francecentral", "francesouth", "germanywestcentral", "norwayeast", "norwaywest", "swedencentral", "switzerlandnorth", "switzerlandwest", "uksouth", "ukwest"], i = 0, void 0; i < r.length; i++) {
      var n;
      var r;
      var i;
      if (n.indexOf(r[i]) > -1) return e.EU_CONNECTION_STRING;
    }
    return e.NON_EU_CONNECTION_STRING;
  };
  e.NON_EU_CONNECTION_STRING = "InstrumentationKey=c4a29126-a7cb-47e5-b348-11414998b11e;IngestionEndpoint=https://westus-0.in.applicationinsights.azure.com";
  e.EU_CONNECTION_STRING = "InstrumentationKey=7dc56bab-3c0c-4e9f-9ebb-d1acadee8d0f;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com";
  e.STATS_COLLECTION_SHORT_INTERVAL = 9e5;
  e.STATS_COLLECTION_LONG_INTERVAL = 864e5;
  e.TAG = "Statsbeat";
  return e;
}();
module.exports = y;