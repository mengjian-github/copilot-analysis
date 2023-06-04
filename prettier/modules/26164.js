var r = require(3832);
require(8925);
require(84311);
var i = module.exports = r.tls;
function o(e, t, n) {
  var o = t.entity === r.tls.ConnectionEnd.client;
  e.read.cipherState = {
    init: !1,
    cipher: r.cipher.createDecipher("AES-CBC", o ? n.keys.server_write_key : n.keys.client_write_key),
    iv: o ? n.keys.server_write_IV : n.keys.client_write_IV
  };
  e.write.cipherState = {
    init: !1,
    cipher: r.cipher.createCipher("AES-CBC", o ? n.keys.client_write_key : n.keys.server_write_key),
    iv: o ? n.keys.client_write_IV : n.keys.server_write_IV
  };
  e.read.cipherFunction = l;
  e.write.cipherFunction = s;
  e.read.macLength = e.write.macLength = n.mac_length;
  e.read.macFunction = e.write.macFunction = i.hmac_sha1;
}
function s(e, t) {
  var n;
  var o = !1;
  var s = t.macFunction(t.macKey, t.sequenceNumber, e);
  e.fragment.putBytes(s);
  t.updateSequenceNumber();
  n = e.version.minor === i.Versions.TLS_1_0.minor ? t.cipherState.init ? null : t.cipherState.iv : r.random.getBytesSync(16);
  t.cipherState.init = !0;
  var c = t.cipherState.cipher;
  c.start({
    iv: n
  });
  if (e.version.minor >= i.Versions.TLS_1_1.minor) {
    c.output.putBytes(n);
  }
  c.update(e.fragment);
  if (c.finish(a)) {
    e.fragment = c.output;
    e.length = e.fragment.length();
    o = !0;
  }
  return o;
}
function a(e, t, n) {
  if (!n) {
    var r = e - t.length() % e;
    t.fillWithByte(r - 1, r);
  }
  return !0;
}
function c(e, t, n) {
  var r = !0;
  if (n) {
    for (i = t.length(), o = t.last(), s = i - 1 - o, void 0; s < i - 1; ++s) {
      var i;
      var o;
      var s;
      r = r && t.at(s) == o;
    }
    if (r) {
      t.truncate(o + 1);
    }
  }
  return r;
}
function l(e, t) {
  var n;
  var o = !1;
  n = e.version.minor === i.Versions.TLS_1_0.minor ? t.cipherState.init ? null : t.cipherState.iv : e.fragment.getBytes(16);
  t.cipherState.init = !0;
  var s = t.cipherState.cipher;
  s.start({
    iv: n
  });
  s.update(e.fragment);
  o = s.finish(c);
  var a = t.macLength;
  var l = r.random.getBytesSync(a);
  var u = s.output.length();
  if (u >= a) {
    e.fragment = s.output.getBytes(u - a);
    l = s.output.getBytes(a);
  } else {
    e.fragment = s.output.getBytes();
  }
  e.fragment = r.util.createBuffer(e.fragment);
  e.length = e.fragment.length();
  var p = t.macFunction(t.macKey, t.sequenceNumber, e);
  t.updateSequenceNumber();
  o = function (e, t, n) {
    var i = r.hmac.create();
    i.start("SHA1", e);
    i.update(t);
    t = i.digest().getBytes();
    i.start(null, null);
    i.update(n);
    return t === (n = i.digest().getBytes());
  }(t.macKey, l, p) && o;
  return o;
}
i.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
  id: [0, 47],
  name: "TLS_RSA_WITH_AES_128_CBC_SHA",
  initSecurityParameters: function (e) {
    e.bulk_cipher_algorithm = i.BulkCipherAlgorithm.aes;
    e.cipher_type = i.CipherType.block;
    e.enc_key_length = 16;
    e.block_length = 16;
    e.fixed_iv_length = 16;
    e.record_iv_length = 16;
    e.mac_algorithm = i.MACAlgorithm.hmac_sha1;
    e.mac_length = 20;
    e.mac_key_length = 20;
  },
  initConnectionState: o
};
i.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
  id: [0, 53],
  name: "TLS_RSA_WITH_AES_256_CBC_SHA",
  initSecurityParameters: function (e) {
    e.bulk_cipher_algorithm = i.BulkCipherAlgorithm.aes;
    e.cipher_type = i.CipherType.block;
    e.enc_key_length = 32;
    e.block_length = 16;
    e.fixed_iv_length = 16;
    e.record_iv_length = 16;
    e.mac_algorithm = i.MACAlgorithm.hmac_sha1;
    e.mac_length = 20;
    e.mac_key_length = 20;
  },
  initConnectionState: o
};