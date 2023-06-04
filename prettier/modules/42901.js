Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.convertToAPIJsonData = exports.prepareSolutionForReturn = exports.SSEProcessor = exports.splitChunk = void 0;
const r = require(59189);
const i = require(29899);
const o = require(6333);
const s = require(40937);
const a = new i.Logger(i.LogLevel.INFO, "streamChoices");
class c {
  constructor() {
    this.logprobs = [];
    this.top_logprobs = [];
    this.text = [];
    this.tokens = [];
    this.text_offset = [];
  }
  append(e) {
    if (e.text) {
      this.text.push(e.text);
    }
    if (e.delta?.content) {
      this.text.push(e.delta.content);
    }
    if (e.logprobs) {
      this.tokens.push(e.logprobs.tokens ?? []);
      this.text_offset.push(e.logprobs.text_offset ?? []);
      this.logprobs.push(e.logprobs.token_logprobs ?? []);
      this.top_logprobs.push(e.logprobs.top_logprobs ?? []);
    }
  }
}
function splitChunk(e) {
  const t = e.split("\n");
  const n = t.pop();
  return [t.filter(e => "" != e), n];
}
exports.splitChunk = splitChunk;
class SSEProcessor {
  constructor(e, t, n, r, i, o, a, c) {
    this.ctx = e;
    this.expectedNumChoices = t;
    this.response = n;
    this.body = r;
    this.telemetryData = i;
    this.dropCompletionReasons = o;
    this.fastCancellation = a;
    this.cancellationToken = c;
    this.requestId = s.getRequestId(this.response);
    this.stats = new d(this.expectedNumChoices);
    this.solutions = {};
  }
  static async create(e, t, n, i, o, s) {
    const a = await n.body();
    a.setEncoding("utf8");
    const c = await e.get(r.Features).fastCancellation();
    return new SSEProcessor(e, t, n, a, i, o ?? ["content_filter"], c, s);
  }
  async *processSSE(e = async () => {}) {
    try {
      yield* this.processSSEInner(e);
    } finally {
      if (this.fastCancellation) {
        this.cancel();
      }
      a.info(this.ctx, `request done: headerRequestId: [${this.requestId.headerRequestId}] model deployment ID: [${this.requestId.deploymentId}]`);
      a.debug(this.ctx, `request stats: ${this.stats}`);
    }
  }
  async *processSSEInner(e) {
    let t = "";
    e: for await (const n of this.body) {
      if (this.maybeCancel("after awaiting body chunk")) return;
      a.debug(this.ctx, "chunk", n.toString());
      const [r, i] = splitChunk(t + n.toString());
      t = i;
      for (const t of r) {
        const n = t.slice("data:".length).trim();
        if ("[DONE]" == n) return void (yield* this.finishSolutions());
        let r;
        try {
          r = JSON.parse(n);
        } catch (e) {
          a.error(this.ctx, "Error parsing JSON stream data", t);
          continue;
        }
        if (void 0 !== r.choices) {
          if (0 == this.requestId.created) {
            this.requestId = s.getRequestId(this.response, r);
            if (0 == this.requestId.created) {
              a.error(this.ctx, `Request id invalid, should have "completionId" and "created": ${this.requestId}`, this.requestId);
            }
          }
          if (this.allSolutionsDone() && this.fastCancellation) break e;
          for (let t = 0; t < r.choices.length; t++) {
            const n = r.choices[t];
            a.debug(this.ctx, "choice", n);
            this.stats.add(n.index);
            if (n.index in this.solutions) {
              this.solutions[n.index] = new c();
            }
            const i = this.solutions[n.index];
            if (null == i) continue;
            let s;
            i.append(n);
            const l = n.text?.indexOf("\n") > -1 || n.delta?.content?.indexOf("\n") > -1;
            if ((n.finish_reason || l) && (s = await e(i.text.join("")), this.maybeCancel("after awaiting finishedCb"))) return;
            if (!n.finish_reason && void 0 === s) continue;
            const u = n.finish_reason ?? "client-trimmed";
            o.telemetry(this.ctx, "completion.finishReason", this.telemetryData.extendedBy({
              completionChoiceFinishReason: u
            }));
            if (this.dropCompletionReasons.includes(n.finish_reason)) {
              this.solutions[n.index] = null;
            } else {
              this.stats.markYielded(n.index);
              yield {
                solution: i,
                finishOffset: s,
                reason: n.finish_reason,
                requestId: this.requestId,
                index: n.index
              };
            }
            if (this.maybeCancel("after yielding finished choice")) return;
            this.solutions[n.index] = null;
          }
        } else if (void 0 !== r.error) {
          a.error(this.ctx, "Error in response:", r.error.message);
        } else {
          a.error(this.ctx, "Unexpected response with no choices or error");
        }
      }
    }
    for (const [e, t] of Object.entries(this.solutions)) {
      const n = Number(e);
      if (null != t && (this.stats.markYielded(n), yield {
        solution: t,
        finishOffset: void 0,
        reason: "Iteration Done",
        requestId: this.requestId,
        index: n
      }, this.maybeCancel("after yielding after iteration done"))) return;
    }
    if (t.length > 0) try {
      const e = JSON.parse(t);
      if (void 0 !== e.error) {
        a.error(this.ctx, `Error in response: ${e.error.message}`, e.error);
      }
    } catch (e) {
      a.error(this.ctx, `Error parsing extraData: ${t}`);
    }
  }
  async *finishSolutions() {
    for (const [e, t] of Object.entries(this.solutions)) {
      const n = Number(e);
      if (null != t && (this.stats.markYielded(n), yield {
        solution: t,
        finishOffset: void 0,
        reason: "DONE",
        requestId: this.requestId,
        index: n
      }, this.maybeCancel("after yielding on DONE"))) return;
    }
  }
  maybeCancel(e) {
    return !!this.cancellationToken?.isCancellationRequested && (a.debug(this.ctx, "Cancelled: " + e), this.cancel(), !0);
  }
  cancel() {
    this.body.destroy();
  }
  allSolutionsDone() {
    const e = Object.values(this.solutions);
    return e.length == this.expectedNumChoices && e.every(e => null == e);
  }
}
function convertToAPIJsonData(e, t) {
  const n = {
    text: t.text.join(""),
    tokens: t.text
  };
  if (0 === t.logprobs.length) return n;
  const r = t.logprobs.reduce((e, t) => e.concat(t), []);
  const i = t.top_logprobs.reduce((e, t) => e.concat(t), []);
  const o = t.text_offset.reduce((e, t) => e.concat(t), []);
  const s = t.tokens.reduce((e, t) => e.concat(t), []);
  return {
    ...n,
    logprobs: {
      token_logprobs: r,
      top_logprobs: i,
      text_offset: o,
      tokens: s
    }
  };
}
exports.SSEProcessor = SSEProcessor;
exports.prepareSolutionForReturn = function (e, t, n) {
  let r = t.solution.text.join("");
  let i = !1;
  if (void 0 !== t.finishOffset) {
    a.debug(e, `solution ${t.index}: early finish at offset ${t.finishOffset}`);
    r = r.substring(0, t.finishOffset);
    i = !0;
  }
  a.info(e, `solution ${t.index} returned. finish reason: [${t.reason}]`);
  a.debug(e, `solution ${t.index} details: finishOffset: [${t.finishOffset}] completionId: [{${t.requestId.completionId}}] created: [{${t.requestId.created}}]`);
  const o = convertToAPIJsonData(0, t.solution);
  return s.convertToAPIChoice(e, r, o, t.index, t.requestId, i, n);
};
exports.convertToAPIJsonData = convertToAPIJsonData;
class d {
  constructor(e) {
    this.choices = new Map();
    for (let t = 0; t < e; t++) this.choices.set(t, new h());
  }
  add(e) {
    this.choices.get(e).increment();
  }
  markYielded(e) {
    this.choices.get(e).markYielded();
  }
  toString() {
    return Array.from(this.choices.entries()).map(([e, t]) => `${e}: ${t.yieldedTokens} -> ${t.seenTokens}`).join(", ");
  }
}
class h {
  constructor() {
    this.yieldedTokens = -1;
    this.seenTokens = 0;
  }
  increment() {
    this.seenTokens++;
  }
  markYielded() {
    this.yieldedTokens = this.seenTokens;
  }
}