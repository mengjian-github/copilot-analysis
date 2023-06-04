Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.getSymbolDefSnippets = exports.SymbolDefinitionProvider = void 0;
  const r = require(15205),
    i = require(43076),
    o = require(29899),
    s = require(80857),
    a = require(82533),
    c = new o.Logger(o.LogLevel.INFO, "symbol_def");
  class l {}
  exports.SymbolDefinitionProvider = l;
  let u = async function (e, t, n, r) {
    try {
      return await r.getSymbolDefinition(n);
    } catch (t) {
      return c.exception(e, t, "Error retrieving definitions"), [];
    }
  };
  u = (0, r.default)(u, {
    cache: new i.LRUCacheMap(1e3),
    hash: (e, t, n, r) => `${n.uri}#${t}`
  }), u = (0, s.shortCircuit)(u, 100, []), exports.getSymbolDefSnippets = async function (e, t) {
    const n = e.get(l),
      r = await (0, a.getCallSites)(t);
    if (0 == r.length) return [];
    const i = [];
    for (const o of r) {
      const r = {
          ...t,
          position: o.position
        },
        s = u(e, o.name, r, n);
      i.push(s);
    }
    return (await Promise.all(i)).flat();
  };