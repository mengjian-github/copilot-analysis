Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.onDidChangeConfigurationHandler = exports.VSCodeNetworkConfiguration = void 0;
const vscode = require("vscode");
const i = require(44197);
const network = require("./network");
const session = require("./session");
const a = "github-enterprise";
const c = "https://github.com";
function l() {
  return vscode.workspace.getConfiguration(i.CopilotConfigPrefix).get("advanced")?.authProvider === session.AuthProviderId.GitHubEnterprise ? vscode.workspace.getConfiguration(a).get("uri") ?? c : c;
}
class VSCodeNetworkConfiguration extends network.DefaultNetworkConfiguration {
  constructor() {
    super(l());
  }
  updateBaseUrl(e, t) {
    super.updateBaseUrl(e, l());
  }
}
exports.VSCodeNetworkConfiguration = VSCodeNetworkConfiguration;
exports.onDidChangeConfigurationHandler = function (e, t) {
  if (e.affectsConfiguration(`${i.CopilotConfigPrefix}.advanced`) || e.affectsConfiguration(`${a}.uri`)) {
    t.get(network.NetworkConfiguration).updateBaseUrl(t);
  }
};