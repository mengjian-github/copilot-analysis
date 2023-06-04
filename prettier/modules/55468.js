require(41808);
var debug;
var i = require(24404);
var o = require(13685);
var s = require(95687);
var a = require(82361);
var c = (require(39491), require(73837));
function l(e) {
  var t = this;
  t.options = e || {};
  t.proxyOptions = t.options.proxy || {};
  t.maxSockets = t.options.maxSockets || o.Agent.defaultMaxSockets;
  t.requests = [];
  t.sockets = [];
  t.on("free", function (e, n, r, i) {
    for (o = p(n, r, i), s = 0, a = t.requests.length, void 0; s < a; ++s) {
      var o;
      var s;
      var a;
      var c = t.requests[s];
      if (c.host === o.host && c.port === o.port) {
        t.requests.splice(s, 1);
        return void c.request.onSocket(e);
      }
    }
    e.destroy();
    t.removeSocket(e);
  });
}
function u(e, t) {
  var n = this;
  l.prototype.createSocket.call(n, e, function (r) {
    var o = e.request.getHeader("host");
    var s = d({}, n.options, {
      socket: r,
      servername: o ? o.replace(/:.*$/, "") : e.host
    });
    var a = i.connect(0, s);
    n.sockets[n.sockets.indexOf(r)] = a;
    t(a);
  });
}
function p(e, t, n) {
  return "string" == typeof e ? {
    host: e,
    port: t,
    localAddress: n
  } : e;
}
function d(e) {
  for (t = 1, n = arguments.length, void 0; t < n; ++t) {
    var t;
    var n;
    var r = arguments[t];
    if ("object" == typeof r) for (i = Object.keys(r), o = 0, s = i.length, void 0; o < s; ++o) {
      var i;
      var o;
      var s;
      var a = i[o];
      if (void 0 !== r[a]) {
        e[a] = r[a];
      }
    }
  }
  return e;
}
exports.httpOverHttp = function (e) {
  var t = new l(e);
  t.request = o.request;
  return t;
};
exports.httpsOverHttp = function (e) {
  var t = new l(e);
  t.request = o.request;
  t.createSocket = u;
  t.defaultPort = 443;
  return t;
};
exports.httpOverHttps = function (e) {
  var t = new l(e);
  t.request = s.request;
  return t;
};
exports.httpsOverHttps = function (e) {
  var t = new l(e);
  t.request = s.request;
  t.createSocket = u;
  t.defaultPort = 443;
  return t;
};
c.inherits(l, a.EventEmitter);
l.prototype.addRequest = function (e, t, n, r) {
  var i = this;
  var o = d({
    request: e
  }, i.options, p(t, n, r));
  if (i.sockets.length >= this.maxSockets) {
    i.requests.push(o);
  } else {
    i.createSocket(o, function (t) {
      function n() {
        i.emit("free", t, o);
      }
      function r(e) {
        i.removeSocket(t);
        t.removeListener("free", n);
        t.removeListener("close", r);
        t.removeListener("agentRemove", r);
      }
      t.on("free", n);
      t.on("close", r);
      t.on("agentRemove", r);
      e.onSocket(t);
    });
  }
};
l.prototype.createSocket = function (e, t) {
  var n = this;
  var i = {};
  n.sockets.push(i);
  var o = d({}, n.proxyOptions, {
    method: "CONNECT",
    path: e.host + ":" + e.port,
    agent: !1,
    headers: {
      host: e.host + ":" + e.port
    }
  });
  if (e.localAddress) {
    o.localAddress = e.localAddress;
  }
  if (o.proxyAuth) {
    o.headers = o.headers || {};
    o.headers["Proxy-Authorization"] = "Basic " + new Buffer(o.proxyAuth).toString("base64");
  }
  debug("making CONNECT request");
  var s = n.request(o);
  function a(o, a, c) {
    var l;
    s.removeAllListeners();
    a.removeAllListeners();
    return 200 !== o.statusCode ? (debug("tunneling socket could not be established, statusCode=%d", o.statusCode), a.destroy(), (l = new Error("tunneling socket could not be established, statusCode=" + o.statusCode)).code = "ECONNRESET", e.request.emit("error", l), void n.removeSocket(i)) : c.length > 0 ? (debug("got illegal response body from proxy"), a.destroy(), (l = new Error("got illegal response body from proxy")).code = "ECONNRESET", e.request.emit("error", l), void n.removeSocket(i)) : (debug("tunneling connection has established"), n.sockets[n.sockets.indexOf(i)] = a, t(a));
  }
  s.useChunkedEncodingByDefault = !1;
  s.once("response", function (e) {
    e.upgrade = !0;
  });
  s.once("upgrade", function (e, t, n) {
    process.nextTick(function () {
      a(e, t, n);
    });
  });
  s.once("connect", a);
  s.once("error", function (t) {
    s.removeAllListeners();
    debug("tunneling socket could not be established, cause=%s\n", t.message, t.stack);
    var o = new Error("tunneling socket could not be established, cause=" + t.message);
    o.code = "ECONNRESET";
    e.request.emit("error", o);
    n.removeSocket(i);
  });
  s.end();
};
l.prototype.removeSocket = function (e) {
  var t = this.sockets.indexOf(e);
  if (-1 !== t) {
    this.sockets.splice(t, 1);
    var n = this.requests.shift();
    if (n) {
      this.createSocket(n, function (e) {
        n.request.onSocket(e);
      });
    }
  }
};
debug = process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG) ? function () {
  var e = Array.prototype.slice.call(arguments);
  if ("string" == typeof e[0]) {
    e[0] = "TUNNEL: " + e[0];
  } else {
    e.unshift("TUNNEL:");
  }
  console.error.apply(console, e);
} : function () {};
exports.debug = debug;