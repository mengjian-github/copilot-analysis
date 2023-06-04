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
var p = function (e) {
  function t(n, r) {
    var i = e.call(this) || this;
    if (r && r.method && n) {
      i.method = r.method;
      i.url = t._getUrlFromRequestOptions(n, r);
      i.startTime = +new Date();
    }
    return i;
  }
  i(t, e);
  t.prototype.onError = function (e) {
    this._setStatus(void 0, e);
  };
  t.prototype.onResponse = function (e) {
    this._setStatus(e.statusCode, void 0);
    this.correlationId = a.getCorrelationContextTarget(e, c.requestContextTargetKey);
  };
  t.prototype.getDependencyTelemetry = function (e, t) {
    var n = this.method.toUpperCase();
    var r = s.RemoteDependencyDataConstants.TYPE_HTTP;
    var i = "";
    try {
      var a = new o.URL(this.url);
      a.search = void 0;
      a.hash = void 0;
      n += " " + a.pathname;
      i = a.hostname;
      if (a.port) {
        i += ":" + a.port;
      }
    } catch (e) {}
    if (this.correlationId) {
      r = s.RemoteDependencyDataConstants.TYPE_AI;
      if (this.correlationId !== u.correlationIdPrefix) {
        i += " | " + this.correlationId;
      }
    } else {
      r = s.RemoteDependencyDataConstants.TYPE_HTTP;
    }
    var c = {
      id: t,
      name: n,
      data: this.url,
      duration: this.duration,
      success: this._isSuccess(),
      resultCode: this.statusCode ? this.statusCode.toString() : null,
      properties: this.properties || {},
      dependencyTypeName: r,
      target: i
    };
    if (e && e.time) {
      c.time = e.time;
    } else {
      if (this.startTime) {
        c.time = new Date(this.startTime);
      }
    }
    if (e) {
      for (var l in e) c[l] || (c[l] = e[l]);
      if (e.properties) for (var l in e.properties) c.properties[l] = e.properties[l];
    }
    return c;
  };
  t._getUrlFromRequestOptions = function (e, t) {
    if ("string" == typeof e) {
      if (0 === e.indexOf("http://") || 0 === e.indexOf("https://")) try {
        e = new o.URL(e);
      } catch (e) {} else try {
        var n = new o.URL("http://" + e);
        e = "443" === n.port ? new o.URL("https://" + e) : new o.URL("http://" + e);
      } catch (e) {}
    } else {
      if (e && "function" == typeof o.URL && e instanceof o.URL) return o.format(e);
      var r = e;
      e = {};
      if (r) {
        Object.keys(r).forEach(function (t) {
          e[t] = r[t];
        });
      }
    }
    if (e.path && e.host) try {
      var i = new o.URL(e.path, "http://" + e.host + e.path);
      e.pathname = i.pathname;
      e.search = i.search;
    } catch (e) {}
    if (e.path && e.hostname && !e.host) try {
      i = new o.URL(e.path, "http://" + e.hostname + e.path);
      e.pathname = i.pathname;
      e.search = i.search;
    } catch (e) {}
    if (e.host && e.port) try {
      if (!new o.URL("http://" + e.host).port && e.port) {
        e.hostname = e.host;
        delete e.host;
      }
    } catch (e) {}
    e.protocol = e.protocol || t.agent && t.agent.protocol || t.protocol || void 0;
    e.hostname = e.hostname || "localhost";
    return o.format(e);
  };
  return t;
}(l);
module.exports = p;