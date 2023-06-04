Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.logEnginePrompt = exports.logEngineCompletion = exports.telemetryError = exports.telemetryException = exports.telemetryRaw = exports.telemetryExpProblem = exports.telemetry = exports.TelemetryEndpointUrl = exports.now = exports.telemetrizePromptLength = exports.TelemetryData = exports.TelemetryUserConfig = exports.TelemetryReporters = exports.CopilotTelemetryReporter = void 0;
const r = require(1581);
const i = require(42600);
const o = require(1402);
const s = require(51133);
const a = require(59189);
const c = require(46500);
const l = require(60070);
const u = require(26071);
const p = require(72499);
exports.CopilotTelemetryReporter = class {};
class TelemetryReporters {
  getReporter(e) {
    return this.reporter;
  }
  getSecureReporter(e) {
    return y(e) ? this.reporterSecure : l.shouldFailForDebugPurposes(e) ? new u.FailingTelemetryReporter() : void 0;
  }
  setReporter(e) {
    this.reporter = e;
  }
  setSecureReporter(e) {
    this.reporterSecure = e;
  }
  async deactivate() {
    let e = Promise.resolve();
    if (this.reporter) {
      e = this.reporter.dispose();
      this.reporter = void 0;
    }
    let t = Promise.resolve();
    if (this.reporterSecure) {
      t = this.reporterSecure.dispose();
      this.reporterSecure = void 0;
    }
    await Promise.all([e, t]);
  }
}
exports.TelemetryReporters = TelemetryReporters;
class TelemetryUserConfig {
  constructor(e, t, n) {
    this.trackingId = t;
    this.optedIn = n ?? !1;
    this.setupUpdateOnToken(e);
  }
  setupUpdateOnToken(e) {
    e.get(o.CopilotTokenNotifier).on("onCopilotToken", e => {
      const t = "1" === e.getTokenValue("rt");
      const n = e.getTokenValue("tid");
      const r = e.organization_list;
      if (void 0 !== n) {
        this.trackingId = n;
        this.organizationsList = r?.toString();
        this.optedIn = t;
      }
    });
  }
}
exports.TelemetryUserConfig = TelemetryUserConfig;
class TelemetryData {
  constructor(e, t, n) {
    this.properties = e;
    this.measurements = t;
    this.issuedTime = n;
  }
  static createAndMarkAsIssued(e, t) {
    return new TelemetryData(e || {}, t || {}, now());
  }
  extendedBy(e, t) {
    const n = {
      ...this.properties,
      ...e
    };
    const r = {
      ...this.measurements,
      ...t
    };
    const i = new TelemetryData(n, r, this.issuedTime);
    i.displayedTime = this.displayedTime;
    i.filtersAndExp = this.filtersAndExp;
    return i;
  }
  markAsDisplayed() {
    if (void 0 === this.displayedTime) {
      this.displayedTime = now();
    }
  }
  async extendWithExpTelemetry(e) {
    if (this.filtersAndExp) {
      await e.get(a.Features).addExpAndFilterToTelemetry(this);
    }
    this.filtersAndExp.exp.addToTelemetry(this);
    this.filtersAndExp.filters.addToTelemetry(this);
  }
  extendWithEditorAgnosticFields(e) {
    this.properties.editor_version = s.formatNameAndVersion(e.get(s.EditorAndPluginInfo).getEditorInfo());
    this.properties.editor_plugin_version = s.formatNameAndVersion(e.get(s.EditorAndPluginInfo).getEditorPluginInfo());
    const t = e.get(s.EditorSession);
    this.properties.client_machineid = t.machineId;
    this.properties.client_sessionid = t.sessionId;
    this.properties.copilot_version = `copilot/${s.getVersion(e)}`;
    const n = e.get(s.EditorAndPluginInfo);
    this.properties.common_extname = n.getEditorPluginInfo().name;
    this.properties.common_extversion = n.getEditorPluginInfo().version;
    this.properties.common_vscodeversion = s.formatNameAndVersion(n.getEditorInfo());
  }
  extendWithConfigProperties(e) {
    const t = s.dumpConfig(e);
    t["copilot.build"] = s.getBuild(e);
    t["copilot.buildType"] = s.getBuildType(e);
    const n = e.get(TelemetryUserConfig);
    if (n.trackingId) {
      t["copilot.trackingId"] = n.trackingId;
    }
    if (n.organizationsList) {
      t.organizations_list = n.organizationsList;
    }
    this.properties = {
      ...this.properties,
      ...t
    };
  }
  extendWithRequestId(e) {
    const t = {
      completionId: e.completionId,
      created: e.created.toString(),
      headerRequestId: e.headerRequestId,
      serverExperiments: e.serverExperiments,
      deploymentId: e.deploymentId
    };
    this.properties = {
      ...this.properties,
      ...t
    };
  }
  static maybeRemoveRepoInfoFromPropertiesHack(e, t) {
    if (e) return t;
    const n = {};
    for (const e in t) if (TelemetryData.keysToRemoveFromStandardTelemetryHack.includes(e)) {
      n[e] = t[e];
    }
    return n;
  }
  sanitizeKeys() {
    this.properties = TelemetryData.sanitizeKeys(this.properties);
    this.measurements = TelemetryData.sanitizeKeys(this.measurements);
  }
  static sanitizeKeys(e) {
    e = e || {};
    const t = {};
    for (const n in e) t[TelemetryData.keysExemptedFromSanitization.includes(n) ? n : n.replace(/\./g, "_")] = e[n];
    return t;
  }
  updateTimeSinceIssuedAndDisplayed() {
    const e = now() - this.issuedTime;
    this.measurements.timeSinceIssuedMs = e;
    if (void 0 !== this.displayedTime) {
      const e = now() - this.displayedTime;
      this.measurements.timeSinceDisplayedMs = e;
    }
  }
  validateData(e, t) {
    let n;
    if (TelemetryData.validateTelemetryProperties(this.properties)) {
      n = {
        problem: "properties",
        error: JSON.stringify(TelemetryData.validateTelemetryProperties.errors)
      };
    }
    if (!TelemetryData.validateTelemetryMeasurements(this.measurements)) {
      const e = JSON.stringify(TelemetryData.validateTelemetryMeasurements.errors);
      void 0 === n ? n = {
        problem: "measurements",
        error: e
      } : (n.problem = "both", n.error += `; ${e}`);
    }
    if (void 0 === n) return !0;
    if (l.shouldFailForDebugPurposes(e)) throw new Error(`Invalid telemetry data: ${n.problem} ${n.error} properties=${JSON.stringify(this.properties)} measurements=${JSON.stringify(this.measurements)}`);
    telemetryError(e, "invalidTelemetryData", TelemetryData.createAndMarkAsIssued({
      properties: JSON.stringify(this.properties),
      measurements: JSON.stringify(this.measurements),
      problem: n.problem,
      validationError: n.error
    }), t);
    if (t) {
      telemetryError(e, "invalidTelemetryData_in_secure", TelemetryData.createAndMarkAsIssued({
        problem: n.problem,
        requestId: this.properties.requestId ?? "unknown"
      }), !1);
    }
    return !1;
  }
  async makeReadyForSending(e, t, n) {
    this.extendWithConfigProperties(e);
    this.extendWithEditorAgnosticFields(e);
    this.sanitizeKeys();
    if ("IncludeExp" === n) {
      await this.extendWithExpTelemetry(e);
    }
    this.updateTimeSinceIssuedAndDisplayed();
    if (this.validateData(e, t)) {
      this.properties.telemetry_failed_validation = "true";
    }
    v(e, this.properties);
  }
}
function m(e, t, n, r) {
  const i = t ? e.get(TelemetryReporters).getSecureReporter(e) : e.get(TelemetryReporters).getReporter(e);
  if (i) {
    i.sendTelemetryEvent(n, TelemetryData.maybeRemoveRepoInfoFromPropertiesHack(t, r.properties), r.measurements);
  }
}
function now() {
  return new Date().getTime();
}
function y(e) {
  return e.get(TelemetryUserConfig).optedIn;
}
async function telemetry(e, t, n, r) {
  await e.get(u.PromiseQueue).register(async function (e, t, n, r) {
    if (r && !y(e)) return;
    const i = n || TelemetryData.createAndMarkAsIssued({}, {});
    await i.makeReadyForSending(e, r ?? !1, "IncludeExp");
    m(e, r ?? !1, t, i);
  }(e, t, n, r));
}
function v(e, t) {
  t.unique_id = i.v4();
  const n = e.get(s.EditorAndPluginInfo);
  t.common_extname = n.getEditorPluginInfo().name;
  t.common_extversion = n.getEditorPluginInfo().version;
  t.common_vscodeversion = s.formatNameAndVersion(n.getEditorInfo());
}
async function telemetryError(e, t, n, r) {
  await e.get(u.PromiseQueue).register(async function (e, t, n, r) {
    if (r && !y(e)) return;
    const i = n || TelemetryData.createAndMarkAsIssued({}, {});
    await i.makeReadyForSending(e, r ?? !1, "IncludeExp");
    (function (e, t, n, r) {
      const i = t ? e.get(TelemetryReporters).getSecureReporter(e) : e.get(TelemetryReporters).getReporter(e);
      if (i) {
        i.sendTelemetryErrorEvent(n, TelemetryData.maybeRemoveRepoInfoFromPropertiesHack(t, r.properties), r.measurements);
      }
    })(e, r ?? !1, t, i);
  }(e, t, n, r));
}
TelemetryData.ajv = new r.default({
  strictNumbers: !1
});
TelemetryData.validateTelemetryProperties = TelemetryData.ajv.compile({
  type: "object",
  additionalProperties: {
    type: "string"
  },
  required: []
});
TelemetryData.validateTelemetryMeasurements = TelemetryData.ajv.compile({
  type: "object",
  properties: {
    meanLogProb: {
      type: "number",
      nullable: !0
    },
    meanAlternativeLogProb: {
      type: "number",
      nullable: !0
    }
  },
  additionalProperties: {
    type: "number"
  },
  required: []
});
TelemetryData.keysExemptedFromSanitization = [c.ExpServiceTelemetryNames.assignmentContextTelemetryPropertyName, c.ExpServiceTelemetryNames.featuresTelemetryPropertyName];
TelemetryData.keysToRemoveFromStandardTelemetryHack = ["gitRepoHost", "gitRepoName", "gitRepoOwner", "gitRepoUrl", "gitRepoPath", "repo", "request_option_nwo", "userKind"];
exports.TelemetryData = TelemetryData;
exports.telemetrizePromptLength = function (e) {
  return e.isFimEnabled ? {
    promptPrefixCharLen: e.prefix.length,
    promptSuffixCharLen: e.suffix.length
  } : {
    promptCharLen: e.prefix.length
  };
};
exports.now = now;
exports.TelemetryEndpointUrl = class {
  constructor(e = "https://copilot-telemetry.githubusercontent.com/telemetry") {
    this.url = e;
  }
  getUrl() {
    return this.url;
  }
  setUrlForTesting(e) {
    this.url = e;
  }
};
exports.telemetry = telemetry;
exports.telemetryExpProblem = async function (e, t) {
  await e.get(u.PromiseQueue).register(async function (e, t) {
    const n = TelemetryData.createAndMarkAsIssued(t, {});
    await n.makeReadyForSending(e, !1, "SkipExp");
    m(e, !1, "expProblem", n);
  }(e, t));
};
exports.telemetryRaw = async function (e, t, n, r) {
  await e.get(u.PromiseQueue).register(async function (e, t, n, r) {
    v(e, n);
    m(e, !1, t, {
      properties: n,
      measurements: r
    });
  }(e, t, n, r));
};
exports.telemetryException = async function (e, t, n, r) {
  await e.get(u.PromiseQueue).register(async function (e, t, n, r) {
    const i = t instanceof Error ? t : new Error("Non-error thrown: " + t);
    const o = y(e);
    const s = TelemetryData.createAndMarkAsIssued({
      origin: p.redactPaths(n),
      reason: o ? "Exception logged to restricted telemetry" : "Exception, not logged due to opt-out",
      ...r
    });
    await s.makeReadyForSending(e, !1, "IncludeExp");
    m(e, !1, "exception", s);
    if (!o) return;
    const a = TelemetryData.createAndMarkAsIssued({
      origin: n,
      ...r
    });
    await a.makeReadyForSending(e, !0, "IncludeExp");
    (function (e, t, n, r) {
      const i = e.get(TelemetryReporters).getSecureReporter(e);
      if (i) {
        i.sendTelemetryException(n, TelemetryData.maybeRemoveRepoInfoFromPropertiesHack(true, r.properties), r.measurements);
      }
    })(e, 0, i, a);
  }(e, t, n, r));
};
exports.telemetryError = telemetryError;
exports.logEngineCompletion = async function (e, t, n, r, i) {
  const o = TelemetryData.createAndMarkAsIssued({
    completionTextJson: JSON.stringify(t),
    choiceIndex: i.toString()
  });
  if (n.logprobs) for (const [e, t] of Object.entries(n.logprobs)) o.properties["logprobs_" + e] = JSON.stringify(t) ?? "unset";
  o.extendWithRequestId(r);
  await telemetry(e, "engine.completion", o, !0);
};
exports.logEnginePrompt = async function (e, t, n) {
  let r;
  r = t.isFimEnabled ? {
    promptPrefixJson: JSON.stringify(t.prefix),
    promptSuffixJson: JSON.stringify(t.suffix),
    promptElementRanges: JSON.stringify(t.promptElementRanges)
  } : {
    promptJson: JSON.stringify(t.prefix),
    promptElementRanges: JSON.stringify(t.promptElementRanges)
  };
  const i = n.extendedBy(r);
  await telemetry(e, "engine.prompt", i, !0);
};