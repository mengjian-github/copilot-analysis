var r = this && this.__awaiter || function (e, t, n, r) {
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
var i = this && this.__generator || function (e, t) {
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
var o = require(57147);
var s = require(22037);
var a = require(71017);
var c = require(59796);
var l = require(63580);
var u = require(88723);
var p = require(30164);
var d = require(25740);
var h = require(57310);
var f = require(95282);
var m = require(12640);
var g = [200, 206, 402, 408, 429, 439, 500];
var y = function () {
  function e(t, n, r, i, o, c, l) {
    this._redirectedHost = null;
    this._config = t;
    this._onSuccess = r;
    this._onError = i;
    this._statsbeat = o;
    this._enableDiskRetryMode = !1;
    this._resendInterval = e.WAIT_BETWEEN_RESEND;
    this._maxBytesOnDisk = e.MAX_BYTES_ON_DISK;
    this._numConsecutiveFailures = 0;
    this._numConsecutiveRedirects = 0;
    this._resendTimer = null;
    this._getAuthorizationHandler = n;
    this._fileCleanupTimer = null;
    this._tempDir = a.join(s.tmpdir(), e.TEMPDIR_PREFIX + this._config.instrumentationKey);
    this._isStatsbeatSender = c || !1;
    this._shutdownStatsbeat = l;
    this._failedToIngestCounter = 0;
    this._statsbeatHasReachedIngestionAtLeastOnce = !1;
  }
  e.prototype.setDiskRetryMode = function (t, n, r) {
    var i = this;
    if (t) {
      m.FileAccessControl.checkFileProtection();
    }
    this._enableDiskRetryMode = m.FileAccessControl.OS_PROVIDES_FILE_PROTECTION && t;
    if ("number" == typeof n && n >= 0) {
      this._resendInterval = Math.floor(n);
    }
    if ("number" == typeof r && r >= 0) {
      this._maxBytesOnDisk = Math.floor(r);
    }
    if (t && !m.FileAccessControl.OS_PROVIDES_FILE_PROTECTION) {
      this._enableDiskRetryMode = !1;
      this._logWarn("Ignoring request to enable disk retry mode. Sufficient file protection capabilities were not detected.");
    }
    if (this._enableDiskRetryMode) {
      if (this._statsbeat) {
        this._statsbeat.addFeature(l.StatsbeatFeature.DISK_RETRY);
      }
      if (this._fileCleanupTimer) {
        this._fileCleanupTimer = setTimeout(function () {
          i._fileCleanupTask();
        }, e.CLEANUP_TIMEOUT);
        this._fileCleanupTimer.unref();
      }
    } else {
      if (this._statsbeat) {
        this._statsbeat.removeFeature(l.StatsbeatFeature.DISK_RETRY);
      }
      if (this._fileCleanupTimer) {
        clearTimeout(this._fileCleanupTimer);
      }
    }
  };
  e.prototype.send = function (t, n) {
    return r(this, void 0, void 0, function () {
      var r;
      var o;
      var s;
      var a;
      var p;
      var f;
      var m;
      var y;
      var _ = this;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            if (!t) return [3, 5];
            r = this._redirectedHost || this._config.endpointUrl;
            o = new h.URL(r).hostname;
            s = {
              method: "POST",
              withCredentials: !1,
              headers: {
                "Content-Type": "application/x-json-stream"
              }
            };
            if (!(a = this._getAuthorizationHandler ? this._getAuthorizationHandler(this._config) : null)) return [3, 4];
            if (this._statsbeat) {
              this._statsbeat.addFeature(l.StatsbeatFeature.AAD_HANDLING);
            }
            i.label = 1;
          case 1:
            i.trys.push([1, 3,, 4]);
            return [4, a.addAuthorizationHeader(s)];
          case 2:
            i.sent();
            return [3, 4];
          case 3:
            p = i.sent();
            f = "Failed to get AAD bearer token for the Application.";
            if (this._enableDiskRetryMode) {
              f += "This batch of telemetry items will be retried. ";
              this._storeToDisk(t);
            }
            f += "Error:" + p.toString();
            this._logWarn(f);
            if ("function" == typeof n) {
              n(f);
            }
            return [2];
          case 4:
            m = "";
            t.forEach(function (e) {
              var t = d.stringify(e);
              if ("string" == typeof t) {
                m += t + "\n";
              }
            });
            if (m.length > 0) {
              m = m.substring(0, m.length - 1);
            }
            y = Buffer.from ? Buffer.from(m) : new Buffer(m);
            c.gzip(y, function (i, a) {
              var c = a;
              if (i) {
                _._logWarn(d.dumpObj(i));
                c = y;
                s.headers["Content-Length"] = y.length.toString();
              } else {
                s.headers["Content-Encoding"] = "gzip";
                s.headers["Content-Length"] = a.length.toString();
              }
              _._logInfo(d.dumpObj(s));
              s[u.disableCollectionRequestOption] = !0;
              var p = +new Date();
              var h = d.makeRequest(_._config, r, s, function (e) {
                e.setEncoding("utf-8");
                var r = "";
                e.on("data", function (e) {
                  r += e;
                });
                e.on("end", function () {
                  var i = +new Date() - p;
                  _._numConsecutiveFailures = 0;
                  if (_._isStatsbeatSender && !_._statsbeatHasReachedIngestionAtLeastOnce) {
                    if (g.includes(e.statusCode)) {
                      _._statsbeatHasReachedIngestionAtLeastOnce = !0;
                    } else {
                      _._statsbeatFailedToIngest();
                    }
                  }
                  if (_._statsbeat) {
                    if (402 == e.statusCode || 439 == e.statusCode) {
                      _._statsbeat.countThrottle(l.StatsbeatNetworkCategory.Breeze, o, e.statusCode);
                    } else {
                      _._statsbeat.countRequest(l.StatsbeatNetworkCategory.Breeze, o, i, 200 === e.statusCode, e.statusCode);
                    }
                  }
                  if (_._enableDiskRetryMode) if (200 === e.statusCode) _._resendTimer || (_._resendTimer = setTimeout(function () {
                    _._resendTimer = null, _._sendFirstFileOnDisk();
                  }, _._resendInterval), _._resendTimer.unref());else if (_._isRetriable(e.statusCode)) try {
                    _._statsbeat && _._statsbeat.countRetry(l.StatsbeatNetworkCategory.Breeze, o, e.statusCode);
                    var s = JSON.parse(r),
                      a = [];
                    s.errors && (s.errors.forEach(function (e) {
                      429 != e.statusCode && 500 != e.statusCode && 503 != e.statusCode || a.push(t[e.index]);
                    }), a.length > 0 && _._storeToDisk(a));
                  } catch (e) {
                    _._storeToDisk(t);
                  }
                  if (307 === e.statusCode || 308 === e.statusCode) {
                    _._numConsecutiveRedirects++;
                    if (_._numConsecutiveRedirects < 10) {
                      var c = e.headers.location ? e.headers.location.toString() : null;
                      c && (_._redirectedHost = c, _.send(t, n));
                    } else _._statsbeat && _._statsbeat.countException(l.StatsbeatNetworkCategory.Breeze, o, {
                      name: "Circular Redirect",
                      message: "Error sending telemetry because of circular redirects."
                    }), "function" == typeof n && n("Error sending telemetry because of circular redirects.");
                  } else {
                    _._numConsecutiveRedirects = 0;
                    if ("function" == typeof n) {
                      n(r);
                    }
                    _._logInfo(r);
                    if ("function" == typeof _._onSuccess) {
                      _._onSuccess(r);
                    }
                  }
                });
              });
              h.setTimeout(e.HTTP_TIMEOUT, function () {
                _._requestTimedOut = !0;
                h.abort();
              });
              h.on("error", function (r) {
                if (_._isStatsbeatSender && !_._statsbeatHasReachedIngestionAtLeastOnce) {
                  _._statsbeatFailedToIngest();
                }
                _._numConsecutiveFailures++;
                if (_._statsbeat) {
                  _._statsbeat.countException(l.StatsbeatNetworkCategory.Breeze, o, r);
                }
                if (!_._enableDiskRetryMode || _._numConsecutiveFailures > 0 && _._numConsecutiveFailures % e.MAX_CONNECTION_FAILURES_BEFORE_WARN == 0) {
                  var i = "Ingestion endpoint could not be reached. This batch of telemetry items has been lost. Use Disk Retry Caching to enable resending of failed telemetry. Error:";
                  _._enableDiskRetryMode && (i = "Ingestion endpoint could not be reached " + _._numConsecutiveFailures + " consecutive times. There may be resulting telemetry loss. Most recent error:"), _._logWarn(i, d.dumpObj(r));
                } else i = "Transient failure to reach ingestion endpoint. This batch of telemetry items will be retried. Error:", _._logInfo(i, d.dumpObj(r));
                _._onErrorHelper(r);
                if ("function" == typeof n) {
                  if (r) {
                    if (_._requestTimedOut) {
                      r.name = "telemetry timeout";
                      r.message = "telemetry request timed out";
                    }
                    n(d.dumpObj(r));
                  } else {
                    n("Error sending telemetry");
                  }
                }
                if (_._enableDiskRetryMode) {
                  _._storeToDisk(t);
                }
              });
              h.write(c);
              h.end();
            });
            i.label = 5;
          case 5:
            return [2];
        }
      });
    });
  };
  e.prototype.saveOnCrash = function (e) {
    if (this._enableDiskRetryMode) {
      this._storeToDiskSync(d.stringify(e));
    }
  };
  e.prototype._isRetriable = function (e) {
    return 206 === e || 401 === e || 403 === e || 408 === e || 429 === e || 500 === e || 502 === e || 503 === e || 504 === e;
  };
  e.prototype._logInfo = function (t) {
    for (n = [], r = 1, void 0; r < arguments.length; r++) {
      var n;
      var r;
      n[r - 1] = arguments[r];
    }
    if (this._isStatsbeatSender) {
      f.info(e.TAG, t, n);
    }
  };
  e.prototype._logWarn = function (t) {
    for (n = [], r = 1, void 0; r < arguments.length; r++) {
      var n;
      var r;
      n[r - 1] = arguments[r];
    }
    if (this._isStatsbeatSender) {
      f.warn(e.TAG, t, n);
    }
  };
  e.prototype._statsbeatFailedToIngest = function () {
    if (this._shutdownStatsbeat) {
      this._failedToIngestCounter++;
      if (this._failedToIngestCounter >= 3) {
        this._shutdownStatsbeat();
      }
    }
  };
  e.prototype._storeToDisk = function (e) {
    return r(this, void 0, void 0, function () {
      var t;
      var n;
      var r;
      var o;
      var s;
      var c;
      var l;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            i.trys.push([0, 2,, 3]);
            this._logInfo("Checking existence of data storage directory: " + this._tempDir);
            return [4, p.confirmDirExists(this._tempDir)];
          case 1:
            i.sent();
            return [3, 3];
          case 2:
            t = i.sent();
            this._logWarn("Failed to create folder to put telemetry: " + d.dumpObj(t));
            this._onErrorHelper(t);
            return [2];
          case 3:
            i.trys.push([3, 5,, 6]);
            return [4, m.FileAccessControl.applyACLRules(this._tempDir)];
          case 4:
            i.sent();
            return [3, 6];
          case 5:
            n = i.sent();
            this._logWarn("Failed to apply file access control to folder: " + d.dumpObj(n));
            this._onErrorHelper(n);
            return [2];
          case 6:
            i.trys.push([6, 8,, 9]);
            return [4, p.getShallowDirectorySize(this._tempDir)];
          case 7:
            return (r = i.sent()) > this._maxBytesOnDisk ? (this._logWarn("Not saving data due to max size limit being met. Directory size in bytes is: " + r), [2]) : [3, 9];
          case 8:
            o = i.sent();
            this._logWarn("Failed to read directory for retriable telemetry: " + d.dumpObj(o));
            this._onErrorHelper(o);
            return [2];
          case 9:
            i.trys.push([9, 11,, 12]);
            s = new Date().getTime() + ".ai.json";
            c = a.join(this._tempDir, s);
            this._logInfo("saving data to disk at: " + c);
            return [4, p.writeFileAsync(c, d.stringify(e), {
              mode: 384
            })];
          case 10:
            i.sent();
            return [3, 12];
          case 11:
            l = i.sent();
            this._logWarn("Failed to persist telemetry to disk: " + d.dumpObj(l));
            this._onErrorHelper(l);
            return [2];
          case 12:
            return [2];
        }
      });
    });
  };
  e.prototype._storeToDiskSync = function (e) {
    try {
      this._logInfo("Checking existence of data storage directory: " + this._tempDir);
      if (o.existsSync(this._tempDir)) {
        o.mkdirSync(this._tempDir);
      }
      m.FileAccessControl.applyACLRulesSync(this._tempDir);
      var t = p.getShallowDirectorySizeSync(this._tempDir);
      if (t > this._maxBytesOnDisk) return void this._logInfo("Not saving data due to max size limit being met. Directory size in bytes is: " + t);
      var n = new Date().getTime() + ".ai.json";
      var r = a.join(this._tempDir, n);
      this._logInfo("saving data before crash to disk at: " + r);
      o.writeFileSync(r, e, {
        mode: 384
      });
    } catch (e) {
      this._logWarn("Error while saving data to disk: " + d.dumpObj(e));
      this._onErrorHelper(e);
    }
  };
  e.prototype._sendFirstFileOnDisk = function () {
    return r(this, void 0, void 0, function () {
      var e;
      var t;
      var n;
      var r;
      var o;
      var s;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            i.trys.push([0, 6,, 7]);
            return [4, p.readdirAsync(this._tempDir)];
          case 1:
            return (e = (e = i.sent()).filter(function (e) {
              return a.basename(e).indexOf(".ai.json") > -1;
            })).length > 0 ? (t = e[0], n = a.join(this._tempDir, t), [4, p.readFileAsync(n)]) : [3, 5];
          case 2:
            r = i.sent();
            return [4, p.unlinkAsync(n)];
          case 3:
            i.sent();
            o = JSON.parse(r.toString());
            return [4, this.send(o)];
          case 4:
            i.sent();
            i.label = 5;
          case 5:
            return [3, 7];
          case 6:
            s = i.sent();
            this._onErrorHelper(s);
            return [3, 7];
          case 7:
            return [2];
        }
      });
    });
  };
  e.prototype._onErrorHelper = function (e) {
    if ("function" == typeof this._onError) {
      this._onError(e);
    }
  };
  e.prototype._fileCleanupTask = function () {
    return r(this, void 0, void 0, function () {
      var t;
      var n;
      var r;
      var o;
      var s;
      var c = this;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            i.trys.push([0, 6,, 7]);
            return [4, p.readdirAsync(this._tempDir)];
          case 1:
            if (!((t = (t = i.sent()).filter(function (e) {
              return a.basename(e).indexOf(".ai.json") > -1;
            })).length > 0)) return [3, 5];
            n = 0;
            i.label = 2;
          case 2:
            return n < t.length ? (r = new Date(parseInt(t[n].split(".ai.json")[0])), new Date(+new Date() - e.FILE_RETEMPTION_PERIOD) > r ? (o = a.join(this._tempDir, t[n]), [4, p.unlinkAsync(o).catch(function (e) {
              c._onErrorHelper(e);
            })]) : [3, 4]) : [3, 5];
          case 3:
            i.sent();
            i.label = 4;
          case 4:
            n++;
            return [3, 2];
          case 5:
            return [3, 7];
          case 6:
            if ("ENOENT" != (s = i.sent()).code) {
              this._onErrorHelper(s);
            }
            return [3, 7];
          case 7:
            return [2];
        }
      });
    });
  };
  e.TAG = "Sender";
  e.WAIT_BETWEEN_RESEND = 6e4;
  e.MAX_BYTES_ON_DISK = 52428800;
  e.MAX_CONNECTION_FAILURES_BEFORE_WARN = 5;
  e.CLEANUP_TIMEOUT = 36e5;
  e.FILE_RETEMPTION_PERIOD = 6048e5;
  e.TEMPDIR_PREFIX = "appInsights-node";
  e.HTTP_TIMEOUT = 2e4;
  return e;
}();
module.exports = y;