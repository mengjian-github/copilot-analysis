Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CannedResponseFetcher = exports.RecordingFetcher = exports.ErrorReturningFetcher = exports.SyntheticCompletions = exports.fetcherForTesting = void 0;
const r = require(23055);
const i = require(42600);
const o = require(30362);
const s = require(51133);
const a = require(94969);
const c = require(6333);
const l = require(24419);
function u(e, t, n, o = c.TelemetryData.createAndMarkAsIssued()) {
  const s = r.getTokenizer();
  return {
    completionText: n,
    meanLogProb: .5,
    meanAlternativeLogProb: .5,
    modelInfo: void 0,
    numTokens: -1,
    choiceIndex: t,
    requestId: {
      headerRequestId: e,
      completionId: i.v4(),
      created: 0,
      serverExperiments: "dummy",
      deploymentId: "dummy"
    },
    telemetryData: o,
    tokens: s.tokenize(n).map(e => s.detokenize([e])).concat()
  };
}
function p(e, t, n, r, o) {
  const s = l.postProcessChoices(async function* (e, t, n, r) {
    const o = i.v4();
    let s = 0;
    for (let i of n) {
      let n = -1;
      if (void 0 !== e?.stop) for (const t of e.stop) {
        const e = i.indexOf(t);
        if (-1 !== e && (-1 === n || e < n)) {
          n = e;
        }
      }
      if (-1 !== n) {
        i = i.substring(0, n);
      }
      const a = await t(i);
      if (void 0 !== a) {
        i = i.substring(0, a);
      }
      const c = u(o, s++, i, r);
      c.blockFinished = void 0 !== a;
      yield c;
    }
  }(n, t, e, o), r);
  return {
    type: "success",
    choices: s,
    getProcessingTime: () => 0
  };
}
exports.fetcherForTesting = async function (e, t, n) {
  const r = n?.openAIFetcher;
  if (r) return r;
  const {
    doc: i,
    cursor: o,
    knownCompletion: s,
    rangeStart: c
  } = t;
  if (void 0 !== c) return new CannedResponseFetcher(new l.LiveOpenAIFetcher(), s);
  const u = await a.extractPrompt(e, i, o);
  return "prompt" == u.type ? new CannedResponseFetcher(new l.LiveOpenAIFetcher(), u.trailingWs + s) : new SyntheticCompletions([]);
};
class SyntheticCompletions extends l.OpenAIFetcher {
  constructor(e) {
    super();
    this._completions = e;
    this._wasCalled = !1;
  }
  async fetchAndStreamCompletions(e, t, n, r, i, s, a) {
    e.get(o.CopilotTokenManager).getCopilotToken(e);
    return i?.isCancellationRequested ? {
      type: "canceled",
      reason: "canceled during test"
    } : this._wasCalled ? p(this._completions.map(e => ""), r, t.postOptions, a, n) : (this._wasCalled = !0, p(this._completions, r, t.postOptions, a, n));
  }
}
exports.SyntheticCompletions = SyntheticCompletions;
class ErrorReturningFetcher extends l.LiveOpenAIFetcher {
  constructor(e) {
    super();
    this.response = e;
  }
  fetchWithParameters(e, t, n, r) {
    return Promise.resolve(this.response);
  }
}
exports.ErrorReturningFetcher = ErrorReturningFetcher;
exports.RecordingFetcher = class {
  constructor(e) {
    this.inner = e;
  }
  async fetchAndStreamCompletions(e, t, n, r, i) {
    this.params = t;
    return this.inner.fetchAndStreamCompletions(e, t, n, r, i);
  }
};
class CannedResponseFetcher {
  constructor(e, t) {
    this.inner = e;
    this.response = t;
  }
  async fetchAndStreamCompletions(e, t, n, r, i) {
    let o = this.response;
    for (const e of t.postOptions?.stop ?? []) {
      const t = o.indexOf(e);
      if (-1 !== t) {
        o = o.substring(0, t);
      }
    }
    const a = new Array(t.count).fill(o);
    const c = t?.postOptions?.extra?.language ?? "plaintext";
    return (await e.get(s.BlockModeConfig).forLanguage(e, c)) == s.BlockMode.Parsing ? new SyntheticCompletions(a).fetchAndStreamCompletions(e, t, n, r, i) : this.inner.fetchAndStreamCompletions(e, {
      ...t,
      postOptions: {
        ...t.postOptions,
        extra: {
          ...(t?.postOptions?.extra ?? {
            language: "",
            next_indent: 0
          }),
          test_completions: a,
          trim_by_indentation: !0,
          prompt_tokens: 0,
          suffix_tokens: 0
        }
      }
    }, n, r, i);
  }
}
exports.CannedResponseFetcher = CannedResponseFetcher;