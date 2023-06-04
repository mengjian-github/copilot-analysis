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
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.AzureFunctionsHook = void 0;
var o = require(95282);
var s = require(70894);
var AzureFunctionsHook = function () {
  function e(e) {
    this._client = e;
    this._autoGenerateIncomingRequests = !1;
    try {
      this._functionsCoreModule = require(27593);
      var t = this._functionsCoreModule.getProgrammingModel();
      if ("@azure/functions" === t.name && t.version.startsWith("3.")) {
        this._addPreInvocationHook();
        this._addPostInvocationHook();
      } else {
        o.warn('AzureFunctionsHook does not support model "' + t.name + '" version "' + t.version + '"');
      }
    } catch (e) {
      o.info("AzureFunctionsHook failed to load, not running in Azure Functions");
    }
  }
  e.prototype.enable = function (e) {
    this._autoGenerateIncomingRequests = e;
  };
  e.prototype.dispose = function () {
    this.enable(!1);
    this._removeInvocationHooks();
    this._functionsCoreModule = void 0;
  };
  e.prototype._addPreInvocationHook = function () {
    var e = this;
    if (this._preInvocationHook) {
      this._preInvocationHook = this._functionsCoreModule.registerHook("preInvocation", function (t) {
        return r(e, void 0, void 0, function () {
          var e;
          var n;
          return i(this, function (r) {
            e = t.invocationContext;
            try {
              if (n = s.CorrelationContextManager.startOperation(e)) {
                n.customProperties.setProperty("InvocationId", e.invocationId);
                if (e.traceContext.attributes) {
                  n.customProperties.setProperty("ProcessId", e.traceContext.attributes.ProcessId);
                  n.customProperties.setProperty("LogLevel", e.traceContext.attributes.LogLevel);
                  n.customProperties.setProperty("Category", e.traceContext.attributes.Category);
                  n.customProperties.setProperty("HostInstanceId", e.traceContext.attributes.HostInstanceId);
                  n.customProperties.setProperty("AzFuncLiveLogsSessionId", e.traceContext.attributes["#AzFuncLiveLogsSessionId"]);
                }
                t.functionCallback = s.CorrelationContextManager.wrapCallback(t.functionCallback, n);
                if (this._isHttpTrigger(e) && this._autoGenerateIncomingRequests) {
                  t.hookData.appInsightsExtractedContext = n;
                  t.hookData.appInsightsStartTime = Date.now();
                }
              }
            } catch (e) {
              o.warn("Failed to propagate context in Azure Functions", e);
              return [2];
            }
            return [2];
          });
        });
      });
    }
  };
  e.prototype._addPostInvocationHook = function () {
    var e = this;
    if (this._postInvocationHook) {
      this._postInvocationHook = this._functionsCoreModule.registerHook("postInvocation", function (t) {
        return r(e, void 0, void 0, function () {
          var e;
          var n;
          var r;
          var a;
          var c;
          var l = this;
          return i(this, function (i) {
            try {
              if (this._autoGenerateIncomingRequests) {
                e = t.invocationContext;
                if (this._isHttpTrigger(e) && (n = t.inputs[0])) {
                  r = t.hookData.appInsightsStartTime || Date.now();
                  a = this._getAzureFunctionResponse(t, e);
                  if (c = t.hookData.appInsightsExtractedContext) {
                    s.CorrelationContextManager.runWithContext(c, function () {
                      l._createIncomingRequestTelemetry(n, a, r, c.operation.parentId);
                    });
                  } else {
                    this._createIncomingRequestTelemetry(n, a, r, null);
                  }
                }
              }
            } catch (e) {
              o.warn("Error creating automatic incoming request in Azure Functions", e);
            }
            return [2];
          });
        });
      });
    }
  };
  e.prototype._createIncomingRequestTelemetry = function (e, t, n, r) {
    for (i = 200, o = 0, s = [t.statusCode, t.status], void 0; o < s.length; o++) {
      var i;
      var o;
      var s;
      var a = s[o];
      if ("number" == typeof a && Number.isInteger(a)) {
        i = a;
        break;
      }
      if ("string" == typeof a) {
        var c = parseInt(a);
        if (!isNaN(c)) {
          i = c;
          break;
        }
      }
    }
    this._client.trackRequest({
      name: e.method + " " + e.url,
      resultCode: i,
      success: 0 < i && i < 400,
      url: e.url,
      time: new Date(n),
      duration: Date.now() - n,
      id: r
    });
    this._client.flush();
  };
  e.prototype._getAzureFunctionResponse = function (e, t) {
    var n = t.bindingDefinitions.find(function (e) {
      return "out" === e.direction && "http" === e.type.toLowerCase();
    });
    return "$return" === (null == n ? void 0 : n.name) ? e.result : n && t.bindings && void 0 !== t.bindings[n.name] ? t.bindings[n.name] : t.res;
  };
  e.prototype._isHttpTrigger = function (e) {
    return e.bindingDefinitions.find(function (e) {
      var t;
      return "httptrigger" === (null === (t = e.type) || void 0 === t ? void 0 : t.toLowerCase());
    });
  };
  e.prototype._removeInvocationHooks = function () {
    if (this._preInvocationHook) {
      this._preInvocationHook.dispose();
      this._preInvocationHook = void 0;
    }
    if (this._postInvocationHook) {
      this._postInvocationHook.dispose();
      this._postInvocationHook = void 0;
    }
  };
  return e;
}();
exports.AzureFunctionsHook = AzureFunctionsHook;