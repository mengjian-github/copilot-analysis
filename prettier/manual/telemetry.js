exports.logEnginePrompt =
  exports.logEngineCompletion =
  exports.telemetryError =
  exports.telemetryException =
  exports.telemetryRaw =
  exports.telemetryExpProblem =
  exports.telemetry =
  exports.TelemetryEndpointUrl =
  exports.now =
  exports.telemetrizePromptLength =
  exports.TelemetryData =
  exports.TelemetryUserConfig =
  exports.TelemetryReporters =
  exports.CopilotTelemetryReporter =
    void 0;
const r = require(1581),
  i = require(42600),
  o = require(1402),
  s = require(51133),
  a = require(59189),
  c = require(46500),
  l = require(60070),
  u = require(26071),
  p = require(72499);
exports.CopilotTelemetryReporter = class {};
class d {
  getReporter(e) {
    return this.reporter;
  }
  getSecureReporter(e) {
    return y(e)
      ? this.reporterSecure
      : (0, l.shouldFailForDebugPurposes)(e)
      ? new u.FailingTelemetryReporter()
      : void 0;
  }
  setReporter(e) {
    this.reporter = e;
  }
  setSecureReporter(e) {
    this.reporterSecure = e;
  }
  async deactivate() {
    let e = Promise.resolve();
    this.reporter && ((e = this.reporter.dispose()), (this.reporter = void 0));
    let t = Promise.resolve();
    this.reporterSecure &&
      ((t = this.reporterSecure.dispose()), (this.reporterSecure = void 0)),
      await Promise.all([e, t]);
  }
}
exports.TelemetryReporters = d;
class h {
  constructor(e, t, n) {
    (this.trackingId = t), (this.optedIn = n ?? !1), this.setupUpdateOnToken(e);
  }
  setupUpdateOnToken(e) {
    e.get(o.CopilotTokenNotifier).on("onCopilotToken", (e) => {
      const t = "1" === e.getTokenValue("rt"),
        n = e.getTokenValue("tid"),
        r = e.organization_list;
      void 0 !== n &&
        ((this.trackingId = n),
        (this.organizationsList = r?.toString()),
        (this.optedIn = t));
    });
  }
}
exports.TelemetryUserConfig = h;
class f {
  constructor(e, t, n) {
    (this.properties = e), (this.measurements = t), (this.issuedTime = n);
  }
  static createAndMarkAsIssued(e, t) {
    return new f(e || {}, t || {}, g());
  }
  extendedBy(e, t) {
    const n = {
        ...this.properties,
        ...e,
      },
      r = {
        ...this.measurements,
        ...t,
      },
      i = new f(n, r, this.issuedTime);
    return (
      (i.displayedTime = this.displayedTime),
      (i.filtersAndExp = this.filtersAndExp),
      i
    );
  }
  markAsDisplayed() {
    void 0 === this.displayedTime && (this.displayedTime = g());
  }
  async extendWithExpTelemetry(e) {
    this.filtersAndExp ||
      (await e.get(a.Features).addExpAndFilterToTelemetry(this)),
      this.filtersAndExp.exp.addToTelemetry(this),
      this.filtersAndExp.filters.addToTelemetry(this);
  }
  extendWithEditorAgnosticFields(e) {
    (this.properties.editor_version = (0, s.formatNameAndVersion)(
      e.get(s.EditorAndPluginInfo).getEditorInfo()
    )),
      (this.properties.editor_plugin_version = (0, s.formatNameAndVersion)(
        e.get(s.EditorAndPluginInfo).getEditorPluginInfo()
      ));
    const t = e.get(s.EditorSession);
    (this.properties.client_machineid = t.machineId),
      (this.properties.client_sessionid = t.sessionId),
      (this.properties.copilot_version = `copilot/${(0, s.getVersion)(e)}`);
    const n = e.get(s.EditorAndPluginInfo);
    (this.properties.common_extname = n.getEditorPluginInfo().name),
      (this.properties.common_extversion = n.getEditorPluginInfo().version),
      (this.properties.common_vscodeversion = (0, s.formatNameAndVersion)(
        n.getEditorInfo()
      ));
  }
  extendWithConfigProperties(e) {
    const t = (0, s.dumpConfig)(e);
    (t["copilot.build"] = (0, s.getBuild)(e)),
      (t["copilot.buildType"] = (0, s.getBuildType)(e));
    const n = e.get(h);
    n.trackingId && (t["copilot.trackingId"] = n.trackingId),
      n.organizationsList && (t.organizations_list = n.organizationsList),
      (this.properties = {
        ...this.properties,
        ...t,
      });
  }
  extendWithRequestId(e) {
    const t = {
      completionId: e.completionId,
      created: e.created.toString(),
      headerRequestId: e.headerRequestId,
      serverExperiments: e.serverExperiments,
      deploymentId: e.deploymentId,
    };
    this.properties = {
      ...this.properties,
      ...t,
    };
  }
  static maybeRemoveRepoInfoFromPropertiesHack(e, t) {
    if (e) return t;
    const n = {};
    for (const e in t)
      f.keysToRemoveFromStandardTelemetryHack.includes(e) || (n[e] = t[e]);
    return n;
  }
  sanitizeKeys() {
    (this.properties = f.sanitizeKeys(this.properties)),
      (this.measurements = f.sanitizeKeys(this.measurements));
  }
  static sanitizeKeys(e) {
    e = e || {};
    const t = {};
    for (const n in e)
      t[
        f.keysExemptedFromSanitization.includes(n) ? n : n.replace(/\./g, "_")
      ] = e[n];
    return t;
  }
  updateTimeSinceIssuedAndDisplayed() {
    const e = g() - this.issuedTime;
    if (
      ((this.measurements.timeSinceIssuedMs = e), void 0 !== this.displayedTime)
    ) {
      const e = g() - this.displayedTime;
      this.measurements.timeSinceDisplayedMs = e;
    }
  }
  validateData(e, t) {
    let n;
    if (
      (f.validateTelemetryProperties(this.properties) ||
        (n = {
          problem: "properties",
          error: JSON.stringify(f.validateTelemetryProperties.errors),
        }),
      !f.validateTelemetryMeasurements(this.measurements))
    ) {
      const e = JSON.stringify(f.validateTelemetryMeasurements.errors);
      void 0 === n
        ? (n = {
            problem: "measurements",
            error: e,
          })
        : ((n.problem = "both"), (n.error += `; ${e}`));
    }
    if (void 0 === n) return !0;
    if ((0, l.shouldFailForDebugPurposes)(e))
      throw new Error(
        `Invalid telemetry data: ${n.problem} ${
          n.error
        } properties=${JSON.stringify(
          this.properties
        )} measurements=${JSON.stringify(this.measurements)}`
      );
    return (
      b(
        e,
        "invalidTelemetryData",
        f.createAndMarkAsIssued({
          properties: JSON.stringify(this.properties),
          measurements: JSON.stringify(this.measurements),
          problem: n.problem,
          validationError: n.error,
        }),
        t
      ),
      t &&
        b(
          e,
          "invalidTelemetryData_in_secure",
          f.createAndMarkAsIssued({
            problem: n.problem,
            requestId: this.properties.requestId ?? "unknown",
          }),
          !1
        ),
      !1
    );
  }
  async makeReadyForSending(e, t, n) {
    this.extendWithConfigProperties(e),
      this.extendWithEditorAgnosticFields(e),
      this.sanitizeKeys(),
      "IncludeExp" === n && (await this.extendWithExpTelemetry(e)),
      this.updateTimeSinceIssuedAndDisplayed(),
      this.validateData(e, t) ||
        (this.properties.telemetry_failed_validation = "true"),
      v(e, this.properties);
  }
}
function m(e, t, n, r) {
  const i = t ? e.get(d).getSecureReporter(e) : e.get(d).getReporter(e);
  i &&
    i.sendTelemetryEvent(
      n,
      f.maybeRemoveRepoInfoFromPropertiesHack(t, r.properties),
      r.measurements
    );
}
function g() {
  return new Date().getTime();
}
function y(e) {
  return e.get(h).optedIn;
}
async function _(e, t, n, r) {
  await e.get(u.PromiseQueue).register(
    (async function (e, t, n, r) {
      if (r && !y(e)) return;
      const i = n || f.createAndMarkAsIssued({}, {});
      await i.makeReadyForSending(e, r ?? !1, "IncludeExp"),
        m(e, r ?? !1, t, i);
    })(e, t, n, r)
  );
}
function v(e, t) {
  t.unique_id = i.v4();
  const n = e.get(s.EditorAndPluginInfo);
  (t.common_extname = n.getEditorPluginInfo().name),
    (t.common_extversion = n.getEditorPluginInfo().version),
    (t.common_vscodeversion = (0, s.formatNameAndVersion)(n.getEditorInfo()));
}
async function b(e, t, n, r) {
  await e.get(u.PromiseQueue).register(
    (async function (e, t, n, r) {
      if (r && !y(e)) return;
      const i = n || f.createAndMarkAsIssued({}, {});
      await i.makeReadyForSending(e, r ?? !1, "IncludeExp"),
        (function (e, t, n, r) {
          const i = t ? e.get(d).getSecureReporter(e) : e.get(d).getReporter(e);
          i &&
            i.sendTelemetryErrorEvent(
              n,
              f.maybeRemoveRepoInfoFromPropertiesHack(t, r.properties),
              r.measurements
            );
        })(e, r ?? !1, t, i);
    })(e, t, n, r)
  );
}
(f.ajv = new r.default({
  strictNumbers: !1,
})),
  (f.validateTelemetryProperties = f.ajv.compile({
    type: "object",
    additionalProperties: {
      type: "string",
    },
    required: [],
  })),
  (f.validateTelemetryMeasurements = f.ajv.compile({
    type: "object",
    properties: {
      meanLogProb: {
        type: "number",
        nullable: !0,
      },
      meanAlternativeLogProb: {
        type: "number",
        nullable: !0,
      },
    },
    additionalProperties: {
      type: "number",
    },
    required: [],
  })),
  (f.keysExemptedFromSanitization = [
    c.ExpServiceTelemetryNames.assignmentContextTelemetryPropertyName,
    c.ExpServiceTelemetryNames.featuresTelemetryPropertyName,
  ]),
  (f.keysToRemoveFromStandardTelemetryHack = [
    "gitRepoHost",
    "gitRepoName",
    "gitRepoOwner",
    "gitRepoUrl",
    "gitRepoPath",
    "repo",
    "request_option_nwo",
    "userKind",
  ]),
  (exports.TelemetryData = f),
  (exports.telemetrizePromptLength = function (e) {
    return e.isFimEnabled
      ? {
          promptPrefixCharLen: e.prefix.length,
          promptSuffixCharLen: e.suffix.length,
        }
      : {
          promptCharLen: e.prefix.length,
        };
  }),
  (exports.now = g),
  (exports.TelemetryEndpointUrl = class {
    constructor(
      e = "https://copilot-telemetry.githubusercontent.com/telemetry"
    ) {
      this.url = e;
    }
    getUrl() {
      return this.url;
    }
    setUrlForTesting(e) {
      this.url = e;
    }
  }),
  (exports.telemetry = _),
  (exports.telemetryExpProblem = async function (e, t) {
    await e.get(u.PromiseQueue).register(
      (async function (e, t) {
        const n = f.createAndMarkAsIssued(t, {});
        await n.makeReadyForSending(e, !1, "SkipExp"),
          m(e, !1, "expProblem", n);
      })(e, t)
    );
  }),
  (exports.telemetryRaw = async function (e, t, n, r) {
    await e.get(u.PromiseQueue).register(
      (async function (e, t, n, r) {
        v(e, n),
          m(e, !1, t, {
            properties: n,
            measurements: r,
          });
      })(e, t, n, r)
    );
  }),
  (exports.telemetryException = async function (e, t, n, r) {
    await e.get(u.PromiseQueue).register(
      (async function (e, t, n, r) {
        const i = t instanceof Error ? t : new Error("Non-error thrown: " + t),
          o = y(e),
          s = f.createAndMarkAsIssued({
            origin: (0, p.redactPaths)(n),
            reason: o
              ? "Exception logged to restricted telemetry"
              : "Exception, not logged due to opt-out",
            ...r,
          });
        if (
          (await s.makeReadyForSending(e, !1, "IncludeExp"),
          m(e, !1, "exception", s),
          !o)
        )
          return;
        const a = f.createAndMarkAsIssued({
          origin: n,
          ...r,
        });
        await a.makeReadyForSending(e, !0, "IncludeExp"),
          (function (e, t, n, r) {
            const i = e.get(d).getSecureReporter(e);
            i &&
              i.sendTelemetryException(
                n,
                f.maybeRemoveRepoInfoFromPropertiesHack(true, r.properties),
                r.measurements
              );
          })(e, 0, i, a);
      })(e, t, n, r)
    );
  }),
  (exports.telemetryError = b),
  (exports.logEngineCompletion = async function (e, t, n, r, i) {
    const o = f.createAndMarkAsIssued({
      completionTextJson: JSON.stringify(t),
      choiceIndex: i.toString(),
    });
    if (n.logprobs)
      for (const [e, t] of Object.entries(n.logprobs))
        o.properties["logprobs_" + e] = JSON.stringify(t) ?? "unset";
    o.extendWithRequestId(r), await _(e, "engine.completion", o, !0);
  }),
  (exports.logEnginePrompt = async function (e, t, n) {
    let r;
    r = t.isFimEnabled
      ? {
          promptPrefixJson: JSON.stringify(t.prefix),
          promptSuffixJson: JSON.stringify(t.suffix),
          promptElementRanges: JSON.stringify(t.promptElementRanges),
        }
      : {
          promptJson: JSON.stringify(t.prefix),
          promptElementRanges: JSON.stringify(t.promptElementRanges),
        };
    const i = n.extendedBy(r);
    await _(e, "engine.prompt", i, !0);
  });
