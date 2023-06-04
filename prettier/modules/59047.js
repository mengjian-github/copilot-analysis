Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.installCopilotChatExtensionIfNeeded = void 0;
const r = require(89496);
const i = require(29899);
const o = require(91238);
const s = "GitHub.copilot-chat";
exports.installCopilotChatExtensionIfNeeded = async function (e) {
  if (r.extensions.getExtension(s)) return;
  const t = e.get(i.LogTarget);
  if (!(r.env.appName.includes("Insiders") || r.env.appName.includes("Exploration") || r.env.appName.includes("OSS"))) return void t.logIt(e, i.LogLevel.WARN, "Not installing CopilotChat- not VS Code Insiders");
  const n = e.get(o.VsCodeExtensionContext);
  const a = n.extensionMode === r.ExtensionMode.Production;
  const c = "GitHub.copilot-nightly" === n.extension.id;
  if (!a || c) try {
    t.logIt(e, i.LogLevel.INFO, "Installing CopilotChat");
    await r.commands.executeCommand("workbench.extensions.installExtension", s, {
      donotSync: !0,
      installPreReleaseVersion: !0
    });
  } catch (n) {
    t.logIt(e, i.LogLevel.ERROR, "Failed to install CopilotChat", n);
  } else t.logIt(e, i.LogLevel.WARN, "Not installing CopilotChat- is prod and is not nightly");
};