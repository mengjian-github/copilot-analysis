var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
var p;
var d;
var h;
function f(e) {
  return function () {
    var t;
    var n = this;
    t = [].slice.call(arguments);
    return new Promise(function (r, i) {
      t.push(function (e, t) {
        if (e) {
          i(e);
        } else {
          r(t);
        }
      });
      e.apply(n, t);
    });
  };
}
function m() {}
r = require(57147);
i = require(22037);
o = require(71017);
s = require(56519);
a = require(49568);
c = require(30298);
module.exports = function (e) {
  var t;
  var a;
  var c;
  var f;
  var g;
  f = {};
  g = new Set();
  return function (e) {
    return Promise.resolve(e).then(y);
  };
  function y(d) {
    var h;
    var g;
    if (d) {
      if (a) {
        a = (h = e.save || e.$ave, "string" == typeof h ? h = [h] : Array.isArray(h) || (h = [o.join(__dirname, "../pem"), o.join(i.homedir(), ".local/win-ca/pem")]), g = 0, function e() {
          return g < h.length ? s(h[g++]).catch(e) : Promise.resolve();
        }()).then(function (e) {
          return t = e;
        });
      }
      a = a.then(function () {
        if (t) return function (e) {
          var t;
          var n;
          (c || (c = r.createWriteStream(_("roots.pem")))).write(t = l(e));
          if (f[n = u(e)]) {
            f[n] = 0;
          }
          return p(_(n + "." + f[n]++), t).catch(m);
        }(d);
      });
    } else {
      if (a) {
        a.then(v).then(function () {
          if (null != c) {
            c.end();
          }
          if (t && e.$ave) {
            process.env.SSL_CERT_DIR = require(44825).path = t;
          }
          if ("function" == typeof e.onsave) {
            e.onsave(t);
          }
        });
      } else {
        if ("function" == typeof e.onsave) {
          e.onsave();
        }
      }
    }
  }
  function _(e) {
    g.add(e);
    return o.join(t, e);
  }
  function v() {
    if (t) {
      d(t).then(function (e) {
        return Promise.all(e.filter(function (e) {
          return !g.has(e);
        }).map(function (e) {
          return o.join(t, e);
        }).map(function (e) {
          return h(e).catch(m);
        }));
      }).catch(m);
    }
  }
};
l = a(a.txt);
u = c();
p = f(r.writeFile);
d = f(r.readdir);
h = f(r.unlink);