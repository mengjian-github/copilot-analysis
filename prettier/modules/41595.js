const r = require(57147);
let i;
module.exports = () => (void 0 === i && (i = function () {
  try {
    r.statSync("/.dockerenv");
    return !0;
  } catch (e) {
    return !1;
  }
}() || function () {
  try {
    return r.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch (e) {
    return !1;
  }
}()), i);