var r = require(13685);
var i = require(95687);
var o = require(95282);
var s = require(25740);
var a = require(59036);
var c = require(86694);
var l = require(70894);
var u = require(74350);
var p = function () {
  function e(t) {
    if (e.INSTANCE) throw new Error("Server request tracking should be configured from the applicationInsights object");
    e.INSTANCE = this;
    this._client = t;
  }
  e.prototype.enable = function (e) {
    this._isEnabled = e;
    if ((this._isAutoCorrelating || this._isEnabled || u.isEnabled()) && !this._isInitialized) {
      this.useAutoCorrelation(this._isAutoCorrelating);
      this._initialize();
    }
  };
  e.prototype.useAutoCorrelation = function (e, t) {
    if (e && !this._isAutoCorrelating) {
      l.CorrelationContextManager.enable(t);
    } else {
      if (!e && this._isAutoCorrelating) {
        l.CorrelationContextManager.disable();
      }
    }
    this._isAutoCorrelating = e;
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.prototype.isAutoCorrelating = function () {
    return this._isAutoCorrelating;
  };
  e.prototype._generateCorrelationContext = function (e) {
    if (this._isAutoCorrelating) return l.CorrelationContextManager.generateContextObject(e.getOperationId(this._client.context.tags), e.getRequestId(), e.getOperationName(this._client.context.tags), e.getCorrelationContextHeader(), e.getTraceparent(), e.getTracestate());
  };
  e.prototype._registerRequest = function (t, n, r) {
    var i = this;
    var o = new c(t);
    var s = this._generateCorrelationContext(o);
    l.CorrelationContextManager.runWithContext(s, function () {
      if (i._isEnabled) {
        t[e.alreadyAutoCollectedFlag] = !0;
        e.trackRequest(i._client, {
          request: t,
          response: n
        }, o);
      }
      if ("function" == typeof r) {
        r(t, n);
      }
    });
  };
  e.prototype._initialize = function () {
    this._isInitialized = !0;
    if (!e.HANDLER_READY) {
      e.HANDLER_READY = !0;
      var t = function (t) {
          if (t) {
            if ("function" != typeof t) throw new Error("onRequest handler must be a function");
            return function (n, r) {
              var i;
              l.CorrelationContextManager.wrapEmitter(n), l.CorrelationContextManager.wrapEmitter(r);
              var o = n && !n[e.alreadyAutoCollectedFlag];
              n && o ? null === (i = e.INSTANCE) || void 0 === i || i._registerRequest(n, r, t) : "function" == typeof t && t(n, r);
            };
          }
        },
        n = function (e) {
          var n = e.addListener.bind(e);
          e.addListener = function (e, r) {
            switch (e) {
              case "request":
              case "checkContinue":
                return n(e, t(r));
              default:
                return n(e, r);
            }
          }, e.on = e.addListener;
        },
        o = r.createServer;
      r.createServer = function (e, r) {
        if (r && "function" == typeof r) {
          var i = o(e, t(r));
          return n(i), i;
        }
        return i = o(t(e)), n(i), i;
      };
      var s = i.createServer;
      i.createServer = function (e, r) {
        var i = s(e, t(r));
        return n(i), i;
      };
    }
  };
  e.trackRequestSync = function (t, n) {
    if (n.request && n.response && t) {
      n.isProcessed = !1;
      e.addResponseCorrelationIdHeader(t, n.response);
      var r = l.CorrelationContextManager.getCurrentContext();
      var i = new c(n.request, r && r.operation.parentId);
      if (r) {
        r.operation.id = i.getOperationId(t.context.tags) || r.operation.id;
        r.operation.name = i.getOperationName(t.context.tags) || r.operation.name;
        r.operation.parentId = i.getRequestId() || r.operation.parentId;
        r.customProperties.addHeaderData(i.getCorrelationContextHeader());
      }
      e.endRequest(t, i, n, n.duration, n.error);
    } else o.info("AutoCollectHttpRequests.trackRequestSync was called with invalid parameters: ", !n.request, !n.response, !t);
  };
  e.trackRequest = function (t, n, r) {
    if (n.request && n.response && t) {
      n.isProcessed = !1;
      var i = l.CorrelationContextManager.getCurrentContext();
      var a = r || new c(n.request, i && i.operation.parentId);
      if (s.canIncludeCorrelationHeader(t, a.getUrl())) {
        e.addResponseCorrelationIdHeader(t, n.response);
      }
      if (i && !r) {
        i.operation.id = a.getOperationId(t.context.tags) || i.operation.id;
        i.operation.name = a.getOperationName(t.context.tags) || i.operation.name;
        i.operation.parentId = a.getOperationParentId(t.context.tags) || i.operation.parentId;
        i.customProperties.addHeaderData(a.getCorrelationContextHeader());
      }
      if (n.response.once) {
        n.response.once("finish", function () {
          e.endRequest(t, a, n, null, null);
        });
      }
      if (n.request.on) {
        n.request.on("error", function (r) {
          e.endRequest(t, a, n, null, r);
        });
      }
      if (n.request.on) {
        n.request.on("aborted", function () {
          e.endRequest(t, a, n, null, "The request has been aborted and the network socket has closed.");
        });
      }
    } else o.info("AutoCollectHttpRequests.trackRequest was called with invalid parameters: ", !n.request, !n.response, !t);
  };
  e.addResponseCorrelationIdHeader = function (e, t) {
    if (e.config && e.config.correlationId && t.getHeader && t.setHeader && !t.headersSent) {
      var n = t.getHeader(a.requestContextHeader);
      s.safeIncludeCorrelationHeader(e, t, n);
    }
  };
  e.endRequest = function (e, t, n, r, i) {
    if (!n.isProcessed) {
      n.isProcessed = !0;
      if (i) {
        t.onError(i, r);
      } else {
        t.onResponse(n.response, r);
      }
      var o = t.getRequestTelemetry(n);
      o.tagOverrides = t.getRequestTags(e.context.tags);
      if (n.tagOverrides) for (var s in n.tagOverrides) o.tagOverrides[s] = n.tagOverrides[s];
      var a = t.getLegacyRootId();
      if (a) {
        o.properties.ai_legacyRootId = a;
      }
      o.contextObjects = o.contextObjects || {};
      o.contextObjects["http.ServerRequest"] = n.request;
      o.contextObjects["http.ServerResponse"] = n.response;
      e.trackRequest(o);
    }
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1);
    this._isInitialized = !1;
    l.CorrelationContextManager.disable();
    this._isAutoCorrelating = !1;
  };
  e.HANDLER_READY = !1;
  e.alreadyAutoCollectedFlag = "_appInsightsAutoCollected";
  return e;
}();
module.exports = p;