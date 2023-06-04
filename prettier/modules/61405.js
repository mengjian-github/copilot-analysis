Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.onDidChangeConfigurationHandler = exports.VSCodeNetworkConfiguration = void 0;
const r = require(89496);
const i = require(44197);
const o = require(42512);
const s = require(30047);
const a = "github-enterprise";
const c = "https://github.com";
function l() {
  return r.workspace.getConfiguration(i.CopilotConfigPrefix).get("advanced")?.authProvider === s.AuthProviderId.GitHubEnterprise ? r.workspace.getConfiguration(a).get("uri") ?? c : c;
}
class VSCodeNetworkConfiguration extends o.DefaultNetworkConfiguration {
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
    t.get(o.NetworkConfiguration).updateBaseUrl(t);
  }
};