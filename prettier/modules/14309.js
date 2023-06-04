exports.wp = void 0;
var r = require(55290);
var i = require(63580);
var o = require(84953);
var s = [];
var a = function (e) {
  var t = e.data.message;
  s.forEach(function (n) {
    if (t instanceof Error && !n.config.enableLoggerErrorToTrace) {
      n.trackException({
        exception: t
      });
    } else {
      if (t instanceof Error) {
        n.trackTrace({
          message: t.toString(),
          severity: e.data.stderr ? r.SeverityLevel.Error : r.SeverityLevel.Information
        });
      } else {
        if (t.lastIndexOf("\n") == t.length - 1) {
          t = t.substring(0, t.length - 1);
        }
        n.trackTrace({
          message: t,
          severity: e.data.stderr ? r.SeverityLevel.Warning : r.SeverityLevel.Information
        });
      }
    }
  });
};
exports.wp = function (e, t) {
  if (e) {
    if (s.find(function (e) {
      return e == t;
    })) return;
    if (0 === s.length) {
      o.channel.subscribe("console", a, o.trueFilter, function (e, n) {
        var r = t.getStatsbeat();
        if (r) {
          r.addInstrumentation(i.StatsbeatInstrumentation.CONSOLE);
        }
      });
    }
    s.push(t);
  } else if (0 === (s = s.filter(function (e) {
    return e != t;
  })).length) {
    o.channel.unsubscribe("console", a);
  }
};