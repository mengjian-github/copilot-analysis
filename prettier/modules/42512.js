Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.DefaultNetworkConfiguration = exports.NetworkConfiguration = void 0;
const r = require(17373);
const token = require("./token");
const o = "github.com";
const s = `https://${o}`;
class NetworkConfiguration {}
exports.NetworkConfiguration = NetworkConfiguration;
exports.DefaultNetworkConfiguration = class extends NetworkConfiguration {
  constructor(e = s) {
    super();
    this.recalculateUrls(e);
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
    this.recalculateUrls(t);
    if (n.toString() !== this.baseUri.toString()) {
      e.get(token.CopilotTokenManager).resetCopilotToken(e);
    }
  }
  recalculateUrls(e) {
    this.baseUri = r.URI.parse(e);
    const t = r.URI.parse(`${this.baseUri.scheme}://api.${this.baseUri.authority}`);
    this.isEnterprise = this.baseUri.authority !== o;
    this.tokenUrl = r.Utils.joinPath(t, "/copilot_internal/v2/token").toString();
    this.notificationUrl = r.Utils.joinPath(t, "/copilot_internal/notification").toString();
    this.deviceFlowStartUrl = r.Utils.joinPath(this.baseUri, "/login/device/code").toString();
    this.deviceFlowCompletionUrl = r.Utils.joinPath(this.baseUri, "/login/oauth/access_token").toString();
    this.userInfoUrl = r.Utils.joinPath(t, "/user").toString();
  }
};