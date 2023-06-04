var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
function p(e) {
  h(e, []);
  return d;
}
function d(e) {
  c.push(s(e));
}
function h(e, t) {
  if (t) {
    c.length = 0;
    c.push.apply(c, t);
  }
  if ((e = "+" === e ? 2 : e ? 1 : 0) !== l) {
    switch (l) {
      case 1:
        a.ca === c && delete a.ca;
        break;
      case 2:
        i.createSecureContext === f && (i.createSecureContext = u, u = void 0);
    }
    switch (l = e) {
      case 1:
        a.ca = c;
        break;
      case 2:
        u || (u = i.createSecureContext, i.createSecureContext = f);
    }
  }
}
function f(e) {
  var t;
  var n;
  var r;
  var i;
  var o;
  t = u.apply(this, arguments);
  if (2 === l && (null == e || !e.ca)) for (n = 0, i = (r = c).length; n < i; ++n) o = r[n], t.context.addCACert(o);
  return t;
}
r = require(95687);
i = require(24404);
o = require(49568);
module.exports = p;
p.inject = h;
s = o(o.pem);
a = r.globalAgent.options;
c = [];
l = 0;