Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.onDidChangeConfigurationHandler = exports.VSCodeNetworkConfiguration = void 0;
  const r = require(89496),
    i = require(44197),
    o = require(42512),
    s = require(30047),
    a = "github-enterprise",
    c = "https://github.com";
  function l() {
    return r.workspace.getConfiguration(i.CopilotConfigPrefix).get("advanced")?.authProvider === s.AuthProviderId.GitHubEnterprise ? r.workspace.getConfiguration(a).get("uri") ?? c : c;
  }
  class u extends o.DefaultNetworkConfiguration {
    constructor() {
      super(l());
    }
    updateBaseUrl(e, t) {
      super.updateBaseUrl(e, l());
    }
  }
  exports.VSCodeNetworkConfiguration = u, exports.onDidChangeConfigurationHandler = function (e, t) {
    (e.affectsConfiguration(`${i.CopilotConfigPrefix}.advanced`) || e.affectsConfiguration(`${a}.uri`)) && t.get(o.NetworkConfiguration).updateBaseUrl(t);
  };