var r = require(3832);
require(3068);
var i = r.asn1;
exports.privateKeyValidator = {
  name: "PrivateKeyInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  value: [{
    name: "PrivateKeyInfo.version",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.INTEGER,
    constructed: !1,
    capture: "privateKeyVersion"
  }, {
    name: "PrivateKeyInfo.privateKeyAlgorithm",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "AlgorithmIdentifier.algorithm",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OID,
      constructed: !1,
      capture: "privateKeyOid"
    }]
  }, {
    name: "PrivateKeyInfo",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.OCTETSTRING,
    constructed: !1,
    capture: "privateKey"
  }]
};
exports.publicKeyValidator = {
  name: "SubjectPublicKeyInfo",
  tagClass: i.Class.UNIVERSAL,
  type: i.Type.SEQUENCE,
  constructed: !0,
  captureAsn1: "subjectPublicKeyInfo",
  value: [{
    name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "AlgorithmIdentifier.algorithm",
      tagClass: i.Class.UNIVERSAL,
      type: i.Type.OID,
      constructed: !1,
      capture: "publicKeyOid"
    }]
  }, {
    tagClass: i.Class.UNIVERSAL,
    type: i.Type.BITSTRING,
    constructed: !1,
    composed: !0,
    captureBitStringValue: "ed25519PublicKey"
  }]
};