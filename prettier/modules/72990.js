Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CopilotPanel = void 0;
const r = require(89496);
const i = require(51133);
const o = require(80256);
const s = require(57017);
const a = require(73060);
const c = require(23799);
exports.CopilotPanel = class {
  constructor(e) {
    this._onDidChange = new r.EventEmitter();
    this._documents = new Map();
    this.panelSolutions = new Map();
    this._ctx = e;
    this._closeSubscription = r.workspace.onDidCloseTextDocument(e => {
      if (e.isClosed && e.uri.scheme == o.CopilotPanelScheme) {
        this._documents.delete(e.uri.toString());
        this.panelSolutions.delete(e.uri.toString());
      }
    });
    this._changeSubscription = r.window.onDidChangeVisibleTextEditors(e => {
      if (e.some(e => e.document.uri.scheme == o.CopilotPanelScheme)) {
        r.commands.executeCommand("setContext", a.CopilotPanelVisible, !1);
      }
    });
  }
  dispose() {
    this._closeSubscription.dispose();
    this._changeSubscription.dispose();
    this._documents.clear();
    this.panelSolutions.clear();
    this._onDidChange.dispose();
  }
  get onDidChange() {
    return this._onDidChange.event;
  }
  async provideTextDocumentContent(e) {
    let t = this._documents.get(e.toString());
    let n = t?.model;
    if (t && n) return this.getTextDocumentContent(t, e);
    const s = new r.CancellationTokenSource();
    const [a, l] = o.decodeLocation(this._ctx, e);
    const u = await r.workspace.openTextDocument(a);
    n = new c.CopilotListDocument(this._ctx, e, u, l, i.getConfig(this._ctx, i.ConfigKey.ListCount), s.token);
    n.onDidResultUpdated(e => {
      this._onDidChange.fire(e);
    });
    t = {
      model: n,
      cts: s
    };
    this._documents.set(e.toString(), t);
    n.runQuery();
    return this.getTextDocumentContent(t, e);
  }
  getTextDocumentContent(e, t) {
    this.generatePanelSolutionInfo(e, t);
    return e.model.value;
  }
  generatePanelSolutionInfo(e, t) {
    const n = e.model;
    let i = n.numberHeaderLines;
    const o = n.completionContext.insertPosition;
    const a = c.CopilotListDocument.separator.split("\n").length - 1;
    const l = n.solutions().map((t, c) => {
      const l = new r.Position(i + a - 1, 0);
      const u = new r.Position(l.line + t.displayLines.length, 0);
      const p = n.savedTelemetryData.extendedBy({
        choiceIndex: t.choiceIndex.toString()
      }, {
        compCharLen: t.completionText.length,
        meanProb: t.meanProb,
        rank: c
      });
      p.extendWithRequestId(t.requestId);
      p.markAsDisplayed();
      const d = new r.Range(l, u);
      i = u.line;
      return {
        targetUri: n.targetUri,
        range: d,
        insertPosition: o,
        completionText: t.completionText,
        postInsertionCallback: async () => {
          const i = (await r.workspace.openTextDocument(n.targetUri)).offsetAt(o);
          e.cts.cancel();
          await s.postInsertionTasks(this._ctx, "solution", t.completionText, i, n.targetUri, p, `${t.requestId.headerRequestId}-${c}`, o);
        }
      };
    });
    this.panelSolutions.set(t.toString(), l);
    return l;
  }
  getCodeLens(e, t) {
    return (this.panelSolutions.get(t.toString()) ?? this.generatePanelSolutionInfo(e, t)).map(e => new r.CodeLens(e.range, {
      title: "Accept Solution",
      tooltip: "Replace code with this solution",
      command: a.CMDAcceptPanelSolution,
      arguments: [e.targetUri, e.insertPosition, e.completionText, e.postInsertionCallback]
    }));
  }
  provideCodeLenses(e, t) {
    const n = this._documents.get(e.uri.toString());
    if (n) return this.getCodeLens(n, e.uri);
  }
};