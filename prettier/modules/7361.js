Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CursorHistoryMatcher = exports.CursorSnippetsPickingStrategy = void 0;
const r = require(61747);
const i = require(90630);
const o = require(569);
const s = require(31016);
const a = require(66366);
const c = require(40744);
var l;
!function (e) {
  e.CursorOnly = "cursoronly";
  e.CursorJaccard = "cursorjaccard";
  e.JaccardCursor = "jaccardcursor";
}(l = exports.CursorSnippetsPickingStrategy || (exports.CursorSnippetsPickingStrategy = {}));
const u = new class {
  constructor(e) {
    this.keys = [];
    this.cache = {};
    this.size = e;
  }
  put(e, t) {
    this.cache[e] = t;
    if (this.keys.length > this.size) {
      this.keys.push(e);
      const t = this.keys.shift() ?? "";
      delete this.cache[t];
    }
  }
  get(e) {
    return this.cache[e];
  }
}(20);
class p extends s.WindowedMatcher {
  constructor(e, t, n) {
    super(e, n);
    this.windowLength = t;
    this.cursorContextFix = n;
  }
  id() {
    return "CustomizedFixedWindowSizeJaccardMatcher:" + this.windowLength;
  }
  getWindowsDelineations(e) {
    return c.getBasicWindowDelineations(this.windowLength, e);
  }
  trimDocument(e) {
    return e.source.slice(0, e.offset).split("\n").slice(-this.windowLength).join("\n");
  }
  _getCursorContextInfo(e) {
    return i.getCursorContext(e, {
      maxLineCount: this.windowLength,
      cursorContextFix: this.cursorContextFix
    });
  }
  similarityScore(e, t) {
    return o.computeScore(e, t);
  }
  retrieveAllSnippets(e, t = s.SortOptions.Descending, n) {
    const r = [];
    if (0 === e.source.length || 0 === this.referenceTokens.size) return r;
    const i = e.source.split("\n");
    const o = this.id() + ":" + e.source;
    const a = u.get(o) ?? [];
    const c = 0 == a.length;
    const l = c ? i.map(this.tokenizer.tokenize, this.tokenizer) : [];
    for (const [e, [t, o]] of this.getWindowsDelineations(i).entries()) {
      if (c) {
        const e = new Set();
        l.slice(t, o).forEach(t => t.forEach(e.add, e));
        a.push(e);
      }
      if (void 0 !== n && n.get(t) !== o) continue;
      const i = a[e];
      const s = this.similarityScore(i, this.referenceTokens);
      r.push({
        score: s,
        startLine: t,
        endLine: o
      });
    }
    if (c) {
      u.put(o, a);
    }
    return this.sortScoredSnippets(r, t);
  }
}
class CursorHistoryMatcher {
  constructor(e, t, n, r, i) {
    this.windowLength = t;
    this.lineCursorHistory = n;
    this.jaccardMatcher = new p(e, t, i);
    this.strategy = r;
  }
  sortScoredSnippets(e, t = s.SortOptions.Descending) {
    return t == s.SortOptions.Ascending ? e.sort((e, t) => e.score > t.score ? 1 : -1) : t == s.SortOptions.Descending ? e.sort((e, t) => e.score > t.score ? -1 : 1) : e;
  }
  markerToSnippet(e, t) {
    return e.map(e => ({
      snippet: t.slice(e.startLine, e.endLine).join("\n"),
      provider: a.SnippetProvider.NeighboringTabs,
      semantics: a.SnippetSemantics.Snippet,
      ...e
    }));
  }
  async findMatches(e, t = r.SnippetSelectionOption.BestMatch, n) {
    if (t == r.SnippetSelectionOption.BestMatch) {
      const t = await this.findBestMatch(e);
      return void 0 === t ? [] : [t];
    }
    return t == r.SnippetSelectionOption.TopK && (await this.findTopKMatches(e, n)) || [];
  }
  async findBestMatch(e) {
    if (0 !== e.source.length) {
      if (this.strategy === l.CursorOnly) {
        let t = this.retrieveCursorSnippets(e);
        t = this.sortScoredSnippets(t, s.SortOptions.Descending);
        if (0 === t.length) return;
        const n = Math.max(...t.map(e => e.score));
        const r = t.filter(e => e.score === n);
        const i = r.sort((e, t) => e.startLine - t.startLine)[Math.floor(r.length / 2)];
        return {
          snippet: e.source.split("\n").slice(i.startLine, i.endLine).join("\n"),
          provider: a.SnippetProvider.NeighboringTabs,
          semantics: a.SnippetSemantics.Snippet,
          ...i
        };
      }
      if (this.strategy === l.CursorJaccard) {
        let t = this.retrieveCursorSnippets(e);
        t = this.sortScoredSnippets(t, s.SortOptions.Descending);
        if (0 === t.length) return;
        const n = Math.max(...t.map(e => e.score));
        const r = [];
        const i = new Map();
        for (const e of t) if (e.score === n) {
          r.push(e);
          i.set(e.startLine, e.endLine);
        }
        const o = this.jaccardMatcher.retrieveAllSnippets(e, s.SortOptions.Descending, i);
        if (0 === o.length) return;
        const c = o[0];
        for (const e of t) if (e.startLine === c.startLine && e.endLine === c.endLine) {
          c.score += e.score;
          break;
        }
        return {
          snippet: e.source.split("\n").slice(c.startLine, c.endLine).join("\n"),
          provider: a.SnippetProvider.NeighboringTabs,
          semantics: a.SnippetSemantics.Snippet,
          ...c
        };
      }
      if (this.strategy === l.JaccardCursor) {
        const t = await this.jaccardMatcher.findBestMatch(e);
        if (void 0 === t) return;
        let n = this.retrieveCursorSnippets(e);
        n = this.sortScoredSnippets(n, s.SortOptions.Descending);
        if (0 === n.length) return;
        for (const e of n) if (e.startLine === t.startLine && e.endLine === t.endLine) {
          t.score += e.score;
          break;
        }
        return t;
      }
    }
  }
  async findTopKMatches(e, t = 1) {
    if (0 === e.source.length || t < 1) return;
    const n = e.source.split("\n");
    let r = this.retrieveCursorSnippets(e);
    if (0 !== r.length) {
      if (this.strategy === l.CursorOnly) {
        r = this.sortScoredSnippets(r, s.SortOptions.Descending);
        let e = this.gatherNonOverlappingSnippets(r, t);
        return this.markerToSnippet(e, n);
      }
      if (this.strategy === l.CursorJaccard) {
        r = this.sortScoredSnippets(r, s.SortOptions.Descending);
        const i = new Map(r.map(e => [e.startLine, e.endLine]));
        const o = this.jaccardMatcher.retrieveAllSnippets(e, s.SortOptions.Descending, i).reduce((e, t) => e.set([t.startLine, t.endLine].join(","), t.score), new Map());
        r.forEach(e => e.score += o.get([e.startLine, e.endLine].join(",")) ?? 0);
        r = this.sortScoredSnippets(r, s.SortOptions.Descending);
        let a = this.gatherNonOverlappingSnippets(r, t);
        return this.markerToSnippet(a, n);
      }
      if (this.strategy === l.JaccardCursor) {
        const i = await this.jaccardMatcher.findTopKMatches(e, t);
        if (void 0 === i) return;
        const o = r.reduce((e, t) => e.set([t.startLine, t.endLine].join(","), t.score), new Map());
        i.forEach(e => e.score += o.get([e.startLine, e.endLine].join(",")) ?? 0);
        const a = this.sortScoredSnippets(i, s.SortOptions.Descending);
        return this.markerToSnippet(a, n);
      }
    }
  }
  gatherNonOverlappingSnippets(e, t) {
    let n = [e[0]];
    for (let r = 1; r < e.length && n.length < t; r++) if (-1 == n.findIndex(t => e[r].startLine < t.endLine && e[r].endLine > t.startLine)) {
      n.push(e[r]);
    }
    return n;
  }
  retrieveCursorSnippets(e) {
    const t = [];
    if (0 === e.source.length) return t;
    const n = this.lineCursorHistory.get(e.uri);
    if (void 0 === n) return t;
    const r = e.source.split("\n");
    let i;
    !function (e) {
      e[e.leftBoundary = 0] = "leftBoundary";
      e[e.rightBoundary = 1] = "rightBoundary";
    }(i || (i = {}));
    let o = [];
    for (const [e, t] of n.entries()) if (e >= r.length) {
      o.push([Math.max(0, e - this.windowLength + 1), i.leftBoundary, t]);
      o.push([e + 1, i.rightBoundary, t]);
    }
    o.push([r.length, i.leftBoundary, 0]);
    o = o.sort((e, t) => e[0] - t[0]);
    let s = 0;
    let a = 0;
    for (const [e, n, c] of o) {
      if (s > 0) for (let n = a; n < e && (0 == n || n + this.windowLength <= r.length); n++) t.push({
        score: s,
        startLine: n,
        endLine: Math.min(r.length, n + this.windowLength)
      });
      if (n === i.leftBoundary) {
        s += c;
      } else {
        s -= c;
      }
      a = e;
    }
    return t;
  }
}
CursorHistoryMatcher.FACTORY = (e, t, n, r) => ({
  to: i => new CursorHistoryMatcher(i, e, t, n, r)
});
exports.CursorHistoryMatcher = CursorHistoryMatcher;