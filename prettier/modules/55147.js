var r = require(3832);
require(3068);
require(36607);
require(66270);
require(95496);
require(97450);
require(49563);
require(28095);
require(137);
require(97116);
require(25414);
var i = r.asn1;
var o = r.pki;
var s = module.exports = r.pkcs12 = r.pkcs12 || {};
var a = {
  name: "ContentInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "ContentInfo.contentType",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OID,
    constructed: !1,
    capture: "contentType"
  }, {
    name: "ContentInfo.content",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    constructed: !0,
    captureAsn1: "content"
  }]
};
var c = {
  name: "PFX",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "PFX.version",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1,
    capture: "version"
  }, a, {
    name: "PFX.macData",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    optional: !0,
    captureAsn1: "mac",
    value: [{
      name: "PFX.macData.mac",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PFX.macData.mac.digestAlgorithm",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PFX.macData.mac.digestAlgorithm.algorithm",
          tagClass: i.Class.UNIVERSAL,
          type: i.Type.OID,
          constructed: !1,
          capture: "macAlgorithm"
        }, {
          name: "PFX.macData.mac.digestAlgorithm.parameters",
          tagClass: i.Class.UNIVERSAL,
          captureAsn1: "macAlgorithmParameters"
        }]
      }, {
        name: "PFX.macData.mac.digest",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.OCTETSTRING,
        constructed: !1,
        capture: "macDigest"
      }]
    }, {
      name: "PFX.macData.macSalt",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OCTETSTRING,
      constructed: !1,
      capture: "macSalt"
    }, {
      name: "PFX.macData.iterations",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.INTEGER,
      constructed: !1,
      optional: !0,
      capture: "macIterations"
    }]
  }]
};
var l = {
  name: "SafeBag",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "SafeBag.bagId",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OID,
    constructed: !1,
    capture: "bagId"
  }, {
    name: "SafeBag.bagValue",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    constructed: !0,
    captureAsn1: "bagValue"
  }, {
    name: "SafeBag.bagAttributes",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SET,
    constructed: !0,
    optional: !0,
    capture: "bagAttributes"
  }]
};
var u = {
  name: "Attribute",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "Attribute.attrId",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OID,
    constructed: !1,
    capture: "oid"
  }, {
    name: "Attribute.attrValues",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SET,
    constructed: !0,
    capture: "values"
  }]
};
var p = {
  name: "CertBag",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "CertBag.certId",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OID,
    constructed: !1,
    capture: "certId"
  }, {
    name: "CertBag.certValue",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    constructed: !0,
    value: [{
      name: "CertBag.certValue[0]",
      tagClass: i.Class.UNIVERSAL,
      type: i.Class.OCTETSTRING,
      constructed: !1,
      capture: "cert"
    }]
  }]
};
function d(e, t, n, r) {
  for (i = [], o = 0, void 0; o < e.length; o++) {
    var i;
    var o;
    for (var s = 0; s < e[o].safeBags.length; s++) {
      var a = e[o].safeBags[s];
      if (void 0 !== r && a.type !== r) {
        if (null !== t) {
          if (void 0 !== a.attributes[t] && a.attributes[t].indexOf(n) >= 0) {
            i.push(a);
          }
        } else {
          i.push(a);
        }
      }
    }
  }
  return i;
}
function h(e) {
  if (e.composed || e.constructed) {
    for (t = r.util.createBuffer(), n = 0, void 0; n < e.value.length; ++n) {
      var t;
      var n;
      t.putBytes(e.value[n].value);
    }
    e.composed = e.constructed = !1;
    e.value = t.getBytes();
  }
  return e;
}
function f(e, t) {
  var n = {};
  var s = [];
  if (!i.validate(e, r.pkcs7.asn1.encryptedDataValidator, n, s)) throw (a = new Error("Cannot read EncryptedContentInfo.")).errors = s, a;
  var a;
  var c = i.derToOid(n.contentType);
  if (c !== o.oids.data) throw (a = new Error("PKCS#12 EncryptedContentInfo ContentType is not Data.")).oid = c, a;
  c = i.derToOid(n.encAlgorithm);
  var l = o.pbe.getCipher(c, n.encParameter, t);
  var u = h(n.encryptedContentAsn1);
  var p = r.util.createBuffer(u.value);
  l.update(p);
  if (!l.finish()) throw new Error("Failed to decrypt PKCS#12 SafeContents.");
  return l.output.getBytes();
}
function m(e, t, n) {
  if (!t && 0 === e.length) return [];
  if ((e = i.fromDer(e, t)).tagClass !== i.Class.UNIVERSAL || e.type !== i.Type.SEQUENCE || !0 !== e.constructed) throw new Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
  for (r = [], s = 0, void 0; s < e.value.length; s++) {
    var r;
    var s;
    var a = e.value[s];
    var c = {};
    var u = [];
    if (!i.validate(a, l, c, u)) throw (y = new Error("Cannot read SafeBag.")).errors = u, y;
    var d;
    var h;
    var f = {
      type: i.derToOid(c.bagId),
      attributes: g(c.bagAttributes)
    };
    r.push(f);
    var m = c.bagValue.value[0];
    switch (f.type) {
      case o.oids.pkcs8ShroudedKeyBag:
        if (null === (m = o.decryptPrivateKeyInfo(m, n))) throw new Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
      case o.oids.keyBag:
        try {
          f.key = o.privateKeyFromAsn1(m);
        } catch (e) {
          f.key = null;
          f.asn1 = m;
        }
        continue;
      case o.oids.certBag:
        d = p;
        h = function () {
          if (i.derToOid(c.certId) !== o.oids.x509Certificate) {
            var e = new Error("Unsupported certificate type, only X.509 supported.");
            throw e.oid = i.derToOid(c.certId), e;
          }
          var n = i.fromDer(c.cert, t);
          try {
            f.cert = o.certificateFromAsn1(n, !0);
          } catch (e) {
            f.cert = null;
            f.asn1 = n;
          }
        };
        break;
      default:
        var y;
        throw (y = new Error("Unsupported PKCS#12 SafeBag type.")).oid = f.type, y;
    }
    if (void 0 !== d && !i.validate(m, d, c, u)) throw (y = new Error("Cannot read PKCS#12 " + d.name)).errors = u, y;
    h();
  }
  return r;
}
function g(e) {
  var t = {};
  if (void 0 !== e) for (var n = 0; n < e.length; ++n) {
    var r = {};
    var s = [];
    if (!i.validate(e[n], u, r, s)) {
      var a = new Error("Cannot read PKCS#12 BagAttribute.");
      throw a.errors = s, a;
    }
    var c = i.derToOid(r.oid);
    if (void 0 !== o.oids[c]) {
      t[o.oids[c]] = [];
      for (var l = 0; l < r.values.length; ++l) t[o.oids[c]].push(r.values[l].value);
    }
  }
  return t;
}
s.pkcs12FromAsn1 = function (e, t, n) {
  if ("string" == typeof t) {
    n = t;
    t = !0;
  } else {
    if (void 0 === t) {
      t = !0;
    }
  }
  var l = {};
  if (!i.validate(e, c, l, [])) throw (u = new Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.")).errors = u, u;
  var u;
  var p = {
    version: l.version.charCodeAt(0),
    safeContents: [],
    getBags: function (e) {
      var t;
      var n = {};
      if ("localKeyId" in e) {
        t = e.localKeyId;
      } else {
        if ("localKeyIdHex" in e) {
          t = r.util.hexToBytes(e.localKeyIdHex);
        }
      }
      if (void 0 === t && !("friendlyName" in e) && "bagType" in e) {
        n[e.bagType] = d(p.safeContents, null, null, e.bagType);
      }
      if (void 0 !== t) {
        n.localKeyId = d(p.safeContents, "localKeyId", t, e.bagType);
      }
      if ("friendlyName" in e) {
        n.friendlyName = d(p.safeContents, "friendlyName", e.friendlyName, e.bagType);
      }
      return n;
    },
    getBagsByFriendlyName: function (e, t) {
      return d(p.safeContents, "friendlyName", e, t);
    },
    getBagsByLocalKeyId: function (e, t) {
      return d(p.safeContents, "localKeyId", e, t);
    }
  };
  if (3 !== l.version.charCodeAt(0)) throw (u = new Error("PKCS#12 PFX of version other than 3 not supported.")).version = l.version.charCodeAt(0), u;
  if (i.derToOid(l.contentType) !== o.oids.data) throw (u = new Error("Only PKCS#12 PFX in password integrity mode supported.")).oid = i.derToOid(l.contentType), u;
  var g = l.content.value[0];
  if (g.tagClass !== i.Class.UNIVERSAL || g.type !== i.Type.OCTETSTRING) throw new Error("PKCS#12 authSafe content data is not an OCTET STRING.");
  g = h(g);
  if (l.mac) {
    var y = null,
      _ = 0,
      v = i.derToOid(l.macAlgorithm);
    switch (v) {
      case o.oids.sha1:
        y = r.md.sha1.create(), _ = 20;
        break;
      case o.oids.sha256:
        y = r.md.sha256.create(), _ = 32;
        break;
      case o.oids.sha384:
        y = r.md.sha384.create(), _ = 48;
        break;
      case o.oids.sha512:
        y = r.md.sha512.create(), _ = 64;
        break;
      case o.oids.md5:
        y = r.md.md5.create(), _ = 16;
    }
    if (null === y) throw new Error("PKCS#12 uses unsupported MAC algorithm: " + v);
    var b = new r.util.ByteBuffer(l.macSalt),
      E = "macIterations" in l ? parseInt(r.util.bytesToHex(l.macIterations), 16) : 1,
      w = s.generateKey(n, b, 3, E, _, y),
      T = r.hmac.create();
    if (T.start(y, w), T.update(g.value), T.getMac().getBytes() !== l.macDigest) throw new Error("PKCS#12 MAC could not be verified. Invalid password?");
  }
  (function (e, t, n, r) {
    if ((t = i.fromDer(t, n)).tagClass !== i.Class.UNIVERSAL || t.type !== i.Type.SEQUENCE || !0 !== t.constructed) throw new Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
    for (var s = 0; s < t.value.length; s++) {
      var c = t.value[s];
      var l = {};
      var u = [];
      if (!i.validate(c, a, l, u)) throw (y = new Error("Cannot read ContentInfo.")).errors = u, y;
      var p = {
        encrypted: !1
      };
      var d = null;
      var g = l.content.value[0];
      switch (i.derToOid(l.contentType)) {
        case o.oids.data:
          if (g.tagClass !== i.Class.UNIVERSAL || g.type !== i.Type.OCTETSTRING) throw new Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
          d = h(g).value;
          break;
        case o.oids.encryptedData:
          d = f(g, r);
          p.encrypted = !0;
          break;
        default:
          var y;
          throw (y = new Error("Unsupported PKCS#12 contentType.")).contentType = i.derToOid(l.contentType), y;
      }
      p.safeBags = m(d, n, r);
      e.safeContents.push(p);
    }
  })(p, g.value, t, n);
  return p;
};
s.toPkcs12Asn1 = function (e, t, n, a) {
  (a = a || {}).saltSize = a.saltSize || 8;
  a.count = a.count || 2048;
  a.algorithm = a.algorithm || a.encAlgorithm || "aes128";
  if ("useMac" in a) {
    a.useMac = !0;
  }
  if ("localKeyId" in a) {
    a.localKeyId = null;
  }
  if ("generateLocalKeyId" in a) {
    a.generateLocalKeyId = !0;
  }
  var c;
  var l = a.localKeyId;
  if (null !== l) l = r.util.hexToBytes(l);else if (a.generateLocalKeyId) if (t) {
    var u = r.util.isArray(t) ? t[0] : t;
    if ("string" == typeof u) {
      u = o.certificateFromPem(u);
    }
    (I = r.md.sha1.create()).update(i.toDer(o.certificateToAsn1(u)).getBytes());
    l = I.digest().getBytes();
  } else l = r.random.getBytes(20);
  var p = [];
  if (null !== l) {
    p.push(i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.localKeyId).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SET, !0, [i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, l)])]));
  }
  if ("friendlyName" in a) {
    p.push(i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.friendlyName).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SET, !0, [i.create(i.Class.UNIVERSAL, i.Type.BMPSTRING, !1, a.friendlyName)])]));
  }
  if (p.length > 0) {
    c = i.create(i.Class.UNIVERSAL, i.Type.SET, !0, p);
  }
  var d = [];
  var h = [];
  if (null !== t) {
    h = r.util.isArray(t) ? t : [t];
  }
  for (f = [], m = 0, void 0; m < h.length; ++m) {
    var f;
    var m;
    if ("string" == typeof (t = h[m])) {
      t = o.certificateFromPem(t);
    }
    var g = 0 === m ? c : void 0;
    var y = o.certificateToAsn1(t);
    var _ = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.certBag).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.x509Certificate).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, i.toDer(y).getBytes())])])]), g]);
    f.push(_);
  }
  if (f.length > 0) {
    var v = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, f);
    var b = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.data).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, i.toDer(v).getBytes())])]);
    d.push(b);
  }
  var E = null;
  if (null !== e) {
    var w = o.wrapRsaPrivateKey(o.privateKeyToAsn1(e));
    E = null === n ? i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.keyBag).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [w]), c]) : i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.pkcs8ShroudedKeyBag).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [o.encryptPrivateKeyInfo(w, n, a)]), c]);
    var T = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [E]);
    var S = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.data).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, i.toDer(T).getBytes())])]);
    d.push(S);
  }
  var x;
  var C = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, d);
  if (a.useMac) {
    var I = r.md.sha1.create();
    var A = new r.util.ByteBuffer(r.random.getBytes(a.saltSize));
    var k = a.count;
    var P = (e = s.generateKey(n, A, 3, k, 20), r.hmac.create());
    P.start(I, e);
    P.update(i.toDer(C).getBytes());
    var N = P.getMac();
    x = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.sha1).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")]), i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, N.getBytes())]), i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, A.getBytes()), i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(k).getBytes())]);
  }
  return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(3).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.oids.data).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, i.toDer(C).getBytes())])]), x]);
};
s.generateKey = r.pbe.generatePkcs12Key;