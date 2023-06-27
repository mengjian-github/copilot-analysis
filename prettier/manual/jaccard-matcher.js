Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.computeScore = exports.FunctionJaccardMatcher = exports.IndentationBasedJaccardMatcher = exports.FixedWindowSizeJaccardMatcher = void 0;
  const r = require(648);
  const i = require(1467);
  const o = require(5380);
  class FixedWindowSizeJaccardMatcher extends i.WindowedMatcher {
    constructor(resourceInfo, snippetLength, cursorContextFix) {
      super(resourceInfo, cursorContextFix);
      this.windowLength = snippetLength;
      this.cursorContextFix = cursorContextFix;
    }
    id() {
      return "fixed:" + this.windowLength;
    }
    getWindowsDelineations(e) {
      return o.getBasicWindowDelineations(this.windowLength, e);
    }
    trimDocument(e) {
      return e.source.slice(0, e.offset).split("\n").slice(-this.windowLength).join("\n");
    }
    _getCursorContextInfo(e) {
      return r.getCursorContext(e, {
        maxLineCount: this.windowLength,
        cursorContextFix: this.cursorContextFix
      });
    }
    similarityScore(e, t) {
      return computeScore(e, t);
    }
  }
  exports.FixedWindowSizeJaccardMatcher = FixedWindowSizeJaccardMatcher;
  FixedWindowSizeJaccardMatcher.FACTORY = (e, t) => ({
    to: n => new FixedWindowSizeJaccardMatcher(n, e, t)
  });
  class IndentationBasedJaccardMatcher extends i.WindowedMatcher {
    constructor(e, t, n, r) {
      super(e, r);
      this.indentationMinLength = t;
      this.indentationMaxLength = n;
      this.languageId = e.languageId;
      this.cursorContextFix = r;
    }
    id() {
      return `indent:${this.indentationMinLength}:${this.indentationMaxLength}:${this.languageId}`;
    }
    getWindowsDelineations(e) {
      const t = o.getIndentationWindowsDelineations(e, this.languageId, this.indentationMinLength, this.indentationMaxLength);
      return t.length > 0 ? t : e.length < this.indentationMinLength ? [[0, e.length]] : [];
    }
    trimDocument(e) {
      return e.source.slice(0, e.offset).split("\n").slice(-this.indentationMaxLength).join("\n");
    }
    _getCursorContextInfo(e) {
      return r.getCursorContext(e, {
        maxLineCount: this.indentationMaxLength,
        cursorContextFix: this.cursorContextFix
      });
    }
    similarityScore(e, t) {
      return computeScore(e, t);
    }
  }
  exports.IndentationBasedJaccardMatcher = IndentationBasedJaccardMatcher;
  IndentationBasedJaccardMatcher.FACTORY = (e, t, n) => ({
    to: r => new IndentationBasedJaccardMatcher(r, e, t, n)
  });
  class FunctionJaccardMatcher extends i.FunctionalMatcher {
    id() {
      return "function:" + this.windowLength;
    }
    getWindowsDelineations(e) {
      return void 0 !== this.indentationMaxLength && void 0 !== this.indentationMinLength ? o.getIndentationWindowsDelineations(e, this.languageId, this.indentationMinLength, this.indentationMaxLength) : o.getBasicWindowDelineations(this.windowLength, e);
    }
    constructor(e, t, n, r, i) {
      super(e, n);
      this.windowLength = t;
      this.indentationMinLength = r;
      this.indentationMaxLength = i;
      this.languageId = e.languageId;
      this.cursorContextFix = n;
    }
    trimDocument(e) {
      return e.source.slice(0, e.offset).split("\n").slice(-this.windowLength).join("\n");
    }
    _getCursorContextInfo(e) {
      return r.getCursorContext(e, {
        maxLineCount: this.windowLength,
        cursorContextFix: this.cursorContextFix
      });
    }
    similarityScore(e, t) {
      return computeScore(e, t);
    }
  }
  function computeScore(e, t) {
    const n = new Set();
    e.forEach(e => {
      if (t.has(e)) {
        n.add(e);
      }
    });
    return n.size / (e.size + t.size - n.size);
  }
  exports.FunctionJaccardMatcher = FunctionJaccardMatcher;
  FunctionJaccardMatcher.FACTORY = (e, t, n, r) => ({
    to: i => new FunctionJaccardMatcher(i, e, t, n, r)
  });
  exports.computeScore = computeScore;