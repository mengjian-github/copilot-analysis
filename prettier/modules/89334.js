Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getGhostText = exports.completionCache = exports.ResultType = exports.ghostTextLogger = void 0;
const r = require(23055);
const i = require(81354);
const o = require(42600);
const s = require(43076);
const a = require(70106);
const c = require(38213);
const l = require(51133);
const u = require(68281);
const p = require(59189);
const d = require(55600);
const h = require(29899);
const f = require(82279);
const m = require(20003);
const g = require(24419);
const y = require(40937);
const _ = require(86722);
const v = require(27727);
const b = require(94969);
const E = require(50766);
const w = require(51006);
const T = require(71124);
const S = require(6333);
const x = require(60070);
const C = require(16403);
const I = require(38965);
const A = require(85413);
const k = require(40750);
var P;
let N;
let O;
let R;
async function M(e, n, r, i, o, s, a) {
  exports.ghostTextLogger.debug(e, `Getting ${s} from network`);
  r = r.extendedBy();
  const c = await async function (e, t) {
    const n = await e.get(p.Features).overrideNumGhostCompletions();
    return n ? t.isCycling ? Math.max(0, 3 - n) : n : l.shouldDoParsingTrimming(t.blockMode) && t.multiline ? l.getConfig(e, l.ConfigKey.InlineSuggestCount) : t.isCycling ? 2 : 1;
  }(e, n);
  const d = y.getTemperatureForSamples(e, c);
  const h = {
    stream: !0,
    n: c,
    temperature: d,
    extra: {
      language: n.languageId,
      next_indent: n.indentation.next ?? 0,
      trim_by_indentation: l.shouldDoServerTrimming(n.blockMode),
      prompt_tokens: n.prompt.prefixTokens ?? 0,
      suffix_tokens: n.prompt.suffixTokens ?? 0
    }
  };
  if (n.multiline) {
    h.stop = ["\n"];
  }
  if (n.multiline && n.multiLogitBias) {
    h.logit_bias = {
      50256: -100
    };
  }
  const m = Date.now();
  const _ = {
    endpoint: "completions",
    uiKind: g.CopilotUiKind.GhostText,
    isCycling: JSON.stringify(n.isCycling),
    temperature: JSON.stringify(d),
    n: JSON.stringify(c),
    stop: JSON.stringify(h.stop) ?? "unset",
    logit_bias: JSON.stringify(h.logit_bias ?? null)
  };
  const v = S.telemetrizePromptLength(n.prompt);
  Object.assign(r.properties, _);
  Object.assign(r.measurements, v);
  try {
    const s = {
      prompt: n.prompt,
      languageId: n.languageId,
      repoInfo: n.repoInfo,
      ourRequestId: n.ourRequestId,
      engineUrl: n.engineURL,
      count: c,
      uiKind: g.CopilotUiKind.GhostText,
      postOptions: h
    };
    if (n.delayMs > 0) {
      await new Promise(e => setTimeout(e, n.delayMs));
    }
    const l = await e.get(g.OpenAIFetcher).fetchAndStreamCompletions(e, s, r, o, i);
    return "failed" === l.type ? {
      type: "failed",
      reason: l.reason,
      telemetryData: k.mkBasicResultTelemetry(r)
    } : "canceled" === l.type ? (exports.ghostTextLogger.debug(e, "Cancelled after awaiting fetchCompletions"), {
      type: "canceled",
      reason: l.reason,
      telemetryData: k.mkCanceledResultTelemetry(r)
    }) : a(c, m, l.getProcessingTime(), l.choices);
  } catch (n) {
    if (f.isAbortError(n)) return {
      type: "canceled",
      reason: "network request aborted",
      telemetryData: k.mkCanceledResultTelemetry(r, {
        cancelledNetworkRequest: !0
      })
    };
    exports.ghostTextLogger.exception(e, n, "Error on ghost text request");
    e.get(u.UserErrorNotifier).notifyUser(e, n);
    if ((0, x.shouldFailForDebugPurposes)(e)) throw n;
    return {
      type: "failed",
      reason: "non-abort error on ghost text request",
      telemetryData: k.mkBasicResultTelemetry(r)
    };
  }
}
function L(e, t) {
  const n = {
    ...e
  };
  n.completionText = e.completionText.trimEnd();
  if (t.forceSingleLine) {
    n.completionText = n.completionText.split("\n")[0];
  }
  return n;
}
exports.ghostTextLogger = new h.Logger(h.LogLevel.INFO, "ghostText");
(function (e) {
  e[e.Network = 0] = "Network";
  e[e.Cache = 1] = "Cache";
  e[e.TypingAsSuggested = 2] = "TypingAsSuggested";
  e[e.Cycling = 3] = "Cycling";
})(P = exports.ResultType || (exports.ResultType = {}));
exports.completionCache = new s.LRUCacheMap(100);
const D = new a.Debouncer();
function B() {
  return Math.random() > .5;
}
function F(e, t, n) {
  N = e;
  O = t;
  R = n;
}
function j(e, n, r) {
  const i = s.keyForPrompt(n.prompt);
  const o = exports.completionCache.get(i);
  if (o && o.multiline === r.multiline) {
    exports.completionCache.set(i, {
      multiline: o.multiline,
      choices: o.choices.concat(r.choices)
    });
  } else {
    exports.completionCache.set(i, r);
  }
  exports.ghostTextLogger.debug(e, `Appended cached ghost text for key: ${i}, multiline: ${r.multiline}, number of suggestions: ${r.choices.length}`);
}
function U(e, n) {
  const r = exports.completionCache.get(e);
  if (r && (!n || r.multiline)) return r.choices;
}
function $(e, t, n) {
  if (n.length > 0) {
    if (t.startsWith(n)) return {
      completionIndex: e,
      completionText: t,
      displayText: t.substr(n.length),
      displayNeedsWsOffset: !1
    };
    {
      const r = t.substr(0, t.length - t.trimLeft().length);
      return n.startsWith(r) ? {
        completionIndex: e,
        completionText: t,
        displayText: t.trimLeft(),
        displayNeedsWsOffset: !0
      } : {
        completionIndex: e,
        completionText: t,
        displayText: t,
        displayNeedsWsOffset: !1
      };
    }
  }
  return {
    completionIndex: e,
    completionText: t,
    displayText: t,
    displayNeedsWsOffset: !1
  };
}
function V(e, n) {
  const r = n.requestId;
  const i = {
    choiceIndex: n.choiceIndex.toString()
  };
  const o = {
    numTokens: n.numTokens,
    compCharLen: n.completionText.length,
    numLines: n.completionText.split("\n").length
  };
  if (n.meanLogProb) {
    o.meanLogProb = n.meanLogProb;
  }
  if (n.meanAlternativeLogProb) {
    o.meanAlternativeLogProb = n.meanAlternativeLogProb;
  }
  const s = n.telemetryData.extendedBy(i, o);
  s.extendWithRequestId(r);
  s.measurements.confidence = w.ghostTextScoreConfidence(e, s);
  s.measurements.quantile = w.ghostTextScoreQuantile(e, s);
  exports.ghostTextLogger.debug(e, `Extended telemetry for ${n.telemetryData.properties.headerRequestId} with retention confidence ${s.measurements.confidence} (expected as good or better than about ${s.measurements.quantile} of all suggestions)`);
  return s;
}
function H(e, t, n, r, i) {
  const o = Date.now() - r;
  const s = o - i;
  const a = n.telemetryData.extendedBy({}, {
    completionCharLen: n.completionText.length,
    requestTimeMs: o,
    processingTimeMs: i,
    deltaMs: s,
    meanLogProb: n.meanLogProb || NaN,
    meanAlternativeLogProb: n.meanAlternativeLogProb || NaN,
    numTokens: n.numTokens
  });
  a.extendWithRequestId(n.requestId);
  S.telemetry(e, `ghostText.${t}`, a);
}
exports.getGhostText = async function (e, n, a, u, h, f) {
  const y = await b.extractPrompt(e, n, a);
  if ("copilotNotAvailable" === y.type) {
    exports.ghostTextLogger.debug(e, "Copilot not available, due to the .copilotignore settings");
    return {
      type: "abortedBeforeIssued",
      reason: "Copilot not available due to the .copilotignore settings"
    };
  }
  if ("contextTooShort" === y.type) {
    exports.ghostTextLogger.debug(e, "Breaking, not enough context");
    return {
      type: "abortedBeforeIssued",
      reason: "Not enough context"
    };
  }
  if (f?.isCancellationRequested) {
    exports.ghostTextLogger.info(e, "Cancelled after extractPrompt");
    return {
      type: "abortedBeforeIssued",
      reason: "Cancelled after extractPrompt"
    };
  }
  const w = function (e, t) {
    const n = (i = t, 0 != e.lineAt(i).text.substr(i.character).trim().length);
    const r = function (e, t) {
      const n = t.lineAt(e).text.substr(e.character).trim();
      return /^\s*[)}\]"'`]*\s*[:{;,]?\s*$/.test(n);
    }(t, e);
    var i;
    if (n && !r) return;
    return n && r;
  }(n, a);
  if (void 0 === w) {
    exports.ghostTextLogger.debug(e, "Breaking, invalid middle of the line");
    return {
      type: "abortedBeforeIssued",
      reason: "Invalid middle of the line"
    };
  }
  const q = e.get(_.StatusReporter);
  const z = e.get(C.LocationFactory);
  const K = E.extractRepoInfoInBackground(e, n.fileName);
  const G = E.tryGetGitHubNWO(K) ?? "";
  const W = E.getDogFood(K);
  const Q = await E.getUserKind(e);
  const Z = {
    repoNwo: G,
    userKind: Q,
    dogFood: W,
    fileType: n.languageId
  };
  const X = await e.get(p.Features).requestMultilineExploration(Z);
  const Y = await async function (e, t, n, i, o, s, a, c) {
    const u = await e.get(l.BlockModeConfig).forLanguage(e, t.languageId);
    switch (u) {
      case l.BlockMode.Server:
        return {
          blockMode: l.BlockMode.Server,
          requestMultiline: !0,
          isCyclingRequest: o,
          finishedCb: async e => {}
        };
      case l.BlockMode.Parsing:
      case l.BlockMode.ParsingAndServer:
      default:
        {
          const l = await async function (e, t, n, i, o, s) {
            if (s) {
              const e = await v.isEmptyBlockStart(t, n);
              const r = await v.isEmptyBlockStart(t, t.lineAt(n).range.end);
              o.properties.isEmptyBlockStartDocumentPosition = e.toString();
              o.properties.isEmptyBlockStartDocumentPositionRangeEnd = r.toString();
              o.properties.inlineSuggestion = i.toString();
              o.measurements.documentLineCount = t.lineCount;
              o.measurements.positionLine = n.line;
            }
            if (t.lineCount >= 8e3) S.telemetry(e, "ghostText.longFileMultilineSkip", S.TelemetryData.createAndMarkAsIssued({
              languageId: t.languageId,
              lineCount: String(t.lineCount),
              currentLine: String(n.line)
            }));else {
              if (!i && r.isSupportedLanguageId(t.languageId)) {
                let e = await v.isEmptyBlockStart(t, n);
                if (!e && s) {
                  e = B();
                }
                return e;
              }
              if (i && r.isSupportedLanguageId(t.languageId)) {
                let e = (await v.isEmptyBlockStart(t, n)) || (await v.isEmptyBlockStart(t, t.lineAt(n).range.end));
                if (!e && s) {
                  e = B();
                }
                return e;
              }
            }
            return !1;
          }(e, t, n, s, a, c);
          return l ? {
            blockMode: u,
            requestMultiline: !0,
            isCyclingRequest: !1,
            finishedCb: async r => {
              let o;
              o = i.trailingWs.length > 0 && !i.prompt.prefix.endsWith(i.trailingWs) ? e.get(C.LocationFactory).position(n.line, Math.max(n.character - i.trailingWs.length, 0)) : n;
              return v.isBlockBodyFinished(e, t, o, r);
            }
          } : {
            blockMode: u,
            requestMultiline: !1,
            isCyclingRequest: o,
            finishedCb: async e => {}
          };
        }
    }
  }(e, n, a, y, u, w, h, X);
  if (f?.isCancellationRequested) {
    exports.ghostTextLogger.info(e, "Cancelled after requestMultiline");
    return {
      type: "abortedBeforeIssued",
      reason: "Cancelled after requestMultiline"
    };
  }
  const [J] = b.trimLastLine(n.getText(z.range(z.position(0, 0), a)));
  let ee = function (e, n, r, i) {
    const o = function (e, n, r, i) {
      const o = !!N && n.startsWith(N);
      const s = null != O && r.suffix == O;
      if (!(N && R && o && s)) return;
      const a = U(R, i);
      if (!a) return;
      const c = n.substring(N.length);
      exports.ghostTextLogger.debug(e, `Getting completions for user-typing flow - remaining prefix: ${c}`);
      const l = [];
      a.forEach(e => {
        const t = L(e, {
          forceSingleLine: !1
        });
        if (t.completionText.startsWith(c)) {
          t.completionText = t.completionText.substring(c.length);
          l.push(t);
        }
      });
      return l;
    }(e, n, r, i);
    if (o && o.length > 0) return [o, P.TypingAsSuggested];
    const a = function (e, n, r, i) {
      const o = s.keyForPrompt(r);
      exports.ghostTextLogger.debug(e, `Trying to get completions from cache for key: ${o}`);
      const a = U(o, i);
      if (a) {
        exports.ghostTextLogger.debug(e, `Got completions from cache for key: ${o}`);
        const s = [];
        a.forEach(e => {
          const t = L(e, {
            forceSingleLine: !i
          });
          s.push(t);
        });
        const c = s.filter(e => e.completionText);
        if (c.length > 0) {
          F(n, r.suffix, o);
        }
        return c;
      }
    }(e, n, r, i);
    return a && a.length > 0 ? [a, P.Cache] : void 0;
  }(e, J, y.prompt, Y.requestMultiline);
  const te = o.v4();
  const ne = await m.getEngineURL(e, E.tryGetGitHubNWO(K), n.languageId, W, Q, h);
  const re = await e.get(p.Features).beforeRequestWaitMs(Z);
  const ie = await e.get(p.Features).multiLogitBias(Z);
  const oe = {
    blockMode: Y.blockMode,
    languageId: n.languageId,
    repoInfo: K,
    engineURL: ne,
    ourRequestId: te,
    prefix: J,
    prompt: y.prompt,
    multiline: Y.requestMultiline,
    indentation: v.contextIndentation(n, a),
    isCycling: u,
    delayMs: re,
    multiLogitBias: ie
  };
  const se = await e.get(p.Features).debouncePredict();
  const ae = await e.get(p.Features).contextualFilterEnable();
  const ce = await e.get(p.Features).contextualFilterAcceptThreshold();
  const le = await e.get(p.Features).contextualFilterEnableTree();
  const ue = await e.get(p.Features).contextualFilterExplorationTraffic();
  let pe = !1;
  if (se || ae) {
    pe = !0;
  }
  const de = await e.get(d.LanguageDetection).detectLanguage(n);
  const he = function (e, t, n, r, o, s, a, c, l) {
    const u = e.get(C.LocationFactory);
    const p = t.lineAt(o.line);
    const d = t.getText(u.range(p.range.start, o));
    const h = t.getText(u.range(o, p.range.end));
    const f = {
      languageId: t.languageId,
      beforeCursorWhitespace: JSON.stringify("" === d.trim()),
      afterCursorWhitespace: JSON.stringify("" === h.trim())
    };
    if (t.languageId !== n.languageId) {
      f.detectedLanguageId = n.languageId;
      f.fileExtension = n.fileExtension;
    }
    const m = {
      ...S.telemetrizePromptLength(s.prompt),
      promptEndPos: t.offsetAt(o),
      documentLength: t.getText().length,
      delayMs: r.delayMs
    };
    const y = a.extendedBy(f, m);
    y.properties.promptChoices = JSON.stringify(s.promptChoices, (e, t) => t instanceof Map ? Array.from(t.entries()).reduce((e, [t, n]) => ({
      ...e,
      [t]: n
    }), {}) : t);
    y.properties.promptBackground = JSON.stringify(s.promptBackground, (e, t) => t instanceof Map ? Array.from(t.values()) : t);
    const _ = Array.from(s.neighborSource.entries()).map(e => [e[0], e[1].map(e => i.SHA256(e).toString())]);
    y.properties.neighborSource = JSON.stringify(_);
    y.measurements.promptComputeTimeMs = s.computeTimeMs;
    if (c) {
      y.measurements.contextualFilterScore = I.contextualFilterScore(e, y, s.prompt, l);
    }
    const v = r.repoInfo;
    y.properties.gitRepoInformation = void 0 === v ? "unavailable" : v === E.ComputationStatus.PENDING ? "pending" : "available";
    if (void 0 !== v && v !== E.ComputationStatus.PENDING) {
      y.properties.gitRepoUrl = v.url;
      y.properties.gitRepoHost = v.hostname;
      y.properties.gitRepoOwner = v.owner;
      y.properties.gitRepoName = v.repo;
      y.properties.gitRepoPath = v.pathname;
    }
    y.properties.engineName = g.extractEngineName(e, r.engineURL);
    y.properties.isMultiline = JSON.stringify(r.multiline);
    y.properties.blockMode = r.blockMode;
    y.properties.isCycling = JSON.stringify(r.isCycling);
    y.properties.headerRequestId = r.ourRequestId;
    S.telemetry(e, "ghostText.issued", y);
    return y;
  }(e, n, de, oe, a, y, h, pe, le);
  if (Y.isCyclingRequest && (ee?.[0].length ?? 0) > 1 || !Y.isCyclingRequest && void 0 !== ee) exports.ghostTextLogger.info(e, "Found inline suggestions locally");else {
    q?.setProgress();
    if (Y.isCyclingRequest) {
      const n = await async function (e, n, r, i, o) {
        return M(e, n, r, i, o, "all completions", async (o, s, a, c) => {
          const l = [];
          for await (const n of c) {
            if (i?.isCancellationRequested) return exports.ghostTextLogger.debug(e, "Cancelled after awaiting choices iterator"), {
              type: "canceled",
              reason: "after awaiting choices iterator",
              telemetryData: (0, k.mkCanceledResultTelemetry)(r)
            };
            if (n.completionText.trimEnd()) {
              if (-1 !== l.findIndex(e => e.completionText.trim() === n.completionText.trim())) continue;
              l.push(n);
            }
          }
          return l.length > 0 && (j(e, n, {
            multiline: n.multiline,
            choices: l
          }), H(e, "cyclingPerformance", l[0], s, a)), {
            type: "success",
            value: l,
            telemetryData: (0, k.mkBasicResultTelemetry)(r),
            telemetryBlob: r
          };
        });
      }(e, oe, he, f, Y.finishedCb);
      if ("success" === n.type) {
        const e = ee?.[0] ?? [];
        n.value.forEach(t => {
          -1 === e.findIndex(e => e.completionText.trim() === t.completionText.trim()) && e.push(t);
        }), ee = [e, P.Cycling];
      } else if (void 0 === ee) return q?.removeProgress(), n;
    } else {
      const n = await (0, A.getDebounceLimit)(e, he);
      try {
        await D.debounce(n);
      } catch {
        return {
          type: "canceled",
          reason: "by debouncer",
          telemetryData: (0, k.mkCanceledResultTelemetry)(he)
        };
      }
      if (f?.isCancellationRequested) return exports.ghostTextLogger.info(e, "Cancelled during debounce"), {
        type: "canceled",
        reason: "during debounce",
        telemetryData: (0, k.mkCanceledResultTelemetry)(he)
      };
      if (ae && he.measurements.contextualFilterScore && he.measurements.contextualFilterScore < ce / 100 && Math.random() < 1 - ue / 100) return exports.ghostTextLogger.info(e, "Cancelled by contextual filter"), {
        type: "canceled",
        reason: "contextualFilterScore below threshold",
        telemetryData: (0, k.mkCanceledResultTelemetry)(he)
      };
      const r = await async function (e, n, r, i, o) {
        return M(e, n, r, i, o, "completions", async (o, a, c, l) => {
          const u = l[Symbol.asyncIterator](),
            d = await u.next();
          if (d.done) return exports.ghostTextLogger.debug(e, "All choices redacted"), {
            type: "empty",
            reason: "all choices redacted",
            telemetryData: (0, k.mkBasicResultTelemetry)(r)
          };
          if (i?.isCancellationRequested) return exports.ghostTextLogger.debug(e, "Cancelled after awaiting redactedChoices iterator"), {
            type: "canceled",
            reason: "after awaiting redactedChoices iterator",
            telemetryData: (0, k.mkCanceledResultTelemetry)(r)
          };
          const h = d.value;
          if (void 0 === h) return exports.ghostTextLogger.debug(e, "Got undefined choice from redactedChoices iterator"), {
            type: "empty",
            reason: "got undefined choice from redactedChoices iterator",
            telemetryData: (0, k.mkBasicResultTelemetry)(r)
          };
          H(e, "performance", h, a, c);
          const f = o - 1;
          exports.ghostTextLogger.debug(e, `Awaited first result, id:  ${h.choiceIndex}`), function (e, n, r) {
            const i = (0, s.keyForPrompt)(n.prompt);
            F(n.prefix, n.prompt.suffix, i), exports.completionCache.set(i, r), exports.ghostTextLogger.debug(e, `Cached ghost text for key: ${i}, multiline: ${r.multiline}, number of suggestions: ${r.choices.length}`);
          }(e, n, {
            multiline: n.multiline,
            choices: [h]
          });
          const m = [];
          for (let e = 0; e < f; e++) m.push(u.next());
          const g = Promise.all(m).then(async r => {
            (await e.get(p.Features).fastCancellation()) && u.next(), exports.ghostTextLogger.debug(e, `Awaited remaining results, number of results: ${r.length}`);
            const i = [];
            for (const n of r) {
              const r = n.value;
              if (void 0 !== r && (exports.ghostTextLogger.info(e, `GhostText later completion: [${r.completionText}]`), r.completionText.trimEnd())) {
                if (-1 !== i.findIndex(e => e.completionText.trim() === r.completionText.trim())) continue;
                if (r.completionText.trim() === h.completionText.trim()) continue;
                i.push(r);
              }
            }
            i.length > 0 && j(e, n, {
              multiline: n.multiline,
              choices: i
            });
          });
          return (0, x.isRunningInTest)(e) && (await g), {
            type: "success",
            value: L(d.value, {
              forceSingleLine: !1
            }),
            telemetryData: (0, k.mkBasicResultTelemetry)(r),
            telemetryBlob: r
          };
        });
      }(e, oe, he, f, Y.finishedCb);
      if ("success" !== r.type) return q?.removeProgress(), r;
      ee = [[r.value], P.Network];
    }
    q?.removeProgress();
  }
  if (void 0 === ee) return {
    type: "failed",
    reason: "internal error: choices should be defined after network call",
    telemetryData: k.mkBasicResultTelemetry(he)
  };
  const [fe, me] = ee;
  const ge = c.asyncIterableMapFilter(c.asyncIterableFromArray(fe), async r => T.postProcessChoice(e, "ghostText", n, a, r, w, exports.ghostTextLogger));
  const ye = [];
  for await (const r of ge) {
    const i = w && T.checkSuffix(n, a, r);
    if (f?.isCancellationRequested) {
      exports.ghostTextLogger.info(e, "Cancelled after post processing completions");
      return {
        type: "canceled",
        reason: "after post processing completions",
        telemetryData: k.mkCanceledResultTelemetry(he)
      };
    }
    const o = V(e, r);
    const s = {
      completion: $(r.choiceIndex, r.completionText, y.trailingWs),
      telemetry: o,
      isMiddleOfTheLine: w,
      coversSuffix: i
    };
    ye.push(s);
  }
  return {
    type: "success",
    value: [ye, me],
    telemetryData: k.mkBasicResultTelemetry(he),
    telemetryBlob: he
  };
};