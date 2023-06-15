Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getGhostText =
  exports.completionCache =
  exports.ResultType =
  exports.ghostTextLogger =
    void 0;
const utils = require("./utils");
const i = require(81354);
const o = require(42600);
const s = require(43076);
const a = require(70106);
const c = require(38213);
const config = require("./config");
const u = require(68281);
const p = require(59189);
const language = require("./language");
const logger = require("./logger");
const request = require("./request");
const m = require(20003);
const g = require(24419);
const y = require(40937);
const reporter = require("./status-reporter");
const v = require(27727);
const extractprompt = require('./extract-prompt');
const repo = require("./repo");
const ghosttextscore = require('./ghost-text-score');
const T = require(71124);
const telemetry = require("./telemetry");
const env = require("./env");
const locationfactory = require("./location-factory");
const I = require(38965);
const A = require(85413);
const telemetryutils = require("./telemetry-utils");
var P;
let prefixCache;
let suffixCache;
let promptKeyCache;

// ctx, requestPayload, telemetryObject, token, finishedCb, "all completions", async
async function getCompletion(ctx, requestPayload, telemetryObject, token, finishedCb, s = 'all completions', cb) {
  exports.ghostTextLogger.debug(ctx, `Getting ${s} from network`);
  telemetryObject = telemetryObject.extendedBy();
  const n = await (async function (ctx, requestPayload) {
    const n = await ctx.get(p.Features).overrideNumGhostCompletions();
    return n
      ? requestPayload.isCycling
        ? Math.max(0, 3 - n)
        : n
      : config.shouldDoParsingTrimming(requestPayload.blockMode) && requestPayload.multiline
      ? config.getConfig(ctx, config.ConfigKey.InlineSuggestCount)
      : requestPayload.isCycling
      ? 2
      : 1;
  })(ctx, requestPayload);
  const temperature = y.getTemperatureForSamples(ctx, n);
  const postOptions = {
    stream: true,
    n: n,
    temperature: temperature,
    extra: {
      language: requestPayload.languageId,
      next_indent: requestPayload.indentation.next ?? 0,
      trim_by_indentation: config.shouldDoServerTrimming(requestPayload.blockMode),
      prompt_tokens: requestPayload.prompt.prefixTokens ?? 0,
      suffix_tokens: requestPayload.prompt.suffixTokens ?? 0,
    },
  };
  if (requestPayload.multiline) {
    postOptions.stop = ["\n"];
  }
  if (requestPayload.multiline && requestPayload.multiLogitBias) {
    postOptions.logit_bias = {
      50256: -100,
    };
  }
  const now = Date.now();
  const _ = {
    endpoint: "completions",
    uiKind: g.CopilotUiKind.GhostText,
    isCycling: JSON.stringify(requestPayload.isCycling),
    temperature: JSON.stringify(temperature),
    n: JSON.stringify(c),
    stop: JSON.stringify(postOptions.stop) ?? "unset",
    logit_bias: JSON.stringify(postOptions.logit_bias ?? null),
  };
  const v = telemetry.telemetrizePromptLength(requestPayload.prompt);
  Object.assign(telemetryObject.properties, _);
  Object.assign(telemetryObject.measurements, v);
  try {
    const payload = {
      prompt: requestPayload.prompt,
      languageId: requestPayload.languageId,
      repoInfo: requestPayload.repoInfo,
      ourRequestId: requestPayload.ourRequestId,
      engineUrl: requestPayload.engineURL,
      count: n,
      uiKind: g.CopilotUiKind.GhostText,
      postOptions: postOptions,
    };
    if (requestPayload.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, requestPayload.delayMs));
    }
    const result = await ctx
      .get(g.OpenAIFetcher)
      .fetchAndStreamCompletions(ctx, payload, telemetryObject, finishedCb, token);
    return "failed" === result.type
      ? {
          type: "failed",
          reason: result.reason,
          telemetryData: telemetryutils.mkBasicResultTelemetry(telemetryObject),
        }
      : "canceled" === result.type
      ? (exports.ghostTextLogger.debug(
          ctx,
          "Cancelled after awaiting fetchCompletions"
        ),
        {
          type: "canceled",
          reason: result.reason,
          telemetryData: telemetryutils.mkCanceledResultTelemetry(telemetryObject),
        })
      : cb(n, now, result.getProcessingTime(), result.choices);
  } catch (e) {
    if (request.isAbortError(e))
      return {
        type: "canceled",
        reason: "network request aborted",
        telemetryData: telemetryutils.mkCanceledResultTelemetry(telemetryObject, {
          cancelledNetworkRequest: !0,
        }),
      };
    exports.ghostTextLogger.exception(ctx, e, "Error on ghost text request");
    ctx.get(u.UserErrorNotifier).notifyUser(ctx, e);
    if ((0, env.shouldFailForDebugPurposes)(ctx)) throw e;
    return {
      type: "failed",
      reason: "non-abort error on ghost text request",
      telemetryData: telemetryutils.mkBasicResultTelemetry(telemetryObject),
    };
  }
}
function trimCompletionText(e, t) {
  const n = {
    ...e,
  };
  n.completionText = e.completionText.trimEnd();
  if (t.forceSingleLine) {
    n.completionText = n.completionText.split("\n")[0];
  }
  return n;
}
exports.ghostTextLogger = new logger.Logger(logger.LogLevel.INFO, "ghostText");
(function (e) {
  e[(e.Network = 0)] = "Network";
  e[(e.Cache = 1)] = "Cache";
  e[(e.TypingAsSuggested = 2)] = "TypingAsSuggested";
  e[(e.Cycling = 3)] = "Cycling";
})((P = exports.ResultType || (exports.ResultType = {})));
exports.completionCache = new s.LRUCacheMap(100);
const D = new a.Debouncer();
function B() {
  return Math.random() > 0.5;
}
function updateGlobalCacheKey(prefix, suffix, promptKey) {
  prefixCache = prefix;
  suffixCache = suffix;
  promptKeyCache = promptKey;
}

