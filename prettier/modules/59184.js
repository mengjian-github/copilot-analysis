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
var o = require(95687);
var s = require(88723);
var a = require(95282);
var c = require(3751);
var l = require(25740);
var u = require(57310);
var p = "x-ms-qps-service-polling-interval-hint";
var d = "x-ms-qps-service-endpoint-redirect-v2";
var h = function () {
  function e(e, t) {
    this._config = e;
    this._consecutiveErrors = 0;
    this._getAuthorizationHandler = t;
  }
  e.prototype.ping = function (e, t, n) {
    var r = [{
      name: "x-ms-qps-stream-id",
      value: e.StreamId
    }, {
      name: "x-ms-qps-machine-name",
      value: e.MachineName
    }, {
      name: "x-ms-qps-role-name",
      value: e.RoleName
    }, {
      name: "x-ms-qps-instance-name",
      value: e.Instance
    }, {
      name: "x-ms-qps-invariant-version",
      value: e.InvariantVersion.toString()
    }];
    this._submitData(e, t, n, "ping", r);
  };
  e.prototype.post = function (e, t, n) {
    return r(this, void 0, void 0, function () {
      return i(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, this._submitData([e], t, n, "post")];
          case 1:
            r.sent();
            return [2];
        }
      });
    });
  };
  e.prototype._submitData = function (t, n, h, f, m) {
    return r(this, void 0, void 0, function () {
      var r;
      var g;
      var y;
      var _;
      var v;
      var b;
      var E;
      var w = this;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            r = l.stringify(t);
            (b = {})[s.disableCollectionRequestOption] = !0;
            b.host = n && n.length > 0 ? n : this._config.quickPulseHost;
            b.method = "POST";
            b.path = "/QuickPulseService.svc/" + f + "?ikey=" + this._config.instrumentationKey;
            (E = {
              Expect: "100-continue"
            })["x-ms-qps-transmission-time"] = c.getTransmissionTime();
            E["Content-Type"] = "application/json";
            E["Content-Length"] = Buffer.byteLength(r);
            b.headers = E;
            g = b;
            if (m && m.length > 0) {
              m.forEach(function (e) {
                return g.headers[e.name] = e.value;
              });
            }
            if ("post" !== f) return [3, 4];
            if (!(y = this._getAuthorizationHandler ? this._getAuthorizationHandler(this._config) : null)) return [3, 4];
            i.label = 1;
          case 1:
            i.trys.push([1, 3,, 4]);
            return [4, y.addAuthorizationHeader(g)];
          case 2:
            i.sent();
            return [3, 4];
          case 3:
            _ = i.sent();
            a.info(e.TAG, "Failed to get AAD bearer token for the Application. Error:", _);
            return [2];
          case 4:
            if (this._config.httpsAgent) {
              g.agent = this._config.httpsAgent;
            } else {
              g.agent = l.tlsRestrictedAgent;
            }
            (v = o.request(g, function (e) {
              if (200 == e.statusCode) {
                var t = "true" === e.headers["x-ms-qps-subscribed"];
                var n = null;
                try {
                  n = e.headers[d] ? new u.URL(e.headers[d].toString()).host : null;
                } catch (e) {
                  w._onError("Failed to parse redirect header from QuickPulse: " + l.dumpObj(e));
                }
                var r = e.headers[p] ? parseInt(e.headers[p].toString()) : null;
                w._consecutiveErrors = 0;
                h(t, e, n, r);
              } else {
                w._onError("StatusCode:" + e.statusCode + " StatusMessage:" + e.statusMessage);
                h();
              }
            })).on("error", function (e) {
              w._onError(e);
              h();
            });
            v.write(r);
            v.end();
            return [2];
        }
      });
    });
  };
  e.prototype._onError = function (t) {
    this._consecutiveErrors++;
    var n = "Transient error connecting to the Live Metrics endpoint. This packet will not appear in your Live Metrics Stream. Error:";
    if (this._consecutiveErrors % e.MAX_QPS_FAILURES_BEFORE_WARN == 0) {
      n = "Live Metrics endpoint could not be reached " + this._consecutiveErrors + " consecutive times. Most recent error:";
      a.warn(e.TAG, n, t);
    } else {
      a.info(e.TAG, n, t);
    }
  };
  e.TAG = "QuickPulseSender";
  e.MAX_QPS_FAILURES_BEFORE_WARN = 25;
  return e;
}();
module.exports = h;