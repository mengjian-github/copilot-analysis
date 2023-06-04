exports.wp = void 0;
var r = require(55290);
var i = require(63580);
var o = require(84953);
var s = [];
var a = {
  10: r.SeverityLevel.Verbose,
  20: r.SeverityLevel.Verbose,
  30: r.SeverityLevel.Information,
  40: r.SeverityLevel.Warning,
  50: r.SeverityLevel.Error,
  60: r.SeverityLevel.Critical
};
var c = function (e) {
  var t = e.data.result;
  var n = a[e.data.level];
  s.forEach(function (e) {
    try {
      var r = JSON.parse(t);
      if (r.err) {
        var i = new Error(r.err.message);
        i.name = r.err.name;
        i.stack = r.err.stack;
        return e.config.enableLoggerErrorToTrace ? void e.trackTrace({
          message: t,
          severity: n
        }) : void e.trackException({
          exception: i
        });
      }
    } catch (e) {}
    e.trackTrace({
      message: t,
      severity: n
    });
  });
};
exports.wp = function (e, t) {
  if (e) {
    if (s.find(function (e) {
      return e == t;
    })) return;
    if (0 === s.length) {
      o.channel.subscribe("bunyan", c, o.trueFilter, function (e, n) {
        var r = t.getStatsbeat();
        if (r) {
          r.addInstrumentation(i.StatsbeatInstrumentation.BUNYAN);
        }
      });
    }
    s.push(t);
  } else if (0 === (s = s.filter(function (e) {
    return e != t;
  })).length) {
    o.channel.unsubscribe("bunyan", c);
  }
};