Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.parsesWithoutError = exports.getCallSites = exports.getPrompt = exports.getNodeStart = exports.getFunctionPositions = exports.getBlockCloseToken = exports.isSupportedLanguageId = exports.isBlockBodyFinished = exports.isEmptyBlockStart = exports.terminate = exports.init = void 0;
  const r = require(23055);
  let i = null;
  const o = new Map();
  let s = 0;
  exports.init = function (t, u, p) {
    if (!u) {
      const t = require(44723);
      for (const n of [...a, ...c]) module.exports[n] = t[n];
      return;
    }
    for (const n of a) module.exports[n] = l(t, p, n);
    module.exports.getPrompt = function (e, t) {
      return function (n, ...r) {
        const a = s++;
        return new Promise((n, s) => {
          o.set(a, {
            resolve: n,
            reject: s
          }), t.debug(e, `Proxy getPrompt - ${a}`), i?.postMessage({
            id: a,
            fn: "getPrompt",
            args: r
          });
        });
      };
    }(t, p), i = r.createWorker(), o.clear(), s = 0;
    const d = t.get(r.FileSystem);
    function h(e) {
      p.exception(t, e);
      for (const t of o.values()) t.reject(e);
      o.clear();
    }
    i.on("message", ({
      id: e,
      err: n,
      res: r
    }) => {
      const i = o.get(e);
      p.debug(t, `Response ${e} - ${r}, ${n}`), i && (o.delete(e), n ? i.reject(n) : i.resolve(r));
    }), i.on("error", h), i.on("exit", e => {
      0 !== e && h(new Error(`Worker thread exited with code ${e}.`));
    }), i.on("readFileReq", e => {
      p.debug(t, `READ_FILE_REQ - ${e}`), d.readFile(e).then(e => {
        i?.emit("readFileRes", e);
      }).catch(h);
    }), i.on("mtimeRes", e => {
      p.debug(t, `mTime_REQ - ${e}`), d.mtime(e).then(e => {
        i?.emit("mtimeRes", e);
      }).catch(h);
    });
  }, exports.terminate = function () {
    i && (i.removeAllListeners(), i.terminate(), i = null, o.clear());
  };
  const a = ["getFunctionPositions", "isEmptyBlockStart", "isBlockBodyFinished", "getNodeStart", "getCallSites", "parsesWithoutError"],
    c = ["isSupportedLanguageId", "getBlockCloseToken", "getPrompt"];
  function l(e, t, n) {
    return function (...r) {
      const a = s++;
      return new Promise((s, c) => {
        o.set(a, {
          resolve: s,
          reject: c
        }), t.debug(e, `Proxy ${n}`), i?.postMessage({
          id: a,
          fn: n,
          args: r
        });
      });
    };
  }
  exports.isEmptyBlockStart = r.isEmptyBlockStart, exports.isBlockBodyFinished = r.isBlockBodyFinished, exports.isSupportedLanguageId = r.isSupportedLanguageId, exports.getBlockCloseToken = r.getBlockCloseToken, exports.getFunctionPositions = r.getFunctionPositions, exports.getNodeStart = r.getNodeStart, exports.getPrompt = r.getPrompt, exports.getCallSites = r.getCallSites, exports.parsesWithoutError = r.parsesWithoutError;