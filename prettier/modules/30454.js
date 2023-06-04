exports.wp = void 0;
var r = require(63580);
var i = require(55290);
var o = require(84953);
var s = [];
var a = {
  syslog: function (e) {
    var t = {
      emerg: i.SeverityLevel.Critical,
      alert: i.SeverityLevel.Critical,
      crit: i.SeverityLevel.Critical,
      error: i.SeverityLevel.Error,
      warning: i.SeverityLevel.Warning,
      notice: i.SeverityLevel.Information,
      info: i.SeverityLevel.Information,
      debug: i.SeverityLevel.Verbose
    };
    return void 0 === t[e] ? i.SeverityLevel.Information : t[e];
  },
  npm: function (e) {
    var t = {
      error: i.SeverityLevel.Error,
      warn: i.SeverityLevel.Warning,
      info: i.SeverityLevel.Information,
      verbose: i.SeverityLevel.Verbose,
      debug: i.SeverityLevel.Verbose,
      silly: i.SeverityLevel.Verbose
    };
    return void 0 === t[e] ? i.SeverityLevel.Information : t[e];
  },
  unknown: function (e) {
    return i.SeverityLevel.Information;
  }
};
var c = function (e) {
  var t = e.data.message;
  var n = a[e.data.levelKind](e.data.level);
  s.forEach(function (r) {
    if (t instanceof Error && !r.config.enableLoggerErrorToTrace) {
      r.trackException({
        exception: t,
        properties: e.data.meta
      });
    } else {
      if (t instanceof Error) {
        r.trackTrace({
          message: t.toString(),
          severity: n,
          properties: e.data.meta
        });
      } else {
        r.trackTrace({
          message: t,
          severity: n,
          properties: e.data.meta
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
      o.channel.subscribe("winston", c, o.trueFilter, function (e, n) {
        var i = t.getStatsbeat();
        if (i) {
          i.addInstrumentation(r.StatsbeatInstrumentation.WINSTON);
        }
      });
    }
    s.push(t);
  } else if (0 === (s = s.filter(function (e) {
    return e != t;
  })).length) {
    o.channel.unsubscribe("winston", c);
  }
};