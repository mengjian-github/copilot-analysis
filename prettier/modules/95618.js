Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getSymbolDefSnippets = exports.SymbolDefinitionProvider = void 0;
const r = require(15205);
const i = require(43076);
const logger = require("./logger");
const s = require(80857);
const promptlibproxy = require("./prompt-lib-proxy");
const c = new logger.Logger(logger.LogLevel.INFO, "symbol_def");
class SymbolDefinitionProvider {}
exports.SymbolDefinitionProvider = SymbolDefinitionProvider;
let u = async function (e, t, n, r) {
  try {
    return await r.getSymbolDefinition(n);
  } catch (t) {
    c.exception(e, t, "Error retrieving definitions");
    return [];
  }
};
u = r.default(u, {
  cache: new i.LRUCacheMap(1e3),
  hash: (e, t, n, r) => `${n.uri}#${t}`
});
u = s.shortCircuit(u, 100, []);
exports.getSymbolDefSnippets = async function (e, t) {
  const n = e.get(SymbolDefinitionProvider);
  const r = await promptlibproxy.getCallSites(t);
  if (0 == r.length) return [];
  const i = [];
  for (const o of r) {
    const r = {
      ...t,
      position: o.position
    };
    const s = u(e, o.name, r, n);
    i.push(s);
  }
  return (await Promise.all(i)).flat();
};