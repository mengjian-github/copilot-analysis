const r = require(99822);
if (global._asyncHook) {
  if (global._asyncHook.version !== require(26157).i8) throw new Error("Conflicting version of async-hook-jl found");
  module.exports = global._asyncHook;
} else {
  require(92512).filter.attach(function (e, t) {
    return t.filter(function (e) {
      const t = e.getFileName();
      return !(t && t.slice(0, __dirname.length) === __dirname);
    });
  });
  module.exports = global._asyncHook = new r();
}