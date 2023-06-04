Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.Priorities = exports.PromptWishlist = exports.PromptElementRanges = exports.PromptChoices = exports.PromptBackground = exports.PromptElementKind = void 0;
const r = require(61747);
var i;
!function (e) {
  e.BeforeCursor = "BeforeCursor";
  e.AfterCursor = "AfterCursor";
  e.SimilarFile = "SimilarFile";
  e.RetrievalSnippet = "RetrievalSnippet";
  e.SymbolDefinition = "SymbolDefinition";
  e.ImportedFile = "ImportedFile";
  e.LanguageMarker = "LanguageMarker";
  e.PathMarker = "PathMarker";
}(i = exports.PromptElementKind || (exports.PromptElementKind = {}));
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
      length: e.text.length
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
    for (const {
      element: r
    } of e) if (0 !== r.text.length) {
      if (t === i.BeforeCursor && r.kind === i.BeforeCursor) {
        this.ranges[this.ranges.length - 1].end += r.text.length;
      } else {
        this.ranges.push({
          kind: r.kind,
          start: n,
          end: n + r.text.length
        });
      }
      t = r.kind;
      n += r.text.length;
    }
  }
}
exports.PromptElementRanges = PromptElementRanges;
exports.PromptWishlist = class {
  constructor(e, t) {
    this.tokenizer = e;
    this.content = [];
    this.tokenizer = e;
    this.lineEndingOption = t;
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
  append(e, t, n, r = this.tokenizer.tokenLength(e), i = NaN) {
    e = this.convertLineEndings(e);
    const o = this.content.length;
    this.content.push({
      id: o,
      text: e,
      kind: t,
      priority: n,
      tokens: r,
      requires: [],
      excludes: [],
      score: i
    });
    return o;
  }
  appendLineForLine(e, t, n) {
    const r = (e = this.convertLineEndings(e)).split("\n");
    for (let e = 0; e < r.length - 1; e++) r[e] += "\n";
    const i = [];
    r.forEach((e, t) => {
      if ("\n" === e && i.length > 0 && !i[i.length - 1].endsWith("\n\n")) {
        i[i.length - 1] += "\n";
      } else {
        i.push(e);
      }
    });
    const o = [];
    i.forEach((e, r) => {
      if ("" !== e) {
        o.push(this.append(e, t, n));
        if (r > 0) {
          this.content[this.content.length - 2].requires = [this.content[this.content.length - 1]];
        }
      }
    });
    return o;
  }
  require(e, t) {
    const n = this.content.find(t => t.id === e);
    const r = this.content.find(e => e.id === t);
    if (n && r) {
      n.requires.push(r);
    }
  }
  exclude(e, t) {
    const n = this.content.find(t => t.id === e);
    const r = this.content.find(e => e.id === t);
    if (n && r) {
      n.excludes.push(r);
    }
  }
  fulfill(e) {
    const t = new PromptChoices();
    const n = new PromptBackground();
    const r = this.content.map((e, t) => ({
      element: e,
      index: t
    }));
    r.sort((e, t) => e.element.priority === t.element.priority ? t.index - e.index : t.element.priority - e.element.priority);
    const i = new Set();
    const c = new Set();
    let l;
    const u = [];
    let p = e;
    r.forEach(e => {
      const r = e.element;
      const o = e.index;
      if (p >= 0 && (p > 0 || void 0 === l) && r.requires.every(e => i.has(e.id)) && !c.has(r.id)) {
        let s = r.tokens;
        const a = function (e, t) {
          let n;
          let r = 1 / 0;
          for (const i of e) if (i.index > t && i.index < r) {
            n = i;
            r = i.index;
          }
          return n;
        }(u, o)?.element;
        if (r.text.endsWith("\n\n") && a && !a.text.match(/^\s/)) {
          s++;
        }
        if (p >= s) {
          p -= s;
          i.add(r.id);
          r.excludes.forEach(e => c.add(e.id));
          t.markUsed(r);
          n.markUsed(r);
          u.push(e);
        } else {
          if (void 0 === l) {
            l = e;
          } else {
            t.markUnused(e.element);
            n.markUnused(e.element);
          }
        }
      } else {
        t.markUnused(r);
        n.markUnused(r);
      }
    });
    u.sort((e, t) => e.index - t.index);
    let d = u.reduce((e, t) => e + t.element.text, "");
    let h = this.tokenizer.tokenLength(d);
    for (; h > e;) {
      u.sort((e, t) => t.element.priority === e.element.priority ? t.index - e.index : t.element.priority - e.element.priority);
      const e = u.pop();
      if (e) {
        t.undoMarkUsed(e.element);
        t.markUnused(e.element);
        n.undoMarkUsed(e.element);
        n.markUnused(e.element);
        if (void 0 !== l) {
          t.markUnused(l.element);
          n.markUnused(l.element);
        }
        l = void 0;
      }
      u.sort((e, t) => e.index - t.index);
      d = u.reduce((e, t) => e + t.element.text, "");
      h = this.tokenizer.tokenLength(d);
    }
    const f = [...u];
    if (void 0 !== l) {
      f.push(l);
      f.sort((e, t) => e.index - t.index);
      const r = f.reduce((e, t) => e + t.element.text, "");
      const i = this.tokenizer.tokenLength(r);
      if (i <= e) {
        t.markUsed(l.element);
        n.markUsed(l.element);
        const e = new PromptElementRanges(f);
        return {
          prefix: r,
          suffix: "",
          prefixLength: i,
          suffixLength: 0,
          promptChoices: t,
          promptBackground: n,
          promptElementRanges: e
        };
      }
      t.markUnused(l.element);
      n.markUnused(l.element);
    }
    const m = new PromptElementRanges(u);
    return {
      prefix: d,
      suffix: "",
      prefixLength: h,
      suffixLength: 0,
      promptChoices: t,
      promptBackground: n,
      promptElementRanges: m
    };
  }
};
class Priorities {
  constructor() {
    this.registeredPriorities = [0, 1];
  }
  register(e) {
    if (e > Priorities.TOP || e < Priorities.BOTTOM) throw new Error("Priority must be between 0 and 1");
    this.registeredPriorities.push(e);
    return e;
  }
  justAbove(...e) {
    const t = Math.max(...e);
    const n = Math.min(...this.registeredPriorities.filter(e => e > t));
    return this.register((n + t) / 2);
  }
  justBelow(...e) {
    const t = Math.min(...e);
    const n = Math.max(...this.registeredPriorities.filter(e => e < t));
    return this.register((n + t) / 2);
  }
  between(e, t) {
    if (this.registeredPriorities.some(n => n > e && n < t) || !this.registeredPriorities.includes(e) || !this.registeredPriorities.includes(t)) throw new Error("Priorities must be adjacent in the list of priorities");
    return this.register((e + t) / 2);
  }
}
Priorities.TOP = 1;
Priorities.BOTTOM = 0;
exports.Priorities = Priorities;