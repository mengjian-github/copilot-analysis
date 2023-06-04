const r = require(22079);
const i = require(6825);
var o = module.exports.validFormats = {
  der: 0,
  pem: 1,
  txt: 2,
  asn1: 3
};
function s(e) {
  const t = r.pki.pemToDer(e);
  const n = r.asn1;
  const i = n.fromDer(t.data.toString("binary")).value[0].value;
  const o = i[0];
  const s = o.tagClass === n.Class.CONTEXT_SPECIFIC && 0 === o.type && o.constructed;
  const a = i.slice(s);
  return {
    serial: a[0],
    issuer: a[2],
    valid: a[3],
    subject: a[4]
  };
}
module.exports.transform = function (e) {
  return function (t) {
    try {
      switch (e) {
        case o.der:
          return r.pki.pemToDer(t);
        case o.pem:
          return t;
        case o.txt:
          return function (e) {
            const t = s(e);
            const n = new Date();
            const r = t.subject.value.map(e => e.value[0].value[1].value).join("/");
            const o = t.valid.value.map(e => e.value).join(" - ");
            const a = n.toTimeString().replace(/\s*\(.*\)\s*/, "");
            return [`Subject\t${r}`, `Valid\t${o}`, `Saved\t${n.toLocaleDateString()} ${a} by ${i.name}@${i.version}`, String(e)].join("\n");
          }(t);
        case o.asn1:
          return s(t);
        default:
          return r.pki.certificateFromPem(t);
      }
    } catch (e) {
      return;
    }
  };
};