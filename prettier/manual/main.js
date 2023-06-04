const utils = require("./utils");
require("./source-map").install();
const vscode = require("vscode"),
  token = require("./token"),
  CommitFileResolver = require("./commit-file-resolver"),
  production = require("./production"),
  config = require("./config"),
  utils2 = require("./utils2"),
  experiment = require("./experiment"),
  abtest = require("./abtest"),
  language = require("./language"),
  logger = require("./logger"),
  network = require("./network"),
  request = require("./request"),
  notification = require("./notification"),
  reporter = require("./status-reporter"),
  promptlibproxy = require("./prompt-lib-proxy"),
  repo = require("./repo"),
  symbol = require("./symbol"),
  telemetry = require("./telemetry"),
  appinsights = require("./app-insights"),
  token2 = require("./token2"),
  env = require("./env"),
  test = require("./test"),
  locationfactory = require("./location-factory"),
  documentmanager = require("./document-manager"),
  realurlopener = require("./real-url-opener"),
  workspacefilesystem = require("./workspace-file-system"),
  ghosttext = require("./ghost-text"),
  token3 = require("./token3"),
  codequote = require("./code-quote"),
  vscodeutils = require("./vscode-utils"),
  consts = require("./const"),
  install = require("./install"),
  ignore = require("./ignore"),
  panel = require("./panel"),
  report2 = require("./report2"),
  experimentfilter = require("./experiment-filter"),
  extensionapi = require("./extension-api"),
  extensionfilesystem = require("./extension-file-system"),
  ondidchangeconfig = require("./on-did-change-config"),
  proxy = require("./proxy"),
  session = require("./session"),
  statusbar = require("./status-bar"),
  decomposehovertext = require("./decompose-hover-text"),
  telemetryrepo = require("./telemetry-repo"),
  extensionlocationfactory = require("./extension-location-factory"),
  extensiontextdocumentmanger = require("./extension-text-document-manager"),
  extensioncommitfileresolver = require("./extension-commit-file-resolver"),
  extensionworkspacefilesystem = require("./extension-workspace-file-system"),
  copilotchannel = vscode.window.createOutputChannel("GitHub Copilot");

class ExtensionContext {}

// 创建扩展上下文
async function createExtensionContext(event) {
  const context = production.createProductionContext(
    new vscodeutils.VSCodeConfigProvider()
  );
  const mLogger = new logger.MultiLog([
    new logger.ConsoleLog(console),
    new logger.OutputChannelLog(copilotchannel),
  ]);

  context.forceSet(logger.LogTarget, mLogger);
  context.set(config.EditorAndPluginInfo, new vscodeutils.VSCodeEditorInfo());
  proxy.initProxyEnvironment(context.get(request.Fetcher), process.env);
  context.set(
    notification.NotificationSender,
    new token3.ExtensionNotificationSender()
  );
  context.set(
    config.EditorSession,
    new config.EditorSession(vscode.env.sessionId, vscode.env.machineId)
  );
  context.set(ExtensionContext, event);

  context.set(
    experiment.EditorExperimentFilters,
    new experimentfilter.VSCodeEditorExperimentFilters()
  );

  experiment.setupExperimentationService(context);

  context.set(
    symbol.SymbolDefinitionProvider,
    new decomposehovertext.ExtensionSymbolDefinitionProvider()
  );

  if (e.extensionMode === vscode.ExtensionMode.Test) {
    context.forceSet(env.RuntimeMode, env.RuntimeMode.fromEnvironment(true));
    context.set(token.CopilotTokenManager, token2.TestingCopilotTokenManager());
    context.forceSet(realurlopener.UrlOpener, new test.TestUrlOpener());
    await setupTelemetryReporters(context, event, "copilot-test", true);
  } else {
    context.set(
      token.CopilotTokenManager,
      new token3.VSCodeCopilotTokenManager()
    );
    context.forceSet(abtest.ExpConfigMaker, new abtest.ExpConfigFromTAS());
    await setupTelemetryReporters(
      context,
      event,
      event.extension.packageJSON.name,
      vscode.env.isTelemetryEnabled
    );
  }
  event.subscriptions.push(await ignore.registerCopilotIgnore(context));

  context.set(
    locationfactory.LocationFactory,
    new extensionlocationfactory.ExtensionLocationFactory()
  );

  context.set(
    documentmanager.TextDocumentManager,
    new extensiontextdocumentmanger.ExtensionTextDocumentManager(context)
  );

  context.set(
    workspacefilesystem.WorkspaceFileSystem,
    new extensionworkspacefilesystem.ExtensionWorkspaceFileSystem()
  );

  context.set(
    CommitFileResolver.CommitFileResolver,
    new extensioncommitfileresolver.ExtensionCommitFileResolver()
  );

  context.set(utils.FileSystem, extensionfilesystem.extensionFileSystem);

  context.set(
    network.NetworkConfiguration,
    new ondidchangeconfig.VSCodeNetworkConfiguration()
  );

  return context;
}

