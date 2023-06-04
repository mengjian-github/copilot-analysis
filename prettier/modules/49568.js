var r;
var i;
var o;
var s;
var a;
var c;
var l;
for (s in module.exports = u, r = require(48561), o = [], i = {
  der: p,
  pem: d,
  txt: function (e) {
    var t;
    return "Subject\t" + (t = h(e)).subject.value.map(function (e) {
      return l(e.value[0].value[1].value, "binary").toString("utf8");
    }).join("/") + "\nValid\t" + t.valid.value.map(function (e) {
      return e.value;
    }).join(" - ") + "\n" + d(e);
  },
  asn1: h,
  x509: function (e) {
    return r().pki.certificateFromAsn1(r().asn1.fromDer(e.toString("binary")));
  }
}) {
  a = i[s];
  u[s] = o.length;
  o.push(a);
}
function u(e, t) {
  var n;
  n = o[e] || o[0];
  return null != t ? n(t) : n;
}
function p(e) {
  return c(e) ? e : l(e, "binary");
}
function d(e) {
  var t;
  var n;
  var r;
  var i;
  for (t = ["-----BEGIN CERTIFICATE-----"], n = 0, r = (e = p(e).toString("base64")).length; n < r; n += 64) {
    i = n;
    t.push(e.substr(i, 64));
  }
  t.push("-----END CERTIFICATE-----", "");
  return t.join("\r\n");
}
function h(e) {
  var t;
  var n;
  var i;
  var o;
  t = r().asn1;
  e = e.toString("binary");
  o = (i = (n = t.fromDer(e).value[0].value)[0]).tagClass === t.Class.CONTEXT_SPECIFIC && 0 === i.type && i.constructed;
  return {
    serial: (n = n.slice(o))[0],
    valid: n[3],
    issuer: n[2],
    subject: n[4]
  };
}
u.forge = u.x509;
c = Buffer.isBuffer;
l = Buffer.from || function (e, t) {
  return new Buffer(e, t);
};