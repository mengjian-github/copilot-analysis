const r = require(57147);
const i = require(71017);
const o = require(12352);
const s = {
  mode: 511 & ~process.umask(),
  fs: r
};
const a = e => {
  if ("win32" === process.platform && /[<>:"|?*]/.test(e.replace(i.parse(e).root, ""))) {
    const t = new Error(`Path contains invalid characters: ${e}`);
    throw t.code = "EINVAL", t;
  }
};
module.exports = (e, t) => Promise.resolve().then(() => {
  a(e);
  t = Object.assign({}, s, t);
  const n = o(t.fs.mkdir);
  const r = o(t.fs.stat);
  const c = e => n(e, t.mode).then(() => e).catch(t => {
    if ("ENOENT" === t.code) {
      if (t.message.includes("null bytes") || i.dirname(e) === e) throw t;
      return c(i.dirname(e)).then(() => c(e));
    }
    return r(e).then(t => t.isDirectory() ? e : Promise.reject()).catch(() => {
      throw t;
    });
  });
  return c(i.resolve(e));
});
module.exports.sync = (e, t) => {
  a(e);
  t = Object.assign({}, s, t);
  const n = e => {
    try {
      t.fs.mkdirSync(e, t.mode);
    } catch (r) {
      if ("ENOENT" === r.code) {
        if (r.message.includes("null bytes") || i.dirname(e) === e) throw r;
        n(i.dirname(e));
        return n(e);
      }
      try {
        if (!t.fs.statSync(e).isDirectory()) throw new Error("The path is not a directory");
      } catch (e) {
        throw r;
      }
    }
    return e;
  };
  return n(i.resolve(e));
};