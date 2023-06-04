var r;
var i = this && this.__extends || (r = function (e, t) {
  r = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
      e[n] = t[n];
    }
  };
  return r(e, t);
}, function (e, t) {
  function n() {
    this.constructor = e;
  }
  r(e, t);
  e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
var o = require(57310);
var s = require(55290);
var a = require(25740);
var c = require(59036);
var l = require(13054);
var u = require(29962);
var p = require(10420);
var d = require(58090);
var h = function (e) {
  function t(t, n) {
    var r = e.call(this) || this;
    if (t) {
      r.method = t.method;
      r.url = r._getAbsoluteUrl(t);
      r.startTime = +new Date();
      r.socketRemoteAddress = t.socket && t.socket.remoteAddress;
      r.parseHeaders(t, n);
      if (t.connection) {
        r.connectionRemoteAddress = t.connection.remoteAddress;
        r.legacySocketRemoteAddress = t.connection.socket && t.connection.socket.remoteAddress;
      }
    }
    return r;
  }
  i(t, e);
  t.prototype.onError = function (e, t) {
    this._setStatus(void 0, e);
    if (t) {
      this.duration = t;
    }
  };
  t.prototype.onResponse = function (e, t) {
    this._setStatus(e.statusCode, void 0);
    if (t) {
      this.duration = t;
    }
  };
  t.prototype.getRequestTelemetry = function (e) {
    var t = this.method;
    try {
      t += " " + new o.URL(this.url).pathname;
    } catch (e) {}
    var n = {
      id: this.requestId,
      name: t,
      url: this.url,
      source: this.sourceCorrelationId,
      duration: this.duration,
      resultCode: this.statusCode ? this.statusCode.toString() : null,
      success: this._isSuccess(),
      properties: this.properties
    };
    if (e && e.time) {
      n.time = e.time;
    } else {
      if (this.startTime) {
        n.time = new Date(this.startTime);
      }
    }
    if (e) {
      for (var r in e) n[r] || (n[r] = e[r]);
      if (e.properties) for (var r in e.properties) n.properties[r] = e.properties[r];
    }
    return n;
  };
  t.prototype.getRequestTags = function (e) {
    var n = {};
    for (var r in e) n[r] = e[r];
    n[t.keys.locationIp] = e[t.keys.locationIp] || this._getIp();
    n[t.keys.sessionId] = e[t.keys.sessionId] || this._getId("ai_session");
    n[t.keys.userId] = e[t.keys.userId] || this._getId("ai_user");
    n[t.keys.userAuthUserId] = e[t.keys.userAuthUserId] || this._getId("ai_authUser");
    n[t.keys.operationName] = this.getOperationName(e);
    n[t.keys.operationParentId] = this.getOperationParentId(e);
    n[t.keys.operationId] = this.getOperationId(e);
    return n;
  };
  t.prototype.getOperationId = function (e) {
    return e[t.keys.operationId] || this.operationId;
  };
  t.prototype.getOperationParentId = function (e) {
    return e[t.keys.operationParentId] || this.parentId || this.getOperationId(e);
  };
  t.prototype.getOperationName = function (e) {
    if (e[t.keys.operationName]) return e[t.keys.operationName];
    var n = "";
    try {
      n = new o.URL(this.url).pathname;
    } catch (e) {}
    var r = this.method;
    if (n) {
      r += " " + n;
    }
    return r;
  };
  t.prototype.getRequestId = function () {
    return this.requestId;
  };
  t.prototype.getCorrelationContextHeader = function () {
    return this.correlationContextHeader;
  };
  t.prototype.getTraceparent = function () {
    return this.traceparent;
  };
  t.prototype.getTracestate = function () {
    return this.tracestate;
  };
  t.prototype.getLegacyRootId = function () {
    return this.legacyRootId;
  };
  t.prototype._getAbsoluteUrl = function (e) {
    if (!e.headers) return e.url;
    var t = e.connection && e.connection.encrypted || "https" == e.headers["x-forwarded-proto"] ? "https" : "http";
    var n = t + "://" + e.headers.host + "/";
    var r = "";
    var i = "";
    try {
      var s = new o.URL(e.url, n);
      r = s.pathname;
      i = s.search;
    } catch (e) {}
    return o.format({
      protocol: t,
      host: e.headers.host,
      pathname: r,
      search: i
    });
  };
  t.prototype._getIp = function () {
    var e = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
    var t = function (t) {
      var n = e.exec(t);
      if (n) return n[0];
    };
    var n = t(this.rawHeaders["x-forwarded-for"]) || t(this.rawHeaders["x-client-ip"]) || t(this.rawHeaders["x-real-ip"]) || t(this.connectionRemoteAddress) || t(this.socketRemoteAddress) || t(this.legacySocketRemoteAddress);
    if (!n && this.connectionRemoteAddress && this.connectionRemoteAddress.substr && "::" === this.connectionRemoteAddress.substr(0, 2)) {
      n = "127.0.0.1";
    }
    return n;
  };
  t.prototype._getId = function (e) {
    var n = this.rawHeaders && this.rawHeaders.cookie && "string" == typeof this.rawHeaders.cookie && this.rawHeaders.cookie || "";
    return t.parseId(a.getCookie(e, n));
  };
  t.prototype.setBackCompatFromThisTraceContext = function () {
    this.operationId = this.traceparent.traceId;
    if (this.traceparent.legacyRootId) {
      this.legacyRootId = this.traceparent.legacyRootId;
    }
    this.parentId = this.traceparent.parentId;
    this.traceparent.updateSpanId();
    this.requestId = this.traceparent.getBackCompatRequestId();
  };
  t.prototype.parseHeaders = function (e, t) {
    this.rawHeaders = e.headers || e.rawHeaders;
    this.userAgent = e.headers && e.headers["user-agent"];
    this.sourceCorrelationId = a.getCorrelationContextTarget(e, c.requestContextSourceKey);
    if (e.headers) {
      var n = e.headers[c.traceStateHeader] ? e.headers[c.traceStateHeader].toString() : null,
        r = e.headers[c.traceparentHeader] ? e.headers[c.traceparentHeader].toString() : null,
        i = e.headers[c.requestIdHeader] ? e.headers[c.requestIdHeader].toString() : null,
        o = e.headers[c.parentIdHeader] ? e.headers[c.parentIdHeader].toString() : null,
        s = e.headers[c.rootIdHeader] ? e.headers[c.rootIdHeader].toString() : null;
      this.correlationContextHeader = e.headers[c.correlationContextHeader] ? e.headers[c.correlationContextHeader].toString() : null, u.w3cEnabled && (r || n) ? (this.traceparent = new d(r ? r.toString() : null), this.tracestate = r && n && new p(n ? n.toString() : null), this.setBackCompatFromThisTraceContext()) : i ? u.w3cEnabled ? (this.traceparent = new d(null, i), this.setBackCompatFromThisTraceContext()) : (this.parentId = i, this.requestId = u.generateRequestId(this.parentId), this.operationId = u.getRootId(this.requestId)) : u.w3cEnabled ? (this.traceparent = new d(), this.traceparent.parentId = o, this.traceparent.legacyRootId = s || o, this.setBackCompatFromThisTraceContext()) : (this.parentId = o, this.requestId = u.generateRequestId(s || this.parentId), this.correlationContextHeader = null, this.operationId = u.getRootId(this.requestId)), t && (this.requestId = t, this.operationId = u.getRootId(this.requestId));
    }
  };
  t.parseId = function (e) {
    var t = e.split("|");
    return t.length > 0 ? t[0] : "";
  };
  t.keys = new s.ContextTagKeys();
  return t;
}(l);
module.exports = h;