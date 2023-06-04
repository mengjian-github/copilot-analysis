Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.launchSolutions = exports.normalizeCompletionText = void 0;
const r = require(42600);
const i = require(38213);
const o = require(51133);
const s = require(80256);
const a = require(29899);
const c = require(20003);
const l = require(40937);
const u = require(86722);
const p = require(27727);
const d = require(94969);
const h = require(82533);
const f = require(50766);
const m = require(71124);
const g = require(6333);
const y = require(16403);
const _ = new a.Logger(a.LogLevel.INFO, "solutions");
function v(e, t, n, r) {
  return async r => p.isBlockBodyFinished(e, t, n, r);
}
async function b(e, t, n) {
  if (t.isCancellationRequested) {
    e.removeProgress();
    return {
      status: "FinishedWithError",
      error: "Cancelled"
    };
  }
  const r = await n.next();
  return !0 === r.done ? (e.removeProgress(), {
    status: "FinishedNormally"
  }) : {
    status: "Solution",
    solution: r.value,
    next: b(e, t, n)
  };
}
exports.normalizeCompletionText = function (e) {
  return e.replace(/\s+/g, "");
};
exports.launchSolutions = async function (e, t) {
  const n = t.completionContext.insertPosition;
  const a = t.completionContext.prependToCompletion;
  const E = t.completionContext.indentation;
  const w = e.get(y.LocationFactory);
  const T = await t.getDocument();
  const S = await d.extractPrompt(e, T, n);
  if ("copilotNotAvailable" === S.type) {
    t.reportCancelled();
    return {
      status: "FinishedNormally"
    };
  }
  if ("contextTooShort" === S.type) {
    t.reportCancelled();
    return {
      status: "FinishedWithError",
      error: "Context too short"
    };
  }
  const x = S.prompt;
  const C = S.trailingWs;
  if (C.length > 0) {
    t.startPosition = w.position(t.startPosition.line, t.startPosition.character - C.length);
  }
  const I = t.getCancellationToken();
  const A = r.v4();
  t.savedTelemetryData = g.TelemetryData.createAndMarkAsIssued({
    headerRequestId: A,
    languageId: T.languageId,
    source: s.completionTypeToString(t.completionContext.completionType)
  }, {
    ...g.telemetrizePromptLength(x),
    solutionCount: t.solutionCountTarget,
    promptEndPos: T.offsetAt(n)
  });
  _.info(e, `prompt: ${JSON.stringify(x)}`);
  _.debug(e, `prependToCompletion: ${a}`);
  g.telemetry(e, "solution.requested", t.savedTelemetryData);
  const k = await e.get(o.BlockModeConfig).forLanguage(e, T.languageId);
  const P = h.isSupportedLanguageId(T.languageId);
  const N = p.contextIndentation(T, n);
  const O = {
    stream: !0,
    extra: {
      language: T.languageId,
      next_indent: N.next ?? 0,
      prompt_tokens: x.prefixTokens ?? 0,
      suffix_tokens: x.suffixTokens ?? 0
    }
  };
  if ("parsing" !== k || P) {
    O.stop = ["\n\n", "\r\n\r\n"];
  }
  const R = f.extractRepoInfoInBackground(e, T.fileName);
  const M = {
    prompt: x,
    languageId: T.languageId,
    repoInfo: R,
    ourRequestId: A,
    engineUrl: await c.getEngineURL(e, f.tryGetGitHubNWO(R), T.languageId, f.getDogFood(R), await f.getUserKind(e), t.savedTelemetryData),
    count: t.solutionCountTarget,
    uiKind: l.CopilotUiKind.Panel,
    postOptions: O,
    requestLogProbs: !0
  };
  let L;
  switch (t.completionContext.completionType, k) {
    case o.BlockMode.Server:
      L = async e => {};
      O.extra.force_indent = N.prev ?? -1;
      O.extra.trim_by_indentation = !0;
      break;
    case o.BlockMode.ParsingAndServer:
      L = P ? v(e, T, t.startPosition) : async e => {};
      O.extra.force_indent = N.prev ?? -1;
      O.extra.trim_by_indentation = !0;
      break;
    case o.BlockMode.Parsing:
    default:
      L = P ? v(e, T, t.startPosition) : async e => {};
  }
  e.get(u.StatusReporter).setProgress();
  const D = await e.get(l.OpenAIFetcher).fetchAndStreamCompletions(e, M, g.TelemetryData.createAndMarkAsIssued(), L, I);
  if ("failed" === D.type || "canceled" === D.type) {
    t.reportCancelled();
    e.get(u.StatusReporter).removeProgress();
    return {
      status: "FinishedWithError",
      error: `${D.type}: ${D.reason}`
    };
  }
  let B = D.choices;
  B = async function* (e, t) {
    for await (const n of e) {
      const e = {
        ...n
      };
      e.completionText = t + e.completionText.trimRight();
      yield e;
    }
  }(B, a);
  if (null !== E) {
    B = l.cleanupIndentChoices(B, E);
  }
  B = i.asyncIterableMapFilter(B, async t => m.postProcessChoice(e, "solution", T, n, t, !1, _));
  const F = i.asyncIterableMapFilter(B, async r => {
    let i = r.completionText;
    _.info(e, `Open Copilot completion: [${r.completionText}]`);
    if (t.completionContext.completionType === s.CompletionType.OPEN_COPILOT) {
      let t = "";
      const o = await (0, p.getNodeStart)(e, T, n, r.completionText);
      if (o) [t] = (0, d.trimLastLine)(T.getText(w.range(w.position(o.line, o.character), n)));else {
        const e = w.position(n.line, 0);
        t = T.getText(w.range(e, n));
      }
      i = t + i;
    }
    let o = r.completionText;
    if (C.length > 0 && o.startsWith(C)) {
      o = o.substring(C.length);
    }
    const c = r.meanLogProb;
    const l = void 0 !== c ? Math.exp(c) : 0;
    const u = (await t.getDocument()).version;
    return {
      displayText: i,
      meanProb: l,
      meanLogProb: c || 0,
      completionText: o,
      requestId: r.requestId,
      choiceIndex: r.choiceIndex,
      prependToCompletion: a,
      docVersion: u
    };
  });
  return b(e.get(u.StatusReporter), I, F[Symbol.asyncIterator]());
};