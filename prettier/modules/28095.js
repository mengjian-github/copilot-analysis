var r = require(3832);
require(3068);
require(15764);
require(66270);
require(18936);
require(29654);
require(49563);
require(97116);
if (void 0 === i) var i = r.jsbn.BigInteger;
var o = r.util.isNodejs ? require(6113) : null;
var s = r.asn1;
var a = r.util;
r.pki = r.pki || {};
module.exports = r.pki.rsa = r.rsa = r.rsa || {};
var c = r.pki;
var l = [6, 4, 2, 4, 2, 4, 6, 2];
var u = {
  name: "PrivateKeyInfo",
  tagClass: s.Class.UNIVERSAL,
  type: s.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "PrivateKeyInfo.version",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyVersion"
  }, {
    name: "PrivateKeyInfo.privateKeyAlgorithm",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "AlgorithmIdentifier.algorithm",
      tagClass: s.Class.UNIVERSAL,
      type: s.Type.OID,
      constructed: !1,
      capture: "privateKeyOid"
    }]
  }, {
    name: "PrivateKeyInfo",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.OCTETSTRING,
    constructed: !1,
    capture: "privateKey"
  }]
};
var p = {
  name: "RSAPrivateKey",
  tagClass: s.Class.UNIVERSAL,
  type: s.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "RSAPrivateKey.version",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyVersion"
  }, {
    name: "RSAPrivateKey.modulus",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyModulus"
  }, {
    name: "RSAPrivateKey.publicExponent",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyPublicExponent"
  }, {
    name: "RSAPrivateKey.privateExponent",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyPrivateExponent"
  }, {
    name: "RSAPrivateKey.prime1",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyPrime1"
  }, {
    name: "RSAPrivateKey.prime2",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyPrime2"
  }, {
    name: "RSAPrivateKey.exponent1",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyExponent1"
  }, {
    name: "RSAPrivateKey.exponent2",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyExponent2"
  }, {
    name: "RSAPrivateKey.coefficient",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyCoefficient"
  }]
};
var d = {
  name: "RSAPublicKey",
  tagClass: s.Class.UNIVERSAL,
  type: s.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "RSAPublicKey.modulus",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "publicKeyModulus"
  }, {
    name: "RSAPublicKey.exponent",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.INTEGER,
    constructed: !1,
    capture: "publicKeyExponent"
  }]
};
var h = r.pki.rsa.publicKeyValidator = {
  name: "SubjectPublicKeyInfo",
  tagClass: s.Class.UNIVERSAL,
  type: s.Type.SEQUENCE,
  constructed: !0,
  captureAsn1: "subjectPublicKeyInfo",
  value: [{
    name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "AlgorithmIdentifier.algorithm",
      tagClass: s.Class.UNIVERSAL,
      type: s.Type.OID,
      constructed: !1,
      capture: "publicKeyOid"
    }]
  }, {
    name: "SubjectPublicKeyInfo.subjectPublicKey",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.BITSTRING,
    constructed: !1,
    value: [{
      name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
      tagClass: s.Class.UNIVERSAL,
      type: s.Type.SEQUENCE,
      constructed: !0,
      optional: !0,
      captureAsn1: "rsaPublicKey"
    }]
  }]
};
var f = {
  name: "DigestInfo",
  tagClass: s.Class.UNIVERSAL,
  type: s.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "DigestInfo.DigestAlgorithm",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
      tagClass: s.Class.UNIVERSAL,
      type: s.Type.OID,
      constructed: !1,
      capture: "algorithmIdentifier"
    }, {
      name: "DigestInfo.DigestAlgorithm.parameters",
      tagClass: s.Class.UNIVERSAL,
      type: s.Type.NULL,
      capture: "parameters",
      optional: !0,
      constructed: !1
    }]
  }, {
    name: "DigestInfo.digest",
    tagClass: s.Class.UNIVERSAL,
    type: s.Type.OCTETSTRING,
    constructed: !1,
    capture: "digest"
  }]
};
var m = function (e) {
  var t;
  if (!(e.algorithm in c.oids)) {
    var n = new Error("Unknown message digest algorithm.");
    throw n.algorithm = e.algorithm, n;
  }
  t = c.oids[e.algorithm];
  var r = s.oidToDer(t).getBytes();
  var i = s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, []);
  var o = s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, []);
  o.value.push(s.create(s.Class.UNIVERSAL, s.Type.OID, !1, r));
  o.value.push(s.create(s.Class.UNIVERSAL, s.Type.NULL, !1, ""));
  var a = s.create(s.Class.UNIVERSAL, s.Type.OCTETSTRING, !1, e.digest().getBytes());
  i.value.push(o);
  i.value.push(a);
  return s.toDer(i).getBytes();
};
var g = function (e, t, n) {
  if (n) return e.modPow(t.e, t.n);
  if (!t.p || !t.q) return e.modPow(t.d, t.n);
  var o;
  if (t.dP) {
    t.dP = t.d.mod(t.p.subtract(i.ONE));
  }
  if (t.dQ) {
    t.dQ = t.d.mod(t.q.subtract(i.ONE));
  }
  if (t.qInv) {
    t.qInv = t.q.modInverse(t.p);
  }
  do {
    o = new i(r.util.bytesToHex(r.random.getBytes(t.n.bitLength() / 8)), 16);
  } while (o.compareTo(t.n) >= 0 || !o.gcd(t.n).equals(i.ONE));
  for (s = (e = e.multiply(o.modPow(t.e, t.n)).mod(t.n)).mod(t.p).modPow(t.dP, t.p), a = e.mod(t.q).modPow(t.dQ, t.q), void 0; s.compareTo(a) < 0;) {
    var s;
    var a;
    s = s.add(t.p);
  }
  var c = s.subtract(a).multiply(t.qInv).mod(t.p).multiply(t.q).add(a);
  return c.multiply(o.modInverse(t.n)).mod(t.n);
};
function y(e, t, n) {
  var i = r.util.createBuffer();
  var o = Math.ceil(t.n.bitLength() / 8);
  if (e.length > o - 11) {
    var s = new Error("Message is too long for PKCS#1 v1.5 padding.");
    throw s.length = e.length, s.max = o - 11, s;
  }
  i.putByte(0);
  i.putByte(n);
  var a;
  var c = o - 3 - e.length;
  if (0 === n || 1 === n) {
    a = 0 === n ? 0 : 255;
    for (var l = 0; l < c; ++l) i.putByte(a);
  } else for (; c > 0;) {
    var u = 0;
    var p = r.random.getBytes(c);
    for (l = 0; l < c; ++l) if (0 === (a = p.charCodeAt(l))) {
      ++u;
    } else {
      i.putByte(a);
    }
    c = u;
  }
  i.putByte(0);
  i.putBytes(e);
  return i;
}
function _(e, t, n, i) {
  var o = Math.ceil(t.n.bitLength() / 8);
  var s = r.util.createBuffer(e);
  var a = s.getByte();
  var c = s.getByte();
  if (0 !== a || n && 0 !== c && 1 !== c || !n && 2 != c || n && 0 === c && void 0 === i) throw new Error("Encryption block is invalid.");
  var l = 0;
  if (0 === c) {
    l = o - 3 - i;
    for (var u = 0; u < l; ++u) if (0 !== s.getByte()) throw new Error("Encryption block is invalid.");
  } else if (1 === c) for (l = 0; s.length() > 1;) {
    if (255 !== s.getByte()) {
      --s.read;
      break;
    }
    ++l;
  } else if (2 === c) for (l = 0; s.length() > 1;) {
    if (0 === s.getByte()) {
      --s.read;
      break;
    }
    ++l;
  }
  if (0 !== s.getByte() || l !== o - 3 - s.length()) throw new Error("Encryption block is invalid.");
  return s.getBytes();
}
function v(e, t, n) {
  if ("function" == typeof t) {
    n = t;
    t = {};
  }
  var o = {
    algorithm: {
      name: (t = t || {}).algorithm || "PRIMEINC",
      options: {
        workers: t.workers || 2,
        workLoad: t.workLoad || 100,
        workerScript: t.workerScript
      }
    }
  };
  function s() {
    a(e.pBits, function (t, r) {
      return t ? n(t) : (e.p = r, null !== e.q ? l(t, e.q) : void a(e.qBits, l));
    });
  }
  function a(e, t) {
    r.prime.generateProbablePrime(e, o, t);
  }
  function l(t, r) {
    if (t) return n(t);
    e.q = r;
    if (e.p.compareTo(e.q) < 0) {
      var o = e.p;
      e.p = e.q, e.q = o;
    }
    if (0 !== e.p.subtract(i.ONE).gcd(e.e).compareTo(i.ONE)) {
      e.p = null;
      return void s();
    }
    if (0 !== e.q.subtract(i.ONE).gcd(e.e).compareTo(i.ONE)) {
      e.q = null;
      return void a(e.qBits, l);
    }
    e.p1 = e.p.subtract(i.ONE);
    e.q1 = e.q.subtract(i.ONE);
    e.phi = e.p1.multiply(e.q1);
    if (0 !== e.phi.gcd(e.e).compareTo(i.ONE)) return e.p = e.q = null, void s();
    e.n = e.p.multiply(e.q);
    if (e.n.bitLength() !== e.bits) return e.q = null, void a(e.qBits, l);
    var u = e.e.modInverse(e.phi);
    e.keys = {
      privateKey: c.rsa.setPrivateKey(e.n, e.e, u, e.p, e.q, u.mod(e.p1), u.mod(e.q1), e.q.modInverse(e.p)),
      publicKey: c.rsa.setPublicKey(e.n, e.e)
    };
    n(null, e.keys);
  }
  if ("prng" in t) {
    o.prng = t.prng;
  }
  s();
}
function b(e) {
  var t = e.toString(16);
  if (t[0] >= "8") {
    t = "00" + t;
  }
  var n = r.util.hexToBytes(t);
  return n.length > 1 && (0 === n.charCodeAt(0) && 0 == (128 & n.charCodeAt(1)) || 255 === n.charCodeAt(0) && 128 == (128 & n.charCodeAt(1))) ? n.substr(1) : n;
}
function E(e) {
  return e <= 100 ? 27 : e <= 150 ? 18 : e <= 200 ? 15 : e <= 250 ? 12 : e <= 300 ? 9 : e <= 350 ? 8 : e <= 400 ? 7 : e <= 500 ? 6 : e <= 600 ? 5 : e <= 800 ? 4 : e <= 1250 ? 3 : 2;
}
function w(e) {
  return r.util.isNodejs && "function" == typeof o[e];
}
function T(e) {
  return void 0 !== a.globalScope && "object" == typeof a.globalScope.crypto && "object" == typeof a.globalScope.crypto.subtle && "function" == typeof a.globalScope.crypto.subtle[e];
}
function S(e) {
  return void 0 !== a.globalScope && "object" == typeof a.globalScope.msCrypto && "object" == typeof a.globalScope.msCrypto.subtle && "function" == typeof a.globalScope.msCrypto.subtle[e];
}
function x(e) {
  for (t = r.util.hexToBytes(e.toString(16)), n = new Uint8Array(t.length), i = 0, void 0; i < t.length; ++i) {
    var t;
    var n;
    var i;
    n[i] = t.charCodeAt(i);
  }
  return n;
}
c.rsa.encrypt = function (e, t, n) {
  var o;
  var s = n;
  var a = Math.ceil(t.n.bitLength() / 8);
  if (!1 !== n && !0 !== n) {
    s = 2 === n;
    o = y(e, t, n);
  } else {
    (o = r.util.createBuffer()).putBytes(e);
  }
  for (c = new i(o.toHex(), 16), l = g(c, t, s).toString(16), u = r.util.createBuffer(), p = a - Math.ceil(l.length / 2), void 0; p > 0;) {
    var c;
    var l;
    var u;
    var p;
    u.putByte(0);
    --p;
  }
  u.putBytes(r.util.hexToBytes(l));
  return u.getBytes();
};
c.rsa.decrypt = function (e, t, n, o) {
  var s = Math.ceil(t.n.bitLength() / 8);
  if (e.length !== s) {
    var a = new Error("Encrypted message length is invalid.");
    throw a.length = e.length, a.expected = s, a;
  }
  var c = new i(r.util.createBuffer(e).toHex(), 16);
  if (c.compareTo(t.n) >= 0) throw new Error("Encrypted message is invalid.");
  for (l = g(c, t, n).toString(16), u = r.util.createBuffer(), p = s - Math.ceil(l.length / 2), void 0; p > 0;) {
    var l;
    var u;
    var p;
    u.putByte(0);
    --p;
  }
  u.putBytes(r.util.hexToBytes(l));
  return !1 !== o ? _(u.getBytes(), t, n) : u.getBytes();
};
c.rsa.createKeyPairGenerationState = function (e, t, n) {
  if ("string" == typeof e) {
    e = parseInt(e, 10);
  }
  e = e || 2048;
  var o;
  var s = (n = n || {}).prng || r.random;
  var a = {
    nextBytes: function (e) {
      for (t = s.getBytesSync(e.length), n = 0, void 0; n < e.length; ++n) {
        var t;
        var n;
        e[n] = t.charCodeAt(n);
      }
    }
  };
  var c = n.algorithm || "PRIMEINC";
  if ("PRIMEINC" !== c) throw new Error("Invalid key generation algorithm: " + c);
  (o = {
    algorithm: c,
    state: 0,
    bits: e,
    rng: a,
    eInt: t || 65537,
    e: new i(null),
    p: null,
    q: null,
    qBits: e >> 1,
    pBits: e - (e >> 1),
    pqState: 0,
    num: null,
    keys: null
  }).e.fromInt(o.eInt);
  return o;
};
c.rsa.stepKeyPairGenerationState = function (e, t) {
  if ("algorithm" in e) {
    e.algorithm = "PRIMEINC";
  }
  var n = new i(null);
  n.fromInt(30);
  for (o = 0, s = function (e, t) {
    return e | t;
  }, a = +new Date(), u = 0, void 0; null === e.keys && (t <= 0 || u < t);) {
    var r;
    var o;
    var s;
    var a;
    var u;
    if (0 === e.state) {
      var p = null === e.p ? e.pBits : e.qBits;
      var d = p - 1;
      if (0 === e.pqState) {
        e.num = new i(p, e.rng);
        if (e.num.testBit(d)) {
          e.num.bitwiseTo(i.ONE.shiftLeft(d), s, e.num);
        }
        e.num.dAddOffset(31 - e.num.mod(n).byteValue(), 0);
        o = 0;
        ++e.pqState;
      } else {
        if (1 === e.pqState) {
          if (e.num.bitLength() > p) {
            e.pqState = 0;
          } else {
            if (e.num.isProbablePrime(E(e.num.bitLength()))) {
              ++e.pqState;
            } else {
              e.num.dAddOffset(l[o++ % 8], 0);
            }
          }
        } else {
          if (2 === e.pqState) {
            e.pqState = 0 === e.num.subtract(i.ONE).gcd(e.e).compareTo(i.ONE) ? 3 : 0;
          } else {
            if (3 === e.pqState) {
              e.pqState = 0;
              if (null === e.p) {
                e.p = e.num;
              } else {
                e.q = e.num;
              }
              if (null !== e.p && null !== e.q) {
                ++e.state;
              }
              e.num = null;
            }
          }
        }
      }
    } else if (1 === e.state) {
      if (e.p.compareTo(e.q) < 0) {
        e.num = e.p;
        e.p = e.q;
        e.q = e.num;
      }
      ++e.state;
    } else if (2 === e.state) {
      e.p1 = e.p.subtract(i.ONE);
      e.q1 = e.q.subtract(i.ONE);
      e.phi = e.p1.multiply(e.q1);
      ++e.state;
    } else if (3 === e.state) {
      if (0 === e.phi.gcd(e.e).compareTo(i.ONE)) {
        ++e.state;
      } else {
        e.p = null;
        e.q = null;
        e.state = 0;
      }
    } else if (4 === e.state) {
      e.n = e.p.multiply(e.q);
      if (e.n.bitLength() === e.bits) {
        ++e.state;
      } else {
        e.q = null;
        e.state = 0;
      }
    } else if (5 === e.state) {
      var h = e.e.modInverse(e.phi);
      e.keys = {
        privateKey: c.rsa.setPrivateKey(e.n, e.e, h, e.p, e.q, h.mod(e.p1), h.mod(e.q1), e.q.modInverse(e.p)),
        publicKey: c.rsa.setPublicKey(e.n, e.e)
      };
    }
    u += (r = +new Date()) - a;
    a = r;
  }
  return null !== e.keys;
};
c.rsa.generateKeyPair = function (e, t, n, i) {
  if (1 === arguments.length) {
    if ("object" == typeof e) {
      n = e;
      e = void 0;
    } else {
      if ("function" == typeof e) {
        i = e;
        e = void 0;
      }
    }
  } else {
    if (2 === arguments.length) {
      if ("number" == typeof e) {
        if ("function" == typeof t) {
          i = t;
          t = void 0;
        } else {
          if ("number" != typeof t) {
            n = t;
            t = void 0;
          }
        }
      } else {
        n = e;
        i = t;
        e = void 0;
        t = void 0;
      }
    } else {
      if (3 === arguments.length) {
        if ("number" == typeof t) {
          if ("function" == typeof n) {
            i = n;
            n = void 0;
          }
        } else {
          i = n;
          n = t;
          t = void 0;
        }
      }
    }
  }
  n = n || {};
  if (void 0 === e) {
    e = n.bits || 2048;
  }
  if (void 0 === t) {
    t = n.e || 65537;
  }
  if (!r.options.usePureJavaScript && !n.prng && e >= 256 && e <= 16384 && (65537 === t || 3 === t)) if (i) {
    if (w("generateKeyPair")) return o.generateKeyPair("rsa", {
      modulusLength: e,
      publicExponent: t,
      publicKeyEncoding: {
        type: "spki",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
      }
    }, function (e, t, n) {
      if (e) return i(e);
      i(null, {
        privateKey: c.privateKeyFromPem(n),
        publicKey: c.publicKeyFromPem(t)
      });
    });
    if (T("generateKey") && T("exportKey")) return a.globalScope.crypto.subtle.generateKey({
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: e,
      publicExponent: x(t),
      hash: {
        name: "SHA-256"
      }
    }, !0, ["sign", "verify"]).then(function (e) {
      return a.globalScope.crypto.subtle.exportKey("pkcs8", e.privateKey);
    }).then(void 0, function (e) {
      i(e);
    }).then(function (e) {
      if (e) {
        var t = c.privateKeyFromAsn1(s.fromDer(r.util.createBuffer(e)));
        i(null, {
          privateKey: t,
          publicKey: c.setRsaPublicKey(t.n, t.e)
        });
      }
    });
    if (S("generateKey") && S("exportKey")) {
      var l = a.globalScope.msCrypto.subtle.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: e,
        publicExponent: x(t),
        hash: {
          name: "SHA-256"
        }
      }, !0, ["sign", "verify"]);
      return l.oncomplete = function (e) {
        var t = e.target.result,
          n = a.globalScope.msCrypto.subtle.exportKey("pkcs8", t.privateKey);
        n.oncomplete = function (e) {
          var t = e.target.result,
            n = c.privateKeyFromAsn1(s.fromDer(r.util.createBuffer(t)));
          i(null, {
            privateKey: n,
            publicKey: c.setRsaPublicKey(n.n, n.e)
          });
        }, n.onerror = function (e) {
          i(e);
        };
      }, void (l.onerror = function (e) {
        i(e);
      });
    }
  } else if (w("generateKeyPairSync")) {
    var u = o.generateKeyPairSync("rsa", {
      modulusLength: e,
      publicExponent: t,
      publicKeyEncoding: {
        type: "spki",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
      }
    });
    return {
      privateKey: c.privateKeyFromPem(u.privateKey),
      publicKey: c.publicKeyFromPem(u.publicKey)
    };
  }
  var p = c.rsa.createKeyPairGenerationState(e, t, n);
  if (!i) {
    c.rsa.stepKeyPairGenerationState(p, 0);
    return p.keys;
  }
  v(p, n, i);
};
c.setRsaPublicKey = c.rsa.setPublicKey = function (e, t) {
  var n = {
    n: e,
    e: t,
    encrypt: function (e, t, i) {
      if ("string" == typeof t) {
        t = t.toUpperCase();
      } else {
        if (void 0 === t) {
          t = "RSAES-PKCS1-V1_5";
        }
      }
      if ("RSAES-PKCS1-V1_5" === t) t = {
        encode: function (e, t, n) {
          return y(e, t, 2).getBytes();
        }
      };else if ("RSA-OAEP" === t || "RSAES-OAEP" === t) t = {
        encode: function (e, t) {
          return r.pkcs1.encode_rsa_oaep(t, e, i);
        }
      };else if (-1 !== ["RAW", "NONE", "NULL", null].indexOf(t)) t = {
        encode: function (e) {
          return e;
        }
      };else if ("string" == typeof t) throw new Error('Unsupported encryption scheme: "' + t + '".');
      var o = t.encode(e, n, !0);
      return c.rsa.encrypt(o, n, !0);
    },
    verify: function (e, t, i, o) {
      if ("string" == typeof i) {
        i = i.toUpperCase();
      } else {
        if (void 0 === i) {
          i = "RSASSA-PKCS1-V1_5";
        }
      }
      if (void 0 === o) {
        o = {
          _parseAllDigestBytes: !0
        };
      }
      if ("_parseAllDigestBytes" in o) {
        o._parseAllDigestBytes = !0;
      }
      if ("RSASSA-PKCS1-V1_5" === i) {
        i = {
          verify: function (e, t) {
            t = _(t, n, !0);
            var i = s.fromDer(t, {
              parseAllBytes: o._parseAllDigestBytes
            });
            var a = {};
            var c = [];
            if (!s.validate(i, f, a, c)) throw (l = new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.")).errors = c, l;
            var l;
            var u = s.derToOid(a.algorithmIdentifier);
            if (u !== r.oids.md2 && u !== r.oids.md5 && u !== r.oids.sha1 && u !== r.oids.sha224 && u !== r.oids.sha256 && u !== r.oids.sha384 && u !== r.oids.sha512 && u !== r.oids["sha512-224"] && u !== r.oids["sha512-256"]) throw (l = new Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.")).oid = u, l;
            if ((u === r.oids.md2 || u === r.oids.md5) && !("parameters" in a)) throw new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters.");
            return e === a.digest;
          }
        };
      } else {
        if ("NONE" !== i && "NULL" !== i && null !== i) {
          i = {
            verify: function (e, t) {
              return e === _(t, n, !0);
            }
          };
        }
      }
      var a = c.rsa.decrypt(t, n, !0, !1);
      return i.verify(e, a, n.n.bitLength());
    }
  };
  return n;
};
c.setRsaPrivateKey = c.rsa.setPrivateKey = function (e, t, n, i, o, s, a, l) {
  var u = {
    n: e,
    e: t,
    d: n,
    p: i,
    q: o,
    dP: s,
    dQ: a,
    qInv: l,
    decrypt: function (e, t, n) {
      if ("string" == typeof t) {
        t = t.toUpperCase();
      } else {
        if (void 0 === t) {
          t = "RSAES-PKCS1-V1_5";
        }
      }
      var i = c.rsa.decrypt(e, u, !1, !1);
      if ("RSAES-PKCS1-V1_5" === t) t = {
        decode: _
      };else if ("RSA-OAEP" === t || "RSAES-OAEP" === t) t = {
        decode: function (e, t) {
          return r.pkcs1.decode_rsa_oaep(t, e, n);
        }
      };else {
        if (-1 === ["RAW", "NONE", "NULL", null].indexOf(t)) throw new Error('Unsupported encryption scheme: "' + t + '".');
        t = {
          decode: function (e) {
            return e;
          }
        };
      }
      return t.decode(i, u, !1);
    },
    sign: function (e, t) {
      var n = !1;
      if ("string" == typeof t) {
        t = t.toUpperCase();
      }
      if (void 0 === t || "RSASSA-PKCS1-V1_5" === t) {
        t = {
          encode: m
        };
        n = 1;
      } else {
        if ("NONE" !== t && "NULL" !== t && null !== t) {
          t = {
            encode: function () {
              return e;
            }
          };
          n = 1;
        }
      }
      var r = t.encode(e, u.n.bitLength());
      return c.rsa.encrypt(r, u, n);
    }
  };
  return u;
};
c.wrapRsaPrivateKey = function (e) {
  return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, s.integerToDer(0).getBytes()), s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [s.create(s.Class.UNIVERSAL, s.Type.OID, !1, s.oidToDer(c.oids.rsaEncryption).getBytes()), s.create(s.Class.UNIVERSAL, s.Type.NULL, !1, "")]), s.create(s.Class.UNIVERSAL, s.Type.OCTETSTRING, !1, s.toDer(e).getBytes())]);
};
c.privateKeyFromAsn1 = function (e) {
  var t;
  var n;
  var o;
  var a;
  var l;
  var d;
  var h;
  var f;
  var m = {};
  var g = [];
  if (s.validate(e, u, m, g)) {
    e = s.fromDer(r.util.createBuffer(m.privateKey));
  }
  m = {};
  g = [];
  if (!s.validate(e, p, m, g)) {
    var y = new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
    throw y.errors = g, y;
  }
  t = r.util.createBuffer(m.privateKeyModulus).toHex();
  n = r.util.createBuffer(m.privateKeyPublicExponent).toHex();
  o = r.util.createBuffer(m.privateKeyPrivateExponent).toHex();
  a = r.util.createBuffer(m.privateKeyPrime1).toHex();
  l = r.util.createBuffer(m.privateKeyPrime2).toHex();
  d = r.util.createBuffer(m.privateKeyExponent1).toHex();
  h = r.util.createBuffer(m.privateKeyExponent2).toHex();
  f = r.util.createBuffer(m.privateKeyCoefficient).toHex();
  return c.setRsaPrivateKey(new i(t, 16), new i(n, 16), new i(o, 16), new i(a, 16), new i(l, 16), new i(d, 16), new i(h, 16), new i(f, 16));
};
c.privateKeyToAsn1 = c.privateKeyToRSAPrivateKey = function (e) {
  return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, s.integerToDer(0).getBytes()), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.n)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.e)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.d)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.p)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.q)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.dP)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.dQ)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.qInv))]);
};
c.publicKeyFromAsn1 = function (e) {
  var t = {};
  var n = [];
  if (s.validate(e, h, t, n)) {
    var o;
    var a = s.derToOid(t.publicKeyOid);
    if (a !== c.oids.rsaEncryption) throw (o = new Error("Cannot read public key. Unknown OID.")).oid = a, o;
    e = t.rsaPublicKey;
  }
  n = [];
  if (!s.validate(e, d, t, n)) throw (o = new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.")).errors = n, o;
  var l = r.util.createBuffer(t.publicKeyModulus).toHex();
  var u = r.util.createBuffer(t.publicKeyExponent).toHex();
  return c.setRsaPublicKey(new i(l, 16), new i(u, 16));
};
c.publicKeyToAsn1 = c.publicKeyToSubjectPublicKeyInfo = function (e) {
  return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [s.create(s.Class.UNIVERSAL, s.Type.OID, !1, s.oidToDer(c.oids.rsaEncryption).getBytes()), s.create(s.Class.UNIVERSAL, s.Type.NULL, !1, "")]), s.create(s.Class.UNIVERSAL, s.Type.BITSTRING, !1, [c.publicKeyToRSAPublicKey(e)])]);
};
c.publicKeyToRSAPublicKey = function (e) {
  return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.n)), s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, b(e.e))]);
};