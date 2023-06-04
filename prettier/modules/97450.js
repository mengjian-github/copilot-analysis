var r = require(3832);
require(8925);
require(3068);
require(33480);
require(28991);
require(66270);
require(98960);
require(26953);
require(49563);
require(69372);
require(28095);
require(97116);
if (void 0 === i) var i = r.jsbn.BigInteger;
var o = r.asn1;
var s = r.pki = r.pki || {};
module.exports = s.pbe = r.pbe = r.pbe || {};
var a = s.oids;
var c = {
  name: "EncryptedPrivateKeyInfo",
  tagClass: o.Class.UNIVERSAL,
  type: o.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
    tagClass: o.Class.UNIVERSAL,
    type: o.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "AlgorithmIdentifier.algorithm",
      tagClass: o.Class.UNIVERSAL,
      type: o.Type.OID,
      constructed: !1,
      capture: "encryptionOid"
    }, {
      name: "AlgorithmIdentifier.parameters",
      tagClass: o.Class.UNIVERSAL,
      type: o.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "encryptionParams"
    }]
  }, {
    name: "EncryptedPrivateKeyInfo.encryptedData",
    tagClass: o.Class.UNIVERSAL,
    type: o.Type.OCTETSTRING,
    constructed: !1,
    capture: "encryptedData"
  }]
};
var l = {
  name: "PBES2Algorithms",
  tagClass: o.Class.UNIVERSAL,
  type: o.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "PBES2Algorithms.keyDerivationFunc",
    tagClass: o.Class.UNIVERSAL,
    type: o.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PBES2Algorithms.keyDerivationFunc.oid",
      tagClass: o.Class.UNIVERSAL,
      type: o.Type.OID,
      constructed: !1,
      capture: "kdfOid"
    }, {
      name: "PBES2Algorithms.params",
      tagClass: o.Class.UNIVERSAL,
      type: o.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PBES2Algorithms.params.salt",
        tagClass: o.Class.UNIVERSAL,
        type: o.Type.OCTETSTRING,
        constructed: !1,
        capture: "kdfSalt"
      }, {
        name: "PBES2Algorithms.params.iterationCount",
        tagClass: o.Class.UNIVERSAL,
        type: o.Type.INTEGER,
        constructed: !1,
        capture: "kdfIterationCount"
      }, {
        name: "PBES2Algorithms.params.keyLength",
        tagClass: o.Class.UNIVERSAL,
        type: o.Type.INTEGER,
        constructed: !1,
        optional: !0,
        capture: "keyLength"
      }, {
        name: "PBES2Algorithms.params.prf",
        tagClass: o.Class.UNIVERSAL,
        type: o.Type.SEQUENCE,
        constructed: !0,
        optional: !0,
        value: [{
          name: "PBES2Algorithms.params.prf.algorithm",
          tagClass: o.Class.UNIVERSAL,
          type: o.Type.OID,
          constructed: !1,
          capture: "prfOid"
        }]
      }]
    }]
  }, {
    name: "PBES2Algorithms.encryptionScheme",
    tagClass: o.Class.UNIVERSAL,
    type: o.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PBES2Algorithms.encryptionScheme.oid",
      tagClass: o.Class.UNIVERSAL,
      type: o.Type.OID,
      constructed: !1,
      capture: "encOid"
    }, {
      name: "PBES2Algorithms.encryptionScheme.iv",
      tagClass: o.Class.UNIVERSAL,
      type: o.Type.OCTETSTRING,
      constructed: !1,
      capture: "encIv"
    }]
  }]
};
var u = {
  name: "pkcs-12PbeParams",
  tagClass: o.Class.UNIVERSAL,
  type: o.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "pkcs-12PbeParams.salt",
    tagClass: o.Class.UNIVERSAL,
    type: o.Type.OCTETSTRING,
    constructed: !1,
    capture: "salt"
  }, {
    name: "pkcs-12PbeParams.iterations",
    tagClass: o.Class.UNIVERSAL,
    type: o.Type.INTEGER,
    constructed: !1,
    capture: "iterations"
  }]
};
function p(e, t) {
  return e.start().update(t).digest().getBytes();
}
function d(e) {
  var t;
  if (e) {
    if (!(t = s.oids[o.derToOid(e)])) {
      var n = new Error("Unsupported PRF OID.");
      throw n.oid = e, n.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], n;
    }
  } else t = "hmacWithSHA1";
  return h(t);
}
function h(e) {
  var t = r.md;
  switch (e) {
    case "hmacWithSHA224":
      t = r.md.sha512;
    case "hmacWithSHA1":
    case "hmacWithSHA256":
    case "hmacWithSHA384":
    case "hmacWithSHA512":
      e = e.substr(8).toLowerCase();
      break;
    default:
      var n = new Error("Unsupported PRF algorithm.");
      throw n.algorithm = e, n.supported = ["hmacWithSHA1", "hmacWithSHA224", "hmacWithSHA256", "hmacWithSHA384", "hmacWithSHA512"], n;
  }
  if (!t || !(e in t)) throw new Error("Unknown hash algorithm: " + e);
  return t[e].create();
}
s.encryptPrivateKeyInfo = function (e, t, n) {
  (n = n || {}).saltSize = n.saltSize || 8;
  n.count = n.count || 2048;
  n.algorithm = n.algorithm || "aes128";
  n.prfAlgorithm = n.prfAlgorithm || "sha1";
  var i;
  var c;
  var l;
  var u = r.random.getBytesSync(n.saltSize);
  var p = n.count;
  var d = o.integerToDer(p);
  if (0 === n.algorithm.indexOf("aes") || "des" === n.algorithm) {
    var f;
    var m;
    var g;
    switch (n.algorithm) {
      case "aes128":
        i = 16;
        f = 16;
        m = a["aes128-CBC"];
        g = r.aes.createEncryptionCipher;
        break;
      case "aes192":
        i = 24;
        f = 16;
        m = a["aes192-CBC"];
        g = r.aes.createEncryptionCipher;
        break;
      case "aes256":
        i = 32;
        f = 16;
        m = a["aes256-CBC"];
        g = r.aes.createEncryptionCipher;
        break;
      case "des":
        i = 8;
        f = 8;
        m = a.desCBC;
        g = r.des.createEncryptionCipher;
        break;
      default:
        throw (w = new Error("Cannot encrypt private key. Unknown encryption algorithm.")).algorithm = n.algorithm, w;
    }
    var y = "hmacWith" + n.prfAlgorithm.toUpperCase();
    var _ = h(y);
    var v = r.pkcs5.pbkdf2(t, u, p, i, _);
    var b = r.random.getBytesSync(f);
    (T = g(v)).start(b);
    T.update(o.toDer(e));
    T.finish();
    l = T.output.getBytes();
    var E = function (e, t, n, i) {
      var a = o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.OCTETSTRING, !1, e), o.create(o.Class.UNIVERSAL, o.Type.INTEGER, !1, t.getBytes())]);
      if ("hmacWithSHA1" !== i) {
        a.value.push(o.create(o.Class.UNIVERSAL, o.Type.INTEGER, !1, r.util.hexToBytes(n.toString(16))), o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.OID, !1, o.oidToDer(s.oids[i]).getBytes()), o.create(o.Class.UNIVERSAL, o.Type.NULL, !1, "")]));
      }
      return a;
    }(u, d, i, y);
    c = o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.OID, !1, o.oidToDer(a.pkcs5PBES2).getBytes()), o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.OID, !1, o.oidToDer(a.pkcs5PBKDF2).getBytes()), E]), o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.OID, !1, o.oidToDer(m).getBytes()), o.create(o.Class.UNIVERSAL, o.Type.OCTETSTRING, !1, b)])])]);
  } else {
    var w;
    if ("3des" !== n.algorithm) throw (w = new Error("Cannot encrypt private key. Unknown encryption algorithm.")).algorithm = n.algorithm, w;
    i = 24;
    var T;
    var S = new r.util.ByteBuffer(u);
    v = s.pbe.generatePkcs12Key(t, S, 1, p, i);
    b = s.pbe.generatePkcs12Key(t, S, 2, p, i);
    (T = r.des.createEncryptionCipher(v)).start(b);
    T.update(o.toDer(e));
    T.finish();
    l = T.output.getBytes();
    c = o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.OID, !1, o.oidToDer(a["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()), o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [o.create(o.Class.UNIVERSAL, o.Type.OCTETSTRING, !1, u), o.create(o.Class.UNIVERSAL, o.Type.INTEGER, !1, d.getBytes())])]);
  }
  return o.create(o.Class.UNIVERSAL, o.Type.SEQUENCE, !0, [c, o.create(o.Class.UNIVERSAL, o.Type.OCTETSTRING, !1, l)]);
};
s.decryptPrivateKeyInfo = function (e, t) {
  var n = null;
  var i = {};
  var a = [];
  if (!o.validate(e, c, i, a)) {
    var l = new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
    throw l.errors = a, l;
  }
  var u = o.derToOid(i.encryptionOid);
  var p = s.pbe.getCipher(u, i.encryptionParams, t);
  var d = r.util.createBuffer(i.encryptedData);
  p.update(d);
  if (p.finish()) {
    n = o.fromDer(p.output);
  }
  return n;
};
s.encryptedPrivateKeyToPem = function (e, t) {
  var n = {
    type: "ENCRYPTED PRIVATE KEY",
    body: o.toDer(e).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};
s.encryptedPrivateKeyFromPem = function (e) {
  var t = r.pem.decode(e)[0];
  if ("ENCRYPTED PRIVATE KEY" !== t.type) {
    var n = new Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
    throw n.headerType = t.type, n;
  }
  if (t.procType && "ENCRYPTED" === t.procType.type) throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
  return o.fromDer(t.body);
};
s.encryptRsaPrivateKey = function (e, t, n) {
  if (!(n = n || {}).legacy) {
    var i = s.wrapRsaPrivateKey(s.privateKeyToAsn1(e));
    i = s.encryptPrivateKeyInfo(i, t, n);
    return s.encryptedPrivateKeyToPem(i);
  }
  var a;
  var c;
  var l;
  var u;
  switch (n.algorithm) {
    case "aes128":
      a = "AES-128-CBC";
      l = 16;
      c = r.random.getBytesSync(16);
      u = r.aes.createEncryptionCipher;
      break;
    case "aes192":
      a = "AES-192-CBC";
      l = 24;
      c = r.random.getBytesSync(16);
      u = r.aes.createEncryptionCipher;
      break;
    case "aes256":
      a = "AES-256-CBC";
      l = 32;
      c = r.random.getBytesSync(16);
      u = r.aes.createEncryptionCipher;
      break;
    case "3des":
      a = "DES-EDE3-CBC";
      l = 24;
      c = r.random.getBytesSync(8);
      u = r.des.createEncryptionCipher;
      break;
    case "des":
      a = "DES-CBC";
      l = 8;
      c = r.random.getBytesSync(8);
      u = r.des.createEncryptionCipher;
      break;
    default:
      var p = new Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + n.algorithm + '".');
      throw p.algorithm = n.algorithm, p;
  }
  var d = u(r.pbe.opensslDeriveBytes(t, c.substr(0, 8), l));
  d.start(c);
  d.update(o.toDer(s.privateKeyToAsn1(e)));
  d.finish();
  var h = {
    type: "RSA PRIVATE KEY",
    procType: {
      version: "4",
      type: "ENCRYPTED"
    },
    dekInfo: {
      algorithm: a,
      parameters: r.util.bytesToHex(c).toUpperCase()
    },
    body: d.output.getBytes()
  };
  return r.pem.encode(h);
};
s.decryptRsaPrivateKey = function (e, t) {
  var n = null;
  var i = r.pem.decode(e)[0];
  if ("ENCRYPTED PRIVATE KEY" !== i.type && "PRIVATE KEY" !== i.type && "RSA PRIVATE KEY" !== i.type) throw (l = new Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".')).headerType = l, l;
  if (i.procType && "ENCRYPTED" === i.procType.type) {
    var a;
    var c;
    switch (i.dekInfo.algorithm) {
      case "DES-CBC":
        a = 8;
        c = r.des.createDecryptionCipher;
        break;
      case "DES-EDE3-CBC":
        a = 24;
        c = r.des.createDecryptionCipher;
        break;
      case "AES-128-CBC":
        a = 16;
        c = r.aes.createDecryptionCipher;
        break;
      case "AES-192-CBC":
        a = 24;
        c = r.aes.createDecryptionCipher;
        break;
      case "AES-256-CBC":
        a = 32;
        c = r.aes.createDecryptionCipher;
        break;
      case "RC2-40-CBC":
        a = 5;
        c = function (e) {
          return r.rc2.createDecryptionCipher(e, 40);
        };
        break;
      case "RC2-64-CBC":
        a = 8;
        c = function (e) {
          return r.rc2.createDecryptionCipher(e, 64);
        };
        break;
      case "RC2-128-CBC":
        a = 16;
        c = function (e) {
          return r.rc2.createDecryptionCipher(e, 128);
        };
        break;
      default:
        var l;
        throw (l = new Error('Could not decrypt private key; unsupported encryption algorithm "' + i.dekInfo.algorithm + '".')).algorithm = i.dekInfo.algorithm, l;
    }
    var u = r.util.hexToBytes(i.dekInfo.parameters);
    var p = c(r.pbe.opensslDeriveBytes(t, u.substr(0, 8), a));
    p.start(u);
    p.update(r.util.createBuffer(i.body));
    if (!p.finish()) return n;
    n = p.output.getBytes();
  } else n = i.body;
  if (null !== (n = "ENCRYPTED PRIVATE KEY" === i.type ? s.decryptPrivateKeyInfo(o.fromDer(n), t) : o.fromDer(n))) {
    n = s.privateKeyFromAsn1(n);
  }
  return n;
};
s.pbe.generatePkcs12Key = function (e, t, n, i, o, s) {
  var a;
  var c;
  if (null == s) {
    if (!("sha1" in r.md)) throw new Error('"sha1" hash algorithm unavailable.');
    s = r.md.sha1.create();
  }
  var l = s.digestLength;
  var u = s.blockLength;
  var p = new r.util.ByteBuffer();
  var d = new r.util.ByteBuffer();
  if (null != e) {
    for (c = 0; c < e.length; c++) d.putInt16(e.charCodeAt(c));
    d.putInt16(0);
  }
  var h = d.length();
  var f = t.length();
  var m = new r.util.ByteBuffer();
  m.fillWithByte(n, u);
  var g = u * Math.ceil(f / u);
  var y = new r.util.ByteBuffer();
  for (c = 0; c < g; c++) y.putByte(t.at(c % f));
  var _ = u * Math.ceil(h / u);
  var v = new r.util.ByteBuffer();
  for (c = 0; c < _; c++) v.putByte(d.at(c % h));
  var b = y;
  b.putBuffer(v);
  for (E = Math.ceil(o / l), w = 1, void 0; w <= E; w++) {
    var E;
    var w;
    var T = new r.util.ByteBuffer();
    T.putBytes(m.bytes());
    T.putBytes(b.bytes());
    for (var S = 0; S < i; S++) {
      s.start();
      s.update(T.getBytes());
      T = s.digest();
    }
    var x = new r.util.ByteBuffer();
    for (c = 0; c < u; c++) x.putByte(T.at(c % l));
    var C = Math.ceil(f / u) + Math.ceil(h / u);
    var I = new r.util.ByteBuffer();
    for (a = 0; a < C; a++) {
      var A = new r.util.ByteBuffer(b.getBytes(u));
      var k = 511;
      for (c = x.length() - 1; c >= 0; c--) {
        k >>= 8;
        k += x.at(c) + A.at(c);
        A.setAt(c, 255 & k);
      }
      I.putBuffer(A);
    }
    b = I;
    p.putBuffer(T);
  }
  p.truncate(p.length() - o);
  return p;
};
s.pbe.getCipher = function (e, t, n) {
  switch (e) {
    case s.oids.pkcs5PBES2:
      return s.pbe.getCipherForPBES2(e, t, n);
    case s.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
    case s.oids["pbewithSHAAnd40BitRC2-CBC"]:
      return s.pbe.getCipherForPKCS12PBE(e, t, n);
    default:
      var r = new Error("Cannot read encrypted PBE data block. Unsupported OID.");
      throw r.oid = e, r.supportedOids = ["pkcs5PBES2", "pbeWithSHAAnd3-KeyTripleDES-CBC", "pbewithSHAAnd40BitRC2-CBC"], r;
  }
};
s.pbe.getCipherForPBES2 = function (e, t, n) {
  var i;
  var a = {};
  var c = [];
  if (!o.validate(t, l, a, c)) throw (i = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.")).errors = c, i;
  if ((e = o.derToOid(a.kdfOid)) !== s.oids.pkcs5PBKDF2) throw (i = new Error("Cannot read encrypted private key. Unsupported key derivation function OID.")).oid = e, i.supportedOids = ["pkcs5PBKDF2"], i;
  if ((e = o.derToOid(a.encOid)) !== s.oids["aes128-CBC"] && e !== s.oids["aes192-CBC"] && e !== s.oids["aes256-CBC"] && e !== s.oids["des-EDE3-CBC"] && e !== s.oids.desCBC) throw (i = new Error("Cannot read encrypted private key. Unsupported encryption scheme OID.")).oid = e, i.supportedOids = ["aes128-CBC", "aes192-CBC", "aes256-CBC", "des-EDE3-CBC", "desCBC"], i;
  var u;
  var p;
  var h = a.kdfSalt;
  var f = r.util.createBuffer(a.kdfIterationCount);
  switch (f = f.getInt(f.length() << 3), s.oids[e]) {
    case "aes128-CBC":
      u = 16;
      p = r.aes.createDecryptionCipher;
      break;
    case "aes192-CBC":
      u = 24;
      p = r.aes.createDecryptionCipher;
      break;
    case "aes256-CBC":
      u = 32;
      p = r.aes.createDecryptionCipher;
      break;
    case "des-EDE3-CBC":
      u = 24;
      p = r.des.createDecryptionCipher;
      break;
    case "desCBC":
      u = 8;
      p = r.des.createDecryptionCipher;
  }
  var m = d(a.prfOid);
  var g = r.pkcs5.pbkdf2(n, h, f, u, m);
  var y = a.encIv;
  var _ = p(g);
  _.start(y);
  return _;
};
s.pbe.getCipherForPKCS12PBE = function (e, t, n) {
  var i = {};
  var a = [];
  if (!o.validate(t, u, i, a)) throw (m = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.")).errors = a, m;
  var c;
  var l;
  var p;
  var h = r.util.createBuffer(i.salt);
  var f = r.util.createBuffer(i.iterations);
  switch (f = f.getInt(f.length() << 3), e) {
    case s.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
      c = 24;
      l = 8;
      p = r.des.startDecrypting;
      break;
    case s.oids["pbewithSHAAnd40BitRC2-CBC"]:
      c = 5;
      l = 8;
      p = function (e, t) {
        var n = r.rc2.createDecryptionCipher(e, 40);
        n.start(t, null);
        return n;
      };
      break;
    default:
      var m;
      throw (m = new Error("Cannot read PKCS #12 PBE data block. Unsupported OID.")).oid = e, m;
  }
  var g = d(i.prfOid);
  var y = s.pbe.generatePkcs12Key(n, h, 1, f, c, g);
  g.start();
  return p(y, s.pbe.generatePkcs12Key(n, h, 2, f, l, g));
};
s.pbe.opensslDeriveBytes = function (e, t, n, i) {
  if (null == i) {
    if (!("md5" in r.md)) throw new Error('"md5" hash algorithm unavailable.');
    i = r.md.md5.create();
  }
  if (null === t) {
    t = "";
  }
  for (o = [p(i, e + t)], s = 16, a = 1, void 0; s < n; ++a, s += 16) {
    var o;
    var s;
    var a;
    o.push(p(i, o[a - 1] + e + t));
  }
  return o.join("").substr(0, n);
};