var r = require(3832);
require(3068);
require(66270);
require(97450);
require(26953);
require(98960);
require(55147);
require(96007);
require(28095);
require(97116);
require(25414);
var i = r.asn1;
var o = module.exports = r.pki = r.pki || {};
o.pemToDer = function (e) {
  var t = r.pem.decode(e)[0];
  if (t.procType && "ENCRYPTED" === t.procType.type) throw new Error("Could not convert PEM to DER; PEM is encrypted.");
  return r.util.createBuffer(t.body);
};
o.privateKeyFromPem = function (e) {
  var t = r.pem.decode(e)[0];
  if ("PRIVATE KEY" !== t.type && "RSA PRIVATE KEY" !== t.type) {
    var n = new Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
    throw n.headerType = t.type, n;
  }
  if (t.procType && "ENCRYPTED" === t.procType.type) throw new Error("Could not convert private key from PEM; PEM is encrypted.");
  var s = i.fromDer(t.body);
  return o.privateKeyFromAsn1(s);
};
o.privateKeyToPem = function (e, t) {
  var n = {
    type: "RSA PRIVATE KEY",
    body: i.toDer(o.privateKeyToAsn1(e)).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};
o.privateKeyInfoToPem = function (e, t) {
  var n = {
    type: "PRIVATE KEY",
    body: i.toDer(e).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};