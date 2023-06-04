Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.extractPrompt = exports.extractPromptForNotebook = exports.extractPromptForSource = exports.trimLastLine = exports._copilotNotAvailable = exports._contextTooShort = exports.MIN_PROMPT_CHARS = void 0;
const r = require(23055);
const i = require(51133);
const o = require(54913);
const s = require(21839);
const a = require(59189);
const c = require(6333);
const l = require(93136);
const u = require(31451);
const p = require(82533);
const d = require(50766);
const h = require(51470);
const f = require(95618);
function trimLastLine(e) {
  const t = e.split("\n");
  const n = t[t.length - 1];
  const r = n.length - n.trimRight().length;
  const i = e.slice(0, e.length - r);
  const o = e.slice(i.length);
  return [n.length == r ? i : e, o];
}
async function extractPromptForSource(e, n, l, g, y, _) {
  if (e.get(o.CopilotIgnoreManager).isIgnored(y)) return exports._copilotNotAvailable;
  const v = d.extractRepoInfoInBackground(e, y.fsPath);
  const b = d.tryGetGitHubNWO(v) ?? "";
  const E = await d.getUserKind(e);
  const w = {
    repoNwo: b,
    dogFood: d.getDogFood(v),
    userKind: E,
    fileType: _
  };
  const T = await e.get(a.Features).suffixPercent(w);
  const S = await e.get(a.Features).fimSuffixLengthThreshold(w);
  if ((T > 0 ? n.length : l) < exports.MIN_PROMPT_CHARS) return exports._contextTooShort;
  const x = Date.now();
  const {
    prefix: C,
    suffix: I,
    prefixLength: A,
    suffixLength: k,
    promptChoices: P,
    promptBackground: N,
    promptElementRanges: O,
    neighborSource: R
  } = await async function (e, t, n, o, l, m) {
    const g = {
      uri: l.toString(),
      source: t,
      offset: n,
      relativePath: o,
      languageId: m
    };
    const y = d.extractRepoInfoInBackground(e, l.fsPath);
    const _ = {
      repoNwo: d.tryGetGitHubNWO(y) ?? "",
      userKind: await d.getUserKind(e),
      dogFood: d.getDogFood(y),
      fileType: m
    };
    const v = (await e.get(a.Features).maxPromptCompletionTokens(_)) - i.getConfig(e, i.ConfigKey.SolutionLength);
    const b = await e.get(a.Features).neighboringTabsOption(_);
    const E = await e.get(a.Features).neighboringSnippetTypes(_);
    const w = await e.get(a.Features).numberOfSnippets(_);
    const T = await e.get(a.Features).snippetPercent(_);
    const S = await e.get(a.Features).suffixStartMode(_);
    const x = await e.get(a.Features).tokenizerName(_);
    const C = await e.get(a.Features).indentationMinLength(_);
    const I = await e.get(a.Features).indentationMaxLength(_);
    const A = await e.get(a.Features).cursorContextFix(_);
    let k = {
      maxPromptLength: v,
      neighboringTabs: b,
      suffixStartMode: S,
      tokenizerName: x,
      neighboringSnippetTypes: E,
      indentationMinLength: C,
      indentationMaxLength: I,
      cursorSnippetsPickingStrategy: await e.get(a.Features).cursorSnippetsPickingStrategy(_),
      numberOfSnippets: w,
      snippetPercent: T,
      cursorContextFix: A
    };
    let P = [];
    let N = new Map();
    try {
      const t = await u.NeighborSource.getNeighborFiles(e, l, _);
      P = t.docs;
      N = t.neighborSource;
    } catch (t) {
      c.telemetryException(e, t, "prompt.getPromptForSource.exception");
    }
    let O = [];
    const R = await h.getRetrievalOptions(e, _);
    if (R) {
      O = await h.queryRetrievalSnippets(e, g, R);
    }
    if (await e.get(a.Features).symbolDefinitionStrategy(_)) {
      const t = await (0, f.getSymbolDefSnippets)(e, g);
      O.push(...t);
    }
    const M = await e.get(a.Features).suffixPercent(_);
    const L = await e.get(a.Features).suffixMatchThreshold(_);
    const D = await e.get(a.Features).fimSuffixLengthThreshold(_);
    if (M > 0) {
      k = {
        ...k,
        suffixPercent: M,
        suffixMatchThreshold: L,
        fimSuffixLengthThreshold: D
      };
    }
    const B = e.get(r.FileSystem);
    let F;
    const j = new Map();
    for (const e of s.cursorHistoryManager.lineCursorHistory.keys()) j.set(e, s.cursorHistoryManager.lineCursorHistory.get(e) ?? new Map());
    try {
      F = await p.getPrompt(B, g, k, P, O, j);
    } catch (t) {
      throw await c.telemetryException(e, t, "prompt.getPromptForSource.exception"), t;
    }
    return {
      neighborSource: N,
      ...F
    };
  }(e, n, l, g, y, _);
  const [M, L] = trimLastLine(C);
  const D = Date.now();
  return {
    type: "prompt",
    prompt: {
      prefix: M,
      suffix: I,
      prefixTokens: A,
      suffixTokens: k,
      isFimEnabled: T > 0 && I.length > S,
      promptElementRanges: O.ranges
    },
    trailingWs: L,
    promptChoices: P,
    computeTimeMs: D - x,
    promptBackground: N,
    neighborSource: R
  };
}
async function y(e, t, n) {
  const r = await e.get(l.TextDocumentManager).getRelativePath(t);
  return extractPromptForSource(e, t.getText(), t.offsetAt(n), r, t.uri, t.languageId);
}
async function extractPromptForNotebook(e, t, n, i) {
  const o = d.extractRepoInfoInBackground(e, t.uri.fsPath);
  const s = d.tryGetGitHubNWO(o) ?? "";
  const c = await d.getUserKind(e);
  const p = d.getDogFood(o);
  const h = await e.get(a.Features).neighboringLanguageType({
    repoNwo: s,
    userKind: c,
    fileType: t.languageId,
    dogFood: p
  });
  const f = n.getCells().find(e => e.document.uri === t.uri);
  if (f) {
    const o = n.getCells().filter(e => e.index < f.index && u.considerNeighborFile(f.document.languageId, e.document.languageId, h));
    const s = o.length > 0 ? o.map(e => function (e, t) {
      const n = e.document.languageId;
      const i = e.document.getText();
      return n === t ? i : r.commentBlockAsSingles(i, t);
    }(e, f.document.languageId)).join("\n\n") + "\n\n" : "";
    const a = s + t.getText();
    const c = s.length + t.offsetAt(i);
    const p = await e.get(l.TextDocumentManager).getRelativePath(t);
    return extractPromptForSource(e, a, c, p, t.uri, f.document.languageId);
  }
  return y(e, t, i);
}
exports.MIN_PROMPT_CHARS = 10;
exports._contextTooShort = {
  type: "contextTooShort"
};
exports._copilotNotAvailable = {
  type: "copilotNotAvailable"
};
exports.trimLastLine = trimLastLine;
exports.extractPromptForSource = extractPromptForSource;
exports.extractPromptForNotebook = extractPromptForNotebook;
exports.extractPrompt = function (e, t, n) {
  const r = e.get(l.TextDocumentManager).findNotebook(t);
  return void 0 === r ? y(e, t, n) : extractPromptForNotebook(e, t, r, n);
};