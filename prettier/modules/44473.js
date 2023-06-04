const r = require(95687);
const i = require(2517);
if ("darwin" !== process.platform) {
  module.exports.all = () => [];
  module.exports.each = () => {};
} else {
  const t = require(32081);
  const o = /(?=-----BEGIN\sCERTIFICATE-----)/g;
  const s = "/System/Library/Keychains/SystemRootCertificates.keychain";
  const a = ["find-certificate", "-a", "-p"];
  const c = t.spawnSync("/usr/bin/security", a).stdout.toString().split(o);
  const l = t.spawnSync("/usr/bin/security", a.concat(s)).stdout.toString().split(o);
  r.globalAgent.options.ca = r.globalAgent.options.ca || [];
  const u = r.globalAgent.options.ca;
  const p = c.concat(l);
  p.filter(function (e, t, n) {
    return n.indexOf(e) === t;
  }).forEach(e => u.push(e));
  module.exports.der2 = i.validFormats;
  module.exports.all = function (e) {
    return p.map(i.transform(e)).filter(e => e);
  };
  module.exports.each = function (e, t) {
    if ("function" == typeof e) {
      t = e;
      e = void 0;
    }
    return p.map(i.transform(e)).filter(e => e).forEach(t);
  };
}