const r = require(22037);
const i = require(57147);
const o = require(41595);
const s = () => {
  if ("linux" !== process.platform) return !1;
  if (r.release().toLowerCase().includes("microsoft")) return !o();
  try {
    return !!i.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") && !o();
  } catch (e) {
    return !1;
  }
};
if (process.env.__IS_WSL_TEST__) {
  module.exports = s;
} else {
  module.exports = s();
}