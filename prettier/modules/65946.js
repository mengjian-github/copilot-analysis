Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.spanToTelemetryContract = void 0;
var r = require(57310);
var i = require(94284);
var o = require(47480);
var s = require(63580);
var a = require(60211);
var c = require(25740);
function l(e) {
  if (e.attributes[o.SemanticAttributes.HTTP_METHOD]) {
    var t = e.attributes[o.SemanticAttributes.HTTP_URL];
    if (t) return String(t);
    var n = e.attributes[o.SemanticAttributes.HTTP_SCHEME];
    var r = e.attributes[o.SemanticAttributes.HTTP_TARGET];
    if (n && r) {
      var i = e.attributes[o.SemanticAttributes.HTTP_HOST];
      if (i) return n + "://" + i + r;
      var s = e.attributes[o.SemanticAttributes.NET_PEER_PORT];
      if (s) {
        var a = e.attributes[o.SemanticAttributes.NET_PEER_NAME];
        if (a) return n + "://" + a + ":" + s + r;
        var c = e.attributes[o.SemanticAttributes.NET_PEER_IP];
        if (c) return n + "://" + c + ":" + s + r;
      }
    }
  }
  return "";
}
function u(e) {
  var t = e.attributes[o.SemanticAttributes.PEER_SERVICE];
  var n = e.attributes[o.SemanticAttributes.HTTP_HOST];
  var r = e.attributes[o.SemanticAttributes.HTTP_URL];
  var i = e.attributes[o.SemanticAttributes.NET_PEER_NAME];
  var s = e.attributes[o.SemanticAttributes.NET_PEER_IP];
  return t ? String(t) : n ? String(n) : r ? String(r) : i ? String(i) : s ? String(s) : "";
}
exports.spanToTelemetryContract = function (e) {
  var t;
  switch (e.kind) {
    case i.SpanKind.CLIENT:
    case i.SpanKind.PRODUCER:
    case i.SpanKind.INTERNAL:
      t = function (e) {
        var t = {
          name: e.name,
          success: e.status.code != i.SpanStatusCode.ERROR,
          resultCode: "0",
          duration: 0,
          data: "",
          dependencyTypeName: ""
        };
        if (e.kind === i.SpanKind.PRODUCER) {
          t.dependencyTypeName = s.DependencyTypeName.QueueMessage;
        }
        if (e.kind === i.SpanKind.INTERNAL && e.parentSpanId) {
          t.dependencyTypeName = s.DependencyTypeName.InProc;
        }
        var n = e.attributes[o.SemanticAttributes.HTTP_METHOD];
        var a = e.attributes[o.SemanticAttributes.DB_SYSTEM];
        var c = e.attributes[o.SemanticAttributes.RPC_SYSTEM];
        if (n) {
          t.dependencyTypeName = s.DependencyTypeName.Http;
          var p = e.attributes[o.SemanticAttributes.HTTP_URL];
          if (p) {
            var d = "";
            try {
              d = new r.URL(String(p)).pathname;
            } catch (e) {}
            t.name = n + " " + d;
          }
          t.data = l(e);
          var h = e.attributes[o.SemanticAttributes.HTTP_STATUS_CODE];
          if (h) {
            t.resultCode = String(h);
          }
          if (v = u(e)) {
            try {
              var f = new RegExp(/(https?)(:\/\/.*)(:\d+)(\S*)/).exec(v);
              if (null != f) {
                var m = f[1],
                  g = f[3];
                ("https" == m && ":443" == g || "http" == m && ":80" == g) && (v = f[1] + f[2] + f[4]);
              }
            } catch (e) {}
            t.target = "" + v;
          }
        } else if (a) {
          if (String(a) === o.DbSystemValues.MYSQL) {
            t.dependencyTypeName = "mysql";
          } else {
            if (String(a) === o.DbSystemValues.POSTGRESQL) {
              t.dependencyTypeName = "postgresql";
            } else {
              if (String(a) === o.DbSystemValues.MONGODB) {
                t.dependencyTypeName = "mongodb";
              } else {
                if (String(a) === o.DbSystemValues.REDIS) {
                  t.dependencyTypeName = "redis";
                } else {
                  if (function (e) {
                    return e === o.DbSystemValues.DB2 || e === o.DbSystemValues.DERBY || e === o.DbSystemValues.MARIADB || e === o.DbSystemValues.MSSQL || e === o.DbSystemValues.ORACLE || e === o.DbSystemValues.SQLITE || e === o.DbSystemValues.OTHER_SQL || e === o.DbSystemValues.HSQLDB || e === o.DbSystemValues.H2;
                  }(String(a))) {
                    t.dependencyTypeName = "SQL";
                  } else {
                    t.dependencyTypeName = String(a);
                  }
                }
              }
            }
          }
          var y = e.attributes[o.SemanticAttributes.DB_STATEMENT];
          var _ = e.attributes[o.SemanticAttributes.DB_OPERATION];
          if (y) {
            t.data = String(y);
          } else {
            if (_) {
              t.data = String(_);
            }
          }
          var v = u(e);
          var b = e.attributes[o.SemanticAttributes.DB_NAME];
          t.target = v ? b ? v + "|" + b : "" + v : b ? "" + b : "" + a;
        } else if (c) {
          t.dependencyTypeName = s.DependencyTypeName.Grpc;
          var E = e.attributes[o.SemanticAttributes.RPC_GRPC_STATUS_CODE];
          if (E) {
            t.resultCode = String(E);
          }
          if (v = u(e)) {
            t.target = "" + v;
          } else {
            if (c) {
              t.target = String(c);
            }
          }
        }
        return t;
      }(e);
      break;
    case i.SpanKind.SERVER:
    case i.SpanKind.CONSUMER:
      t = function (e) {
        var t = {
          name: e.name,
          success: e.status.code != i.SpanStatusCode.ERROR,
          resultCode: "0",
          duration: 0,
          url: "",
          source: void 0
        };
        var n = e.attributes[o.SemanticAttributes.HTTP_METHOD];
        var s = e.attributes[o.SemanticAttributes.RPC_GRPC_STATUS_CODE];
        if (n) {
          if (e.kind == i.SpanKind.SERVER) {
            var a = e.attributes[o.SemanticAttributes.HTTP_ROUTE];
            var c = e.attributes[o.SemanticAttributes.HTTP_URL];
            if (a) t.name = n + " " + a;else if (c) try {
              var u = new r.URL(String(c));
              t.name = n + " " + u.pathname;
            } catch (e) {}
          }
          t.url = l(e);
          var p = e.attributes[o.SemanticAttributes.HTTP_STATUS_CODE];
          if (p) {
            t.resultCode = String(p);
          }
        } else if (s) {
          t.resultCode = String(s);
        }
        return t;
      }(e);
  }
  var n = "" + (e.spanContext ? e.spanContext() : e.context()).spanId;
  var p = Math.round(1e3 * e.duration[0] + e.duration[1] / 1e6);
  t.id = n;
  t.duration = p;
  t.properties = function (e) {
    for (t = {}, n = 0, r = Object.keys(e.attributes), void 0; n < r.length; n++) {
      var t;
      var n;
      var r;
      var i = r[n];
      if (i.startsWith("http.") || i.startsWith("rpc.") || i.startsWith("db.") || i.startsWith("peer.") || i.startsWith("net.")) {
        t[i] = e.attributes[i];
      }
    }
    var o = e.links.map(function (e) {
      return {
        operation_Id: e.context.traceId,
        id: e.context.spanId
      };
    });
    if (o.length > 0) {
      t["_MS.links"] = c.stringify(o);
    }
    return t;
  }(e);
  if (e.attributes[s.AzNamespace]) {
    if (e.kind === i.SpanKind.INTERNAL) {
      t.dependencyTypeName = s.DependencyTypeName.InProc + " | " + e.attributes[s.AzNamespace];
    }
    if (e.attributes[s.AzNamespace] === s.MicrosoftEventHub) {
      a.parseEventHubSpan(e, t);
    }
  }
  return t;
};