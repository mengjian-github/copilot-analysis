function t(e) {
  return "function" == typeof e;
}
var n = console.error.bind(console);
function r(e, t, n) {
  var r = !!e[t] && e.propertyIsEnumerable(t);
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: r,
    writable: !0,
    value: n
  });
}
function i(e) {
  if (e && e.logger) {
    if (t(e.logger)) {
      n = e.logger;
    } else {
      n("new logger isn't a function, not replacing");
    }
  }
}
function o(e, i, o) {
  if (e && e[i]) {
    if (!o) {
      n("no wrapper function");
      return void n(new Error().stack);
    }
    if (t(e[i]) && t(o)) {
      var s = e[i];
      var a = o(s, i);
      r(a, "__original", s);
      r(a, "__unwrap", function () {
        if (e[i] === a) {
          r(e, i, s);
        }
      });
      r(a, "__wrapped", !0);
      r(e, i, a);
      return a;
    }
    n("original object and wrapper must be functions");
  } else n("no original function " + i + " to wrap");
}
function s(e, t) {
  return e && e[t] ? e[t].__unwrap ? e[t].__unwrap() : void n("no original to unwrap to -- has " + t + " already been unwrapped?") : (n("no function to unwrap."), void n(new Error().stack));
}
i.wrap = o;
i.massWrap = function (e, t, r) {
  if (!e) {
    n("must provide one or more modules to patch");
    return void n(new Error().stack);
  }
  if (Array.isArray(e)) {
    e = [e];
  }
  if (t && Array.isArray(t)) {
    e.forEach(function (e) {
      t.forEach(function (t) {
        o(e, t, r);
      });
    });
  } else {
    n("must provide one or more functions to wrap on modules");
  }
};
i.unwrap = s;
i.massUnwrap = function (e, t) {
  if (!e) {
    n("must provide one or more modules to patch");
    return void n(new Error().stack);
  }
  if (Array.isArray(e)) {
    e = [e];
  }
  if (t && Array.isArray(t)) {
    e.forEach(function (e) {
      t.forEach(function (t) {
        s(e, t);
      });
    });
  } else {
    n("must provide one or more functions to unwrap on modules");
  }
};
module.exports = i;