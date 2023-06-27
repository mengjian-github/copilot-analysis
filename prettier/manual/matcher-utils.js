Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.splitIntoWords = exports.FunctionalMatcher = exports.WindowedMatcher = exports.SortOptions = void 0;
  const r = require(8306);
  const i = require(8312);
  const o = require(4830);
  var s;
  !function (e) {
    e.Ascending = "ascending";
    e.Descending = "descending";
    e.None = "none";
  }(s = exports.SortOptions || (exports.SortOptions = {}));
  class a {
    constructor(e) {
      this.stopsForLanguage = h.get(e.languageId) ?? d;
    }
    tokenize(e) {
      return new Set(splitIntoWords(e).filter(e => !this.stopsForLanguage.has(e)));
    }
  }
  const c = new class {
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
  class WindowedMatcher {
    constructor(e, t) {
      this.referenceDoc = e;
      this.tokenizer = new a(e);
      if (t) {
        this._referenceTokens = this.tokenizer.tokenize(this.trimDocument(e));
      }
    }
    get referenceTokens() {
      if (void 0 === this._referenceTokens) {
        this._referenceTokens = this.tokenizer.tokenize(this._getCursorContextInfo(this.referenceDoc).context);
      }
      return this._referenceTokens;
    }
    sortScoredSnippets(e, t = s.Descending) {
      return t == s.Ascending ? e.sort((e, t) => e.score > t.score ? 1 : -1) : t == s.Descending ? e.sort((e, t) => e.score > t.score ? -1 : 1) : e;
    }
    retrieveAllSnippets(e, t = s.Descending) {
      const n = [];
      if (0 === e.source.length || 0 === this.referenceTokens.size) return n;
      const sourceArr = e.source.split("\n");
      const key = this.id() + ":" + e.source;
      const result = c.get(key) ?? [];
      const noCache = 0 == result.length;
      const tokens = noCache ? sourceArr.map(this.tokenizer.tokenize, this.tokenizer) : [];
      for (const [index, [startLine, endLine]] of this.getWindowsDelineations(sourceArr).entries()) {
        if (noCache) {
          const e = new Set();
          tokens.slice(startLine, endLine).forEach(t => t.forEach(e.add, e));
          result.push(e);
        }
        const r = result[index];
        const s = this.similarityScore(r, this.referenceTokens);
        n.push({
          score: s,
          startLine: startLine,
          endLine: endLine
        });
      }
      if (noCache) {
        c.put(key, result);
      }
      return this.sortScoredSnippets(n, t);
    }
    async findMatches(e, t = i.SnippetSelectionOption.BestMatch, n) {
      if (t == i.SnippetSelectionOption.BestMatch) {
        const t = await this.findBestMatch(e);
        return t ? [t] : [];
      }
      return t == i.SnippetSelectionOption.TopK && (await this.findTopKMatches(e, n)) || [];
    }
    async findBestMatch(e) {
      if (0 === e.source.length || 0 === this.referenceTokens.size) return;
      const t = e.source.split("\n");
      const n = this.retrieveAllSnippets(e, s.Descending);
      return 0 !== n.length && 0 !== n[0].score ? {
        snippet: t.slice(n[0].startLine, n[0].endLine).join("\n"),
        semantics: o.SnippetSemantics.Snippet,
        provider: o.SnippetProvider.NeighboringTabs,
        ...n[0]
      } : void 0;
    }
    async findTopKMatches(e, t = 1) {
      if (0 === e.source.length || 0 === this.referenceTokens.size || t < 1) return;
      const n = e.source.split("\n");
      const r = this.retrieveAllSnippets(e, s.Descending);
      if (0 === r.length || 0 === r[0].score) return;
      const i = [r[0]];
      for (let e = 1; e < r.length && i.length < t; e++) if (-1 == i.findIndex(t => r[e].startLine < t.endLine && r[e].endLine > t.startLine)) {
        i.push(r[e]);
      }
      return i.map(e => ({
        snippet: n.slice(e.startLine, e.endLine).join("\n"),
        semantics: o.SnippetSemantics.Snippet,
        provider: o.SnippetProvider.NeighboringTabs,
        ...e
      }));
    }
  }
  function splitIntoWords(e) {
    return e.split(/[^a-zA-Z0-9]/).filter(e => e.length > 0);
  }
  exports.WindowedMatcher = WindowedMatcher;
  exports.FunctionalMatcher = class extends WindowedMatcher {
    constructor(e, t) {
      super(e, t);
    }
    getMatchingScore(e) {
      const t = this.tokenizer.tokenize(e.source);
      const n = this.similarityScore(t, this.referenceTokens);
      return {
        snippet: e.source,
        score: n,
        startLine: 0,
        endLine: 0
      };
    }
    async findBestMatch(e) {
      const t = await this.findMatches(e);
      if (0 !== t.length && 0 !== t[0].score) return t[0];
    }
    async findMatches(e, t, n) {
      if (0 === e.source.length || 0 === this.referenceTokens.size) return [];
      const i = await async function (e) {
        let t = [];
        if (r.isSupportedLanguageId(e.languageId)) {
          const n = await r.getFunctionPositions(e.languageId, e.source);
          for (let r = 0; r < n.length; r++) {
            let {
              startIndex: i,
              endIndex: o
            } = n[r];
            let s = e.source.substring(i, o);
            t.push({
              source: s,
              relativePath: e.relativePath,
              languageId: e.languageId,
              uri: e.uri
            });
          }
        }
        return t;
      }(e);
      if (0 == i.length) {
        const t = e.source.split("\n");
        const n = this.retrieveAllSnippets(e, s.Descending);
        return 0 === n.length || 0 === n[0].score ? [] : [{
          snippet: t.slice(n[0].startLine, n[0].endLine).join("\n"),
          semantics: o.SnippetSemantics.Snippet,
          provider: o.SnippetProvider.NeighboringTabs,
          ...n[0]
        }];
      }
      const a = [];
      for (let e of i) {
        const t = this.getMatchingScore(e);
        a.push({
          semantics: o.SnippetSemantics.Function,
          provider: o.SnippetProvider.NeighboringTabs,
          ...t
        });
      }
      return a;
    }
  };
  exports.splitIntoWords = splitIntoWords;
  const p = new Set(["we", "our", "you", "it", "its", "they", "them", "their", "this", "that", "these", "those", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "can", "don", "t", "s", "will", "would", "should", "what", "which", "who", "when", "where", "why", "how", "a", "an", "the", "and", "or", "not", "no", "but", "because", "as", "until", "again", "further", "then", "once", "here", "there", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "above", "below", "to", "during", "before", "after", "of", "at", "by", "about", "between", "into", "through", "from", "up", "down", "in", "out", "on", "off", "over", "under", "only", "own", "same", "so", "than", "too", "very", "just", "now"]);
  const d = new Set(["if", "then", "else", "for", "while", "with", "def", "function", "return", "TODO", "import", "try", "catch", "raise", "finally", "repeat", "switch", "case", "match", "assert", "continue", "break", "const", "class", "enum", "struct", "static", "new", "super", "this", "var", ...p]);
  const h = new Map([]);