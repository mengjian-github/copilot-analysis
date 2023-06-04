Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getSiblingFunctionStart = void 0;
const r = require(10464);
exports.getSiblingFunctionStart = async function ({
  source: e,
  offset: t,
  languageId: n
}) {
  if (r.isSupportedLanguageId(n)) {
    const i = await r.parseTreeSitter(n, e);
    try {
      let o = t;
      for (; o >= 0 && /\s/.test(e[o]);) o--;
      const s = i.rootNode.descendantForIndex(o);
      const a = r.getAncestorWithSiblingFunctions(n, s);
      if (a) {
        for (let e = a.nextSibling; e; e = e.nextSibling) if (r.isFunctionDefinition(n, e)) {
          const n = r.getFirstPrecedingComment(e)?.startIndex ?? e.startIndex;
          if (n < t) continue;
          return n;
        }
        if (a.endIndex >= t) return a.endIndex;
      }
    } finally {
      i.delete();
    }
  }
  return t;
};