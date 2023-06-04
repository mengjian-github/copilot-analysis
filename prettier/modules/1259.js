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
var o = require(67625);
var s = require(40731);
var a = require(88723);
var c = require(95282);
var l = function (e) {
  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }
  i(t, e);
  t.prototype.trackNodeHttpRequestSync = function (e) {
    if (e && e.request && e.response && e.duration) {
      s.trackRequestSync(this, e);
    } else {
      c.warn("trackNodeHttpRequestSync requires NodeHttpRequestTelemetry object with request, response and duration specified.");
    }
  };
  t.prototype.trackNodeHttpRequest = function (e) {
    if (e.duration || e.error) {
      c.warn("trackNodeHttpRequest will ignore supplied duration and error parameters. These values are collected from the request and response objects.");
    }
    if (e && e.request && e.response) {
      s.trackRequest(this, e);
    } else {
      c.warn("trackNodeHttpRequest requires NodeHttpRequestTelemetry object with request and response specified.");
    }
  };
  t.prototype.trackNodeHttpDependency = function (e) {
    if (e && e.request) {
      a.trackRequest(this, e);
    } else {
      c.warn("trackNodeHttpDependency requires NodeHttpDependencyTelemetry object with request specified.");
    }
  };
  return t;
}(o);
module.exports = l;