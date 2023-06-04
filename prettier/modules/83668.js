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
var o = require(95282);
var s = require(87148);
var a = require(59184);
var c = require(63580);
var l = require(54470);
var u = function () {
  function e(e, t, n) {
    this._isCollectingData = !1;
    this._lastSuccessTime = Date.now();
    this._lastSendSucceeded = !0;
    this._metrics = {};
    this._documents = [];
    this._collectors = [];
    this._redirectedHost = null;
    this._pollingIntervalHint = -1;
    this.config = e;
    this.context = t || new l();
    this._sender = new a(this.config, n);
    this._isEnabled = !1;
  }
  e.prototype.addCollector = function (e) {
    this._collectors.push(e);
  };
  e.prototype.trackMetric = function (e) {
    this._addMetric(e);
  };
  e.prototype.addDocument = function (e) {
    if (this._isCollectingData) {
      var t = s.telemetryEnvelopeToQuickPulseDocument(e);
      if (t) {
        this._documents.push(t);
      }
    }
  };
  e.prototype.enable = function (e) {
    if (e && !this._isEnabled) {
      this._isEnabled = !0;
      this._goQuickPulse();
    } else {
      if (!e && this._isEnabled) {
        this._isEnabled = !1;
        clearTimeout(this._handle);
        this._handle = void 0;
      }
    }
  };
  e.prototype.enableCollectors = function (e) {
    this._collectors.forEach(function (t) {
      t.enable(e);
    });
  };
  e.prototype._addMetric = function (e) {
    var t = e.value;
    var n = e.count || 1;
    var r = c.PerformanceToQuickPulseCounter[e.name];
    if (r) {
      if (this._metrics[r]) {
        this._metrics[r].Value = (this._metrics[r].Value * this._metrics[r].Weight + t * n) / (this._metrics[r].Weight + n);
        this._metrics[r].Weight += n;
      } else {
        this._metrics[r] = s.createQuickPulseMetric(e);
        this._metrics[r].Name = r;
        this._metrics[r].Weight = 1;
      }
    }
  };
  e.prototype._resetQuickPulseBuffer = function () {
    delete this._metrics;
    this._metrics = {};
    this._documents.length = 0;
  };
  e.prototype._goQuickPulse = function () {
    return r(this, void 0, void 0, function () {
      var t;
      var n;
      var r;
      var o;
      var a = this;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            t = Object.keys(this._metrics).map(function (e) {
              return a._metrics[e];
            });
            n = s.createQuickPulseEnvelope(t, this._documents.slice(), this.config, this.context);
            this._resetQuickPulseBuffer();
            return this._isCollectingData ? [4, this._post(n)] : [3, 2];
          case 1:
            i.sent();
            return [3, 3];
          case 2:
            this._ping(n);
            i.label = 3;
          case 3:
            r = this._pollingIntervalHint > 0 ? this._pollingIntervalHint : e.PING_INTERVAL;
            o = this._isCollectingData ? e.POST_INTERVAL : r;
            if (this._isCollectingData && Date.now() - this._lastSuccessTime >= e.MAX_POST_WAIT_TIME && !this._lastSendSucceeded) {
              this._isCollectingData = !1;
              o = e.FALLBACK_INTERVAL;
            } else {
              if (!this._isCollectingData && Date.now() - this._lastSuccessTime >= e.MAX_PING_WAIT_TIME && !this._lastSendSucceeded) {
                o = e.FALLBACK_INTERVAL;
              }
            }
            this._lastSendSucceeded = null;
            this._handle = setTimeout(this._goQuickPulse.bind(this), o);
            this._handle.unref();
            return [2];
        }
      });
    });
  };
  e.prototype._ping = function (e) {
    this._sender.ping(e, this._redirectedHost, this._quickPulseDone.bind(this));
  };
  e.prototype._post = function (e) {
    return r(this, void 0, void 0, function () {
      return i(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this._sender.post(e, this._redirectedHost, this._quickPulseDone.bind(this))];
          case 1:
            t.sent();
            return [2];
        }
      });
    });
  };
  e.prototype._quickPulseDone = function (e, t, n, r) {
    if (null != e) {
      if (this._isCollectingData !== e) {
        o.info("Live Metrics sending data", e);
        this.enableCollectors(e);
      }
      this._isCollectingData = e;
      if (n && n.length > 0) {
        this._redirectedHost = n;
        o.info("Redirecting endpoint to: ", n);
      }
      if (r && r > 0) {
        this._pollingIntervalHint = r;
      }
      if (t && t.statusCode < 300 && t.statusCode >= 200) {
        this._lastSuccessTime = Date.now();
        this._lastSendSucceeded = !0;
      } else {
        this._lastSendSucceeded = !1;
      }
    } else {
      this._lastSendSucceeded = !1;
    }
  };
  e.MAX_POST_WAIT_TIME = 2e4;
  e.MAX_PING_WAIT_TIME = 6e4;
  e.FALLBACK_INTERVAL = 6e4;
  e.PING_INTERVAL = 5e3;
  e.POST_INTERVAL = 1e3;
  return e;
}();
module.exports = u;