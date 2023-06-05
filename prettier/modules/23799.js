Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CopilotListDocument = void 0;
const r = require(70106);
const config = require("./config");
const o = require(22388);
const telemetry = require("./telemetry");
class CopilotListDocument {
  constructor(e, t, n, o, a, c) {
    this.targetDocument = n;
    this.completionContext = o;
    this.token = c;
    this._solutionCount = 0;
    this.solutionCountTarget = 0;
    this._solutions = [];
    this._wasCancelled = !1;
    this._updateHandlers = new Set();
    this.savedTelemetryData = telemetry.TelemetryData.createAndMarkAsIssued();
    this.debouncedEventFire = r.debounce(10, () => this._updateHandlers.forEach(e => e(this._uri)));
    this.onDidResultUpdated = e => (this._updateHandlers.add(e), {
      dispose: () => {
        this._updateHandlers.delete(e);
      }
    });
    this.solutionCountTarget = a;
    this._ctx = e;
    this._uri = t;
    this._showLogprobs = config.getConfig(e, config.ConfigKey.DebugShowScores);
    this.startPosition = this.completionContext.insertPosition;
  }
  async getDocument() {
    return this.targetDocument;
  }
  get targetUri() {
    return this.targetDocument.uri;
  }
  get numberHeaderLines() {
    return this.header().split("\n").length + 1;
  }
  header() {
    if (this._wasCancelled) return "No synthesized solutions found.";
    {
      const e = this._solutionCount - this._solutions.length > 0 ? " (Duplicates hidden)" : "";
      return `Synthesizing ${this._solutionCount}/${this.solutionCountTarget} solutions${e}`;
    }
  }
  areSolutionsDuplicates(e, t) {
    return o.normalizeCompletionText(e.completionText) === o.normalizeCompletionText(t.completionText);
  }
  insertSorted(e, t, n) {
    if (!/^\s*$/.test(t.completionText)) {
      for (let r = 0; r < e.length; r++) {
        const i = e[r];
        if (this.areSolutionsDuplicates(i, t)) {
          if (n(i) < n(t)) {
            e.splice(r, 1);
            break;
          }
          return;
        }
      }
      for (let r = 0; r < e.length; r++) if (n(e[r]) < n(t)) return void e.splice(r, 0, t);
      e.push(t);
    }
  }
  reportCancelled() {
    this._wasCancelled = !0;
    this.debouncedEventFire();
  }
  getCancellationToken() {
    return this.token;
  }
  insertSolution(e) {
    const t = {
      displayLines: this.formatDisplayLines(e.displayText, e.meanProb, e.meanLogProb),
      completionText: e.completionText,
      meanLogProb: e.meanLogProb,
      meanProb: e.meanProb,
      prependToCompletion: e.prependToCompletion,
      requestId: e.requestId,
      choiceIndex: e.choiceIndex
    };
    this.insertSorted(this._solutions, t, e => e.meanProb);
    this._solutionCount++;
    this.debouncedEventFire();
  }
  formatDisplayLines(e, t, n) {
    let r = "";
    if (this._showLogprobs) {
      n = n || 0;
      r += `\n\t# mean prob: ${t}`;
    }
    return `${CopilotListDocument.separator}${r}\n${CopilotListDocument.suggestionHeaderPrefix}\n\n${e}`.split("\n");
  }
  async runQuery() {
    const e = await o.launchSolutions(this._ctx, this);
    this.processNextSolution(e);
  }
  async processNextSolution(e) {
    switch (e.status) {
      case "FinishedNormally":
      case "FinishedWithError":
        return;
      case "Solution":
        this.insertSolution(e.solution);
        this.processNextSolution(await e.next);
    }
  }
  solutionsReceived() {
    return this._solutionCount;
  }
  solutions() {
    return this._solutions;
  }
  get value() {
    const e = this._solutions.flatMap((e, t) => {
      const n = e.displayLines;
      const r = n.findIndex(e => e === CopilotListDocument.separator.trim());
      if (-1 === r) return n;
      const i = `Suggestion ${t + 1}`;
      const o = n[r + 1].startsWith(CopilotListDocument.suggestionHeaderPrefix);
      n.splice(r + 1, o ? 1 : 0, i);
      return n;
    });
    return [this.header()].concat(e).concat("").join("\n");
  }
}
CopilotListDocument.separator = "\n=======";
CopilotListDocument.suggestionHeaderPrefix = "Suggestion ";
exports.CopilotListDocument = CopilotListDocument;