// // ctx, requestPayload, {
//   multiline: requestPayload.multiline,
//   choices: newChoices,
// }
function updateCache(ctx, requestPayload, data) {
  const i = s.keyForPrompt(requestPayload.prompt);
  const o = exports.completionCache.get(i);
  if (o && o.multiline === data.multiline) {
    exports.completionCache.set(i, {
      multiline: o.multiline,
      choices: o.choices.concat(data.choices),
    });
  } else {
    exports.completionCache.set(i, data);
  }
  exports.ghostTextLogger.debug(
    ctx,
    `Appended cached ghost text for key: ${i}, multiline: ${r.multiline}, number of suggestions: ${r.choices.length}`
  );
}
function getCachedChoices(key, requestMultiline) {
  const value = exports.completionCache.get(key);
  if (value && (!requestMultiline || value.multiline)) return value.choices;
}
function $(e, t, n) {
  if (n.length > 0) {
    if (t.startsWith(n))
      return {
        completionIndex: e,
        completionText: t,
        displayText: t.substr(n.length),
        displayNeedsWsOffset: !1,
      };
    {
      const r = t.substr(0, t.length - t.trimLeft().length);
      return n.startsWith(r)
        ? {
            completionIndex: e,
            completionText: t,
            displayText: t.trimLeft(),
            displayNeedsWsOffset: !0,
          }
        : {
            completionIndex: e,
            completionText: t,
            displayText: t,
            displayNeedsWsOffset: !1,
          };
    }
  }
  return {
    completionIndex: e,
    completionText: t,
    displayText: t,
    displayNeedsWsOffset: !1,
  };
}
function V(e, n) {
  const r = n.requestId;
  const i = {
    choiceIndex: n.choiceIndex.toString(),
  };
  const o = {
    numTokens: n.numTokens,
    compCharLen: n.completionText.length,
    numLines: n.completionText.split("\n").length,
  };
  if (n.meanLogProb) {
    o.meanLogProb = n.meanLogProb;
  }
  if (n.meanAlternativeLogProb) {
    o.meanAlternativeLogProb = n.meanAlternativeLogProb;
  }
  const s = n.telemetryData.extendedBy(i, o);
  s.extendWithRequestId(r);
  s.measurements.confidence = ghosttextscore.ghostTextScoreConfidence(e, s);
  s.measurements.quantile = ghosttextscore.ghostTextScoreQuantile(e, s);
  exports.ghostTextLogger.debug(
    e,
    `Extended telemetry for ${n.telemetryData.properties.headerRequestId} with retention confidence ${s.measurements.confidence} (expected as good or better than about ${s.measurements.quantile} of all suggestions)`
  );
  return s;
}
function H(e, t, n, r, i) {
  const o = Date.now() - r;
  const s = o - i;
  const a = n.telemetryData.extendedBy(
    {},
    {
      completionCharLen: n.completionText.length,
      requestTimeMs: o,
      processingTimeMs: i,
      deltaMs: s,
      meanLogProb: n.meanLogProb || NaN,
      meanAlternativeLogProb: n.meanAlternativeLogProb || NaN,
      numTokens: n.numTokens,
    }
  );
  a.extendWithRequestId(n.requestId);
  telemetry.telemetry(e, `ghostText.${t}`, a);
}

