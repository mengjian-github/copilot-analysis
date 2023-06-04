Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getCursorContext = void 0;
const r = require(1145);
const i = {
  tokenizerName: r.TokenizerName.cushman002
};
exports.getCursorContext = function e(t, n = {}) {
  const o = function (e) {
    return {
      ...i,
      ...e
    };
  }(n);
  const s = r.getTokenizer(o.tokenizerName);
  if (o.cursorContextFix) {
    if (void 0 !== o.maxLineCount && o.maxLineCount < 0) throw new Error("maxLineCount must be non-negative if defined");
    if (void 0 !== o.maxTokenLength && o.maxTokenLength < 0) throw new Error("maxTokenLength must be non-negative if defined");
    if (0 === o.maxLineCount || 0 === o.maxTokenLength) return {
      context: "",
      lineCount: 0,
      tokenLength: 0,
      tokenizerName: o.tokenizerName
    };
    let e = t.source.slice(0, t.offset);
    if (void 0 !== o.maxLineCount) {
      e = e.split("\n").slice(-o.maxLineCount).join("\n");
    }
    if (void 0 !== o.maxTokenLength) {
      e = s.takeLastLinesTokens(e, o.maxTokenLength);
    }
    return {
      context: e,
      lineCount: e.split("\n").length,
      tokenLength: s.tokenLength(e),
      tokenizerName: o.tokenizerName
    };
  }
  if (void 0 === o.maxTokenLength && void 0 !== o.maxLineCount) {
    const e = t.source.slice(0, t.offset).split("\n").slice(-o.maxLineCount);
    const n = e.join("\n");
    return {
      context: n,
      lineCount: e.length,
      tokenLength: s.tokenLength(n),
      tokenizerName: o.tokenizerName
    };
  }
  if (void 0 !== o.maxTokenLength && void 0 === o.maxLineCount) {
    const e = s.takeLastLinesTokens(t.source.slice(0, t.offset), o.maxTokenLength);
    return {
      context: e,
      lineCount: e.split("\n").length,
      tokenLength: s.tokenLength(e),
      tokenizerName: o.tokenizerName
    };
  }
  if (void 0 !== o.maxTokenLength && void 0 !== o.maxLineCount) {
    const r = e(t, {
      ...n,
      maxTokenLength: void 0
    });
    return r.tokenLength > o.maxTokenLength ? e(t, {
      ...n,
      maxLineCount: void 0
    }) : r;
  }
  throw new Error("Either maxTokenLength or maxLineCount must be defined");
};