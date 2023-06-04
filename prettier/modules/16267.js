Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.findPrevNextSolution = exports.registerPanelSupport = exports.PanelNavigationType = void 0;
const r = require(89496);
const i = require(80256);
const o = require(73060);
const s = require(73060);
const a = require(91238);
const c = require(64428);
const l = require(72990);
var u;
function p(e, t) {
  const n = r.window.activeTextEditor;
  if (!n) return;
  if (!r.workspace.getConfiguration("editor", n.document.uri).get("codeLens")) return void r.window.showInformationMessage("GitHub Copilot Panel requires having Code Lens enabled. Please update your settings and then try again.", "Open Settings").then(e => {
    if ("Open Settings" === e) {
      r.commands.executeCommand("workbench.action.openSettings", "editor.codeLens");
    }
  });
  t = function (e, t, n) {
    return n || i.completionContextForDocument(e, t.document, t.selection.active);
  }(e, n, t);
  const o = i.encodeLocation(n.document.uri, t);
  const a = n.document.languageId;
  r.workspace.openTextDocument(o).then(e => {
    r.languages.setTextDocumentLanguage(e, a);
    r.window.showTextDocument(e, r.ViewColumn.Beside);
    r.commands.executeCommand("setContext", s.CopilotPanelVisible, !0);
  });
}
function d(e) {
  const t = r.window.activeTextEditor;
  if (!t) return !1;
  const n = t.document;
  if (!n.uri.scheme.startsWith(i.CopilotPanelScheme)) return !1;
  const o = e.get(l.CopilotPanel).panelSolutions.get(n.uri.toString());
  return !(!o || 0 === o?.length);
}
function h(e, t) {
  if (!d(e)) return;
  const n = r.window.activeTextEditor;
  const i = findPrevNextSolution(e.get(l.CopilotPanel).panelSolutions.get(n.document.uri.toString()) ?? [], n.selection.active, t);
  const o = i.range.start.line + 1;
  const {
    text: s
  } = n.document.lineAt(o);
  n.selection = new r.Selection(new r.Position(o, 0), new r.Position(o, s.length));
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
  c.registerCommandWithTelemetry(e, o.CMDOpenPanel, () => {
    r.commands.executeCommand("editor.action.inlineSuggest.hide");
    p(e);
  });
  c.registerCommandWithTelemetry(e, o.CMDAcceptCursorPanelSolution, () => {
    !function (e) {
      if (!d(e)) return;
      const t = r.window.activeTextEditor;
      const n = e.get(l.CopilotPanel).panelSolutions.get(t.document.uri.toString()) ?? [];
      const i = t.selection.active;
      const o = n.find(e => e.range.contains(i));
      if (o) {
        r.commands.executeCommand(s.CMDAcceptPanelSolution, o.targetUri, o.insertPosition, o.completionText, o.postInsertionCallback);
      }
    }(e);
  });
  c.registerCommandWithTelemetry(e, o.CMDNavigatePreviousPanelSolution, () => {
    h(e, u.Previous);
  });
  c.registerCommandWithTelemetry(e, o.CMDNavigateNextPanelSolution, () => {
    h(e, u.Next);
  });
  c.registerCommandWithTelemetry(e, o.CMDOpenPanelForRange, t => {
    p(e, t);
  });
  c.registerCommandWithTelemetry(e, o.CMDAcceptPanelSolution, async (e, t, n, i) => {
    const o = new r.WorkspaceEdit();
    o.insert(e, t, n);
    await r.workspace.applyEdit(o);
    i();
    await r.commands.executeCommand("workbench.action.closeActiveEditor");
  });
  const t = new l.CopilotPanel(e);
  e.get(a.VsCodeExtensionContext).subscriptions.push(r.workspace.registerTextDocumentContentProvider(i.CopilotPanelScheme, t), r.languages.registerCodeLensProvider({
    scheme: i.CopilotPanelScheme
  }, t));
  e.set(l.CopilotPanel, t);
};
exports.findPrevNextSolution = findPrevNextSolution;