// 初始化遥测报告
async function setupTelemetryReporters(
  context,
  event,
  name,
  isTelemetryEnabled
) {
  event.subscriptions.push(
    vscode.env.onDidChangeTelemetryEnabled(async (n) => {
      await appinsights.setupTelemetryReporters(
        context,
        event.extension.packageJSON.name,
        name && vscode.env.isTelemetryEnabled
      );
    })
  );
  await appinsights.setupTelemetryReporters(context, name, isTelemetryEnabled);
  telemetryrepo.cleanupTelemetryReporters(context);
}

exports.activate = async function (e) {
  const context = await createExtensionContext(e);

  const bar = new statusbar.CopilotStatusBar(context, copilotchannel);
  telemetryrepo.registerCommandWithTelemetry(
    context,
    consts.CMDToggleCopilot,
    () => {
      bar.toggleStatusBar();
    }
  );
  telemetryrepo.registerCommandWithTelemetry(
    context,
    consts.CMDShowErrorMessage,
    () => {
      bar.showErrorMessage();
    }
  );
  context.get(ExtensionContext).subscriptions.push(bar.getStatusBarItem());
  context.set(reporter.StatusReporter, bar);

  e.subscriptions.push(new codequote.CodeQuote(context).register());
  e.subscriptions.push(re(context));

  const init = async () => {
    const statusReporter = context.get(reporter.StatusReporter);
    statusReporter.setProgress();
    await context.get(token.CopilotTokenManager).getCopilotToken(context);
    statusReporter.forceNormal();
    vscode.commands.executeCommand(
      "setContext",
      "github.copilot.activated",
      true
    );
    ignore.checkFileOnLoad(context);
    panel.registerPanelSupport(context);
    ghosttext.registerGhostText(context);
    const conf = vscode.workspace.getConfiguration();
    if (!conf.inspect("editor.inlineSuggest.enabled")?.globalValue) {
      conf.update(
        "editor.inlineSuggest.enabled",
        true,
        vscode.ConfigurationTarget.Global
      );
    }
    e.subscriptions.push(utils2.registerDocumentTracker(context));

    e.subscriptions.push(utils2.registerCursorTracker(context));
    install.installCopilotChatExtensionIfNeeded(context);
    e.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((e) =>
        e
          ? e.document.isUntitled ||
            ("file" === e.document.uri.scheme &&
              (0, repo.extractRepoInfoInBackground)(
                context,
                e.document.fileName
              ))
          : void 0
      )
    );
    e.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument((e) =>
        language.primeLanguageDetectionCache(context, e)
      )
    );
    e.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e) =>
        ondidchangeconfig.onDidChangeConfigurationHandler(e, context)
      )
    );
    const s = e.extensionMode !== vscode.ExtensionMode.Development;
    promptlibproxy.init(
      context,
      s,
      new logger.Logger(logger.LogLevel.INFO, "promptlib proxy")
    );
    w.telemetry(context, "extension.activate");
  };
  vscode.authentication.onDidChangeSessions(async (e) => {
    await session.onDidChangeSessionsHandler(e, context);
  });
  await init();
  return new extensionapi.CopilotExtensionApi(context);
};

function onDeactivate(e) {
  return {
    dispose: async () => {
      await telemetry.telemetry(e, "extension.deactivate"),
        e.get(telemetry.TelemetryReporters).deactivate(),
        promptlibproxy.terminate();
    },
  };
}

exports.createExtensionContext = createExtensionContext;
exports.VsCodeExtensionContext = ExtensionContext;
exports.onDeactivate = onDeactivate;
