Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CopilotPanel = void 0;
const vscode = require("vscode");
const config = require("./config");
const o = require(80256);
const tasks = require("./tasks");
const consts = require("./const");
const c = require(23799);
exports.CopilotPanel = class {
  constructor(e) {
    this._onDidChange = new vscode.EventEmitter();
    this._documents = new Map();
    this.panelSolutions = new Map();
    this._ctx = e;
    this._closeSubscription = vscode.workspace.onDidCloseTextDocument(e => {
      if (e.isClosed && e.uri.scheme == o.CopilotPanelScheme) {
        this._documents.delete(e.uri.toString());
        this.panelSolutions.delete(e.uri.toString());
      }
    });
    this._changeSubscription = vscode.window.onDidChangeVisibleTextEditors(e => {
      if (e.some(e => e.document.uri.scheme == o.CopilotPanelScheme)) {
        vscode.commands.executeCommand("setContext", consts.CopilotPanelVisible, !1);
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
    const s = new vscode.CancellationTokenSource();
    const [a, l] = o.decodeLocation(this._ctx, e);
    const u = await vscode.workspace.openTextDocument(a);
    n = new c.CopilotListDocument(this._ctx, e, u, l, config.getConfig(this._ctx, config.ConfigKey.ListCount), s.token);
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
      const l = new vscode.Position(i + a - 1, 0);
      const u = new vscode.Position(l.line + t.displayLines.length, 0);
      const p = n.savedTelemetryData.extendedBy({
        choiceIndex: t.choiceIndex.toString()
      }, {
        compCharLen: t.completionText.length,
        meanProb: t.meanProb,
        rank: c
      });
      p.extendWithRequestId(t.requestId);
      p.markAsDisplayed();
      const d = new vscode.Range(l, u);
      i = u.line;
      return {
        targetUri: n.targetUri,
        range: d,
        insertPosition: o,
        completionText: t.completionText,
        postInsertionCallback: async () => {
          const i = (await vscode.workspace.openTextDocument(n.targetUri)).offsetAt(o);
          e.cts.cancel();
          await tasks.postInsertionTasks(this._ctx, "solution", t.completionText, i, n.targetUri, p, `${t.requestId.headerRequestId}-${c}`, o);
        }
      };
    });
    this.panelSolutions.set(t.toString(), l);
    return l;
  }
  getCodeLens(e, t) {
    return (this.panelSolutions.get(t.toString()) ?? this.generatePanelSolutionInfo(e, t)).map(e => new vscode.CodeLens(e.range, {
      title: "Accept Solution",
      tooltip: "Replace code with this solution",
      command: consts.CMDAcceptPanelSolution,
      arguments: [e.targetUri, e.insertPosition, e.completionText, e.postInsertionCallback]
    }));
  }
  provideCodeLenses(e, t) {
    const n = this._documents.get(e.uri.toString());
    if (n) return this.getCodeLens(n, e.uri);
  }
};