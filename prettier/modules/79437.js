var r = require(3832);
require(8925);
require(3068);
require(33480);
require(66270);
require(26953);
require(95496);
require(49563);
require(97116);
require(25414);
var i = r.asn1;
var o = module.exports = r.pkcs7 = r.pkcs7 || {};
function s(e) {
  var t = {};
  var n = [];
  if (!i.validate(e, o.asn1.recipientInfoValidator, t, n)) {
    var s = new Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
    throw s.errors = n, s;
  }
  return {
    version: t.version.charCodeAt(0),
    issuer: r.pki.RDNAttributesAsArray(t.issuer),
    serialNumber: r.util.createBuffer(t.serial).toHex(),
    encryptedContent: {
      algorithm: i.derToOid(t.encAlgorithm),
      parameter: t.encParameter ? t.encParameter.value : void 0,
      content: t.encKey
    }
  };
}
function a(e) {
  for (n = [], o = 0, void 0; o < e.length; ++o) {
    var t;
    var n;
    var o;
    n.push((t = e[o], i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(t.version).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [r.pki.distinguishedNameToAsn1({
      attributes: t.issuer
    }), i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, r.util.hexToBytes(t.serialNumber))]), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(t.encryptedContent.algorithm).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")]), i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, t.encryptedContent.content)])));
  }
  return n;
}
function c(e) {
  var t = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(e.version).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [r.pki.distinguishedNameToAsn1({
    attributes: e.issuer
  }), i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, r.util.hexToBytes(e.serialNumber))]), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.digestAlgorithm).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")])]);
  if (e.authenticatedAttributesAsn1) {
    t.value.push(e.authenticatedAttributesAsn1);
  }
  t.value.push(i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.signatureAlgorithm).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")]));
  t.value.push(i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, e.signature));
  if (e.unauthenticatedAttributes.length > 0) {
    for (var n = i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, []), o = 0; o < e.unauthenticatedAttributes.length; ++o) {
      var s = e.unauthenticatedAttributes[o];
      n.values.push(l(s));
    }
    t.value.push(n);
  }
  return t;
}
function l(e) {
  var t;
  if (e.type === r.pki.oids.contentType) t = i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.value).getBytes());else if (e.type === r.pki.oids.messageDigest) t = i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, e.value.bytes());else if (e.type === r.pki.oids.signingTime) {
    var n = new Date("1950-01-01T00:00:00Z");
    var o = new Date("2050-01-01T00:00:00Z");
    var s = e.value;
    if ("string" == typeof s) {
      var a = Date.parse(s);
      s = isNaN(a) ? 13 === s.length ? i.utcTimeToDate(s) : i.generalizedTimeToDate(s) : new Date(a);
    }
    t = s >= n && s < o ? i.create(i.Class.UNIVERSAL, i.Type.UTCTIME, !1, i.dateToUtcTime(s)) : i.create(i.Class.UNIVERSAL, i.Type.GENERALIZEDTIME, !1, i.dateToGeneralizedTime(s));
  }
  return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.type).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SET, !0, [t])]);
}
function u(e, t, n) {
  var o = {};
  if (!i.validate(t, n, o, [])) {
    var s = new Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
    throw s.errors = s, s;
  }
  if (i.derToOid(o.contentType) !== r.pki.oids.data) throw new Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
  if (o.encryptedContent) {
    var a = "";
    if (r.util.isArray(o.encryptedContent)) for (var c = 0; c < o.encryptedContent.length; ++c) {
      if (o.encryptedContent[c].type !== i.Type.OCTETSTRING) throw new Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
      a += o.encryptedContent[c].value;
    } else a = o.encryptedContent;
    e.encryptedContent = {
      algorithm: i.derToOid(o.encAlgorithm),
      parameter: r.util.createBuffer(o.encParameter.value),
      content: r.util.createBuffer(a)
    };
  }
  if (o.content) {
    a = "";
    if (r.util.isArray(o.content)) for (c = 0; c < o.content.length; ++c) {
      if (o.content[c].type !== i.Type.OCTETSTRING) throw new Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
      a += o.content[c].value;
    } else a = o.content;
    e.content = r.util.createBuffer(a);
  }
  e.version = o.version.charCodeAt(0);
  e.rawCapture = o;
  return o;
}
function p(e) {
  if (void 0 === e.encryptedContent.key) throw new Error("Symmetric key not available.");
  if (void 0 === e.content) {
    var t;
    switch (e.encryptedContent.algorithm) {
      case r.pki.oids["aes128-CBC"]:
      case r.pki.oids["aes192-CBC"]:
      case r.pki.oids["aes256-CBC"]:
        t = r.aes.createDecryptionCipher(e.encryptedContent.key);
        break;
      case r.pki.oids.desCBC:
      case r.pki.oids["des-EDE3-CBC"]:
        t = r.des.createDecryptionCipher(e.encryptedContent.key);
        break;
      default:
        throw new Error("Unsupported symmetric cipher, OID " + e.encryptedContent.algorithm);
    }
    t.start(e.encryptedContent.parameter);
    t.update(e.encryptedContent.content);
    if (!t.finish()) throw new Error("Symmetric decryption failed.");
    e.content = t.output;
  }
}
o.messageFromPem = function (e) {
  var t = r.pem.decode(e)[0];
  if ("PKCS7" !== t.type) {
    var n = new Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".');
    throw n.headerType = t.type, n;
  }
  if (t.procType && "ENCRYPTED" === t.procType.type) throw new Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
  var s = i.fromDer(t.body);
  return o.messageFromAsn1(s);
};
o.messageToPem = function (e, t) {
  var n = {
    type: "PKCS7",
    body: i.toDer(e.toAsn1()).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};
o.messageFromAsn1 = function (e) {
  var t = {};
  var n = [];
  if (!i.validate(e, o.asn1.contentInfoValidator, t, n)) {
    var s = new Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
    throw s.errors = n, s;
  }
  var a;
  var c = i.derToOid(t.contentType);
  switch (c) {
    case r.pki.oids.envelopedData:
      a = o.createEnvelopedData();
      break;
    case r.pki.oids.encryptedData:
      a = o.createEncryptedData();
      break;
    case r.pki.oids.signedData:
      a = o.createSignedData();
      break;
    default:
      throw new Error("Cannot read PKCS#7 message. ContentType with OID " + c + " is not (yet) supported.");
  }
  a.fromAsn1(t.content.value[0]);
  return a;
};
o.createSignedData = function () {
  var e = null;
  return e = {
    type: r.pki.oids.signedData,
    version: 1,
    certificates: [],
    crls: [],
    signers: [],
    digestAlgorithmIdentifiers: [],
    contentInfo: null,
    signerInfos: [],
    fromAsn1: function (t) {
      u(e, t, o.asn1.signedDataValidator);
      e.certificates = [];
      e.crls = [];
      e.digestAlgorithmIdentifiers = [];
      e.contentInfo = null;
      e.signerInfos = [];
      if (e.rawCapture.certificates) for (var n = e.rawCapture.certificates.value, i = 0; i < n.length; ++i) e.certificates.push(r.pki.certificateFromAsn1(n[i]));
    },
    toAsn1: function () {
      if (e.contentInfo) {
        e.sign();
      }
      for (t = [], n = 0, void 0; n < e.certificates.length; ++n) {
        var t;
        var n;
        t.push(r.pki.certificateToAsn1(e.certificates[n]));
      }
      var o = [];
      var s = i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(e.version).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SET, !0, e.digestAlgorithmIdentifiers), e.contentInfo])]);
      if (t.length > 0) {
        s.value[0].value.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, t));
      }
      if (o.length > 0) {
        s.value[0].value.push(i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, o));
      }
      s.value[0].value.push(i.create(i.Class.UNIVERSAL, i.Type.SET, !0, e.signerInfos));
      return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.type).getBytes()), s]);
    },
    addSigner: function (t) {
      var n = t.issuer;
      var i = t.serialNumber;
      if (t.certificate) {
        var o = t.certificate;
        if ("string" == typeof o) {
          o = r.pki.certificateFromPem(o);
        }
        n = o.issuer.attributes;
        i = o.serialNumber;
      }
      var s = t.key;
      if (!s) throw new Error("Could not add PKCS#7 signer; no private key specified.");
      if ("string" == typeof s) {
        s = r.pki.privateKeyFromPem(s);
      }
      var a = t.digestAlgorithm || r.pki.oids.sha1;
      switch (a) {
        case r.pki.oids.sha1:
        case r.pki.oids.sha256:
        case r.pki.oids.sha384:
        case r.pki.oids.sha512:
        case r.pki.oids.md5:
          break;
        default:
          throw new Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + a);
      }
      var c = t.authenticatedAttributes || [];
      if (c.length > 0) {
        for (l = !1, u = !1, p = 0, void 0; p < c.length; ++p) {
          var l;
          var u;
          var p;
          var d = c[p];
          if (l || d.type !== r.pki.oids.contentType) {
            if (u || d.type !== r.pki.oids.messageDigest) ;else {
              u = !0;
              if (l) break;
            }
          } else {
            l = !0;
            if (u) break;
          }
        }
        if (!l || !u) throw new Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.");
      }
      e.signers.push({
        key: s,
        version: 1,
        issuer: n,
        serialNumber: i,
        digestAlgorithm: a,
        signatureAlgorithm: r.pki.oids.rsaEncryption,
        signature: null,
        authenticatedAttributes: c,
        unauthenticatedAttributes: []
      });
    },
    sign: function (t) {
      var n;
      t = t || {};
      if ("object" != typeof e.content || null === e.contentInfo) {
        e.contentInfo = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(r.pki.oids.data).getBytes())]);
        if ("content" in e) {
          if (e.content instanceof r.util.ByteBuffer) {
            n = e.content.bytes();
          } else {
            if ("string" == typeof e.content) {
              n = r.util.encodeUtf8(e.content);
            }
          }
          if (t.detached) {
            e.detachedContent = i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, n);
          } else {
            e.contentInfo.value.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, n)]));
          }
        }
      }
      if (0 !== e.signers.length) {
        (function (t) {
          var n;
          if (!(n = e.detachedContent ? e.detachedContent : (n = e.contentInfo.value[1]).value[0])) throw new Error("Could not sign PKCS#7 message; there is no content to sign.");
          var o = i.derToOid(e.contentInfo.value[0].value);
          var s = i.toDer(n);
          for (var a in s.getByte(), i.getBerValueLength(s), s = s.getBytes(), t) t[a].start().update(s);
          for (u = new Date(), p = 0, void 0; p < e.signers.length; ++p) {
            var u;
            var p;
            var d = e.signers[p];
            if (0 === d.authenticatedAttributes.length) {
              if (o !== r.pki.oids.data) throw new Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.");
            } else {
              d.authenticatedAttributesAsn1 = i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, []);
              for (h = i.create(i.Class.UNIVERSAL, i.Type.SET, !0, []), f = 0, void 0; f < d.authenticatedAttributes.length; ++f) {
                var h;
                var f;
                var m = d.authenticatedAttributes[f];
                if (m.type === r.pki.oids.messageDigest) {
                  m.value = t[d.digestAlgorithm].digest();
                } else {
                  if (m.type === r.pki.oids.signingTime) {
                    if (m.value) {
                      m.value = u;
                    }
                  }
                }
                h.value.push(l(m));
                d.authenticatedAttributesAsn1.value.push(l(m));
              }
              s = i.toDer(h).getBytes();
              d.md.start().update(s);
            }
            d.signature = d.key.sign(d.md, "RSASSA-PKCS1-V1_5");
          }
          e.signerInfos = function (e) {
            for (t = [], n = 0, void 0; n < e.length; ++n) {
              var t;
              var n;
              t.push(c(e[n]));
            }
            return t;
          }(e.signers);
        })(function () {
          for (t = {}, n = 0, void 0; n < e.signers.length; ++n) {
            var t;
            var n;
            var o = e.signers[n];
            if ((s = o.digestAlgorithm) in t) {
              t[s] = r.md[r.pki.oids[s]].create();
            }
            if (0 === o.authenticatedAttributes.length) {
              o.md = t[s];
            } else {
              o.md = r.md[r.pki.oids[s]].create();
            }
          }
          for (var s in e.digestAlgorithmIdentifiers = [], t) e.digestAlgorithmIdentifiers.push(i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(s).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")]));
          return t;
        }());
      }
    },
    verify: function () {
      throw new Error("PKCS#7 signature verification not yet implemented.");
    },
    addCertificate: function (t) {
      if ("string" == typeof t) {
        t = r.pki.certificateFromPem(t);
      }
      e.certificates.push(t);
    },
    addCertificateRevokationList: function (e) {
      throw new Error("PKCS#7 CRL support not yet implemented.");
    }
  };
};
o.createEncryptedData = function () {
  var e = null;
  return e = {
    type: r.pki.oids.encryptedData,
    version: 0,
    encryptedContent: {
      algorithm: r.pki.oids["aes256-CBC"]
    },
    fromAsn1: function (t) {
      u(e, t, o.asn1.encryptedDataValidator);
    },
    decrypt: function (t) {
      if (void 0 !== t) {
        e.encryptedContent.key = t;
      }
      p(e);
    }
  };
};
o.createEnvelopedData = function () {
  var e = null;
  return e = {
    type: r.pki.oids.envelopedData,
    version: 0,
    recipients: [],
    encryptedContent: {
      algorithm: r.pki.oids["aes256-CBC"]
    },
    fromAsn1: function (t) {
      var n = u(e, t, o.asn1.envelopedDataValidator);
      e.recipients = function (e) {
        for (t = [], n = 0, void 0; n < e.length; ++n) {
          var t;
          var n;
          t.push(s(e[n]));
        }
        return t;
      }(n.recipientInfos.value);
    },
    toAsn1: function () {
      return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.type).getBytes()), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(e.version).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SET, !0, a(e.recipients)), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, (t = e.encryptedContent, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(r.pki.oids.data).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(t.algorithm).getBytes()), t.parameter ? i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, t.parameter.getBytes()) : void 0]), i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, t.content.getBytes())])]))])])]);
      var t;
    },
    findRecipient: function (t) {
      for (n = t.issuer.attributes, r = 0, void 0; r < e.recipients.length; ++r) {
        var n;
        var r;
        var i = e.recipients[r];
        var o = i.issuer;
        if (i.serialNumber === t.serialNumber && o.length === n.length) {
          for (s = !0, a = 0, void 0; a < n.length; ++a) {
            var s;
            var a;
            if (o[a].type !== n[a].type || o[a].value !== n[a].value) {
              s = !1;
              break;
            }
          }
          if (s) return i;
        }
      }
      return null;
    },
    decrypt: function (t, n) {
      if (void 0 === e.encryptedContent.key && void 0 !== t && void 0 !== n) switch (t.encryptedContent.algorithm) {
        case r.pki.oids.rsaEncryption:
        case r.pki.oids.desCBC:
          var i = n.decrypt(t.encryptedContent.content);
          e.encryptedContent.key = r.util.createBuffer(i);
          break;
        default:
          throw new Error("Unsupported asymmetric cipher, OID " + t.encryptedContent.algorithm);
      }
      p(e);
    },
    addRecipient: function (t) {
      e.recipients.push({
        version: 0,
        issuer: t.issuer.attributes,
        serialNumber: t.serialNumber,
        encryptedContent: {
          algorithm: r.pki.oids.rsaEncryption,
          key: t.publicKey
        }
      });
    },
    encrypt: function (t, n) {
      if (void 0 === e.encryptedContent.content) {
        var i;
        var o;
        var s;
        switch (n = n || e.encryptedContent.algorithm, t = t || e.encryptedContent.key, n) {
          case r.pki.oids["aes128-CBC"]:
            i = 16;
            o = 16;
            s = r.aes.createEncryptionCipher;
            break;
          case r.pki.oids["aes192-CBC"]:
            i = 24;
            o = 16;
            s = r.aes.createEncryptionCipher;
            break;
          case r.pki.oids["aes256-CBC"]:
            i = 32;
            o = 16;
            s = r.aes.createEncryptionCipher;
            break;
          case r.pki.oids["des-EDE3-CBC"]:
            i = 24;
            o = 8;
            s = r.des.createEncryptionCipher;
            break;
          default:
            throw new Error("Unsupported symmetric cipher, OID " + n);
        }
        if (void 0 === t) t = r.util.createBuffer(r.random.getBytes(i));else if (t.length() != i) throw new Error("Symmetric key has wrong length; got " + t.length() + " bytes, expected " + i + ".");
        e.encryptedContent.algorithm = n;
        e.encryptedContent.key = t;
        e.encryptedContent.parameter = r.util.createBuffer(r.random.getBytes(o));
        var a = s(t);
        a.start(e.encryptedContent.parameter.copy());
        a.update(e.content);
        if (!a.finish()) throw new Error("Symmetric encryption failed.");
        e.encryptedContent.content = a.output;
      }
      for (var c = 0; c < e.recipients.length; ++c) {
        var l = e.recipients[c];
        if (void 0 === l.encryptedContent.content) {
          if (l.encryptedContent.algorithm !== r.pki.oids.rsaEncryption) throw new Error("Unsupported asymmetric cipher, OID " + l.encryptedContent.algorithm);
          l.encryptedContent.content = l.encryptedContent.key.encrypt(e.encryptedContent.key.data);
        }
      }
    }
  };
};