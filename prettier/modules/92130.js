const r = require(22037);
const i = require(86560);
const o = process.env;
let s;
function a(e) {
  const t = function (e) {
    if (!1 === s) return 0;
    if (i("color=16m") || i("color=full") || i("color=truecolor")) return 3;
    if (i("color=256")) return 2;
    if (e && !e.isTTY && !0 !== s) return 0;
    const t = s ? 1 : 0;
    if ("win32" === process.platform) {
      const e = r.release().split(".");
      return Number(process.versions.node.split(".")[0]) >= 8 && Number(e[0]) >= 10 && Number(e[2]) >= 10586 ? Number(e[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in o) return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(e => e in o) || "codeship" === o.CI_NAME ? 1 : t;
    if ("TEAMCITY_VERSION" in o) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(o.TEAMCITY_VERSION) ? 1 : 0;
    if ("truecolor" === o.COLORTERM) return 3;
    if ("TERM_PROGRAM" in o) {
      const e = parseInt((o.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (o.TERM_PROGRAM) {
        case "iTerm.app":
          return e >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(o.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(o.TERM) || "COLORTERM" in o ? 1 : (o.TERM, t);
  }(e);
  return function (e) {
    return 0 !== e && {
      level: e,
      hasBasic: !0,
      has256: e >= 2,
      has16m: e >= 3
    };
  }(t);
}
if (i("no-color") || i("no-colors") || i("color=false")) {
  s = !1;
} else {
  if (i("color") || i("colors") || i("color=true") || i("color=always")) {
    s = !0;
  }
}
if ("FORCE_COLOR" in o) {
  s = 0 === o.FORCE_COLOR.length || 0 !== parseInt(o.FORCE_COLOR, 10);
}
module.exports = {
  supportsColor: a,
  stdout: a(process.stdout),
  stderr: a(process.stderr)
};