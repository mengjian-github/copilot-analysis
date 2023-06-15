Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.Priorities =
  exports.PromptWishlist =
  exports.PromptElementRanges =
  exports.PromptChoices =
  exports.PromptBackground =
  exports.PromptElementKind =
    void 0;
const r = require(8312);
var i;
!(function (e) {
  e.BeforeCursor = "BeforeCursor";
  e.AfterCursor = "AfterCursor";
  e.SimilarFile = "SimilarFile";
  e.RetrievalSnippet = "RetrievalSnippet";
  e.SymbolDefinition = "SymbolDefinition";
  e.ImportedFile = "ImportedFile";
  e.LanguageMarker = "LanguageMarker";
  e.PathMarker = "PathMarker";
})((i = exports.PromptElementKind || (exports.PromptElementKind = {})));
class PromptBackground {
  constructor() {
    this.used = new Map();
    this.unused = new Map();
  }
  markUsed(e) {
    if (this.IsSnippet(e)) {
      this.used.set(e.id, this.convert(e));
    }
  }
  undoMarkUsed(e) {
    if (this.IsSnippet(e)) {
      this.used.delete(e.id);
    }
  }
  markUnused(e) {
    if (this.IsSnippet(e)) {
      this.unused.set(e.id, this.convert(e));
    }
  }
  convert(e) {
    return {
      score: e.score.toFixed(4),
      length: e.text.length,
    };
  }
  IsSnippet(e) {
    return e.kind == i.SimilarFile || e.kind == i.RetrievalSnippet;
  }
}
exports.PromptBackground = PromptBackground;
class PromptChoices {
  constructor() {
    this.used = new Map();
    this.unused = new Map();
    this.usedCounts = new Map();
    this.unusedCounts = new Map();
  }
  markUsed(e) {
    this.used.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens);
    this.usedCounts.set(e.kind, (this.usedCounts.get(e.kind) || 0) + 1);
  }
  undoMarkUsed(e) {
    this.used.set(e.kind, (this.used.get(e.kind) || 0) - e.tokens);
    this.usedCounts.set(e.kind, (this.usedCounts.get(e.kind) || 0) - 1);
  }
  markUnused(e) {
    this.unused.set(e.kind, (this.unused.get(e.kind) || 0) + e.tokens);
    this.unusedCounts.set(e.kind, (this.unusedCounts.get(e.kind) || 0) + 1);
  }
}
exports.PromptChoices = PromptChoices;
class PromptElementRanges {
  constructor(e) {
    this.ranges = new Array();
    let t;
    let n = 0;
    for (const { element: r } of e)
      if (0 !== r.text.length) {
        if (t === i.BeforeCursor && r.kind === i.BeforeCursor) {
          this.ranges[this.ranges.length - 1].end += r.text.length;
        } else {
          this.ranges.push({
            kind: r.kind,
            start: n,
            end: n + r.text.length,
          });
        }
        t = r.kind;
        n += r.text.length;
      }
  }
}
exports.PromptElementRanges = PromptElementRanges;
exports.PromptWishlist = class {
  constructor(tokenizer, lineEndingOption) {
    this.tokenizer = tokenizer;
    this.content = [];
    this.lineEndingOption = lineEndingOption;
  }
  getContent() {
    return [...this.content];
  }
  convertLineEndings(e) {
    if (this.lineEndingOption === r.LineEndingOptions.ConvertToUnix) {
      e = e.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }
    return e;
  }
  append(
    text,
    kind,
    priority,
    tokens = this.tokenizer.tokenLength(text),
    i = NaN
  ) {
    text = this.convertLineEndings(text);
    const id = this.content.length;
    this.content.push({
      id: id,
      text: text,
      kind: kind,
      priority: priority,
      tokens: tokens,
      requires: [],
      excludes: [],
      score: score,
    });
    return id;
  }
  appendLineForLine(lines, kind, priority) {
    const lineArr = (lines = this.convertLineEndings(text)).split("\n");
    for (let i = 0; i < lineArr.length - 1; i++) lineArr[i] += "\n";
    const lines = [];
    lineArr.forEach((line) => {
      if ("\n" === line && lines.length > 0 && !lines[lines.length - 1].endsWith("\n\n")) {
        lines[lines.length - 1] += "\n";
      } else {
        lines.push(line);
      }
    });
    const result = [];
    lines.forEach((text, index) => {
      if ("" !== text) {
        result.push(this.append(text, kind, priority));
        if (index > 0) {
          this.content[this.content.length - 2].requires = [
            this.content[this.content.length - 1],
          ];
        }
      }
    });
    return result;
  }
  require(e, t) {
    const n = this.content.find((t) => t.id === e);
    const r = this.content.find((e) => e.id === t);
    if (n && r) {
      n.requires.push(r);
    }
  }
  exclude(e, t) {
    const n = this.content.find((t) => t.id === e);
    const r = this.content.find((e) => e.id === t);
    if (n && r) {
      n.excludes.push(r);
    }
  }
  fulfill(maxPromptLength) {
    const promptChoices = new PromptChoices();
    const promptBackground = new PromptBackground();
    const elements = this.content.map((e, t) => ({
      element: e,
      index: t,
    }));
    elements.sort((e, t) =>
      e.element.priority === t.element.priority
        ? t.index - e.index
        : t.element.priority - e.element.priority
    );
    const requires = new Set();
    const excludes = new Set();
    let lastElement;
    const results = [];
    let promptLength = maxPromptLength;
    elements.forEach((e) => {
      const element = e.element;
      const index = e.index;
      if (
        promptLength >= 0 &&
        (promptLength > 0 || void 0 === lastElement) &&
        element.requires.every((e) => requires.has(e.id)) &&
        !excludes.has(r.id)
      ) {
        let tokens = element.tokens;
        const nextElement = (function (e, t) {
          let n;
          let r = 1 / 0;
          for (const i of e)
            if (i.index > t && i.index < r) {
              n = i;
              r = i.index;
            }
          return n;
        })(results, index)?.element;
        if (element.text.endsWith("\n\n") && nextElement && !nextElement.text.match(/^\s/)) {
          tokens++;
        }
        if (promptLength >= tokens) {
            promptLength -= tokens;
            requires.add(r.id);
          element.excludes.forEach((e) => excludes.add(e.id));
          promptChoices.markUsed(element);
          promptBackground.markUsed(element);
          results.push(e);
        } else {
          if (void 0 === lastElement) {
            lastElement = e;
          } else {
            promptChoices.markUnused(e.element);
            promptBackground.markUnused(e.element);
          }
        }
      } else {
        promptChoices.markUnused(element);
        promptBackground.markUnused(element);
      }
    });
    u.sort((e, t) => e.index - t.index);
    let prefix = results.reduce((e, t) => e + t.element.text, "");
    let prefixLength = this.tokenizer.tokenLength(prefix);
    for (; prefixLength > maxPromptLength; ) {
      u.sort((e, t) =>
        t.element.priority === e.element.priority
          ? t.index - e.index
          : t.element.priority - e.element.priority
      );
      const e = u.pop();
      if (e) {
        promptChoices.undoMarkUsed(e.element);
        promptChoices.markUnused(e.element);
        promptBackground.undoMarkUsed(e.element);
        promptBackground.markUnused(e.element);
        if (void 0 !== lastElement) {
          promptChoices.markUnused(lastElement.element);
          promptBackground.markUnused(lastElement.element);
        }
        lastElement = void 0;
      }
      u.sort((e, t) => e.index - t.index);
      prefix = u.reduce((e, t) => e + t.element.text, "");
      prefixLength = this.tokenizer.tokenLength(prefix);
    }
    const f = [...u];
    if (void 0 !== lastElement) {
      f.push(lastElement);
      f.sort((e, t) => e.index - t.index);
      const prefix = f.reduce((e, t) => e + t.element.text, "");
      const prefixLength = this.tokenizer.tokenLength(prefix);
      if (prefixLength <= maxPromptLength) {
        promptChoices.markUsed(l.element);
        promptBackground.markUsed(l.element);
        const promptElementRanges = new PromptElementRanges(f);
        return {
          prefix: prefix,
          suffix: "",
          prefixLength: prefixLength,
          suffixLength: 0,
          promptChoices: promptChoices,
          promptBackground: promptBackground,
          promptElementRanges: promptElementRanges,
        };
      }
      promptChoices.markUnused(l.element);
      promptBackground.markUnused(l.element);
    }
    const m = new PromptElementRanges(u);
    return {
      prefix: prefix,
      suffix: "",
      prefixLength: prefixLength,
      suffixLength: 0,
      promptChoices: promptChoices,
      promptBackground: promptBackground,
      promptElementRanges: m,
    };
  }
};
class Priorities {
  constructor() {
    this.registeredPriorities = [0, 1];
  }
  register(e) {
    if (e > Priorities.TOP || e < Priorities.BOTTOM)
      throw new Error("Priority must be between 0 and 1");
    this.registeredPriorities.push(e);
    return e;
  }
  justAbove(...e) {
    const t = Math.max(...e);
    const n = Math.min(...this.registeredPriorities.filter((e) => e > t));
    return this.register((n + t) / 2);
  }
  justBelow(...e) {
    const t = Math.min(...e);
    const n = Math.max(...this.registeredPriorities.filter((e) => e < t));
    return this.register((n + t) / 2);
  }
  between(e, t) {
    if (
      this.registeredPriorities.some((n) => n > e && n < t) ||
      !this.registeredPriorities.includes(e) ||
      !this.registeredPriorities.includes(t)
    )
      throw new Error("Priorities must be adjacent in the list of priorities");
    return this.register((e + t) / 2);
  }
}
exports.Priorities = Priorities;
Priorities.TOP = 1;
Priorities.BOTTOM = 0;
