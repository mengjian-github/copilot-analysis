exports.wp = exports.qP = void 0;
var r = require(63580);
var i = require(84953);
var o = [];
exports.qP = function (e) {
  o.forEach(function (t) {
    var n = e.data.query;
    var r = n.preparable && n.preparable.text || n.plan || n.text || "unknown query";
    var i = !e.data.error;
    var o = e.data.database.host + ":" + e.data.database.port;
    t.trackDependency({
      target: o,
      data: r,
      name: r,
      duration: e.data.duration,
      success: i,
      resultCode: i ? "0" : "1",
      time: e.data.time,
      dependencyTypeName: "postgres"
    });
  });
};
exports.wp = function (e, n) {
  if (e) {
    if (o.find(function (e) {
      return e == n;
    })) return;
    if (0 === o.length) {
      i.channel.subscribe("postgres", exports.qP, i.trueFilter, function (e, t) {
        var i = n.getStatsbeat();
        if (i) {
          i.addInstrumentation(r.StatsbeatInstrumentation.POSTGRES);
        }
      });
    }
    o.push(n);
  } else if (0 === (o = o.filter(function (e) {
    return e != n;
  })).length) {
    i.channel.unsubscribe("postgres", exports.qP);
  }
};