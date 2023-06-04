var r = require(3832);
require(97116);
module.exports = r.log = r.log || {};
r.log.levels = ["none", "error", "warning", "info", "debug", "verbose", "max"];
var i = {};
var o = [];
var s = null;
r.log.LEVEL_LOCKED = 2;
r.log.NO_LEVEL_CHECK = 4;
r.log.INTERPOLATE = 8;
for (var a = 0; a < r.log.levels.length; ++a) {
  var c = r.log.levels[a];
  i[c] = {
    index: a,
    name: c.toUpperCase()
  };
}
r.log.logMessage = function (e) {
  for (t = i[e.level].index, n = 0, void 0; n < o.length; ++n) {
    var t;
    var n;
    var s = o[n];
    if (s.flags & r.log.NO_LEVEL_CHECK) {
      s.f(e);
    } else {
      if (t <= i[s.level].index) {
        s.f(s, e);
      }
    }
  }
};
r.log.prepareStandard = function (e) {
  if ("standard" in e) {
    e.standard = i[e.level].name + " [" + e.category + "] " + e.message;
  }
};
r.log.prepareFull = function (e) {
  if (!("full" in e)) {
    var t = [e.message];
    t = t.concat([] || 0);
    e.full = r.util.format.apply(this, t);
  }
};
r.log.prepareStandardFull = function (e) {
  if ("standardFull" in e) {
    r.log.prepareStandard(e);
    e.standardFull = e.standard;
  }
};
var l = ["error", "warning", "info", "debug", "verbose"];
for (a = 0; a < l.length; ++a) !function (e) {
  r.log[e] = function (t, n) {
    var i = Array.prototype.slice.call(arguments).slice(2);
    var o = {
      timestamp: new Date(),
      level: e,
      category: t,
      message: n,
      arguments: i
    };
    r.log.logMessage(o);
  };
}(l[a]);
r.log.makeLogger = function (e) {
  var t = {
    flags: 0,
    f: e
  };
  r.log.setLevel(t, "none");
  return t;
};
r.log.setLevel = function (e, t) {
  var n = !1;
  if (e && !(e.flags & r.log.LEVEL_LOCKED)) for (var i = 0; i < r.log.levels.length; ++i) if (t == r.log.levels[i]) {
    e.level = t;
    n = !0;
    break;
  }
  return n;
};
r.log.lock = function (e, t) {
  if (void 0 === t || t) {
    e.flags |= r.log.LEVEL_LOCKED;
  } else {
    e.flags &= ~r.log.LEVEL_LOCKED;
  }
};
r.log.addLogger = function (e) {
  o.push(e);
};
if ("undefined" != typeof console && "log" in console) {
  var u;
  if (console.error && console.warn && console.info && console.debug) {
    var p = {
        error: console.error,
        warning: console.warn,
        info: console.info,
        debug: console.debug,
        verbose: console.debug
      },
      d = function (e, t) {
        r.log.prepareStandard(t);
        var n = p[t.level],
          i = [t.standard];
        i = i.concat(t.arguments.slice()), n.apply(console, i);
      };
    u = r.log.makeLogger(d);
  } else d = function (e, t) {
    r.log.prepareStandardFull(t), console.log(t.standardFull);
  }, u = r.log.makeLogger(d);
  r.log.setLevel(u, "debug"), r.log.addLogger(u), s = u;
} else console = {
  log: function () {}
};
if (null !== s && "undefined" != typeof window && window.location) {
  var h = new URL(window.location.href).searchParams;
  if (h.has("console.level")) {
    r.log.setLevel(s, h.get("console.level").slice(-1)[0]);
  }
  if (h.has("console.lock") && "true" == h.get("console.lock").slice(-1)[0]) {
    r.log.lock(s);
  }
}
r.log.consoleLogger = s;