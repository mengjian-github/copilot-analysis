Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.findPrevNextSolution = exports.registerPanelSupport = exports.PanelNavigationType = void 0;
const vscode = require("vscode");
const i = require(80256);
const consts = require("./const");
const consts = require("./const");
const main = require("./main");
const telemetryrepo = require("./telemetry-repo");
const l = require(72990);
var u;
function p(e, t) {
  const n = vscode.window.activeTextEditor;
  if (!n) return;
  if (!vscode.workspace.getConfiguration("editor", n.document.uri).get("codeLens")) return void vscode.window.showInformationMessage("GitHub Copilot Panel requires having Code Lens enabled. Please update your settings and then try again.", "Open Settings").then(e => {
    if ("Open Settings" === e) {
      vscode.commands.executeCommand("workbench.action.openSettings", "editor.codeLens");
    }
  });
  t = function (e, t, n) {
    return n || i.completionContextForDocument(e, t.document, t.selection.active);
  }(e, n, t);
  const o = i.encodeLocation(n.document.uri, t);
  const a = n.document.languageId;
  vscode.workspace.openTextDocument(o).then(e => {
    vscode.languages.setTextDocumentLanguage(e, a);
    vscode.window.showTextDocument(e, vscode.ViewColumn.Beside);
    vscode.commands.executeCommand("setContext", consts.CopilotPanelVisible, !0);
  });
}
function d(e) {
  const t = vscode.window.activeTextEditor;
  if (!t) return !1;
  const n = t.document;
  if (!n.uri.scheme.startsWith(i.CopilotPanelScheme)) return !1;
  const o = e.get(l.CopilotPanel).panelSolutions.get(n.uri.toString());
  return !(!o || 0 === o?.length);
}
function h(e, t) {
  if (!d(e)) return;
  const n = vscode.window.activeTextEditor;
  const i = findPrevNextSolution(e.get(l.CopilotPanel).panelSolutions.get(n.document.uri.toString()) ?? [], n.selection.active, t);
  const o = i.range.start.line + 1;
  const {
    text: s
  } = n.document.lineAt(o);
  n.selection = new vscode.Selection(new vscode.Position(o, 0), new vscode.Position(o, s.length));
  n.revealRange(i.range);
}
function findPrevNextSolution(e, t, n) {
  const r = n === u.Previous;
  const i = e.findIndex(e => e.range.contains(t));
  let o = r ? i - 1 : i + 1;
  if (-1 === i) {
    o = r ? -1 : 0;
  }
  return e.at(o) ?? e[0];
}
!function (e) {
  e.Previous = "previous";
  e.Next = "next";
}(u = exports.PanelNavigationType || (exports.PanelNavigationType = {}));
exports.registerPanelSupport = function (e) {
  telemetryrepo.registerCommandWithTelemetry(e, consts.CMDOpenPanel, () => {
    vscode.commands.executeCommand("editor.action.inlineSuggest.hide");
    p(e);
  });
  telemetryrepo.registerCommandWithTelemetry(e, consts.CMDAcceptCursorPanelSolution, () => {
    !function (e) {
      if (!d(e)) return;
      const t = vscode.window.activeTextEditor;
      const n = e.get(l.CopilotPanel).panelSolutions.get(t.document.uri.toString()) ?? [];
      const i = t.selection.active;
      const o = n.find(e => e.range.contains(i));
      if (o) {
        vscode.commands.executeCommand(consts.CMDAcceptPanelSolution, o.targetUri, o.insertPosition, o.completionText, o.postInsertionCallback);
      }
    }(e);
  });
  telemetryrepo.registerCommandWithTelemetry(e, consts.CMDNavigatePreviousPanelSolution, () => {
    h(e, u.Previous);
  });
  telemetryrepo.registerCommandWithTelemetry(e, consts.CMDNavigateNextPanelSolution, () => {
    h(e, u.Next);
  });
  telemetryrepo.registerCommandWithTelemetry(e, consts.CMDOpenPanelForRange, t => {
    p(e, t);
  });
  telemetryrepo.registerCommandWithTelemetry(e, consts.CMDAcceptPanelSolution, async (e, t, n, i) => {
    const o = new vscode.WorkspaceEdit();
    o.insert(e, t, n);
    await vscode.workspace.applyEdit(o);
    i();
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
  });
  const t = new l.CopilotPanel(e);
  e.get(main.VsCodeExtensionContext).subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(i.CopilotPanelScheme, t), vscode.languages.registerCodeLensProvider({
    scheme: i.CopilotPanelScheme
  }, t));
  e.set(l.CopilotPanel, t);
};
exports.findPrevNextSolution = findPrevNextSolution;