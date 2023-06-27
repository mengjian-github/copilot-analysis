Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.getCursorContext = void 0;
  const r = require(1145);
  const i = {
    tokenizerName: r.TokenizerName.cushman002
  };
  exports.getCursorContext = function e(doc, opts = {}) {
    const opts = function (e) {
      return {
        ...i,
        ...e
      };
    }(opts);
    const s = r.getTokenizer(opts.tokenizerName);
    if (opts.cursorContextFix) {
      if (void 0 !== opts.maxLineCount && opts.maxLineCount < 0) throw new Error("maxLineCount must be non-negative if defined");
      if (void 0 !== opts.maxTokenLength && opts.maxTokenLength < 0) throw new Error("maxTokenLength must be non-negative if defined");
      if (0 === opts.maxLineCount || 0 === opts.maxTokenLength) return {
        context: "",
        lineCount: 0,
        tokenLength: 0,
        tokenizerName: opts.tokenizerName
      };
      let e = doc.source.slice(0, doc.offset);
      if (void 0 !== opts.maxLineCount) {
        e = e.split("\n").slice(-opts.maxLineCount).join("\n");
      }
      if (void 0 !== opts.maxTokenLength) {
        e = s.takeLastLinesTokens(e, opts.maxTokenLength);
      }
      return {
        context: e,
        lineCount: e.split("\n").length,
        tokenLength: s.tokenLength(e),
        tokenizerName: opts.tokenizerName
      };
    }
    if (void 0 === opts.maxTokenLength && void 0 !== opts.maxLineCount) {
      const e = doc.source.slice(0, doc.offset).split("\n").slice(-opts.maxLineCount);
      const n = e.join("\n");
      return {
        context: n,
        lineCount: e.length,
        tokenLength: s.tokenLength(n),
        tokenizerName: opts.tokenizerName
      };
    }
    if (void 0 !== opts.maxTokenLength && void 0 === opts.maxLineCount) {
      const e = s.takeLastLinesTokens(doc.source.slice(0, doc.offset), opts.maxTokenLength);
      return {
        context: e,
        lineCount: e.split("\n").length,
        tokenLength: s.tokenLength(e),
        tokenizerName: opts.tokenizerName
      };
    }
    if (void 0 !== opts.maxTokenLength && void 0 !== opts.maxLineCount) {
      const r = e(doc, {
        ...opts,
        maxTokenLength: void 0
      });
      return r.tokenLength > opts.maxTokenLength ? e(doc, {
        ...opts,
        maxLineCount: void 0
      }) : r;
    }
    throw new Error("Either maxTokenLength or maxLineCount must be defined");
  };