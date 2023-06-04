Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getTemperatureForSamples = exports.calculateMeanAlternativeLogProb = exports.calculateMeanLogProb = exports.cleanupIndentChoices = exports.convertToAPIChoice = exports.DEFAULT_CHARACTER_MULTIPLIER = exports.MAX_PROMPT_LENGTH = exports.getRequestId = exports.OpenAIFetcher = exports.LiveOpenAIFetcher = exports.CopilotUiKind = void 0;
const r = require(51133);
const i = require(29899);
const o = require(6333);
const s = require(60070);
var a = require(24419);
function calculateMeanLogProb(e, t) {
  if (t?.logprobs?.token_logprobs) try {
    let e = 0;
    let n = 0;
    let r = 50;
    for (let i = 0; i < t.logprobs.token_logprobs.length - 1 && r > 0; i++, r--) {
      e += t.logprobs.token_logprobs[i];
      n += 1;
    }
    return n > 0 ? e / n : void 0;
  } catch (t) {
    i.logger.exception(e, t, "Error calculating mean prob");
  }
}
function calculateMeanAlternativeLogProb(e, t) {
  if (t?.logprobs?.top_logprobs) try {
    let e = 0;
    let n = 0;
    let r = 50;
    for (let i = 0; i < t.logprobs.token_logprobs.length - 1 && r > 0; i++, r--) {
      const r = {
        ...t.logprobs.top_logprobs[i]
      };
      delete r[t.logprobs.tokens[i]];
      e += Math.max(...Object.values(r));
      n += 1;
    }
    return n > 0 ? e / n : void 0;
  } catch (t) {
    i.logger.exception(e, t, "Error calculating mean prob");
  }
}
Object.defineProperty(exports, "CopilotUiKind", {
  enumerable: !0,
  get: function () {
    return a.CopilotUiKind;
  }
});
Object.defineProperty(exports, "LiveOpenAIFetcher", {
  enumerable: !0,
  get: function () {
    return a.LiveOpenAIFetcher;
  }
});
Object.defineProperty(exports, "OpenAIFetcher", {
  enumerable: !0,
  get: function () {
    return a.OpenAIFetcher;
  }
});
Object.defineProperty(exports, "getRequestId", {
  enumerable: !0,
  get: function () {
    return a.getRequestId;
  }
});
exports.MAX_PROMPT_LENGTH = 1500;
exports.DEFAULT_CHARACTER_MULTIPLIER = 3;
exports.convertToAPIChoice = function (e, t, n, r, i, s, a, u) {
  o.logEngineCompletion(e, t, n, i, r);
  return {
    completionText: t,
    meanLogProb: calculateMeanLogProb(e, n),
    meanAlternativeLogProb: calculateMeanAlternativeLogProb(e, n),
    choiceIndex: r,
    requestId: i,
    modelInfo: u,
    blockFinished: s,
    tokens: n.tokens,
    numTokens: n.tokens.length,
    telemetryData: a
  };
};
exports.cleanupIndentChoices = async function* (e, t) {
  for await (const n of e) {
    const e = {
      ...n
    };
    const r = e.completionText.split("\n");
    for (let e = 0; e < r.length; ++e) {
      const n = r[e].trimLeft();
      r[e] = "" === n ? n : t + n;
    }
    e.completionText = r.join("\n");
    yield e;
  }
};
exports.calculateMeanLogProb = calculateMeanLogProb;
exports.calculateMeanAlternativeLogProb = calculateMeanAlternativeLogProb;
exports.getTemperatureForSamples = function (e, t) {
  if (s.isRunningInTest(e)) return 0;
  const n = parseFloat(r.getConfig(e, r.ConfigKey.Temperature));
  return n >= 0 && n <= 1 ? n : t <= 1 ? 0 : t < 10 ? .2 : t < 20 ? .4 : .8;
};