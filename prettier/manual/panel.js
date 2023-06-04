Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.findPrevNextSolution = exports.registerPanelSupport = exports.PanelNavigationType = void 0;
  const r = require(89496),
    i = require(80256),
    o = require(73060),
    s = require(73060),
    a = require(91238),
    c = require(64428),
    l = require(72990);
  var u;
  function p(e, t) {
    const n = r.window.activeTextEditor;
    if (!n) return;
    if (!r.workspace.getConfiguration("editor", n.document.uri).get("codeLens")) return void r.window.showInformationMessage("GitHub Copilot Panel requires having Code Lens enabled. Please update your settings and then try again.", "Open Settings").then(e => {
      "Open Settings" === e && r.commands.executeCommand("workbench.action.openSettings", "editor.codeLens");
    });
    t = function (e, t, n) {
      return n || (0, i.completionContextForDocument)(e, t.document, t.selection.active);
    }(e, n, t);
    const o = (0, i.encodeLocation)(n.document.uri, t),
      a = n.document.languageId;
    r.workspace.openTextDocument(o).then(e => {
      r.languages.setTextDocumentLanguage(e, a), r.window.showTextDocument(e, r.ViewColumn.Beside), r.commands.executeCommand("setContext", s.CopilotPanelVisible, !0);
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
    const n = r.window.activeTextEditor,
      i = f(e.get(l.CopilotPanel).panelSolutions.get(n.document.uri.toString()) ?? [], n.selection.active, t),
      o = i.range.start.line + 1,
      {
        text: s
      } = n.document.lineAt(o);
    n.selection = new r.Selection(new r.Position(o, 0), new r.Position(o, s.length)), n.revealRange(i.range);
  }
  function f(e, t, n) {
    const r = n === u.Previous,
      i = e.findIndex(e => e.range.contains(t));
    let o = r ? i - 1 : i + 1;
    return -1 === i && (o = r ? -1 : 0), e.at(o) ?? e[0];
  }
  !function (e) {
    e.Previous = "previous", e.Next = "next";
  }(u = exports.PanelNavigationType || (exports.PanelNavigationType = {})), exports.registerPanelSupport = function (e) {
    (0, c.registerCommandWithTelemetry)(e, o.CMDOpenPanel, () => {
      r.commands.executeCommand("editor.action.inlineSuggest.hide"), p(e);
    }), (0, c.registerCommandWithTelemetry)(e, o.CMDAcceptCursorPanelSolution, () => {
      !function (e) {
        if (!d(e)) return;
        const t = r.window.activeTextEditor,
          n = e.get(l.CopilotPanel).panelSolutions.get(t.document.uri.toString()) ?? [],
          i = t.selection.active,
          o = n.find(e => e.range.contains(i));
        o && r.commands.executeCommand(s.CMDAcceptPanelSolution, o.targetUri, o.insertPosition, o.completionText, o.postInsertionCallback);
      }(e);
    }), (0, c.registerCommandWithTelemetry)(e, o.CMDNavigatePreviousPanelSolution, () => {
      h(e, u.Previous);
    }), (0, c.registerCommandWithTelemetry)(e, o.CMDNavigateNextPanelSolution, () => {
      h(e, u.Next);
    }), (0, c.registerCommandWithTelemetry)(e, o.CMDOpenPanelForRange, t => {
      p(e, t);
    }), (0, c.registerCommandWithTelemetry)(e, o.CMDAcceptPanelSolution, async (e, t, n, i) => {
      const o = new r.WorkspaceEdit();
      o.insert(e, t, n), await r.workspace.applyEdit(o), i(), await r.commands.executeCommand("workbench.action.closeActiveEditor");
    });
    const t = new l.CopilotPanel(e);
    e.get(a.VsCodeExtensionContext).subscriptions.push(r.workspace.registerTextDocumentContentProvider(i.CopilotPanelScheme, t), r.languages.registerCodeLensProvider({
      scheme: i.CopilotPanelScheme
    }, t)), e.set(l.CopilotPanel, t);
  }, exports.findPrevNextSolution = f;