Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.LiveOpenAIFetcher = exports.postProcessChoices = exports.OpenAIFetcher = exports.extractEngineName = exports.getProcessingTime = exports.getRequestId = exports.CopilotUiKind = void 0;
const r = require(73837);
const token = require("./token");
const o = require(38213);
const config = require("./config");
const a = require(59189);
const logger = require("./logger");
const request = require("./request");
const reporter = require("./status-reporter");
const repo = require("./repo");
const telemetry = require("./telemetry");
const h = require(40937);
const f = require(42901);
const m = new logger.Logger(logger.LogLevel.INFO, "fetch");
var g;
function getRequestId(e, t) {
  return {
    headerRequestId: e.headers.get("x-request-id") || "",
    completionId: t && t.id ? t.id : "",
    created: t && t.created ? t.created : 0,
    serverExperiments: e.headers.get("X-Copilot-Experiment") || "",
    deploymentId: e.headers.get("azureml-model-deployment") || ""
  };
}
function getProcessingTime(e) {
  const t = e.headers.get("openai-processing-ms");
  return t ? parseInt(t, 10) : 0;
}
function extractEngineName(e, t) {
  return t.split("/").pop() || (m.error(e, "Malformed engine URL: " + t), t);
}
!function (e) {
  e.GhostText = "ghostText";
  e.Panel = "synthesize";
  e.ConversationPanel = "conversationPanel";
  e.ConversationInline = "conversationInline";
}(g = exports.CopilotUiKind || (exports.CopilotUiKind = {}));
exports.getRequestId = getRequestId;
exports.getProcessingTime = getProcessingTime;
exports.extractEngineName = extractEngineName;
class OpenAIFetcher {}
function postProcessChoices(e, t) {
  return t ? e : o.asyncIterableFilter(e, async e => e.completionText.trim().length > 0);
}
exports.OpenAIFetcher = OpenAIFetcher;
exports.postProcessChoices = postProcessChoices;
exports.LiveOpenAIFetcher = class extends OpenAIFetcher {
  async fetchAndStreamCompletions(e, t, n, r, i, s) {
    const l = e.get(reporter.StatusReporter);
    const p = "completions";
    const h = await this.fetchWithParameters(e, p, t, i, s);
    if ("not-sent" === h) return {
      type: "canceled",
      reason: "before fetch request"
    };
    if (i?.isCancellationRequested) {
      const t = await h.body();
      try {
        t.destroy();
      } catch (t) {
        logger.logger.exception(e, t, "Error destroying stream");
      }
      return {
        type: "canceled",
        reason: "after fetch request"
      };
    }
    if (void 0 === h) {
      const n = this.createTelemetryData(p, e, t);
      l.setWarning();
      n.properties.error = "Response was undefined";
      telemetry.telemetry(e, "request.shownWarning", n);
      return {
        type: "failed",
        reason: "fetch response was undefined"
      };
    }
    if (200 !== h.status) {
      const n = this.createTelemetryData(p, e, t);
      return this.handleError(e, l, n, h);
    }
    const m = await e.get(a.Features).dropCompletionReasons();
    const g = (await f.SSEProcessor.create(e, t.count, h, n, m, i)).processSSE(r);
    return {
      type: "success",
      choices: postProcessChoices(o.asyncIterableMap(g, async t => f.prepareSolutionForReturn(e, t, n)), t.allowEmptyChoices),
      getProcessingTime: () => getProcessingTime(h)
    };
  }
  createTelemetryData(e, t, n) {
    return telemetry.TelemetryData.createAndMarkAsIssued({
      endpoint: e,
      engineName: extractEngineName(t, n.engineUrl),
      uiKind: n.uiKind,
      headerRequestId: n.ourRequestId
    });
  }
  async fetchWithParameters(e, t, n, o, f) {
    const m = config.getLanguageConfig(e, config.ConfigKey.Stops);
    const _ = await e.get(a.Features).disableLogProb();
    const b = {
      prompt: n.prompt.prefix,
      suffix: n.prompt.suffix,
      max_tokens: config.getConfig(e, config.ConfigKey.SolutionLength),
      temperature: h.getTemperatureForSamples(e, n.count),
      top_p: config.getConfig(e, config.ConfigKey.TopP),
      n: n.count,
      stop: m
    };
    if (!n.requestLogProbs && _) {
      b.logprobs = 2;
    }
    const E = repo.tryGetGitHubNWO(n.repoInfo);
    if (void 0 !== E) {
      b.nwo = E;
    }
    if (n.postOptions) {
      Object.assign(b, n.postOptions);
    }
    return o?.isCancellationRequested ? "not-sent" : (logger.logger.info(e, `[fetchCompletions] engine ${n.engineUrl}`), await function (e, t, n, i, o, s, a, p, h, f) {
      const m = e.get(reporter.StatusReporter);
      const _ = r.format("%s/%s", n, i);
      if (!a) return void logger.logger.error(e, `Failed to send request to ${_} due to missing key`);
      let b = telemetry.TelemetryData.createAndMarkAsIssued({
        endpoint: i,
        engineName: extractEngineName(e, n),
        uiKind: p
      }, telemetry.telemetrizePromptLength(t));
      if (f) {
        b = b.extendedBy(f);
      }
      for (const [e, t] of Object.entries(s)) if ("prompt" != e && "suffix" != e) {
        b.properties[`request.option.${e}`] = JSON.stringify(t) ?? "undefined";
      }
      b.properties.headerRequestId = o;
      telemetry.telemetry(e, "request.sent", b);
      const E = telemetry.now();
      const w = function (e) {
        switch (e) {
          case g.GhostText:
            return "copilot-ghost";
          case g.Panel:
            return "copilot-panel";
        }
      }(p);
      return request.postRequest(e, _, a, w, o, s, h).then(n => {
        const r = getRequestId(n, void 0);
        b.extendWithRequestId(r);
        const i = telemetry.now() - E;
        b.measurements.totalTimeMs = i;
        logger.logger.info(e, `request.response: [${_}] took ${i} ms`);
        logger.logger.debug(e, "request.response properties", b.properties);
        logger.logger.debug(e, "request.response measurements", b.measurements);
        logger.logger.debug(e, `prompt: ${JSON.stringify(t)}`);
        telemetry.telemetry(e, "request.response", b);
        return n;
      }).catch(t => {
        if (request.isAbortError(t)) throw t;
        m.setWarning(t.message);
        const n = b.extendedBy({
          error: "Network exception"
        });
        telemetry.telemetry(e, "request.shownWarning", n);
        b.properties.code = String(t.code ?? "");
        b.properties.errno = String(t.errno ?? "");
        b.properties.message = String(t.message ?? "");
        b.properties.type = String(t.type ?? "");
        const r = telemetry.now() - E;
        throw b.measurements.totalTimeMs = r, logger.logger.debug(e, `request.response: [${_}] took ${r} ms`), logger.logger.debug(e, "request.error properties", b.properties), logger.logger.debug(e, "request.error measurements", b.measurements), logger.logger.exception(e, t, "Request Error"), telemetry.telemetry(e, "request.error", b), t;
      }).finally(() => {
        telemetry.logEnginePrompt(e, t, b);
      });
    }(e, n.prompt, n.engineUrl, t, n.ourRequestId, b, (await e.get(token.CopilotTokenManager).getCopilotToken(e)).token, n.uiKind, o, f));
  }
  async handleError(e, t, n, r) {
    t.setWarning();
    n.properties.error = `Response status was ${r.status}`;
    n.properties.status = String(r.status);
    telemetry.telemetry(e, "request.shownWarning", n);
    if (401 === r.status || 403 === r.status) return e.get(token.CopilotTokenManager).resetCopilotToken(e, r.status), {
      type: "failed",
      reason: `token expired or invalid: ${r.status}`
    };
    if (499 === r.status) {
      m.info(e, "Cancelled by server");
      return {
        type: "failed",
        reason: "canceled by server"
      };
    }
    const o = await r.text();
    return 466 === r.status ? (t.setError(o), m.info(e, o), {
      type: "failed",
      reason: `client not supported: ${o}`
    }) : (m.error(e, "Unhandled status from server:", r.status, o), {
      type: "failed",
      reason: `unhandled status from server: ${r.status} ${o}`
    });
  }
};