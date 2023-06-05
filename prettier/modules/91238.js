Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.onDeactivate = exports.VsCodeExtensionContext = exports.createExtensionContext = exports.activate = void 0;
const utils = require("./utils");
require(20406);
const vscode = require("vscode");
const token = require("./token");
const commitfileresolver = require("./commit-file-resolver");
const production = require("./production");
const config = require("./config");
const errorhandler = require("./error-handler");
const utils2 = require("./utils2");
const experiment = require("./experiment");
const abtest = require("./abtest");
const language = require("./language");
const logger = require("./logger");
const network = require("./network");
const request = require("./request");
const notification = require("./notification");
const reporter = require("./status-reporter");
const promptlibproxy = require("./prompt-lib-proxy");
const repo = require("./repo");
const symbol = require("./symbol");
const telemetry = require("./telemetry");
const appinsights = require("./app-insights");
const token2 = require("./token2");
const env = require("./env");
const test = require("./test");
const locationfactory = require("./location-factory");
const documentmanager = require("./document-manager");
const realurlopener = require("./real-url-opener");
const workspacefilesystem = require("./workspace-file-system");
const ghosttext = require("./ghost-text");
const token3 = require("./token3");
const codequote = require("./code-quote");
const vscodeutils = require("./vscode-utils");
const consts = require("./const");
const install = require("./install");
const ingnore = require("./ignore");
const panel = require("./panel");
const report2 = require("./report2");
const experimentfilter = require("./experiment-filter");
const extensionapi = require("./extension-api");
const extensionfilesystem = require("./extension-file-system");
const ondidchangeconfig = require("./on-did-change-config");
const proxy = require("./proxy");
const session = require("./session");
const K = require(87254);
const decomposehovertext = require("./decompose-hover-text");
const telemetryrepo = require("./telemetry-repo");
const extensionlocationfactory = require("./extension-location-factory");
const extensiontextdocumentmanager = require("./extension-text-document-manager");
const extensioncommitfileresolver = require("./extension-commit-file-resolver");
const extensionworkspacefilesystem = require("./extension-workspace-file-system");
const J = vscode.window.createOutputChannel("GitHub Copilot");
async function ee(e) {
  const t = production.createProductionContext(new vscodeutils.VSCodeConfigProvider());
  const n = new logger.MultiLog([new logger.ConsoleLog(console), new logger.OutputChannelLog(J)]);
  t.forceSet(logger.LogTarget, n);
  t.set(config.EditorAndPluginInfo, new vscodeutils.VSCodeEditorInfo());
  proxy.initProxyEnvironment(t.get(request.Fetcher), process.env);
  t.set(notification.NotificationSender, new token3.ExtensionNotificationSender());
  t.set(config.EditorSession, new config.EditorSession(vscode.env.sessionId, vscode.env.machineId));
  (function (e, t) {
    e.set(ne, t);
  })(t, e);
  t.set(experiment.EditorExperimentFilters, new experimentfilter.VSCodeEditorExperimentFilters());
  experiment.setupExperimentationService(t);
  t.set(symbol.SymbolDefinitionProvider, new decomposehovertext.ExtensionSymbolDefinitionProvider());
  if (e.extensionMode === vscode.ExtensionMode.Test) {
    t.forceSet(env.RuntimeMode, env.RuntimeMode.fromEnvironment(!0));
    t.set(token.CopilotTokenManager, token2.getTestingCopilotTokenManager());
    t.forceSet(realurlopener.UrlOpener, new test.TestUrlOpener());
    await te(t, e, "copilot-test", !0);
  } else {
    t.set(token.CopilotTokenManager, new token3.VSCodeCopilotTokenManager());
    t.forceSet(abtest.ExpConfigMaker, new abtest.ExpConfigFromTAS());
    await te(t, e, e.extension.packageJSON.name, vscode.env.isTelemetryEnabled);
  }
  e.subscriptions.push(await ingnore.registerCopilotIgnore(t));
  t.set(locationfactory.LocationFactory, new extensionlocationfactory.ExtensionLocationFactory());
  t.set(documentmanager.TextDocumentManager, new extensiontextdocumentmanager.ExtensionTextDocumentManager(t));
  t.set(workspacefilesystem.WorkspaceFileSystem, new extensionworkspacefilesystem.ExtensionWorkspaceFileSystem());
  t.set(commitfileresolver.CommitFileResolver, new extensioncommitfileresolver.ExtensionCommitFileResolver());
  t.set(utils.FileSystem, extensionfilesystem.extensionFileSystem);
  t.set(network.NetworkConfiguration, new ondidchangeconfig.VSCodeNetworkConfiguration());
  return t;
}
async function te(e, t, n, r) {
  t.subscriptions.push(vscode.env.onDidChangeTelemetryEnabled(async n => {
    await appinsights.setupTelemetryReporters(e, t.extension.packageJSON.name, n && vscode.env.isTelemetryEnabled);
  }));
  await appinsights.setupTelemetryReporters(e, n, r);
  telemetryrepo.cleanupTelemetryReporters(e);
}
exports.activate = async function (e) {
  const t = await ee(e);
  if ("abortActivation" == (await async function (e) {
    return "GitHub.copilot-nightly" === e.get(ne).extension.id && (errorhandler.registerDefaultHandlers(e, "vscode"), vscode.extensions.all.find(e => "GitHub.copilot" === e.id)) ? ("Uninstall" === (await vscode.window.showWarningMessage("To use GitHub Copilot Nightly you need to uninstall GitHub Copilot extension", "Uninstall")) && (await vscode.commands.executeCommand("workbench.extensions.uninstallExtension", "GitHub.copilot")), "abortActivation") : "continueActivation";
  }(t))) return;
  !function (e, t) {
    const n = new K.CopilotStatusBar(e, t);
    telemetryrepo.registerCommandWithTelemetry(e, consts.CMDToggleCopilot, () => {
      n.toggleStatusBar();
    });
    telemetryrepo.registerCommandWithTelemetry(e, consts.CMDShowErrorMessage, () => {
      n.showErrorMessage();
    });
    e.get(ne).subscriptions.push(n.getStatusBarItem());
    e.set(reporter.StatusReporter, n);
  }(t, J);
  (function (e) {
    telemetryrepo.registerCommandWithTelemetry(e, consts.CMDCollectDiagnostics, () => report2.openDiagnosticReport(e));
    telemetryrepo.registerCommandWithTelemetry(e, consts.CMDSendFeedback, () => {
      vscode.env.openExternal(vscode.Uri.parse("https://github.com/github/feedback/discussions/categories/copilot"));
    });
  })(t);
  e.subscriptions.push(new codequote.CodeQuote(t).register());
  e.subscriptions.push(re(t));
  const n = async () => {
    const r = t.get(reporter.StatusReporter);
    r.setProgress();
    try {
      await t.get(token.CopilotTokenManager).getCopilotToken(t);
    } catch (e) {
      return void (e => {
        const o = e.message || e;
        telemetry.telemetryError(t, "activationFailed", telemetry.TelemetryData.createAndMarkAsIssued({
          reason: o
        }));
        t.get(telemetry.TelemetryReporters).deactivate();
        const s = "GitHubLoginFailed" === o ? session.SESSION_LOGIN_MESSAGE : `GitHub Copilot could not connect to server. Extension activation failed: "${o}"`;
        r.setError(s, n);
        logger.logger.error(t, s);
        vscode.commands.executeCommand("setContext", "github.copilot.activated", !1);
      })(e);
    }
    r.forceNormal();
    vscode.commands.executeCommand("setContext", "github.copilot.activated", !0);
    ingnore.checkFileOnLoad(t);
    panel.registerPanelSupport(t);
    (function (e) {
      try {
        ghosttext.registerGhostText(e);
        const t = vscode.workspace.getConfiguration();
        if (void 0 === t.inspect("editor.inlineSuggest.enabled")?.globalValue) {
          t.update("editor.inlineSuggest.enabled", !0, vscode.ConfigurationTarget.Global);
        }
      } catch (t) {
        telemetry.telemetryException(e, t, "registerGhostTextSupport");
      }
    })(t);
    e.subscriptions.push(utils2.registerDocumentTracker(t));
    e.subscriptions.push(utils2.registerCursorTracker(t));
    install.installCopilotChatExtensionIfNeeded(t);
    e.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => e ? e.document.isUntitled || "file" === e.document.uri.scheme && repo.extractRepoInfoInBackground(t, e.document.fileName) : void 0));
    e.subscriptions.push(vscode.workspace.onDidOpenTextDocument(e => language.primeLanguageDetectionCache(t, e)));
    e.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => ondidchangeconfig.onDidChangeConfigurationHandler(e, t)));
    const s = e.extensionMode !== vscode.ExtensionMode.Development;
    promptlibproxy.init(t, s, new logger.Logger(logger.LogLevel.INFO, "promptlib proxy"));
    telemetry.telemetry(t, "extension.activate");
  };
  vscode.authentication.onDidChangeSessions(async e => {
    await session.onDidChangeSessionsHandler(e, t);
  });
  await n();
  return new extensionapi.CopilotExtensionApi(t);
};
exports.createExtensionContext = ee;
class ne {}
function re(e) {
  return {
    dispose: async () => {
      await telemetry.telemetry(e, "extension.deactivate");
      e.get(telemetry.TelemetryReporters).deactivate();
      promptlibproxy.terminate();
    }
  };
}
exports.VsCodeExtensionContext = ne;
exports.onDeactivate = re;