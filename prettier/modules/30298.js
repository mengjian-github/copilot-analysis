var r;
var i;
var o;
var s;
var a;
var c;
function l(e) {
  var t;
  t = r.createHash("sha1");
  a(e).subject.value.forEach(function (e) {
    var n;
    var r;
    if ((n = (e = s.copy(e)).value[0].value[1]).value) {
      n.type = s.Type.UTF8;
      r = (r = c(n.value, "binary").toString("utf8")).trim().replace(/[A-Z]+/g, function (e) {
        return e.toLowerCase();
      }).replace(/\s+/g, " ");
      n.value = c(r, "utf8").toString("binary");
      t.update(s.toDer(e).getBytes(), "binary");
    }
  });
  return p(t);
}
function u(e) {
  var t;
  var n;
  t = r.createHash("md5");
  n = a(e).subject;
  t.update(s.toDer(n).getBytes(), "binary");
  return p(t);
}
function p(e) {
  (e = e.digest().slice(0, 4)).writeUInt32LE(e.readUInt32BE(0), 0);
  return e.toString("hex");
}
r = require(6113);
i = require(48561);
o = require(49568);
s = i().asn1;
a = o(o.asn1);
module.exports = function (e, t) {
  var n;
  n = 0 === e ? u : l;
  return null != t ? n(t) : n;
};
c = Buffer.from || function (e, t) {
  return new Buffer(e, t);
};