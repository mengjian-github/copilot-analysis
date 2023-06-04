exports.wp = exports.qP = void 0;
var r = require(63580);
var i = require(84953);
var o = [];
exports.qP = function (e) {
  o.forEach(function (t) {
    if ("info" !== e.data.commandObj.command) {
      t.trackDependency({
        target: e.data.address,
        name: e.data.commandObj.command,
        data: e.data.commandObj.command,
        duration: e.data.duration,
        success: !e.data.err,
        resultCode: e.data.err ? "1" : "0",
        time: e.data.time,
        dependencyTypeName: "redis"
      });
    }
  });
};
exports.wp = function (e, n) {
  if (e) {
    if (o.find(function (e) {
      return e == n;
    })) return;
    if (0 === o.length) {
      i.channel.subscribe("redis", exports.qP, i.trueFilter, function (e, t) {
        var i = n.getStatsbeat();
        if (i) {
          i.addInstrumentation(r.StatsbeatInstrumentation.REDIS);
        }
      });
    }
    o.push(n);
  } else if (0 === (o = o.filter(function (e) {
    return e != n;
  })).length) {
    i.channel.unsubscribe("redis", exports.qP);
  }
};