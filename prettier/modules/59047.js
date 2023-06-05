Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.installCopilotChatExtensionIfNeeded = void 0;
const vscode = require("vscode");
const logger = require("./logger");
const main = require("./main");
const s = "GitHub.copilot-chat";
exports.installCopilotChatExtensionIfNeeded = async function (e) {
  if (vscode.extensions.getExtension(s)) return;
  const t = e.get(logger.LogTarget);
  if (!(vscode.env.appName.includes("Insiders") || vscode.env.appName.includes("Exploration") || vscode.env.appName.includes("OSS"))) return void t.logIt(e, logger.LogLevel.WARN, "Not installing CopilotChat- not VS Code Insiders");
  const n = e.get(main.VsCodeExtensionContext);
  const a = n.extensionMode === vscode.ExtensionMode.Production;
  const c = "GitHub.copilot-nightly" === n.extension.id;
  if (!a || c) try {
    t.logIt(e, logger.LogLevel.INFO, "Installing CopilotChat");
    await vscode.commands.executeCommand("workbench.extensions.installExtension", s, {
      donotSync: !0,
      installPreReleaseVersion: !0
    });
  } catch (n) {
    t.logIt(e, logger.LogLevel.ERROR, "Failed to install CopilotChat", n);
  } else t.logIt(e, logger.LogLevel.WARN, "Not installing CopilotChat- is prod and is not nightly");
};