Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.onDeactivate = exports.VsCodeExtensionContext = exports.createExtensionContext = exports.activate = void 0;
const r = require(23055);
require(20406);
const i = require(89496);
const o = require(30362);
const s = require(84936);
const a = require(13688);
const c = require(51133);
const l = require(79408);
const u = require(21839);
const p = require(85251);
const d = require(69748);
const h = require(55600);
const f = require(29899);
const m = require(42512);
const g = require(82279);
const y = require(41547);
const _ = require(86722);
const v = require(82533);
const b = require(50766);
const E = require(95618);
const w = require(6333);
const T = require(89176);
const S = require(10956);
const x = require(60070);
const C = require(28771);
const I = require(16403);
const A = require(93136);
const k = require(47057);
const P = require(88560);
const N = require(63197);
const O = require(91862);
const R = require(90622);
const M = require(19425);
const L = require(73060);
const D = require(59047);
const B = require(24425);
const F = require(16267);
const j = require(85863);
const U = require(62130);
const $ = require(65849);
const V = require(86857);
const H = require(61405);
const q = require(29477);
const z = require(30047);
const K = require(87254);
const G = require(39813);
const W = require(64428);
const Q = require(68129);
const Z = require(70385);
const X = require(41480);
const Y = require(49263);
const J = i.window.createOutputChannel("GitHub Copilot");
async function ee(e) {
  const t = a.createProductionContext(new M.VSCodeConfigProvider());
  const n = new f.MultiLog([new f.ConsoleLog(console), new f.OutputChannelLog(J)]);
  t.forceSet(f.LogTarget, n);
  t.set(c.EditorAndPluginInfo, new M.VSCodeEditorInfo());
  q.initProxyEnvironment(t.get(g.Fetcher), process.env);
  t.set(y.NotificationSender, new O.ExtensionNotificationSender());
  t.set(c.EditorSession, new c.EditorSession(i.env.sessionId, i.env.machineId));
  (function (e, t) {
    e.set(ne, t);
  })(t, e);
  t.set(p.EditorExperimentFilters, new U.VSCodeEditorExperimentFilters());
  p.setupExperimentationService(t);
  t.set(E.SymbolDefinitionProvider, new G.ExtensionSymbolDefinitionProvider());
  if (e.extensionMode === i.ExtensionMode.Test) {
    t.forceSet(x.RuntimeMode, x.RuntimeMode.fromEnvironment(!0));
    t.set(o.CopilotTokenManager, S.getTestingCopilotTokenManager());
    t.forceSet(k.UrlOpener, new C.TestUrlOpener());
    await te(t, e, "copilot-test", !0);
  } else {
    t.set(o.CopilotTokenManager, new O.VSCodeCopilotTokenManager());
    t.forceSet(d.ExpConfigMaker, new d.ExpConfigFromTAS());
    await te(t, e, e.extension.packageJSON.name, i.env.isTelemetryEnabled);
  }
  e.subscriptions.push(await B.registerCopilotIgnore(t));
  t.set(I.LocationFactory, new Q.ExtensionLocationFactory());
  t.set(A.TextDocumentManager, new Z.ExtensionTextDocumentManager(t));
  t.set(P.WorkspaceFileSystem, new Y.ExtensionWorkspaceFileSystem());
  t.set(s.CommitFileResolver, new X.ExtensionCommitFileResolver());
  t.set(r.FileSystem, V.extensionFileSystem);
  t.set(m.NetworkConfiguration, new H.VSCodeNetworkConfiguration());
  return t;
}
async function te(e, t, n, r) {
  t.subscriptions.push(i.env.onDidChangeTelemetryEnabled(async n => {
    await T.setupTelemetryReporters(e, t.extension.packageJSON.name, n && i.env.isTelemetryEnabled);
  }));
  await T.setupTelemetryReporters(e, n, r);
  W.cleanupTelemetryReporters(e);
}
exports.activate = async function (e) {
  const t = await ee(e);
  if ("abortActivation" == (await async function (e) {
    return "GitHub.copilot-nightly" === e.get(ne).extension.id && (l.registerDefaultHandlers(e, "vscode"), i.extensions.all.find(e => "GitHub.copilot" === e.id)) ? ("Uninstall" === (await i.window.showWarningMessage("To use GitHub Copilot Nightly you need to uninstall GitHub Copilot extension", "Uninstall")) && (await i.commands.executeCommand("workbench.extensions.uninstallExtension", "GitHub.copilot")), "abortActivation") : "continueActivation";
  }(t))) return;
  !function (e, t) {
    const n = new K.CopilotStatusBar(e, t);
    W.registerCommandWithTelemetry(e, L.CMDToggleCopilot, () => {
      n.toggleStatusBar();
    });
    W.registerCommandWithTelemetry(e, L.CMDShowErrorMessage, () => {
      n.showErrorMessage();
    });
    e.get(ne).subscriptions.push(n.getStatusBarItem());
    e.set(_.StatusReporter, n);
  }(t, J);
  (function (e) {
    W.registerCommandWithTelemetry(e, L.CMDCollectDiagnostics, () => j.openDiagnosticReport(e));
    W.registerCommandWithTelemetry(e, L.CMDSendFeedback, () => {
      i.env.openExternal(i.Uri.parse("https://github.com/github/feedback/discussions/categories/copilot"));
    });
  })(t);
  e.subscriptions.push(new R.CodeQuote(t).register());
  e.subscriptions.push(re(t));
  const n = async () => {
    const r = t.get(_.StatusReporter);
    r.setProgress();
    try {
      await t.get(o.CopilotTokenManager).getCopilotToken(t);
    } catch (e) {
      return void (e => {
        const o = e.message || e;
        w.telemetryError(t, "activationFailed", w.TelemetryData.createAndMarkAsIssued({
          reason: o
        }));
        t.get(w.TelemetryReporters).deactivate();
        const s = "GitHubLoginFailed" === o ? z.SESSION_LOGIN_MESSAGE : `GitHub Copilot could not connect to server. Extension activation failed: "${o}"`;
        r.setError(s, n);
        f.logger.error(t, s);
        i.commands.executeCommand("setContext", "github.copilot.activated", !1);
      })(e);
    }
    r.forceNormal();
    i.commands.executeCommand("setContext", "github.copilot.activated", !0);
    B.checkFileOnLoad(t);
    F.registerPanelSupport(t);
    (function (e) {
      try {
        N.registerGhostText(e);
        const t = i.workspace.getConfiguration();
        if (void 0 === t.inspect("editor.inlineSuggest.enabled")?.globalValue) {
          t.update("editor.inlineSuggest.enabled", !0, i.ConfigurationTarget.Global);
        }
      } catch (t) {
        w.telemetryException(e, t, "registerGhostTextSupport");
      }
    })(t);
    e.subscriptions.push(u.registerDocumentTracker(t));
    e.subscriptions.push(u.registerCursorTracker(t));
    D.installCopilotChatExtensionIfNeeded(t);
    e.subscriptions.push(i.window.onDidChangeActiveTextEditor(e => e ? e.document.isUntitled || "file" === e.document.uri.scheme && b.extractRepoInfoInBackground(t, e.document.fileName) : void 0));
    e.subscriptions.push(i.workspace.onDidOpenTextDocument(e => h.primeLanguageDetectionCache(t, e)));
    e.subscriptions.push(i.workspace.onDidChangeConfiguration(e => H.onDidChangeConfigurationHandler(e, t)));
    const s = e.extensionMode !== i.ExtensionMode.Development;
    v.init(t, s, new f.Logger(f.LogLevel.INFO, "promptlib proxy"));
    w.telemetry(t, "extension.activate");
  };
  i.authentication.onDidChangeSessions(async e => {
    await z.onDidChangeSessionsHandler(e, t);
  });
  await n();
  return new $.CopilotExtensionApi(t);
};
exports.createExtensionContext = ee;
class ne {}
function re(e) {
  return {
    dispose: async () => {
      await w.telemetry(e, "extension.deactivate");
      e.get(w.TelemetryReporters).deactivate();
      v.terminate();
    }
  };
}
exports.VsCodeExtensionContext = ne;
exports.onDeactivate = re;