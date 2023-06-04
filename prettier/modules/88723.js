var r = this && this.__spreadArrays || function () {
  for (e = 0, t = 0, n = arguments.length, void 0; t < n; t++) {
    var e;
    var t;
    var n;
    e += arguments[t].length;
  }
  var r = Array(e);
  var i = 0;
  for (t = 0; t < n; t++) for (o = arguments[t], s = 0, a = o.length, void 0; s < a; s++, i++) {
    var o;
    var s;
    var a;
    r[i] = o[s];
  }
  return r;
};
var i = require(13685);
var o = require(95687);
var s = require(95282);
var a = require(25740);
var c = require(59036);
var l = require(48339);
var u = require(70894);
var p = require(58090);
var d = require(87396);
var h = require(29962);
var f = function () {
  function e(t) {
    if (e.INSTANCE) throw new Error("Client request tracking should be configured from the applicationInsights object");
    e.INSTANCE = this;
    this._client = t;
  }
  e.prototype.enable = function (e) {
    this._isEnabled = e;
    if (this._isEnabled && !this._isInitialized) {
      this._initialize();
    }
    if (d.IsInitialized) {
      require(89879).wp(e, this._client);
      require(67886).wp(e, this._client);
      require(34777).wp(e, this._client);
      require(85071).wp(e, this._client);
      require(31227).wp(e, this._client);
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.prototype._initialize = function () {
    var t = this;
    this._isInitialized = !0;
    var n = i.request;
    var c = o.request;
    var l = function (n, r) {
      try {
        var i = !r[e.disableCollectionRequestOption] && !n[e.alreadyAutoCollectedFlag];
        var o = null;
        if (r.headers && (o = r.headers["User-Agent"] || r.headers["user-agent"]) && -1 !== o.toString().indexOf("azsdk-js")) {
          i = !1;
        }
        if (n && r && i && (u.CorrelationContextManager.wrapEmitter(n), t._isEnabled)) if (n[e.alreadyAutoCollectedFlag] = !0, u.CorrelationContextManager.getCurrentContext()) e.trackRequest(t._client, {
          options: r,
          request: n
        });else {
          var c = null;
          if (h.w3cEnabled) c = new p().traceId;else {
            var l = h.generateRequestId(null);
            c = h.getRootId(l);
          }
          var d = u.CorrelationContextManager.generateContextObject(c);
          u.CorrelationContextManager.runWithContext(d, function () {
            e.trackRequest(t._client, {
              options: r,
              request: n
            });
          });
        }
      } catch (e) {
        s.warn("Failed to generate dependency telemetry.", a.dumpObj(e));
      }
    };
    i.request = function (e) {
      for (t = [], o = 1, void 0; o < arguments.length; o++) {
        var t;
        var o;
        t[o - 1] = arguments[o];
      }
      var s = n.call.apply(n, r([i, e], t));
      l(s, e);
      return s;
    };
    o.request = function (e) {
      for (t = [], n = 1, void 0; n < arguments.length; n++) {
        var t;
        var n;
        t[n - 1] = arguments[n];
      }
      var i = c.call.apply(c, r([o, e], t));
      l(i, e);
      return i;
    };
    i.get = function (e) {
      for (n = [], o = 1, void 0; o < arguments.length; o++) {
        var t;
        var n;
        var o;
        n[o - 1] = arguments[o];
      }
      var s = (t = i.request).call.apply(t, r([i, e], n));
      s.end();
      return s;
    };
    o.get = function (e) {
      for (n = [], i = 1, void 0; i < arguments.length; i++) {
        var t;
        var n;
        var i;
        n[i - 1] = arguments[i];
      }
      var s = (t = o.request).call.apply(t, r([o, e], n));
      s.end();
      return s;
    };
  };
  e.trackRequest = function (t, n) {
    if (n.options && n.request && t) {
      var r;
      var i;
      var o = new l(n.options, n.request);
      var d = u.CorrelationContextManager.getCurrentContext();
      if (d && d.operation && d.operation.traceparent && p.isValidTraceId(d.operation.traceparent.traceId)) {
        d.operation.traceparent.updateSpanId();
        r = d.operation.traceparent.getBackCompatRequestId();
      } else {
        if (h.w3cEnabled) {
          i = (m = new p()).toString();
          r = m.getBackCompatRequestId();
        } else {
          r = d && d.operation && d.operation.parentId + e.requestNumber++ + ".";
        }
      }
      if (a.canIncludeCorrelationHeader(t, o.getUrl()) && n.request.getHeader && n.request.setHeader && t.config && t.config.correlationId) {
        var f = n.request.getHeader(c.requestContextHeader);
        try {
          a.safeIncludeCorrelationHeader(t, n.request, f);
        } catch (e) {
          s.warn("Request-Context header could not be set. Correlation of requests may be lost", e);
        }
        if (d && d.operation) try {
          if (n.request.setHeader(c.requestIdHeader, r), t.config.ignoreLegacyHeaders || (n.request.setHeader(c.parentIdHeader, d.operation.id), n.request.setHeader(c.rootIdHeader, r)), i || d.operation.traceparent) n.request.setHeader(c.traceparentHeader, i || d.operation.traceparent.toString());else if (h.w3cEnabled) {
            var m = new p().toString();
            n.request.setHeader(c.traceparentHeader, m);
          }
          if (d.operation.tracestate) {
            var g = d.operation.tracestate.toString();
            g && n.request.setHeader(c.traceStateHeader, g);
          }
          var y = d.customProperties.serializeToHeader();
          y && n.request.setHeader(c.correlationContextHeader, y);
        } catch (e) {
          s.warn("Correlation headers could not be set. Correlation of requests may be lost.", e);
        }
      }
      if (n.request.on) {
        n.request.on("response", function (e) {
          if (!n.isProcessed) {
            n.isProcessed = !0;
            o.onResponse(e);
            var i = o.getDependencyTelemetry(n, r);
            i.contextObjects = i.contextObjects || {};
            i.contextObjects["http.RequestOptions"] = n.options;
            i.contextObjects["http.ClientRequest"] = n.request;
            i.contextObjects["http.ClientResponse"] = e;
            t.trackDependency(i);
          }
        });
        n.request.on("error", function (e) {
          if (!n.isProcessed) {
            n.isProcessed = !0;
            o.onError(e);
            var i = o.getDependencyTelemetry(n, r);
            i.contextObjects = i.contextObjects || {};
            i.contextObjects["http.RequestOptions"] = n.options;
            i.contextObjects["http.ClientRequest"] = n.request;
            i.contextObjects.Error = e;
            t.trackDependency(i);
          }
        });
        n.request.on("abort", function () {
          if (!n.isProcessed) {
            n.isProcessed = !0;
            o.onError(new Error("The request has been aborted and the network socket has closed."));
            var e = o.getDependencyTelemetry(n, r);
            e.contextObjects = e.contextObjects || {};
            e.contextObjects["http.RequestOptions"] = n.options;
            e.contextObjects["http.ClientRequest"] = n.request;
            t.trackDependency(e);
          }
        });
      }
    } else s.info("AutoCollectHttpDependencies.trackRequest was called with invalid parameters: ", !n.options, !n.request, !t);
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1);
    this._isInitialized = !1;
  };
  e.disableCollectionRequestOption = "disableAppInsightsAutoCollection";
  e.requestNumber = 1;
  e.alreadyAutoCollectedFlag = "_appInsightsAutoCollected";
  return e;
}();
module.exports = f;