var r = require(76372);
var i = r.wrap;
var o = r.unwrap;
var s = "wrap@before";
function a(e, t, n) {
  var r = !!e[t] && e.propertyIsEnumerable(t);
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: r,
    writable: !0,
    value: n
  });
}
function c(e, t) {
  var n;
  n = e._events && e._events[t];
  if (Array.isArray(n)) {
    n = n ? [n] : [];
  }
  return n;
}
function l(e, t) {
  if (e) {
    var n = e;
    if ("function" == typeof e) n = t(e);else if (Array.isArray(e)) {
      n = [];
      for (var r = 0; r < e.length; r++) n[r] = t(e[r]);
    }
    return n;
  }
}
module.exports = function (e, t, n) {
  if (!(e && e.on && e.addListener && e.removeListener && e.emit)) throw new Error("can only wrap real EEs");
  if (!t) throw new Error("must have function to run on listener addition");
  if (!n) throw new Error("must have function to wrap listeners when emitting");
  function r(e) {
    return function (t, n) {
      var o = c(this, t).slice();
      try {
        var a = e.call(this, t, n);
        (function (e, t, n) {
          var r = c(e, t).filter(function (e) {
            return -1 === n.indexOf(e);
          });
          if (r.length > 0) {
            (function (e, t) {
              for (n = t.length, r = 0, void 0; r < n; r++) {
                var n;
                var r;
                var i = t[r];
                var o = e[s];
                if ("function" == typeof o) o(i);else if (Array.isArray(o)) for (a = o.length, c = 0, void 0; c < a; c++) {
                  var a;
                  var c;
                  o[c](i);
                }
              }
            })(e, r);
          }
        })(this, t, o);
        return a;
      } finally {
        if (this.on.__wrapped) {
          i(this, "on", r);
        }
        if (this.addListener.__wrapped) {
          i(this, "addListener", r);
        }
      }
    };
  }
  if (e[s]) {
    if ("function" == typeof e[s]) {
      a(e, s, [e[s], t]);
    } else {
      if (Array.isArray(e[s])) {
        e[s].push(t);
      }
    }
  } else {
    a(e, s, t);
  }
  if (e.__wrapped) {
    i(e, "addListener", r);
    i(e, "on", r);
    i(e, "emit", function (e) {
      return function (t) {
        if (!this._events || !this._events[t]) return e.apply(this, arguments);
        var r = this._events[t];
        function s(e) {
          return function () {
            this._events[t] = r;
            try {
              return e.apply(this, arguments);
            } finally {
              r = this._events[t];
              this._events[t] = l(r, n);
            }
          };
        }
        i(this, "removeListener", s);
        try {
          this._events[t] = l(r, n);
          return e.apply(this, arguments);
        } finally {
          o(this, "removeListener");
          this._events[t] = r;
        }
      };
    });
    a(e, "__unwrap", function () {
      o(e, "addListener");
      o(e, "on");
      o(e, "emit");
      delete e[s];
      delete e.__wrapped;
    });
    a(e, "__wrapped", !0);
  }
};