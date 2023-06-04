require.r(exports);
require.d(exports, {
  default: () => u,
  portNumbers: () => p
});
const r = require("node:net");
const i = require("node:os");
class o extends Error {
  constructor(e) {
    super(`${e} is locked`);
  }
}
const s = {
  old: new Set(),
  young: new Set()
};
let a;
const c = e => new Promise((t, n) => {
  const i = r.createServer();
  i.unref();
  i.on("error", n);
  i.listen(e, () => {
    const {
      port: e
    } = i.address();
    i.close(() => {
      t(e);
    });
  });
});
const l = async (e, t) => {
  if (e.host || 0 === e.port) return c(e);
  for (const n of t) try {
    await c({
      port: e.port,
      host: n
    });
  } catch (e) {
    if (!["EADDRNOTAVAIL", "EINVAL"].includes(e.code)) throw e;
  }
  return e.port;
};
async function u(e) {
  let t;
  if (e) {
    t = "number" == typeof e.port ? [e.port] : e.port;
  }
  if (void 0 === a) {
    a = setInterval(() => {
      s.old = s.young;
      s.young = new Set();
    }, 15e3);
    if (a.unref) {
      a.unref();
    }
  }
  const n = (() => {
    const e = i.networkInterfaces();
    const t = new Set([void 0, "0.0.0.0"]);
    for (const n of Object.values(e)) for (const e of n) t.add(e.address);
    return t;
  })();
  for (const r of function* (e) {
    if (e) {
      yield* e;
    }
    yield 0;
  }(t)) try {
    let t = await l({
      ...e,
      port: r
    }, n);
    for (; s.old.has(t) || s.young.has(t);) {
      if (0 !== r) throw new o(r);
      t = await l({
        ...e,
        port: r
      }, n);
    }
    s.young.add(t);
    return t;
  } catch (e) {
    if (!(["EADDRINUSE", "EACCES"].includes(e.code) || e instanceof o)) throw e;
  }
  throw new Error("No available ports found");
}
function p(e, t) {
  if (!Number.isInteger(e) || !Number.isInteger(t)) throw new TypeError("`from` and `to` must be integer numbers");
  if (e < 1024 || e > 65535) throw new RangeError("`from` must be between 1024 and 65535");
  if (t < 1024 || t > 65536) throw new RangeError("`to` must be between 1024 and 65536");
  if (t < e) throw new RangeError("`to` must be greater than or equal to `from`");
  return function* (e, t) {
    for (let n = e; n <= t; n++) yield n;
  }(e, t);
}