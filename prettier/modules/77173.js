var r = require(3832);
require(8925);
require(36607);
require(25063);
require(137);
require(97116);
var i = module.exports = r.ssh = r.ssh || {};
function o(e, t) {
  var n = t.toString(16);
  if (n[0] >= "8") {
    n = "00" + n;
  }
  var i = r.util.hexToBytes(n);
  e.putInt32(i.length);
  e.putBytes(i);
}
function s(e, t) {
  e.putInt32(t.length);
  e.putString(t);
}
function a() {
  for (e = r.md.sha1.create(), t = arguments.length, n = 0, void 0; n < t; ++n) {
    var e;
    var t;
    var n;
    e.update(arguments[n]);
  }
  return e.digest();
}
i.privateKeyToPutty = function (e, t, n) {
  var i = "ssh-rsa";
  var c = "" === (t = t || "") ? "none" : "aes256-cbc";
  var l = "PuTTY-User-Key-File-2: " + i + "\r\n";
  l += "Encryption: " + c + "\r\n";
  l += "Comment: " + (n = n || "") + "\r\n";
  var u = r.util.createBuffer();
  s(u, i);
  o(u, e.e);
  o(u, e.n);
  var p = r.util.encode64(u.bytes(), 64);
  var d = Math.floor(p.length / 66) + 1;
  l += "Public-Lines: " + d + "\r\n";
  l += p;
  var h;
  var f = r.util.createBuffer();
  o(f, e.d);
  o(f, e.p);
  o(f, e.q);
  o(f, e.qInv);
  if (t) {
    var m = f.length() + 16 - 1;
    m -= m % 16;
    var g = a(f.bytes());
    g.truncate(g.length() - m + f.length()), f.putBuffer(g);
    var y = r.util.createBuffer();
    y.putBuffer(a("\0\0\0\0", t)), y.putBuffer(a("\0\0\0", t));
    var _ = r.aes.createEncryptionCipher(y.truncate(8), "CBC");
    _.start(r.util.createBuffer().fillWithByte(0, 16)), _.update(f.copy()), _.finish();
    var v = _.output;
    v.truncate(16), h = r.util.encode64(v.bytes(), 64);
  } else h = r.util.encode64(f.bytes(), 64);
  l += "\r\nPrivate-Lines: " + (d = Math.floor(h.length / 66) + 1) + "\r\n";
  l += h;
  var b = a("putty-private-key-file-mac-key", t);
  var E = r.util.createBuffer();
  s(E, i);
  s(E, c);
  s(E, n);
  E.putInt32(u.length());
  E.putBuffer(u);
  E.putInt32(f.length());
  E.putBuffer(f);
  var w = r.hmac.create();
  w.start("sha1", b);
  w.update(E.bytes());
  return l + "\r\nPrivate-MAC: " + w.digest().toHex() + "\r\n";
};
i.publicKeyToOpenSSH = function (e, t) {
  var n = "ssh-rsa";
  t = t || "";
  var i = r.util.createBuffer();
  s(i, n);
  o(i, e.e);
  o(i, e.n);
  return n + " " + r.util.encode64(i.bytes()) + " " + t;
};
i.privateKeyToOpenSSH = function (e, t) {
  return t ? r.pki.encryptRsaPrivateKey(e, t, {
    legacy: !0,
    algorithm: "aes128"
  }) : r.pki.privateKeyToPem(e);
};
i.getPublicKeyFingerprint = function (e, t) {
  var n = (t = t || {}).md || r.md.md5.create();
  var i = r.util.createBuffer();
  s(i, "ssh-rsa");
  o(i, e.e);
  o(i, e.n);
  n.start();
  n.update(i.getBytes());
  var a = n.digest();
  if ("hex" === t.encoding) {
    var c = a.toHex();
    return t.delimiter ? c.match(/.{2}/g).join(t.delimiter) : c;
  }
  if ("binary" === t.encoding) return a.getBytes();
  if (t.encoding) throw new Error('Unknown encoding "' + t.encoding + '".');
  return a;
};