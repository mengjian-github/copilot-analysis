var r = require(3832);
require(8925);
require(3068);
require(33480);
require(28991);
require(86971);
require(66270);
require(26953);
require(96007);
require(28095);
require(97116);
var i = r.asn1;
var o = module.exports = r.pki = r.pki || {};
var s = o.oids;
var a = {};
a.CN = s.commonName;
a.commonName = "CN";
a.C = s.countryName;
a.countryName = "C";
a.L = s.localityName;
a.localityName = "L";
a.ST = s.stateOrProvinceName;
a.stateOrProvinceName = "ST";
a.O = s.organizationName;
a.organizationName = "O";
a.OU = s.organizationalUnitName;
a.organizationalUnitName = "OU";
a.E = s.emailAddress;
a.emailAddress = "E";
var c = r.pki.rsa.publicKeyValidator;
var l = {
  name: "Certificate",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "Certificate.TBSCertificate",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    captureAsn1: "tbsCertificate",
    value: [{
      name: "Certificate.TBSCertificate.version",
      tagClass: i.Class.CONTEXT_SPECIFIC,
      type: 0,
      constructed: !0,
      optional: !0,
      value: [{
        name: "Certificate.TBSCertificate.version.integer",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.INTEGER,
        constructed: !1,
        capture: "certVersion"
      }]
    }, {
      name: "Certificate.TBSCertificate.serialNumber",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.INTEGER,
      constructed: !1,
      capture: "certSerialNumber"
    }, {
      name: "Certificate.TBSCertificate.signature",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "Certificate.TBSCertificate.signature.algorithm",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.OID,
        constructed: !1,
        capture: "certinfoSignatureOid"
      }, {
        name: "Certificate.TBSCertificate.signature.parameters",
        tagClass: i.Class.UNIVERSAL,
        optional: !0,
        captureAsn1: "certinfoSignatureParams"
      }]
    }, {
      name: "Certificate.TBSCertificate.issuer",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "certIssuer"
    }, {
      name: "Certificate.TBSCertificate.validity",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "Certificate.TBSCertificate.validity.notBefore (utc)",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.UTCTIME,
        constructed: !1,
        optional: !0,
        capture: "certValidity1UTCTime"
      }, {
        name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.GENERALIZEDTIME,
        constructed: !1,
        optional: !0,
        capture: "certValidity2GeneralizedTime"
      }, {
        name: "Certificate.TBSCertificate.validity.notAfter (utc)",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.UTCTIME,
        constructed: !1,
        optional: !0,
        capture: "certValidity3UTCTime"
      }, {
        name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.GENERALIZEDTIME,
        constructed: !1,
        optional: !0,
        capture: "certValidity4GeneralizedTime"
      }]
    }, {
      name: "Certificate.TBSCertificate.subject",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "certSubject"
    }, c, {
      name: "Certificate.TBSCertificate.issuerUniqueID",
      tagClass: i.Class.CONTEXT_SPECIFIC,
      type: 1,
      constructed: !0,
      optional: !0,
      value: [{
        name: "Certificate.TBSCertificate.issuerUniqueID.id",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.BITSTRING,
        constructed: !1,
        captureBitStringValue: "certIssuerUniqueId"
      }]
    }, {
      name: "Certificate.TBSCertificate.subjectUniqueID",
      tagClass: i.Class.CONTEXT_SPECIFIC,
      type: 2,
      constructed: !0,
      optional: !0,
      value: [{
        name: "Certificate.TBSCertificate.subjectUniqueID.id",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.BITSTRING,
        constructed: !1,
        captureBitStringValue: "certSubjectUniqueId"
      }]
    }, {
      name: "Certificate.TBSCertificate.extensions",
      tagClass: i.Class.CONTEXT_SPECIFIC,
      type: 3,
      constructed: !0,
      captureAsn1: "certExtensions",
      optional: !0
    }]
  }, {
    name: "Certificate.signatureAlgorithm",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "Certificate.signatureAlgorithm.algorithm",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OID,
      constructed: !1,
      capture: "certSignatureOid"
    }, {
      name: "Certificate.TBSCertificate.signature.parameters",
      tagClass: i.Class.UNIVERSAL,
      optional: !0,
      captureAsn1: "certSignatureParams"
    }]
  }, {
    name: "Certificate.signatureValue",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.BITSTRING,
    constructed: !1,
    captureBitStringValue: "certSignature"
  }]
};
var u = {
  name: "rsapss",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "rsapss.hashAlgorithm",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 0,
    constructed: !0,
    value: [{
      name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
      tagClass: i.Class.UNIVERSAL,
      type: i.Class.SEQUENCE,
      constructed: !0,
      optional: !0,
      value: [{
        name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.OID,
        constructed: !1,
        capture: "hashOid"
      }]
    }]
  }, {
    name: "rsapss.maskGenAlgorithm",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 1,
    constructed: !0,
    value: [{
      name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
      tagClass: i.Class.UNIVERSAL,
      type: i.Class.SEQUENCE,
      constructed: !0,
      optional: !0,
      value: [{
        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.OID,
        constructed: !1,
        capture: "maskGenOid"
      }, {
        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
          tagClass: i.Class.UNIVERSAL,
          type: i.Type.OID,
          constructed: !1,
          capture: "maskGenHashOid"
        }]
      }]
    }]
  }, {
    name: "rsapss.saltLength",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 2,
    optional: !0,
    value: [{
      name: "rsapss.saltLength.saltLength",
      tagClass: i.Class.UNIVERSAL,
      type: i.Class.INTEGER,
      constructed: !1,
      capture: "saltLength"
    }]
  }, {
    name: "rsapss.trailerField",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 3,
    optional: !0,
    value: [{
      name: "rsapss.trailer.trailer",
      tagClass: i.Class.UNIVERSAL,
      type: i.Class.INTEGER,
      constructed: !1,
      capture: "trailer"
    }]
  }]
};
var p = {
  name: "CertificationRequestInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  captureAsn1: "certificationRequestInfo",
  value: [{
    name: "CertificationRequestInfo.integer",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1,
    capture: "certificationRequestInfoVersion"
  }, {
    name: "CertificationRequestInfo.subject",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    captureAsn1: "certificationRequestInfoSubject"
  }, c, {
    name: "CertificationRequestInfo.attributes",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 0,
    constructed: !0,
    optional: !0,
    capture: "certificationRequestInfoAttributes",
    value: [{
      name: "CertificationRequestInfo.attributes",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "CertificationRequestInfo.attributes.type",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.OID,
        constructed: !1
      }, {
        name: "CertificationRequestInfo.attributes.value",
        tagClass: i.Class.UNIVERSAL,
        type: i.Type.SET,
        constructed: !0
      }]
    }]
  }]
};
var d = {
  name: "CertificationRequest",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  captureAsn1: "csr",
  value: [p, {
    name: "CertificationRequest.signatureAlgorithm",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "CertificationRequest.signatureAlgorithm.algorithm",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OID,
      constructed: !1,
      capture: "csrSignatureOid"
    }, {
      name: "CertificationRequest.signatureAlgorithm.parameters",
      tagClass: i.Class.UNIVERSAL,
      optional: !0,
      captureAsn1: "csrSignatureParams"
    }]
  }, {
    name: "CertificationRequest.signature",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.BITSTRING,
    constructed: !1,
    captureBitStringValue: "csrSignature"
  }]
};
function h(e, t) {
  if ("string" == typeof t) {
    t = {
      shortName: t
    };
  }
  for (r = null, i = 0, void 0; null === r && i < e.attributes.length; ++i) {
    var n;
    var r;
    var i;
    n = e.attributes[i];
    if (t.type && t.type === n.type || t.name && t.name === n.name || t.shortName && t.shortName === n.shortName) {
      r = n;
    }
  }
  return r;
}
o.RDNAttributesAsArray = function (e, t) {
  for (c = [], l = 0, void 0; l < e.value.length; ++l) {
    var n;
    var r;
    var o;
    var c;
    var l;
    n = e.value[l];
    for (var u = 0; u < n.value.length; ++u) {
      o = {};
      r = n.value[u];
      o.type = i.derToOid(r.value[0].value);
      o.value = r.value[1].value;
      o.valueTagClass = r.value[1].type;
      if (o.type in s) {
        o.name = s[o.type];
        if (o.name in a) {
          o.shortName = a[o.name];
        }
      }
      if (t) {
        t.update(o.type);
        t.update(o.value);
      }
      c.push(o);
    }
  }
  return c;
};
o.CRIAttributesAsArray = function (e) {
  for (t = [], n = 0, void 0; n < e.length; ++n) {
    var t;
    var n;
    for (r = e[n], c = i.derToOid(r.value[0].value), l = r.value[1].value, u = 0, void 0; u < l.length; ++u) {
      var r;
      var c;
      var l;
      var u;
      var p = {};
      p.type = c;
      p.value = l[u].value;
      p.valueTagClass = l[u].type;
      if (p.type in s) {
        p.name = s[p.type];
        if (p.name in a) {
          p.shortName = a[p.name];
        }
      }
      if (p.type === s.extensionRequest) {
        p.extensions = [];
        for (var d = 0; d < p.value.length; ++d) p.extensions.push(o.certificateExtensionFromAsn1(p.value[d]));
      }
      t.push(p);
    }
  }
  return t;
};
var f = function (e, t, n) {
  var r = {};
  if (e !== s["RSASSA-PSS"]) return r;
  if (n) {
    r = {
      hash: {
        algorithmOid: s.sha1
      },
      mgf: {
        algorithmOid: s.mgf1,
        hash: {
          algorithmOid: s.sha1
        }
      },
      saltLength: 20
    };
  }
  var o = {};
  var a = [];
  if (!i.validate(t, u, o, a)) {
    var c = new Error("Cannot read RSASSA-PSS parameter block.");
    throw c.errors = a, c;
  }
  if (void 0 !== o.hashOid) {
    r.hash = r.hash || {};
    r.hash.algorithmOid = i.derToOid(o.hashOid);
  }
  if (void 0 !== o.maskGenOid) {
    r.mgf = r.mgf || {};
    r.mgf.algorithmOid = i.derToOid(o.maskGenOid);
    r.mgf.hash = r.mgf.hash || {};
    r.mgf.hash.algorithmOid = i.derToOid(o.maskGenHashOid);
  }
  if (void 0 !== o.saltLength) {
    r.saltLength = o.saltLength.charCodeAt(0);
  }
  return r;
};
var m = function (e) {
  switch (s[e.signatureOid]) {
    case "sha1WithRSAEncryption":
    case "sha1WithRSASignature":
      return r.md.sha1.create();
    case "md5WithRSAEncryption":
      return r.md.md5.create();
    case "sha256WithRSAEncryption":
    case "RSASSA-PSS":
      return r.md.sha256.create();
    case "sha384WithRSAEncryption":
      return r.md.sha384.create();
    case "sha512WithRSAEncryption":
      return r.md.sha512.create();
    default:
      var t = new Error("Could not compute " + e.type + " digest. Unknown signature OID.");
      throw t.signatureOid = e.signatureOid, t;
  }
};
var g = function (e) {
  var t;
  var n = e.certificate;
  switch (n.signatureOid) {
    case s.sha1WithRSAEncryption:
    case s.sha1WithRSASignature:
      break;
    case s["RSASSA-PSS"]:
      var i;
      var o;
      var a;
      if (void 0 === (i = s[n.signatureParameters.mgf.hash.algorithmOid]) || void 0 === r.md[i]) throw (a = new Error("Unsupported MGF hash function.")).oid = n.signatureParameters.mgf.hash.algorithmOid, a.name = i, a;
      if (void 0 === (o = s[n.signatureParameters.mgf.algorithmOid]) || void 0 === r.mgf[o]) throw (a = new Error("Unsupported MGF function.")).oid = n.signatureParameters.mgf.algorithmOid, a.name = o, a;
      o = r.mgf[o].create(r.md[i].create());
      if (void 0 === (i = s[n.signatureParameters.hash.algorithmOid]) || void 0 === r.md[i]) throw (a = new Error("Unsupported RSASSA-PSS hash function.")).oid = n.signatureParameters.hash.algorithmOid, a.name = i, a;
      t = r.pss.create(r.md[i].create(), o, n.signatureParameters.saltLength);
  }
  return n.publicKey.verify(e.md.digest().getBytes(), e.signature, t);
};
function y(e) {
  for (o = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []), s = e.attributes, a = 0, void 0; a < s.length; ++a) {
    var t;
    var n;
    var o;
    var s;
    var a;
    var c = (t = s[a]).value;
    var l = i.Type.PRINTABLESTRING;
    if ("valueTagClass" in t && (l = t.valueTagClass) === i.Type.UTF8) {
      c = r.util.encodeUtf8(c);
    }
    n = i.create(i.Class.UNIVERSAL, i.Type.SET, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(t.type).getBytes()), i.create(i.Class.UNIVERSAL, l, !1, c)])]);
    o.value.push(n);
  }
  return o;
}
function _(e) {
  for (n = 0, void 0; n < e.length; ++n) {
    var t;
    var n;
    if (void 0 === (t = e[n]).name) {
      if (t.type && t.type in o.oids) {
        t.name = o.oids[t.type];
      } else {
        if (t.shortName && t.shortName in a) {
          t.name = o.oids[a[t.shortName]];
        }
      }
    }
    if (void 0 === t.type) {
      if (!t.name || !(t.name in o.oids)) throw (c = new Error("Attribute type not specified.")).attribute = t, c;
      t.type = o.oids[t.name];
    }
    if (void 0 === t.shortName && t.name && t.name in a) {
      t.shortName = a[t.name];
    }
    if (t.type === s.extensionRequest && (t.valueConstructed = !0, t.valueTagClass = i.Type.SEQUENCE, !t.value && t.extensions)) {
      t.value = [];
      for (var r = 0; r < t.extensions.length; ++r) t.value.push(o.certificateExtensionToAsn1(v(t.extensions[r])));
    }
    var c;
    if (void 0 === t.value) throw (c = new Error("Attribute value not specified.")).attribute = t, c;
  }
}
function v(e, t) {
  t = t || {};
  if (void 0 === e.name && e.id && e.id in o.oids) {
    e.name = o.oids[e.id];
  }
  if (void 0 === e.id) {
    if (!e.name || !(e.name in o.oids)) throw (E = new Error("Extension ID not specified.")).extension = e, E;
    e.id = o.oids[e.name];
  }
  if (void 0 !== e.value) return e;
  if ("keyUsage" === e.name) {
    var n = 0;
    var a = 0;
    var c = 0;
    if (e.digitalSignature) {
      a |= 128;
      n = 7;
    }
    if (e.nonRepudiation) {
      a |= 64;
      n = 6;
    }
    if (e.keyEncipherment) {
      a |= 32;
      n = 5;
    }
    if (e.dataEncipherment) {
      a |= 16;
      n = 4;
    }
    if (e.keyAgreement) {
      a |= 8;
      n = 3;
    }
    if (e.keyCertSign) {
      a |= 4;
      n = 2;
    }
    if (e.cRLSign) {
      a |= 2;
      n = 1;
    }
    if (e.encipherOnly) {
      a |= 1;
      n = 0;
    }
    if (e.decipherOnly) {
      c |= 128;
      n = 7;
    }
    var l = String.fromCharCode(n);
    if (0 !== c) {
      l += String.fromCharCode(a) + String.fromCharCode(c);
    } else {
      if (0 !== a) {
        l += String.fromCharCode(a);
      }
    }
    e.value = i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, l);
  } else if ("basicConstraints" === e.name) {
    e.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
    if (e.cA) {
      e.value.value.push(i.create(i.Class.UNIVERSAL, i.Type.BOOLEAN, !1, String.fromCharCode(255)));
    }
    if ("pathLenConstraint" in e) {
      e.value.value.push(i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(e.pathLenConstraint).getBytes()));
    }
  } else if ("extKeyUsage" === e.name) {
    e.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
    var u = e.value.value;
    for (var p in e) if (!0 === e[p]) {
      if (p in s) {
        u.push(i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(s[p]).getBytes()));
      } else {
        if (-1 !== p.indexOf(".")) {
          u.push(i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(p).getBytes()));
        }
      }
    }
  } else if ("nsCertType" === e.name) {
    n = 0;
    a = 0;
    if (e.client) {
      a |= 128;
      n = 7;
    }
    if (e.server) {
      a |= 64;
      n = 6;
    }
    if (e.email) {
      a |= 32;
      n = 5;
    }
    if (e.objsign) {
      a |= 16;
      n = 4;
    }
    if (e.reserved) {
      a |= 8;
      n = 3;
    }
    if (e.sslCA) {
      a |= 4;
      n = 2;
    }
    if (e.emailCA) {
      a |= 2;
      n = 1;
    }
    if (e.objCA) {
      a |= 1;
      n = 0;
    }
    l = String.fromCharCode(n);
    if (0 !== a) {
      l += String.fromCharCode(a);
    }
    e.value = i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, l);
  } else if ("subjectAltName" === e.name || "issuerAltName" === e.name) {
    e.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
    for (var d = 0; d < e.altNames.length; ++d) {
      l = (_ = e.altNames[d]).value;
      if (7 === _.type && _.ip) {
        if (null === (l = r.util.bytesFromIP(_.ip))) throw (E = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.')).extension = e, E;
      } else 8 === _.type && (l = _.oid ? i.oidToDer(i.oidToDer(_.oid)) : i.oidToDer(l));
      e.value.value.push(i.create(i.Class.CONTEXT_SPECIFIC, _.type, !1, l));
    }
  } else if ("nsComment" === e.name && t.cert) {
    if (!/^[\x00-\x7F]*$/.test(e.comment) || e.comment.length < 1 || e.comment.length > 128) throw new Error('Invalid "nsComment" content.');
    e.value = i.create(i.Class.UNIVERSAL, i.Type.IA5STRING, !1, e.comment);
  } else if ("subjectKeyIdentifier" === e.name && t.cert) {
    var h = t.cert.generateSubjectKeyIdentifier();
    e.subjectKeyIdentifier = h.toHex();
    e.value = i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, h.getBytes());
  } else if ("authorityKeyIdentifier" === e.name && t.cert) {
    e.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
    u = e.value.value;
    if (e.keyIdentifier) {
      var f = !0 === e.keyIdentifier ? t.cert.generateSubjectKeyIdentifier().getBytes() : e.keyIdentifier;
      u.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !1, f));
    }
    if (e.authorityCertIssuer) {
      var m = [i.create(i.Class.CONTEXT_SPECIFIC, 4, !0, [y(!0 === e.authorityCertIssuer ? t.cert.issuer : e.authorityCertIssuer)])];
      u.push(i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, m));
    }
    if (e.serialNumber) {
      var g = r.util.hexToBytes(!0 === e.serialNumber ? t.cert.serialNumber : e.serialNumber);
      u.push(i.create(i.Class.CONTEXT_SPECIFIC, 2, !1, g));
    }
  } else if ("cRLDistributionPoints" === e.name) {
    e.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
    u = e.value.value;
    var _;
    var v = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
    var b = i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, []);
    for (d = 0; d < e.altNames.length; ++d) {
      l = (_ = e.altNames[d]).value;
      if (7 === _.type && _.ip) {
        if (null === (l = r.util.bytesFromIP(_.ip))) throw (E = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.')).extension = e, E;
      } else 8 === _.type && (l = _.oid ? i.oidToDer(i.oidToDer(_.oid)) : i.oidToDer(l));
      b.value.push(i.create(i.Class.CONTEXT_SPECIFIC, _.type, !1, l));
    }
    v.value.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [b]));
    u.push(v);
  }
  var E;
  if (void 0 === e.value) throw (E = new Error("Extension value not specified.")).extension = e, E;
  return e;
}
function b(e, t) {
  if (e === s["RSASSA-PSS"]) {
    var n = [];
    if (void 0 !== t.hash.algorithmOid) {
      n.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(t.hash.algorithmOid).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")])]));
    }
    if (void 0 !== t.mgf.algorithmOid) {
      n.push(i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(t.mgf.algorithmOid).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(t.mgf.hash.algorithmOid).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")])])]));
    }
    if (void 0 !== t.saltLength) {
      n.push(i.create(i.Class.CONTEXT_SPECIFIC, 2, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(t.saltLength).getBytes())]));
    }
    return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, n);
  }
  return i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "");
}
function E(e) {
  var t = i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, []);
  if (0 === e.attributes.length) return t;
  for (n = e.attributes, o = 0, void 0; o < n.length; ++o) {
    var n;
    var o;
    var s = n[o];
    var a = s.value;
    var c = i.Type.UTF8;
    if ("valueTagClass" in s) {
      c = s.valueTagClass;
    }
    if (c === i.Type.UTF8) {
      a = r.util.encodeUtf8(a);
    }
    var l = !1;
    if ("valueConstructed" in s) {
      l = s.valueConstructed;
    }
    var u = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(s.type).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SET, !0, [i.create(i.Class.UNIVERSAL, c, l, a)])]);
    t.value.push(u);
  }
  return t;
}
o.certificateFromPem = function (e, t, n) {
  var s = r.pem.decode(e)[0];
  if ("CERTIFICATE" !== s.type && "X509 CERTIFICATE" !== s.type && "TRUSTED CERTIFICATE" !== s.type) {
    var a = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
    throw a.headerType = s.type, a;
  }
  if (s.procType && "ENCRYPTED" === s.procType.type) throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
  var c = i.fromDer(s.body, n);
  return o.certificateFromAsn1(c, t);
};
o.certificateToPem = function (e, t) {
  var n = {
    type: "CERTIFICATE",
    body: i.toDer(o.certificateToAsn1(e)).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};
o.publicKeyFromPem = function (e) {
  var t = r.pem.decode(e)[0];
  if ("PUBLIC KEY" !== t.type && "RSA PUBLIC KEY" !== t.type) {
    var n = new Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
    throw n.headerType = t.type, n;
  }
  if (t.procType && "ENCRYPTED" === t.procType.type) throw new Error("Could not convert public key from PEM; PEM is encrypted.");
  var s = i.fromDer(t.body);
  return o.publicKeyFromAsn1(s);
};
o.publicKeyToPem = function (e, t) {
  var n = {
    type: "PUBLIC KEY",
    body: i.toDer(o.publicKeyToAsn1(e)).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};
o.publicKeyToRSAPublicKeyPem = function (e, t) {
  var n = {
    type: "RSA PUBLIC KEY",
    body: i.toDer(o.publicKeyToRSAPublicKey(e)).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};
o.getPublicKeyFingerprint = function (e, t) {
  var n;
  var s = (t = t || {}).md || r.md.sha1.create();
  switch (t.type || "RSAPublicKey") {
    case "RSAPublicKey":
      n = i.toDer(o.publicKeyToRSAPublicKey(e)).getBytes();
      break;
    case "SubjectPublicKeyInfo":
      n = i.toDer(o.publicKeyToAsn1(e)).getBytes();
      break;
    default:
      throw new Error('Unknown fingerprint type "' + t.type + '".');
  }
  s.start();
  s.update(n);
  var a = s.digest();
  if ("hex" === t.encoding) {
    var c = a.toHex();
    return t.delimiter ? c.match(/.{2}/g).join(t.delimiter) : c;
  }
  if ("binary" === t.encoding) return a.getBytes();
  if (t.encoding) throw new Error('Unknown encoding "' + t.encoding + '".');
  return a;
};
o.certificationRequestFromPem = function (e, t, n) {
  var s = r.pem.decode(e)[0];
  if ("CERTIFICATE REQUEST" !== s.type) {
    var a = new Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
    throw a.headerType = s.type, a;
  }
  if (s.procType && "ENCRYPTED" === s.procType.type) throw new Error("Could not convert certification request from PEM; PEM is encrypted.");
  var c = i.fromDer(s.body, n);
  return o.certificationRequestFromAsn1(c, t);
};
o.certificationRequestToPem = function (e, t) {
  var n = {
    type: "CERTIFICATE REQUEST",
    body: i.toDer(o.certificationRequestToAsn1(e)).getBytes()
  };
  return r.pem.encode(n, {
    maxline: t
  });
};
o.createCertificate = function () {
  var e = {
    version: 2,
    serialNumber: "00",
    signatureOid: null,
    signature: null,
    siginfo: {}
  };
  e.siginfo.algorithmOid = null;
  e.validity = {};
  e.validity.notBefore = new Date();
  e.validity.notAfter = new Date();
  e.issuer = {};
  e.issuer.getField = function (t) {
    return h(e.issuer, t);
  };
  e.issuer.addField = function (t) {
    _([t]);
    e.issuer.attributes.push(t);
  };
  e.issuer.attributes = [];
  e.issuer.hash = null;
  e.subject = {};
  e.subject.getField = function (t) {
    return h(e.subject, t);
  };
  e.subject.addField = function (t) {
    _([t]);
    e.subject.attributes.push(t);
  };
  e.subject.attributes = [];
  e.subject.hash = null;
  e.extensions = [];
  e.publicKey = null;
  e.md = null;
  e.setSubject = function (t, n) {
    _(t);
    e.subject.attributes = t;
    delete e.subject.uniqueId;
    if (n) {
      e.subject.uniqueId = n;
    }
    e.subject.hash = null;
  };
  e.setIssuer = function (t, n) {
    _(t);
    e.issuer.attributes = t;
    delete e.issuer.uniqueId;
    if (n) {
      e.issuer.uniqueId = n;
    }
    e.issuer.hash = null;
  };
  e.setExtensions = function (t) {
    for (var n = 0; n < t.length; ++n) v(t[n], {
      cert: e
    });
    e.extensions = t;
  };
  e.getExtension = function (t) {
    if ("string" == typeof t) {
      t = {
        name: t
      };
    }
    for (r = null, i = 0, void 0; null === r && i < e.extensions.length; ++i) {
      var n;
      var r;
      var i;
      n = e.extensions[i];
      if (t.id && n.id === t.id || t.name && n.name === t.name) {
        r = n;
      }
    }
    return r;
  };
  e.sign = function (t, n) {
    e.md = n || r.md.sha1.create();
    var a = s[e.md.algorithm + "WithRSAEncryption"];
    if (!a) {
      var c = new Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
      throw c.algorithm = e.md.algorithm, c;
    }
    e.signatureOid = e.siginfo.algorithmOid = a;
    e.tbsCertificate = o.getTBSCertificate(e);
    var l = i.toDer(e.tbsCertificate);
    e.md.update(l.getBytes());
    e.signature = t.sign(e.md);
  };
  e.verify = function (t) {
    var n = !1;
    if (!e.issued(t)) {
      var r = t.issuer;
      var s = e.subject;
      var a = new Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
      throw a.expectedIssuer = s.attributes, a.actualIssuer = r.attributes, a;
    }
    var c = t.md;
    if (null === c) {
      c = m({
        signatureOid: t.signatureOid,
        type: "certificate"
      });
      var l = t.tbsCertificate || o.getTBSCertificate(t);
      var u = i.toDer(l);
      c.update(u.getBytes());
    }
    if (null !== c) {
      n = g({
        certificate: e,
        md: c,
        signature: t.signature
      });
    }
    return n;
  };
  e.isIssuer = function (t) {
    var n = !1;
    var r = e.issuer;
    var i = t.subject;
    if (r.hash && i.hash) n = r.hash === i.hash;else if (r.attributes.length === i.attributes.length) {
      var o;
      var s;
      n = !0;
      for (var a = 0; n && a < r.attributes.length; ++a) {
        o = r.attributes[a];
        s = i.attributes[a];
        if (o.type === s.type && o.value === s.value) {
          n = !1;
        }
      }
    }
    return n;
  };
  e.issued = function (t) {
    return t.isIssuer(e);
  };
  e.generateSubjectKeyIdentifier = function () {
    return o.getPublicKeyFingerprint(e.publicKey, {
      type: "RSAPublicKey"
    });
  };
  e.verifySubjectKeyIdentifier = function () {
    for (t = s.subjectKeyIdentifier, n = 0, void 0; n < e.extensions.length; ++n) {
      var t;
      var n;
      var i = e.extensions[n];
      if (i.id === t) {
        var o = e.generateSubjectKeyIdentifier().getBytes();
        return r.util.hexToBytes(i.subjectKeyIdentifier) === o;
      }
    }
    return !1;
  };
  return e;
};
o.certificateFromAsn1 = function (e, t) {
  var n = {};
  var s = [];
  if (!i.validate(e, l, n, s)) {
    var a = new Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
    throw a.errors = s, a;
  }
  if (i.derToOid(n.publicKeyOid) !== o.oids.rsaEncryption) throw new Error("Cannot read public key. OID is not RSA.");
  var c = o.createCertificate();
  c.version = n.certVersion ? n.certVersion.charCodeAt(0) : 0;
  var u = r.util.createBuffer(n.certSerialNumber);
  c.serialNumber = u.toHex();
  c.signatureOid = r.asn1.derToOid(n.certSignatureOid);
  c.signatureParameters = f(c.signatureOid, n.certSignatureParams, !0);
  c.siginfo.algorithmOid = r.asn1.derToOid(n.certinfoSignatureOid);
  c.siginfo.parameters = f(c.siginfo.algorithmOid, n.certinfoSignatureParams, !1);
  c.signature = n.certSignature;
  var p = [];
  if (void 0 !== n.certValidity1UTCTime) {
    p.push(i.utcTimeToDate(n.certValidity1UTCTime));
  }
  if (void 0 !== n.certValidity2GeneralizedTime) {
    p.push(i.generalizedTimeToDate(n.certValidity2GeneralizedTime));
  }
  if (void 0 !== n.certValidity3UTCTime) {
    p.push(i.utcTimeToDate(n.certValidity3UTCTime));
  }
  if (void 0 !== n.certValidity4GeneralizedTime) {
    p.push(i.generalizedTimeToDate(n.certValidity4GeneralizedTime));
  }
  if (p.length > 2) throw new Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
  if (p.length < 2) throw new Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
  c.validity.notBefore = p[0];
  c.validity.notAfter = p[1];
  c.tbsCertificate = n.tbsCertificate;
  if (t) {
    c.md = m({
      signatureOid: c.signatureOid,
      type: "certificate"
    });
    var d = i.toDer(c.tbsCertificate);
    c.md.update(d.getBytes());
  }
  var g = r.md.sha1.create();
  var y = i.toDer(n.certIssuer);
  g.update(y.getBytes());
  c.issuer.getField = function (e) {
    return h(c.issuer, e);
  };
  c.issuer.addField = function (e) {
    _([e]);
    c.issuer.attributes.push(e);
  };
  c.issuer.attributes = o.RDNAttributesAsArray(n.certIssuer);
  if (n.certIssuerUniqueId) {
    c.issuer.uniqueId = n.certIssuerUniqueId;
  }
  c.issuer.hash = g.digest().toHex();
  var v = r.md.sha1.create();
  var b = i.toDer(n.certSubject);
  v.update(b.getBytes());
  c.subject.getField = function (e) {
    return h(c.subject, e);
  };
  c.subject.addField = function (e) {
    _([e]);
    c.subject.attributes.push(e);
  };
  c.subject.attributes = o.RDNAttributesAsArray(n.certSubject);
  if (n.certSubjectUniqueId) {
    c.subject.uniqueId = n.certSubjectUniqueId;
  }
  c.subject.hash = v.digest().toHex();
  if (n.certExtensions) {
    c.extensions = o.certificateExtensionsFromAsn1(n.certExtensions);
  } else {
    c.extensions = [];
  }
  c.publicKey = o.publicKeyFromAsn1(n.subjectPublicKeyInfo);
  return c;
};
o.certificateExtensionsFromAsn1 = function (e) {
  for (t = [], n = 0, void 0; n < e.value.length; ++n) {
    var t;
    var n;
    for (r = e.value[n], i = 0, void 0; i < r.value.length; ++i) {
      var r;
      var i;
      t.push(o.certificateExtensionFromAsn1(r.value[i]));
    }
  }
  return t;
};
o.certificateExtensionFromAsn1 = function (e) {
  var t = {};
  t.id = i.derToOid(e.value[0].value);
  t.critical = !1;
  if (e.value[1].type === i.Type.BOOLEAN) {
    t.critical = 0 !== e.value[1].value.charCodeAt(0);
    t.value = e.value[2].value;
  } else {
    t.value = e.value[1].value;
  }
  if (t.id in s) if (t.name = s[t.id], "keyUsage" === t.name) {
    var n = 0,
      o = 0;
    (c = i.fromDer(t.value)).value.length > 1 && (n = c.value.charCodeAt(1), o = c.value.length > 2 ? c.value.charCodeAt(2) : 0), t.digitalSignature = 128 == (128 & n), t.nonRepudiation = 64 == (64 & n), t.keyEncipherment = 32 == (32 & n), t.dataEncipherment = 16 == (16 & n), t.keyAgreement = 8 == (8 & n), t.keyCertSign = 4 == (4 & n), t.cRLSign = 2 == (2 & n), t.encipherOnly = 1 == (1 & n), t.decipherOnly = 128 == (128 & o);
  } else if ("basicConstraints" === t.name) {
    (c = i.fromDer(t.value)).value.length > 0 && c.value[0].type === i.Type.BOOLEAN ? t.cA = 0 !== c.value[0].value.charCodeAt(0) : t.cA = !1;
    var a = null;
    c.value.length > 0 && c.value[0].type === i.Type.INTEGER ? a = c.value[0].value : c.value.length > 1 && (a = c.value[1].value), null !== a && (t.pathLenConstraint = i.derToInteger(a));
  } else if ("extKeyUsage" === t.name) for (var c = i.fromDer(t.value), l = 0; l < c.value.length; ++l) {
    var u = i.derToOid(c.value[l].value);
    u in s ? t[s[u]] = !0 : t[u] = !0;
  } else if ("nsCertType" === t.name) n = 0, (c = i.fromDer(t.value)).value.length > 1 && (n = c.value.charCodeAt(1)), t.client = 128 == (128 & n), t.server = 64 == (64 & n), t.email = 32 == (32 & n), t.objsign = 16 == (16 & n), t.reserved = 8 == (8 & n), t.sslCA = 4 == (4 & n), t.emailCA = 2 == (2 & n), t.objCA = 1 == (1 & n);else if ("subjectAltName" === t.name || "issuerAltName" === t.name) {
    var p;
    t.altNames = [], c = i.fromDer(t.value);
    for (var d = 0; d < c.value.length; ++d) {
      var h = {
        type: (p = c.value[d]).type,
        value: p.value
      };
      switch (t.altNames.push(h), p.type) {
        case 1:
        case 2:
        case 6:
          break;
        case 7:
          h.ip = r.util.bytesToIP(p.value);
          break;
        case 8:
          h.oid = i.derToOid(p.value);
      }
    }
  } else "subjectKeyIdentifier" === t.name && (c = i.fromDer(t.value), t.subjectKeyIdentifier = r.util.bytesToHex(c.value));
  return t;
};
o.certificationRequestFromAsn1 = function (e, t) {
  var n = {};
  var s = [];
  if (!i.validate(e, d, n, s)) {
    var a = new Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
    throw a.errors = s, a;
  }
  if (i.derToOid(n.publicKeyOid) !== o.oids.rsaEncryption) throw new Error("Cannot read public key. OID is not RSA.");
  var c = o.createCertificationRequest();
  c.version = n.csrVersion ? n.csrVersion.charCodeAt(0) : 0;
  c.signatureOid = r.asn1.derToOid(n.csrSignatureOid);
  c.signatureParameters = f(c.signatureOid, n.csrSignatureParams, !0);
  c.siginfo.algorithmOid = r.asn1.derToOid(n.csrSignatureOid);
  c.siginfo.parameters = f(c.siginfo.algorithmOid, n.csrSignatureParams, !1);
  c.signature = n.csrSignature;
  c.certificationRequestInfo = n.certificationRequestInfo;
  if (t) {
    c.md = m({
      signatureOid: c.signatureOid,
      type: "certification request"
    });
    var l = i.toDer(c.certificationRequestInfo);
    c.md.update(l.getBytes());
  }
  var u = r.md.sha1.create();
  c.subject.getField = function (e) {
    return h(c.subject, e);
  };
  c.subject.addField = function (e) {
    _([e]);
    c.subject.attributes.push(e);
  };
  c.subject.attributes = o.RDNAttributesAsArray(n.certificationRequestInfoSubject, u);
  c.subject.hash = u.digest().toHex();
  c.publicKey = o.publicKeyFromAsn1(n.subjectPublicKeyInfo);
  c.getAttribute = function (e) {
    return h(c, e);
  };
  c.addAttribute = function (e) {
    _([e]);
    c.attributes.push(e);
  };
  c.attributes = o.CRIAttributesAsArray(n.certificationRequestInfoAttributes || []);
  return c;
};
o.createCertificationRequest = function () {
  var e = {
    version: 0,
    signatureOid: null,
    signature: null,
    siginfo: {}
  };
  e.siginfo.algorithmOid = null;
  e.subject = {};
  e.subject.getField = function (t) {
    return h(e.subject, t);
  };
  e.subject.addField = function (t) {
    _([t]);
    e.subject.attributes.push(t);
  };
  e.subject.attributes = [];
  e.subject.hash = null;
  e.publicKey = null;
  e.attributes = [];
  e.getAttribute = function (t) {
    return h(e, t);
  };
  e.addAttribute = function (t) {
    _([t]);
    e.attributes.push(t);
  };
  e.md = null;
  e.setSubject = function (t) {
    _(t);
    e.subject.attributes = t;
    e.subject.hash = null;
  };
  e.setAttributes = function (t) {
    _(t);
    e.attributes = t;
  };
  e.sign = function (t, n) {
    e.md = n || r.md.sha1.create();
    var a = s[e.md.algorithm + "WithRSAEncryption"];
    if (!a) {
      var c = new Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
      throw c.algorithm = e.md.algorithm, c;
    }
    e.signatureOid = e.siginfo.algorithmOid = a;
    e.certificationRequestInfo = o.getCertificationRequestInfo(e);
    var l = i.toDer(e.certificationRequestInfo);
    e.md.update(l.getBytes());
    e.signature = t.sign(e.md);
  };
  e.verify = function () {
    var t = !1;
    var n = e.md;
    if (null === n) {
      n = m({
        signatureOid: e.signatureOid,
        type: "certification request"
      });
      var r = e.certificationRequestInfo || o.getCertificationRequestInfo(e);
      var s = i.toDer(r);
      n.update(s.getBytes());
    }
    if (null !== n) {
      t = g({
        certificate: e,
        md: n,
        signature: e.signature
      });
    }
    return t;
  };
  return e;
};
var w = new Date("1950-01-01T00:00:00Z");
var T = new Date("2050-01-01T00:00:00Z");
function S(e) {
  return e >= w && e < T ? i.create(i.Class.UNIVERSAL, i.Type.UTCTIME, !1, i.dateToUtcTime(e)) : i.create(i.Class.UNIVERSAL, i.Type.GENERALIZEDTIME, !1, i.dateToGeneralizedTime(e));
}
o.getTBSCertificate = function (e) {
  var t = S(e.validity.notBefore);
  var n = S(e.validity.notAfter);
  var s = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(e.version).getBytes())]), i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, r.util.hexToBytes(e.serialNumber)), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.siginfo.algorithmOid).getBytes()), b(e.siginfo.algorithmOid, e.siginfo.parameters)]), y(e.issuer), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [t, n]), y(e.subject), o.publicKeyToAsn1(e.publicKey)]);
  if (e.issuer.uniqueId) {
    s.value.push(i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, [i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + e.issuer.uniqueId)]));
  }
  if (e.subject.uniqueId) {
    s.value.push(i.create(i.Class.CONTEXT_SPECIFIC, 2, !0, [i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + e.subject.uniqueId)]));
  }
  if (e.extensions.length > 0) {
    s.value.push(o.certificateExtensionsToAsn1(e.extensions));
  }
  return s;
};
o.getCertificationRequestInfo = function (e) {
  return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(e.version).getBytes()), y(e.subject), o.publicKeyToAsn1(e.publicKey), E(e)]);
};
o.distinguishedNameToAsn1 = function (e) {
  return y(e);
};
o.certificateToAsn1 = function (e) {
  var t = e.tbsCertificate || o.getTBSCertificate(e);
  return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [t, i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.signatureOid).getBytes()), b(e.signatureOid, e.signatureParameters)]), i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + e.signature)]);
};
o.certificateExtensionsToAsn1 = function (e) {
  var t = i.create(i.Class.CONTEXT_SPECIFIC, 3, !0, []);
  var n = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
  t.value.push(n);
  for (var r = 0; r < e.length; ++r) n.value.push(o.certificateExtensionToAsn1(e[r]));
  return t;
};
o.certificateExtensionToAsn1 = function (e) {
  var t = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
  t.value.push(i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.id).getBytes()));
  if (e.critical) {
    t.value.push(i.create(i.Class.UNIVERSAL, i.Type.BOOLEAN, !1, String.fromCharCode(255)));
  }
  var n = e.value;
  if ("string" != typeof e.value) {
    n = i.toDer(n).getBytes();
  }
  t.value.push(i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, n));
  return t;
};
o.certificationRequestToAsn1 = function (e) {
  var t = e.certificationRequestInfo || o.getCertificationRequestInfo(e);
  return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [t, i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(e.signatureOid).getBytes()), b(e.signatureOid, e.signatureParameters)]), i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + e.signature)]);
};
o.createCaStore = function (e) {
  var t = {
    certs: {}
  };
  function n(e) {
    s(e);
    return t.certs[e.hash] || null;
  }
  function s(e) {
    if (!e.hash) {
      var t = r.md.sha1.create();
      e.attributes = o.RDNAttributesAsArray(y(e), t);
      e.hash = t.digest().toHex();
    }
  }
  t.getIssuer = function (e) {
    return n(e.issuer);
  };
  t.addCertificate = function (e) {
    if ("string" == typeof e) {
      e = r.pki.certificateFromPem(e);
    }
    s(e.subject);
    if (!t.hasCertificate(e)) if (e.subject.hash in t.certs) {
      var n = t.certs[e.subject.hash];
      r.util.isArray(n) || (n = [n]), n.push(e), t.certs[e.subject.hash] = n;
    } else t.certs[e.subject.hash] = e;
  };
  t.hasCertificate = function (e) {
    if ("string" == typeof e) {
      e = r.pki.certificateFromPem(e);
    }
    var t = n(e.subject);
    if (!t) return !1;
    if (r.util.isArray(t)) {
      t = [t];
    }
    for (s = i.toDer(o.certificateToAsn1(e)).getBytes(), a = 0, void 0; a < t.length; ++a) {
      var s;
      var a;
      if (s === i.toDer(o.certificateToAsn1(t[a])).getBytes()) return !0;
    }
    return !1;
  };
  t.listAllCertificates = function () {
    var e = [];
    for (var n in t.certs) if (t.certs.hasOwnProperty(n)) {
      var i = t.certs[n];
      if (r.util.isArray(i)) for (var o = 0; o < i.length; ++o) e.push(i[o]);else e.push(i);
    }
    return e;
  };
  t.removeCertificate = function (e) {
    var a;
    if ("string" == typeof e) {
      e = r.pki.certificateFromPem(e);
    }
    s(e.subject);
    if (!t.hasCertificate(e)) return null;
    var c = n(e.subject);
    if (!r.util.isArray(c)) {
      a = t.certs[e.subject.hash];
      delete t.certs[e.subject.hash];
      return a;
    }
    for (l = i.toDer(o.certificateToAsn1(e)).getBytes(), u = 0, void 0; u < c.length; ++u) {
      var l;
      var u;
      if (l === i.toDer(o.certificateToAsn1(c[u])).getBytes()) {
        a = c[u];
        c.splice(u, 1);
      }
    }
    if (0 === c.length) {
      delete t.certs[e.subject.hash];
    }
    return a;
  };
  if (e) for (var a = 0; a < e.length; ++a) {
    var c = e[a];
    t.addCertificate(c);
  }
  return t;
};
o.certificateError = {
  bad_certificate: "forge.pki.BadCertificate",
  unsupported_certificate: "forge.pki.UnsupportedCertificate",
  certificate_revoked: "forge.pki.CertificateRevoked",
  certificate_expired: "forge.pki.CertificateExpired",
  certificate_unknown: "forge.pki.CertificateUnknown",
  unknown_ca: "forge.pki.UnknownCertificateAuthority"
};
o.verifyCertificateChain = function (e, t, n) {
  if ("function" == typeof n) {
    n = {
      verify: n
    };
  }
  n = n || {};
  var i = (t = t.slice(0)).slice(0);
  var s = n.validityCheckDate;
  if (void 0 === s) {
    s = new Date();
  }
  var a = !0;
  var c = null;
  var l = 0;
  do {
    var u = t.shift();
    var p = null;
    var d = !1;
    if (s && (s < u.validity.notBefore || s > u.validity.notAfter)) {
      c = {
        message: "Certificate is not valid yet or has expired.",
        error: o.certificateError.certificate_expired,
        notBefore: u.validity.notBefore,
        notAfter: u.validity.notAfter,
        now: s
      };
    }
    if (null === c) {
      if (null === (p = t[0] || e.getIssuer(u)) && u.isIssuer(u) && (d = !0, p = u), p) {
        var h = p;
        r.util.isArray(h) || (h = [h]);
        for (var f = !1; !f && h.length > 0;) {
          p = h.shift();
          try {
            f = p.verify(u);
          } catch (e) {}
        }
        f || (c = {
          message: "Certificate signature is invalid.",
          error: o.certificateError.bad_certificate
        });
      }
      null !== c || p && !d || e.hasCertificate(u) || (c = {
        message: "Certificate is not trusted.",
        error: o.certificateError.unknown_ca
      });
    }
    if (null === c && p && !u.isIssuer(p)) {
      c = {
        message: "Certificate issuer is invalid.",
        error: o.certificateError.bad_certificate
      };
    }
    if (null === c) for (var m = {
        keyUsage: !0,
        basicConstraints: !0
      }, g = 0; null === c && g < u.extensions.length; ++g) {
      var y = u.extensions[g];
      y.critical && !(y.name in m) && (c = {
        message: "Certificate has an unsupported critical extension.",
        error: o.certificateError.unsupported_certificate
      });
    }
    if (null === c && (!a || 0 === t.length && (!p || d))) {
      var _ = u.getExtension("basicConstraints");
      var v = u.getExtension("keyUsage");
      if (null !== v) {
        if (v.keyCertSign && null !== _) {
          c = {
            message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
            error: o.certificateError.bad_certificate
          };
        }
      }
      if (null !== c || null === _ || _.cA) {
        c = {
          message: "Certificate basicConstraints indicates the certificate is not a CA.",
          error: o.certificateError.bad_certificate
        };
      }
      if (null === c && null !== v && "pathLenConstraint" in _ && l - 1 > _.pathLenConstraint) {
        c = {
          message: "Certificate basicConstraints pathLenConstraint violated.",
          error: o.certificateError.bad_certificate
        };
      }
    }
    var b = null === c || c.error;
    var E = n.verify ? n.verify(b, l, i) : b;
    if (!0 !== E) throw !0 === b && (c = {
      message: "The application rejected the certificate.",
      error: o.certificateError.bad_certificate
    }), (E || 0 === E) && ("object" != typeof E || r.util.isArray(E) ? "string" == typeof E && (c.error = E) : (E.message && (c.message = E.message), E.error && (c.error = E.error))), c;
    c = null;
    a = !1;
    ++l;
  } while (t.length > 0);
  return !0;
};