// e-ctx, n-document, a-position, u-isInvokeTrigger, h-report, f-token
exports.getGhostText = async function (
  ctx,
  document,
  position,
  isInvokeTrigger,
  report,
  token
) {
  // 1. 提取prompt
  const prompt = await extractprompt.extractPrompt(ctx, document, position);
  // 2. 边界判断
  if ("copilotNotAvailable" === prompt.type) {
    exports.ghostTextLogger.debug(
      ctx,
      "Copilot not available, due to the .copilotignore settings"
    );
    return {
      type: "abortedBeforeIssued",
      reason: "Copilot not available due to the .copilotignore settings",
    };
  }
  if ("contextTooShort" === prompt.type) {
    exports.ghostTextLogger.debug(ctx, "Breaking, not enough context");
    return {
      type: "abortedBeforeIssued",
      reason: "Not enough context",
    };
  }
  if (token?.isCancellationRequested) {
    exports.ghostTextLogger.info(ctx, "Cancelled after extractPrompt");
    return {
      type: "abortedBeforeIssued",
      reason: "Cancelled after extractPrompt",
    };
  }
  const isMiddleOfTheLine = (function (document, position) {
    const isMiddleLine =
      0 !=
      document.lineAt(position).text.substr(position.character).trim().length;
    const isValid = (function (position, document) {
      const n = document
        .lineAt(position)
        .text.substr(position.character)
        .trim();
      return /^\s*[)}\]"'`]*\s*[:{;,]?\s*$/.test(n);
    })(position, document);
    if (isMiddleLine && !isValid) return;
    return isMiddleLine && isValid;
  })(document, position);
  if (void 0 === isValidMiddleLine) {
    exports.ghostTextLogger.debug(ctx, "Breaking, invalid middle of the line");
    return {
      type: "abortedBeforeIssued",
      reason: "Invalid middle of the line",
    };
  }
  const StatusReporter = ctx.get(reporter.StatusReporter);
  const LocationFactory = ctx.get(locationfactory.LocationFactory);
  const repoInfo = repo.extractRepoInfoInBackground(ctx, document.fileName);
  const repoNwo = repo.tryGetGitHubNWO(repoInfo) ?? "";
  const dogFood = repo.getDogFood(repoInfo);
  const userKind = await repo.getUserKind(ctx);
  const userRepoInfo = {
    repoNwo: repoNwo,
    userKind: userKind,
    dogFood: dogFood,
    fileType: document.languageId,
  };
  const multiline = await ctx.get(p.Features).requestMultilineExploration(userRepoInfo);
  const requestConf = await (async function (ctx, document, position, prompt, isInvokeTrigger, isMiddleOfTheLine, report, multiline) {
    const blockMode = await ctx.get(config.BlockModeConfig).forLanguage(ctx, document.languageId);
    switch (blockMode) {
      case config.BlockMode.Server:
        return {
          blockMode: config.BlockMode.Server,
          requestMultiline: true,
          isCyclingRequest: isInvokeTrigger,
          finishedCb: async (e) => {},
        };
      case config.BlockMode.Parsing:
      case config.BlockMode.ParsingAndServer:
      default: {
        const l = await (async function (ctx, document, position, isMiddleOfTheLine, report, multiline) {
          if (multiline) {
            const e = await v.isEmptyBlockStart(document, position);
            const r = await v.isEmptyBlockStart(document, document.lineAt(position).range.end);
            report.properties.isEmptyBlockStartDocumentPosition = e.toString();
            report.properties.isEmptyBlockStartDocumentPositionRangeEnd =
              r.toString();
            report.properties.inlineSuggestion = isMiddleOfTheLine.toString();
            report.measurements.documentLineCount = document.lineCount;
            report.measurements.positionLine = position.line;
          }
          if (document.lineCount >= 8e3)
            telemetry.telemetry(
              ctx,
              "ghostText.longFileMultilineSkip",
              telemetry.TelemetryData.createAndMarkAsIssued({
                languageId: document.languageId,
                lineCount: String(document.lineCount),
                currentLine: String(position.line),
              })
            );
          else {
            if (!isMiddleOfTheLine && utils.isSupportedLanguageId(document.languageId)) {
              let e = await v.isEmptyBlockStart(document, position);
              if (!e && multiline) {
                e = B();
              }
              return e;
            }
            if (isMiddleOfTheLine && utils.isSupportedLanguageId(document.languageId)) {
              let e =
                (await v.isEmptyBlockStart(document, position)) ||
                (await v.isEmptyBlockStart(document, document.lineAt(position).range.end));
              if (!e && multiline) {
                e = B();
              }
              return e;
            }
          }
          return false;
        })(ctx, document, position, isMiddleOfTheLine, report, multiline);
        return l
          ? {
              blockMode: blockMode,
              requestMultiline: true,
              isCyclingRequest: false,
              finishedCb: async (r) => {
                let o;
                o =
                  prompt.trailingWs.length > 0 &&
                  !prompt.prompt.prefix.endsWith(prompt.trailingWs)
                    ? ctx
                        .get(locationfactory.LocationFactory)
                        .position(
                          position.line,
                          Math.max(position.character - prompt.trailingWs.length, 0)
                        )
                    : position;
                return v.isBlockBodyFinished(ctx, document, o, r);
              },
            }
          : {
              blockMode: blockMode,
              requestMultiline: false,
              isCyclingRequest: isInvokeTrigger,
              finishedCb: async (e) => {},
            };
      }
    }
  })(ctx, document, position, prompt, isInvokeTrigger, isMiddleOfTheLine, report, multiline);
  if (token?.isCancellationRequested) {
    exports.ghostTextLogger.info(ctx, "Cancelled after requestMultiline");
    return {
      type: "abortedBeforeIssued",
      reason: "Cancelled after requestMultiline",
    };
  }
  const [prefix] = b.trimLastLine(
    document.getText(LocationFactory.range(LocationFactory.position(0, 0), position))
  );

  // 3. 读取缓存
  let choices = (function (ctx, prefix, prompt, requestMultiline) {
    const cachedChoices = (function (ctx, prefix, prompt, requestMultiline) {
      const o = !!prefixCache && prefix.startsWith(prefixCache);
      const s = null != suffixCache && prompt.suffix == suffixCache;
      if (!(prefixCache && promptKeyCache && o && s)) return;  // 实际上是缓存了

      const choices = getCachedChoices(promptKeyCache, requestMultiline);
      if (!choices) return;
      
      const remainingPrefix = prefix.substring(prefixCache.length);
      exports.ghostTextLogger.debug(
        ctx,
        `Getting completions for user-typing flow - remaining prefix: ${remainingPrefix}`
      );
      const newChoices = [];
      choices.forEach((choice) => {
        const newChoice = trimCompletionText(choice, {
          forceSingleLine: false,
        });
        if (newChoice.completionText.startsWith(remainingPrefix)) {
          newChoice.completionText = newChoice.completionText.substring(remainingPrefix.length);
          newChoices.push(newChoice);
        }
      });
      return newChoices;
    })(ctx, prefix, prompt, requestMultiline);
    if (cachedChoices && cachedChoices.length > 0) return [cachedChoices, P.TypingAsSuggested];

    const a = (function (ctx, prefix, prompt, requestMultiline) {
      const key = s.keyForPrompt(prompt);
      exports.ghostTextLogger.debug(
        ctx,
        `Trying to get completions from cache for key: ${key}`
      );
      const cachedChoices = getCachedChoices(key, requestMultiline);
      if (cachedChoices) {
        exports.ghostTextLogger.debug(
          ctx,
          `Got completions from cache for key: ${key}`
        );
        const s = [];
        cachedChoices.forEach((e) => {
          const t = trimCompletionText(e, {
            forceSingleLine: !requestMultiline,
          });
          s.push(t);
        });
        const c = s.filter((e) => e.completionText);
        if (c.length > 0) {
          updateGlobalCacheKey(prefix, prompt.suffix, key);
        }
        return c;
      }
    })(ctx, prefix, prompt, requestMultiline);
    return a && a.length > 0 ? [a, P.Cache] : void 0;
  })(ctx, prefix, prompt.prompt, requestConf.requestMultiline);

  const requestId = o.v4();
  const engineURL = await m.getEngineURL(
    ctx,
    repo.tryGetGitHubNWO(repoInfo),
    document.languageId,
    dogFood,
    userKind,
    report
  );
  const delayMs = await ctx.get(p.Features).beforeRequestWaitMs(userRepoInfo);
  const multiLogitBias = await ctx.get(p.Features).multiLogitBias(userRepoInfo);
  const requestPayload = {
    blockMode: requestConf.blockMode,
    languageId: document.languageId,
    repoInfo: repoInfo,
    engineURL: engineURL,
    ourRequestId: requestId,
    prefix: prefix,
    prompt: prompt.prompt,
    multiline: requestConf.requestMultiline,
    indentation: v.contextIndentation(document, position),
    isCycling: isInvokeTrigger,
    delayMs: delayMs,
    multiLogitBias: multiLogitBias,
  };
  const debouncePredict = await ctx.get(p.Features).debouncePredict();
  const contextualFilterEnable = await ctx.get(p.Features).contextualFilterEnable();
  const contextualFilterAcceptThreshold = await ctx.get(p.Features).contextualFilterAcceptThreshold();
  const contextualFilterEnableTree = await ctx.get(p.Features).contextualFilterEnableTree();
  const contextualFilterExplorationTraffic = await ctx.get(p.Features).contextualFilterExplorationTraffic();
  let pe = false;
  if (debouncePredict || contextualFilterEnable) {
    pe = true;
  }
  const language = await ctx.get(language.LanguageDetection).detectLanguage(document);
  const telemetryObject = (function (e, t, n, r, o, s, a, c, l) {
    const u = e.get(locationfactory.LocationFactory);
    const p = t.lineAt(o.line);
    const d = t.getText(u.range(p.range.start, o));
    const h = t.getText(u.range(o, p.range.end));
    const f = {
      languageId: t.languageId,
      beforeCursorWhitespace: JSON.stringify("" === d.trim()),
      afterCursorWhitespace: JSON.stringify("" === h.trim()),
    };
    if (t.languageId !== n.languageId) {
      f.detectedLanguageId = n.languageId;
      f.fileExtension = n.fileExtension;
    }
    const m = {
      ...telemetry.telemetrizePromptLength(s.prompt),
      promptEndPos: t.offsetAt(o),
      documentLength: t.getText().length,
      delayMs: r.delayMs,
    };
    const y = a.extendedBy(f, m);
    y.properties.promptChoices = JSON.stringify(s.promptChoices, (e, t) =>
      t instanceof Map
        ? Array.from(t.entries()).reduce(
            (e, [t, n]) => ({
              ...e,
              [t]: n,
            }),
            {}
          )
        : t
    );
    y.properties.promptBackground = JSON.stringify(s.promptBackground, (e, t) =>
      t instanceof Map ? Array.from(t.values()) : t
    );
    const _ = Array.from(s.neighborSource.entries()).map((e) => [
      e[0],
      e[1].map((e) => i.SHA256(e).toString()),
    ]);
    y.properties.neighborSource = JSON.stringify(_);
    y.measurements.promptComputeTimeMs = s.computeTimeMs;
    if (c) {
      y.measurements.contextualFilterScore = I.contextualFilterScore(
        e,
        y,
        s.prompt,
        l
      );
    }
    const v = r.repoInfo;
    y.properties.gitRepoInformation =
      void 0 === v
        ? "unavailable"
        : v === repo.ComputationStatus.PENDING
        ? "pending"
        : "available";
    if (void 0 !== v && v !== repo.ComputationStatus.PENDING) {
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
    telemetry.telemetry(e, "ghostText.issued", y);
    return y;
  })(e, n, language, requestPayload, a, prompt, h, pe, contextualFilterEnableTree);

  // 4. 真正开始发起请求
  if (
    (requestConf.isCyclingRequest && (choices?.[0].length ?? 0) > 1) ||
    (!requestConf.isCyclingRequest && void 0 !== choices)
  )
    exports.ghostTextLogger.info(ctx, "Found inline suggestions locally");
  else {
    StatusReporter?.setProgress();
    if (requestConf.isCyclingRequest) {
      const result = await (async function (ctx, requestPayload, telemetryObject, token, finishedCb) {
        // n, now, result.getProcessingTime(), result.choices
        return getCompletion(ctx, requestPayload, telemetryObject, token, finishedCb, "all completions", async (n, now, processingTime, choices) => {
          const newChoices = [];
          for await (const choice of choices) {
            if (token?.isCancellationRequested)
              return (
                exports.ghostTextLogger.debug(
                  ctx,
                  "Cancelled after awaiting choices iterator"
                ),
                {
                  type: "canceled",
                  reason: "after awaiting choices iterator",
                  telemetryData: (0, telemetryutils.mkCanceledResultTelemetry)(
                    telemetryObject
                  ),
                }
              );
            if (n.completionText.trimEnd()) {
              if (
                -1 !==
                newChoices.findIndex(
                  (e) => e.completionText.trim() === choice.completionText.trim()
                )
              )
                continue;
              newChoices.push(choice);
            }
          }
          return (
            newChoices.length > 0 &&
              (updateCache(ctx, requestPayload, {
                multiline: requestPayload.multiline,
                choices: newChoices,
              }),
              H(ctx, "cyclingPerformance", newChoices[0], now, processingTime)),
            {
              type: "success",
              value: newChoices,
              telemetryData: (0, telemetryutils.mkBasicResultTelemetry)(telemetryObject),
              telemetryBlob: telemetryObject,
            }
          );
        });
      })(ctx, requestPayload, telemetryObject, token, requestConf.finishedCb);
      if ("success" === result.type) {
        const e = choices?.[0] ?? [];
        result.value.forEach((t) => {
          -1 ===
            e.findIndex(
              (e) => e.completionText.trim() === t.completionText.trim()
            ) && e.push(t);
        }),
          (choices = [e, P.Cycling]);
      } else if (void 0 === choices) return StatusReporter?.removeProgress(), result;
    } else {
      const n = await (0, A.getDebounceLimit)(ctx, telemetryObject);
      try {
        await D.debounce(n);
      } catch {
        return {
          type: "canceled",
          reason: "by debouncer",
          telemetryData: (0, telemetryutils.mkCanceledResultTelemetry)(telemetryObject),
        };
      }
      if (token?.isCancellationRequested)
        return (
          exports.ghostTextLogger.info(ctx, "Cancelled during debounce"),
          {
            type: "canceled",
            reason: "during debounce",
            telemetryData: (0, telemetryutils.mkCanceledResultTelemetry)(telemetryObject),
          }
        );
      if (
        contextualFilterEnable &&
        telemetryObject.measurements.contextualFilterScore &&
        telemetryObject.measurements.contextualFilterScore < contextualFilterAcceptThreshold / 100 &&
        Math.random() < 1 - contextualFilterExplorationTraffic / 100
      )
        return (
          exports.ghostTextLogger.info(ctx, "Cancelled by contextual filter"),
          {
            type: "canceled",
            reason: "contextualFilterScore below threshold",
            telemetryData: (0, telemetryutils.mkCanceledResultTelemetry)(telemetryObject),
          }
        );
      const r = await (async function (e, n, r, i, o) {
        return getCompletion(e, n, r, i, o, "completions", async (o, a, c, l) => {
          const u = l[Symbol.asyncIterator](),
            d = await u.next();
          if (d.done)
            return (
              exports.ghostTextLogger.debug(e, "All choices redacted"),
              {
                type: "empty",
                reason: "all choices redacted",
                telemetryData: (0, telemetryutils.mkBasicResultTelemetry)(r),
              }
            );
          if (i?.isCancellationRequested)
            return (
              exports.ghostTextLogger.debug(
                e,
                "Cancelled after awaiting redactedChoices iterator"
              ),
              {
                type: "canceled",
                reason: "after awaiting redactedChoices iterator",
                telemetryData: (0, telemetryutils.mkCanceledResultTelemetry)(r),
              }
            );
          const h = d.value;
          if (void 0 === h)
            return (
              exports.ghostTextLogger.debug(
                e,
                "Got undefined choice from redactedChoices iterator"
              ),
              {
                type: "empty",
                reason: "got undefined choice from redactedChoices iterator",
                telemetryData: (0, telemetryutils.mkBasicResultTelemetry)(r),
              }
            );
          H(e, "performance", h, a, c);
          const f = o - 1;
          exports.ghostTextLogger.debug(
            e,
            `Awaited first result, id:  ${h.choiceIndex}`
          ),
            (function (e, n, r) {
              const i = (0, s.keyForPrompt)(n.prompt);
              updateGlobalCacheKey(n.prefix, n.prompt.suffix, i),
                exports.completionCache.set(i, r),
                exports.ghostTextLogger.debug(
                  e,
                  `Cached ghost text for key: ${i}, multiline: ${r.multiline}, number of suggestions: ${r.choices.length}`
                );
            })(e, n, {
              multiline: n.multiline,
              choices: [h],
            });
          const m = [];
          for (let e = 0; e < f; e++) m.push(u.next());
          const g = Promise.all(m).then(async (r) => {
            (await e.get(p.Features).fastCancellation()) && u.next(),
              exports.ghostTextLogger.debug(
                e,
                `Awaited remaining results, number of results: ${r.length}`
              );
            const i = [];
            for (const n of r) {
              const r = n.value;
              if (
                void 0 !== r &&
                (exports.ghostTextLogger.info(
                  e,
                  `GhostText later completion: [${r.completionText}]`
                ),
                r.completionText.trimEnd())
              ) {
                if (
                  -1 !==
                  i.findIndex(
                    (e) => e.completionText.trim() === r.completionText.trim()
                  )
                )
                  continue;
                if (r.completionText.trim() === h.completionText.trim())
                  continue;
                i.push(r);
              }
            }
            i.length > 0 &&
              updateCache(e, n, {
                multiline: n.multiline,
                choices: i,
              });
          });
          return (
            (0, env.isRunningInTest)(e) && (await g),
            {
              type: "success",
              value: trimCompletionText(d.value, {
                forceSingleLine: !1,
              }),
              telemetryData: (0, telemetryutils.mkBasicResultTelemetry)(r),
              telemetryBlob: r,
            }
          );
        });
      })(e, requestPayload, telemetryObject, f, requestConf.finishedCb);
      if ("success" !== r.type) return StatusReporter?.removeProgress(), r;
      choices = [[r.value], P.Network];
    }
    StatusReporter?.removeProgress();
  }

  
  if (void 0 === choices)
    return {
      type: "failed",
      reason: "internal error: choices should be defined after network call",
      telemetryData: telemetryutils.mkBasicResultTelemetry(telemetryObject),
    };
  const [fe, resultType] = choices;
  const ge = c.asyncIterableMapFilter(c.asyncIterableFromArray(fe), async (r) =>
    T.postProcessChoice(
      ctx,
      "ghostText",
      document,
      position,
      r,
      isMiddleOfTheLine,
      exports.ghostTextLogger
    )
  );
  const ye = [];
  for await (const r of ge) {
    const i = isMiddleOfTheLine && T.checkSuffix(document, position, r);
    if (token?.isCancellationRequested) {
      exports.ghostTextLogger.info(
        ctx,
        "Cancelled after post processing completions"
      );
      return {
        type: "canceled",
        reason: "after post processing completions",
        telemetryData: telemetryutils.mkCanceledResultTelemetry(telemetryObject),
      };
    }
    const o = V(ctx, r);
    const s = {
      completion: $(r.choiceIndex, r.completionText, prompt.trailingWs),
      telemetry: o,
      isMiddleOfTheLine: isMiddleOfTheLine,
      coversSuffix: i,
    };
    ye.push(s);
  }
  return {
    type: "success",
    value: [ye, resultType],
    telemetryData: telemetryutils.mkBasicResultTelemetry(telemetryObject),
    telemetryBlob: telemetryObject,
  };
};
