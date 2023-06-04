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
function l(e) {
  e.sort((e, t) => t.normalizedScore - e.normalizedScore);
}
function selectSnippets(e, t, n) {
  if (0 == t) return {
    reserved: [],
    candidates: []
  };
  const r = e.map(e => normalizeSnippetScore(e, n));
  const i = new Map();
  let o;
  for (o in n) i.set(o, []);
  for (const e of r) {
    let t = i.get(e.provider);
    if (!t) throw new Error("Unknown snippet provider: " + e.provider);
    t.push(e);
  }
  for (const [e, t] of i) l(t);
  let s = [];
  for (o in n) {
    const e = n[o].reservedSnippetCount || 0;
    if (e > 0) {
      const t = i.get(o) || [];
      s = s.concat(t.slice(0, e));
      i.set(o, t.slice(e));
    }
  }
  l(s);
  let a = [];
  if (s.length > t) throw new Error("Reserved snippet count exceeds number of snippets");
  if (s.length < t) {
    const e = Array.from(i.values()).flat();
    l(e);
    a = e.slice(0, t - s.length);
  }
  return {
    reserved: s,
    candidates: a
  };
}
exports.announceSnippet = announceSnippet;
exports.normalizeSnippetScore = normalizeSnippetScore;
exports.selectSnippets = selectSnippets;
exports.processSnippetsForWishlist = function (e, t, n, r, i, o, s) {
  const {
    reserved: c,
    candidates: p
  } = selectSnippets(e, o, r);
  let d = 0;
  let h = [];
  let f = i.high;
  let m = i.low;
  function g(e, r) {
    const o = announceSnippet(e, t);
    const c = n.tokenLength(o);
    let l;
    if (r + c <= s) {
      l = f;
      f = i.priorities.justBelow(l);
    } else {
      l = m;
      m = i.priorities.justBelow(l);
    }
    h.push({
      announcedSnippet: o,
      provider: e.provider,
      providerScore: e.providerScore,
      normalizedScore: e.normalizedScore,
      priority: l,
      tokens: c,
      relativePath: e.relativePath
    });
    return r + c;
  }
  for (const e of [...c, ...p]) {
    if (h.length >= o) break;
    d = g(e, d);
  }
  l(h);
  h.reverse();
  return h;
};