var r = this && this.__assign || function () {
  r = Object.assign || function (e) {
    for (n = 1, r = arguments.length, void 0; n < r; n++) {
      var t;
      var n;
      var r;
      for (var i in t = arguments[n]) if (Object.prototype.hasOwnProperty.call(t, i)) {
        e[i] = t[i];
      }
    }
    return e;
  };
  return r.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.parseEventHubSpan = void 0;
var i = require(94284);
var o = require(47593);
var s = require(47480);
var a = require(63580);
exports.parseEventHubSpan = function (e, t) {
  var n;
  var c = e.attributes[a.AzNamespace];
  var l = (e.attributes[s.SemanticAttributes.NET_PEER_NAME] || e.attributes["peer.address"] || "unknown").replace(/\/$/g, "");
  var u = e.attributes[a.MessageBusDestination] || "unknown";
  switch (e.kind) {
    case i.SpanKind.CLIENT:
      t.dependencyTypeName = c;
      t.target = l + "/" + u;
      break;
    case i.SpanKind.PRODUCER:
      t.dependencyTypeName = a.DependencyTypeName.QueueMessage + " | " + c;
      t.target = l + "/" + u;
      break;
    case i.SpanKind.CONSUMER:
      t.source = l + "/" + u;
      t.measurements = r(r({}, t.measurements), ((n = {})[a.TIME_SINCE_ENQUEUED] = function (e) {
        var t = 0;
        var n = 0;
        var r = o.hrTimeToMilliseconds(e.startTime);
        e.links.forEach(function (e) {
          var i = e.attributes;
          var o = null == i ? void 0 : i[a.ENQUEUED_TIME];
          if (o) {
            t += 1;
            n += r - (parseFloat(o.toString()) || 0);
          }
        });
        return Math.max(n / (t || 1), 0);
      }(e), n));
  }
};