exports.wp = exports.qP = void 0;
var r = require(63580);
var i = require(84953);
var o = [];
exports.qP = function (e) {
  if ("ismaster" !== e.data.event.commandName) {
    o.forEach(function (t) {
      var n = e.data.startedData && e.data.startedData.databaseName || "Unknown database";
      t.trackDependency({
        target: n,
        data: e.data.event.commandName,
        name: e.data.event.commandName,
        duration: e.data.event.duration,
        success: e.data.succeeded,
        resultCode: e.data.succeeded ? "0" : "1",
        time: e.data.startedData.time,
        dependencyTypeName: "mongodb"
      });
    });
  }
};
exports.wp = function (e, n) {
  if (e) {
    if (o.find(function (e) {
      return e == n;
    })) return;
    if (0 === o.length) {
      i.channel.subscribe("mongodb", exports.qP, i.trueFilter, function (e, t) {
        var i = n.getStatsbeat();
        if (i) {
          i.addInstrumentation(r.StatsbeatInstrumentation.MONGODB);
        }
      });
    }
    o.push(n);
  } else if (0 === (o = o.filter(function (e) {
    return e != n;
  })).length) {
    i.channel.unsubscribe("mongodb", exports.qP);
  }
};