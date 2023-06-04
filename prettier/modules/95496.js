var r = require(3832);
require(3068);
require(97116);
var i = r.asn1;
var o = module.exports = r.pkcs7asn1 = r.pkcs7asn1 || {};
r.pkcs7 = r.pkcs7 || {};
r.pkcs7.asn1 = o;
var s = {
  name: "ContentInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "ContentInfo.ContentType",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OID,
    constructed: !1,
    capture: "contentType"
  }, {
    name: "ContentInfo.content",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 0,
    constructed: !0,
    optional: !0,
    captureAsn1: "content"
  }]
};
o.contentInfoValidator = s;
var a = {
  name: "EncryptedContentInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "EncryptedContentInfo.contentType",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OID,
    constructed: !1,
    capture: "contentType"
  }, {
    name: "EncryptedContentInfo.contentEncryptionAlgorithm",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OID,
      constructed: !1,
      capture: "encAlgorithm"
    }, {
      name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
      tagClass: i.Class.UNIVERSAL,
      captureAsn1: "encParameter"
    }]
  }, {
    name: "EncryptedContentInfo.encryptedContent",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 0,
    capture: "encryptedContent",
    captureAsn1: "encryptedContentAsn1"
  }]
};
o.envelopedDataValidator = {
  name: "EnvelopedData",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "EnvelopedData.Version",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1,
    capture: "version"
  }, {
    name: "EnvelopedData.RecipientInfos",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SET,
    constructed: !0,
    captureAsn1: "recipientInfos"
  }].concat(a)
};
o.encryptedDataValidator = {
  name: "EncryptedData",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "EncryptedData.Version",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1,
    capture: "version"
  }].concat(a)
};
var c = {
  name: "SignerInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "SignerInfo.version",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1
  }, {
    name: "SignerInfo.issuerAndSerialNumber",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SignerInfo.issuerAndSerialNumber.issuer",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "issuer"
    }, {
      name: "SignerInfo.issuerAndSerialNumber.serialNumber",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.INTEGER,
      constructed: !1,
      capture: "serial"
    }]
  }, {
    name: "SignerInfo.digestAlgorithm",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "SignerInfo.digestAlgorithm.algorithm",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OID,
      constructed: !1,
      capture: "digestAlgorithm"
    }, {
      name: "SignerInfo.digestAlgorithm.parameter",
      tagClass: i.Class.UNIVERSAL,
      constructed: !1,
      captureAsn1: "digestParameter",
      optional: !0
    }]
  }, {
    name: "SignerInfo.authenticatedAttributes",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 0,
    constructed: !0,
    optional: !0,
    capture: "authenticatedAttributes"
  }, {
    name: "SignerInfo.digestEncryptionAlgorithm",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    capture: "signatureAlgorithm"
  }, {
    name: "SignerInfo.encryptedDigest",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OCTETSTRING,
    constructed: !1,
    capture: "signature"
  }, {
    name: "SignerInfo.unauthenticatedAttributes",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 1,
    constructed: !0,
    optional: !0,
    capture: "unauthenticatedAttributes"
  }]
};
o.signedDataValidator = {
  name: "SignedData",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "SignedData.Version",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1,
    capture: "version"
  }, {
    name: "SignedData.DigestAlgorithms",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SET,
    constructed: !0,
    captureAsn1: "digestAlgorithms"
  }, s, {
    name: "SignedData.Certificates",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 0,
    optional: !0,
    captureAsn1: "certificates"
  }, {
    name: "SignedData.CertificateRevocationLists",
    tagClass: i.Class.CONTEXT_SPECIFIC,
    type: 1,
    optional: !0,
    captureAsn1: "crls"
  }, {
    name: "SignedData.SignerInfos",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SET,
    capture: "signerInfos",
    optional: !0,
    value: [c]
  }]
};
o.recipientInfoValidator = {
  name: "RecipientInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "RecipientInfo.version",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1,
    capture: "version"
  }, {
    name: "RecipientInfo.issuerAndSerial",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "RecipientInfo.issuerAndSerial.issuer",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.SEQUENCE,
      constructed: !0,
      captureAsn1: "issuer"
    }, {
      name: "RecipientInfo.issuerAndSerial.serialNumber",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.INTEGER,
      constructed: !1,
      capture: "serial"
    }]
  }, {
    name: "RecipientInfo.keyEncryptionAlgorithm",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OID,
      constructed: !1,
      capture: "encAlgorithm"
    }, {
      name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
      tagClass: i.Class.UNIVERSAL,
      constructed: !1,
      captureAsn1: "encParameter",
      optional: !0
    }]
  }, {
    name: "RecipientInfo.encryptedKey",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OCTETSTRING,
    constructed: !1,
    capture: "encKey"
  }]
};