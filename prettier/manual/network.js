Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.DefaultNetworkConfiguration = exports.NetworkConfiguration = void 0;
  const r = require(17373),
    i = require(30362),
    o = "github.com",
    s = `https://${o}`;
  class a {}
  exports.NetworkConfiguration = a, exports.DefaultNetworkConfiguration = class extends a {
    constructor(e = s) {
      super(), this.recalculateUrls(e);
    }
    isGitHubEnterprise() {
      return this.isEnterprise;
    }
    getAuthAuthority() {
      return this.baseUri.authority;
    }
    getTokenUrl(e) {
      return e.devOverride?.copilotTokenUrl ?? this.tokenUrl;
    }
    getNotificationUrl(e) {
      return e.devOverride?.notificationUrl ?? this.notificationUrl;
    }
    getDeviceFlowStartUrl() {
      return this.deviceFlowStartUrl;
    }
    getDeviceFlowCompletionUrl() {
      return this.deviceFlowCompletionUrl;
    }
    getUserInfoUrl() {
      return this.userInfoUrl;
    }
    updateBaseUrl(e, t = s) {
      const n = this.baseUri;
      this.recalculateUrls(t), n.toString() !== this.baseUri.toString() && e.get(i.CopilotTokenManager).resetCopilotToken(e);
    }
    recalculateUrls(e) {
      this.baseUri = r.URI.parse(e);
      const t = r.URI.parse(`${this.baseUri.scheme}://api.${this.baseUri.authority}`);
      this.isEnterprise = this.baseUri.authority !== o, this.tokenUrl = r.Utils.joinPath(t, "/copilot_internal/v2/token").toString(), this.notificationUrl = r.Utils.joinPath(t, "/copilot_internal/notification").toString(), this.deviceFlowStartUrl = r.Utils.joinPath(this.baseUri, "/login/device/code").toString(), this.deviceFlowCompletionUrl = r.Utils.joinPath(this.baseUri, "/login/oauth/access_token").toString(), this.userInfoUrl = r.Utils.joinPath(t, "/user").toString();
    }
  };