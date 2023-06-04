var r;
var i;
var o;
var s;
var a;
var c = exports || this;
function l(e) {
  var t;
  if (null == e) {
    e = "roots.exe";
  }
  t = s;
  s = r.resolve(__dirname, e);
  return t;
}
function u(e) {
  return o(function (t) {
    if (t.length) {
      e(a(t, "hex"));
    }
  });
}
r = require(71017);
i = require(32081);
o = require(24563);
l();
c.exe = l;
c.sync = function (e) {
  var t;
  var n;
  return {
    run: r,
    next: function () {
      if (t) {
        t = [];
        n = 0;
        r(function (e) {
          if (e) {
            t.push(e);
          }
        });
      }
      if (n < t.length) return t[n++];
      t = [];
    },
    done: function () {
      t = [];
    }
  };
  function r(t) {
    u(t).on("end", function () {
      t();
    }).end(i.execFileSync(s, e));
  }
};
c.async = function (e) {
  var t;
  var n;
  var r;
  return {
    run: c,
    next: function () {
      if (t) {
        t = [];
        n = [];
        c(o);
      }
      return t.length ? Promise.resolve(t.shift()) : r ? Promise.resolve() : new Promise(function (e) {
        n.push(e);
      });
    },
    done: function () {
      t = [];
      a();
    }
  };
  function o(e) {
    if (r) {
      if (e) {
        if (n.length) {
          n.shift()(e);
        } else {
          t.push(e);
        }
      } else {
        a();
      }
    }
  }
  function a() {
    var e;
    var t;
    var i;
    for (r = !0, e = 0, i = (t = n).length; e < i; ++e) t[e]();
  }
  function c(t) {
    i.execFile(s, e, function () {}).stdout.pipe(u(t)).on("end", function () {
      t();
    });
  }
};
a = Buffer.from || function (e, t) {
  return new Buffer(e, t);
};