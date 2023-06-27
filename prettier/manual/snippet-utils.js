Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.processSnippetsForWishlist = exports.selectSnippets = exports.normalizeSnippetScore = exports.announceSnippet = exports.SnippetSemantics = exports.SnippetProvider = void 0;
  const r = require(2417);
  var i;
  var o;
  (o = exports.SnippetProvider || (exports.SnippetProvider = {})).NeighboringTabs = "neighboring-tabs";
  o.Retrieval = "retrieval";
  o.SymbolDef = "symbol-def";
  (function (e) {
    e.Function = "function";
    e.Snippet = "snippet";
    e.Variable = "variable";
    e.Parameter = "parameter";
    e.Method = "method";
    e.Class = "class";
    e.Module = "module";
    e.Alias = "alias";
    e.Enum = "enum member";
    e.Interface = "interface";
  })(i = exports.SnippetSemantics || (exports.SnippetSemantics = {}));
  const s = {
    [i.Function]: "function",
    [i.Snippet]: "snippet",
    [i.Variable]: "variable",
    [i.Parameter]: "parameter",
    [i.Method]: "method",
    [i.Class]: "class",
    [i.Module]: "module",
    [i.Alias]: "alias",
    [i.Enum]: "enum member",
    [i.Interface]: "interface"
  };
  function announceSnippet(e, t) {
    const n = s[e.semantics];
    let i = (e.relativePath ? `Compare this ${n} from ${e.relativePath}:` : `Compare this ${n}:`) + "\n" + e.snippet;
    if (i.endsWith("\n")) {
      i += "\n";
    }
    return r.commentBlockAsSingles(i, t);
  }
  function normalizeSnippetScore(e, t) {
    const n = t[e.provider];
    if (!n) throw new Error("Unknown snippet provider: " + e.provider);
    const {
      score: r,
      ...i
    } = e;
    let o = r;
    if ("affine" !== n.normalizationFunction) throw new Error(`Unknown normalization function ${n.normalizationFunction} for snippet provider ${e.provider}`);
    {
      const [e, t] = n.normalizationParams;
      o = e * r + t;
    }
    return {
      ...i,
      providerScore: r,
      normalizedScore: o
    };
  }
  function sort(e) {
    e.sort((e, t) => t.normalizedScore - e.normalizedScore);
  }

  // snippets, numberOfSnippets, snippetProviderOptions
  function selectSnippets(snippets, numberOfSnippets, snippetProviderOptions) {
    if (0 == numberOfSnippets) return {
      reserved: [],
      candidates: []
    };
    const normalizeSnippets = snippets.map(e => normalizeSnippetScore(e, snippetProviderOptions));
    const i = new Map();
    let o;
    for (o in snippetProviderOptions) i.set(o, []);
    for (const e of normalizeSnippets) {
      let t = i.get(e.provider);
      if (!t) throw new Error("Unknown snippet provider: " + e.provider);
      t.push(e);
    }
    for (const [e, t] of i) sort(t);
    let reserved = [];
    for (o in snippetProviderOptions) {
      const e = snippetProviderOptions[o].reservedSnippetCount || 0;
      if (e > 0) {
        const t = i.get(o) || [];
        reserved = reserved.concat(t.slice(0, e));
        i.set(o, t.slice(e));
      }
    }
    sort(reserved);
    let candidates = [];
    if (reserved.length > numberOfSnippets) throw new Error("Reserved snippet count exceeds number of snippets");
    if (reserved.length < numberOfSnippets) {
      const e = Array.from(i.values()).flat();
      sort(e);
      candidates = e.slice(0, numberOfSnippets - reserved.length);
    }
    return {
      reserved: reserved,
      candidates: candidates
    };
  }
  exports.announceSnippet = announceSnippet;
  exports.normalizeSnippetScore = normalizeSnippetScore;
  exports.selectSnippets = selectSnippets;
  /**
   * snippets,
      resourceInfo.languageId,
      tokenizer,
      promptOpts.snippetProviderOptions,
      {
        priorities: priorities,
        low: lowSnippetPriority,
        high: highSnippetPriority,
      },
      promptOpts.numberOfSnippets,
      maxSnippetLength
   * @returns 
   */
  exports.processSnippetsForWishlist = function (snippets, languageId, tokenizer, snippetProviderOptions, priorities, numberOfSnippets, maxSnippetLength) {
    const {
      reserved: reserved,
      candidates: candidates
    } = selectSnippets(snippets, numberOfSnippets, snippetProviderOptions);
    let d = 0;
    let h = [];
    let highPriorities = priorities.high;
    let lowPriorities = priorities.low;
    function g(snippet, r) {
      const o = announceSnippet(snippet, languageId);
      const c = tokenizer.tokenLength(o);
      let l;
      if (r + c <= maxSnippetLength) {
        l = highPriorities;
        highPriorities = priorities.priorities.justBelow(l);
      } else {
        l = lowPriorities;
        lowPriorities = priorities.priorities.justBelow(l);
      }
      h.push({
        announcedSnippet: o,
        provider: snippet.provider,
        providerScore: snippet.providerScore,
        normalizedScore: snippet.normalizedScore,
        priority: l,
        tokens: c,
        relativePath: snippet.relativePath
      });
      return r + c;
    }
    for (const snippet of [...reserved, ...candidates]) {
      if (h.length >= numberOfSnippets) break;
      d = g(snippete, d);
    }
    l(h);
    h.reverse();
    return h;
  };