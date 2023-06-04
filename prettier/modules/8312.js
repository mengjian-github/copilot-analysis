Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getPrompt = exports.newLineEnded = exports.normalizeLanguageId = exports.PromptOptions = exports.SuffixStartMode = exports.SuffixMatchOption = exports.SuffixOption = exports.LineEndingOptions = exports.LocalImportContextOption = exports.SnippetSelectionOption = exports.SnippetPositionOption = exports.PathMarkerOption = exports.LanguageMarkerOption = exports.DEFAULT_NUM_OF_SNIPPETS = exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = exports.MAX_EDIT_DISTANCE_LENGTH = exports.MAX_PROMPT_LENGTH = void 0;
const r = require(2417);
const i = require(5179);
const o = require(7670);
const s = require(6845);
const a = require(9125);
const c = require(4830);
const l = require(2395);
const u = require(1145);
const p = require(4456);
let d = {
  text: "",
  tokens: []
};
var h;
var f;
var m;
var g;
var y;
var _;
var v;
var b;
var E;
exports.MAX_PROMPT_LENGTH = 1500;
exports.MAX_EDIT_DISTANCE_LENGTH = 50;
exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = 5;
exports.DEFAULT_NUM_OF_SNIPPETS = 4;
(function (e) {
  e.NoMarker = "nomarker";
  e.Top = "top";
  e.Always = "always";
})(h = exports.LanguageMarkerOption || (exports.LanguageMarkerOption = {}));
(function (e) {
  e.NoMarker = "nomarker";
  e.Top = "top";
  e.Always = "always";
})(f = exports.PathMarkerOption || (exports.PathMarkerOption = {}));
(function (e) {
  e.TopOfText = "top";
  e.DirectlyAboveCursor = "aboveCursor";
  e.AfterSiblings = "afterSiblings";
})(m = exports.SnippetPositionOption || (exports.SnippetPositionOption = {}));
(function (e) {
  e.BestMatch = "bestMatch";
  e.TopK = "topK";
})(g = exports.SnippetSelectionOption || (exports.SnippetSelectionOption = {}));
(function (e) {
  e.NoContext = "nocontext";
  e.Declarations = "declarations";
})(y = exports.LocalImportContextOption || (exports.LocalImportContextOption = {}));
(function (e) {
  e.ConvertToUnix = "unix";
  e.KeepOriginal = "keep";
})(_ = exports.LineEndingOptions || (exports.LineEndingOptions = {}));
(E = exports.SuffixOption || (exports.SuffixOption = {})).None = "none";
E.FifteenPercent = "fifteenPercent";
(function (e) {
  e.Equal = "equal";
  e.Levenshtein = "levenshteineditdistance";
})(v = exports.SuffixMatchOption || (exports.SuffixMatchOption = {}));
(function (e) {
  e.Cursor = "cursor";
  e.CursorTrimStart = "cursortrimstart";
  e.SiblingBlock = "siblingblock";
  e.SiblingBlockTrimStart = "siblingblocktrimstart";
})(b = exports.SuffixStartMode || (exports.SuffixStartMode = {}));
class PromptOptions {
  constructor(e, n) {
    this.fs = e;
    this.maxPromptLength = exports.MAX_PROMPT_LENGTH;
    this.languageMarker = h.Top;
    this.pathMarker = f.Top;
    this.localImportContext = y.Declarations;
    this.snippetPosition = m.TopOfText;
    this.numberOfSnippets = exports.DEFAULT_NUM_OF_SNIPPETS;
    this.snippetProviderOptions = {
      "neighboring-tabs": {
        normalizationFunction: "affine",
        normalizationParams: [1, 0]
      },
      retrieval: {
        normalizationFunction: "affine",
        normalizationParams: [-1, 0]
      },
      "symbol-def": {
        normalizationFunction: "affine",
        normalizationParams: [1, 0],
        reservedSnippetCount: 2
      }
    };
    this.neighboringTabs = a.NeighboringTabsOption.Eager;
    this.neighboringSnippetTypes = a.NeighboringSnippetType.NeighboringSnippets;
    this.lineEnding = _.ConvertToUnix;
    this.suffixPercent = 0;
    this.snippetPercent = 0;
    this.suffixStartMode = b.Cursor;
    this.tokenizerName = u.TokenizerName.cushman001;
    this.suffixMatchThreshold = 0;
    this.suffixMatchCriteria = v.Levenshtein;
    this.fimSuffixLengthThreshold = 0;
    this.cursorContextFix = !1;
    this.cursorSnippetsPickingStrategy = s.CursorSnippetsPickingStrategy.CursorJaccard;
    if (n) {
      const e = n?.snippetSelection;
      if (e && !Object.values(g).includes(e)) throw new Error(`Invalid value for snippetSelection: ${e}`);
      for (const e in n) if ("snippetProviderOptions" !== e) this[e] = n[e];else {
        const e = n.snippetProviderOptions || {};
        let t;
        for (t in e) {
          const n = e[t];
          n && (this.snippetProviderOptions[t] = {
            ...this.snippetProviderOptions[t],
            ...n
          });
        }
      }
    }
    if (this.suffixPercent < 0 || this.suffixPercent > 100) throw new Error(`suffixPercent must be between 0 and 100, but was ${this.suffixPercent}`);
    if (this.snippetPercent < 0 || this.snippetPercent > 100) throw new Error(`snippetPercent must be between 0 and 100, but was ${this.snippetPercent}`);
    if (this.suffixMatchThreshold < 0 || this.suffixMatchThreshold > 100) throw new Error(`suffixMatchThreshold must be at between 0 and 100, but was ${this.suffixMatchThreshold}`);
    if (this.fimSuffixLengthThreshold < -1) throw new Error(`fimSuffixLengthThreshold must be at least -1, but was ${this.fimSuffixLengthThreshold}`);
    if (void 0 !== this.indentationMinLength && void 0 !== this.indentationMaxLength) {
      if (this.indentationMinLength > this.indentationMaxLength) throw new Error(`indentationMinLength must be less than or equal to indentationMaxLength, but was ${this.indentationMinLength} and ${this.indentationMaxLength}`);
      if (this.indentationMinLength < 0) throw new Error(`indentationMinLength must be greater than or equal to zero but was ${this.indentationMinLength}`);
    }
    if (this.snippetSelection === g.TopK && void 0 === this.snippetSelectionK) throw new Error("snippetSelectionK must be defined.");
    if (this.snippetSelection === g.TopK && this.snippetSelectionK && this.snippetSelectionK <= 0) throw new Error(`snippetSelectionK must be greater than 0, but was ${this.snippetSelectionK}`);
  }
}
exports.PromptOptions = PromptOptions;
const T = {
  javascriptreact: "javascript",
  jsx: "javascript",
  typescriptreact: "typescript",
  jade: "pug",
  cshtml: "razor"
};
function normalizeLanguageId(e) {
  e = e.toLowerCase();
  return T[e] ?? e;
}
function newLineEnded(e) {
  return "" === e || e.endsWith("\n") ? e : e + "\n";
}
exports.normalizeLanguageId = normalizeLanguageId;
exports.newLineEnded = newLineEnded;
exports.getPrompt = async function (e, n, s = {}, g = [], _ = [], E) {
  const T = new PromptOptions(e, s);
  const C = u.getTokenizer(T.tokenizerName);
  let I = !1;
  const {
    source: A,
    offset: k
  } = n;
  if (k < 0 || k > A.length) throw new Error(`Offset ${k} is out of range.`);
  n.languageId = normalizeLanguageId(n.languageId);
  const P = new p.Priorities();
  const N = P.justBelow(p.Priorities.TOP);
  const O = T.languageMarker === h.Always ? P.justBelow(p.Priorities.TOP) : P.justBelow(N);
  const R = T.pathMarker === f.Always ? P.justBelow(p.Priorities.TOP) : P.justBelow(N);
  const M = P.justBelow(N);
  const L = P.justBelow(M);
  const D = P.justAbove(N);
  const B = new p.PromptWishlist(C, T.lineEnding);
  let F;
  let j;
  if (T.languageMarker !== h.NoMarker) {
    const e = newLineEnded(r.getLanguageMarker(n));
    F = B.append(e, p.PromptElementKind.LanguageMarker, O);
  }
  if (T.pathMarker !== f.NoMarker) {
    const e = newLineEnded(r.getPathMarker(n));
    if (e.length > 0) {
      j = B.append(e, p.PromptElementKind.PathMarker, R);
    }
  }
  if (T.localImportContext !== y.NoContext) for (const e of await i.extractLocalImportContext(n, T.fs)) B.append(newLineEnded(e), p.PromptElementKind.ImportedFile, M);
  const U = [..._, ...(T.neighboringTabs === a.NeighboringTabsOption.None || 0 === g.length ? [] : await a.getNeighborSnippets(n, g, T.neighboringSnippetTypes, T.neighboringTabs, T.cursorContextFix, T.indentationMinLength, T.indentationMaxLength, T.snippetSelection, T.snippetSelectionK, E, T.cursorSnippetsPickingStrategy))];
  function $() {
    const e = Math.round(T.snippetPercent / 100 * T.maxPromptLength);
    c.processSnippetsForWishlist(U, n.languageId, C, T.snippetProviderOptions, {
      priorities: P,
      low: L,
      high: D
    }, T.numberOfSnippets, e).forEach(e => {
      let t = p.PromptElementKind.SimilarFile;
      if (e.provider === c.SnippetProvider.Retrieval) {
        t = p.PromptElementKind.RetrievalSnippet;
      } else {
        if (e.provider == c.SnippetProvider.SymbolDef) {
          t = p.PromptElementKind.SymbolDefinition;
        }
      }
      B.append(e.announcedSnippet, t, e.priority, e.tokens, e.normalizedScore);
    });
  }
  if (T.snippetPosition === m.TopOfText) {
    $();
  }
  const V = [];
  let H;
  H = A.substring(0, k);
  if (T.snippetPosition === m.DirectlyAboveCursor) {
    const e = H.lastIndexOf("\n") + 1,
      t = H.substring(0, e),
      n = H.substring(e);
    B.appendLineForLine(t, p.PromptElementKind.BeforeCursor, N).forEach(e => V.push(e)), $(), n.length > 0 && (V.push(B.append(n, p.PromptElementKind.AfterCursor, N)), V.length > 1 && B.require(V[V.length - 2], V[V.length - 1]));
  } else B.appendLineForLine(H, p.PromptElementKind.BeforeCursor, N).forEach(e => V.push(e));
  if (h.Top === T.languageMarker && V.length > 0 && void 0 !== F) {
    B.require(F, V[0]);
  }
  if (f.Top === T.pathMarker && V.length > 0 && void 0 !== j) {
    if (F) {
      B.require(j, F);
    } else {
      B.require(j, V[0]);
    }
  }
  if (void 0 !== F && void 0 !== j) {
    B.exclude(j, F);
  }
  let q = A.slice(k);
  if (0 === T.suffixPercent || q.length <= T.fimSuffixLengthThreshold) return B.fulfill(T.maxPromptLength);
  {
    let e = n.offset;
    if (T.suffixStartMode !== b.Cursor && T.suffixStartMode !== b.CursorTrimStart) {
      e = await o.getSiblingFunctionStart(n);
    }
    const r = T.maxPromptLength - exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING;
    let i = Math.floor(r * (100 - T.suffixPercent) / 100);
    let s = B.fulfill(i);
    const a = r - s.prefixLength;
    let c = A.slice(e);
    if (T.suffixStartMode !== b.SiblingBlockTrimStart && T.suffixStartMode !== b.CursorTrimStart) {
      c = c.trimStart();
    }
    const u = C.takeFirstTokens(c, a);
    if (u.tokens.length <= a - 3) {
      i = r - u.tokens.length;
      s = B.fulfill(i);
    }
    if (T.suffixMatchCriteria === v.Equal) u.tokens.length === d.tokens.length && u.tokens.every((e, t) => e === d.tokens[t]) && (I = !0);else if (T.suffixMatchCriteria === v.Levenshtein && u.tokens.length > 0 && T.suffixMatchThreshold > 0) {
      const e = (0, l.findEditDistanceScore)(u.tokens.slice(0, exports.MAX_EDIT_DISTANCE_LENGTH), d.tokens.slice(0, exports.MAX_EDIT_DISTANCE_LENGTH))?.score;
      100 * e < T.suffixMatchThreshold * Math.min(exports.MAX_EDIT_DISTANCE_LENGTH, u.tokens.length) && (I = !0);
    }
    if (!0 === I && d.tokens.length <= a) {
      if (d.tokens.length <= a - 3) {
        i = r - d.tokens.length;
        s = B.fulfill(i);
      }
      s.suffix = d.text;
      s.suffixLength = d.tokens.length;
    } else {
      s.suffix = u.text;
      s.suffixLength = u.tokens.length;
      d = u;
    }
    return s;
  }
};