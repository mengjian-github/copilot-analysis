Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.UserErrorNotifier = void 0;
const r = require(1402);
const i = require(29899);
const o = require(41547);
const s = require(47057);
const a = ["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "CERT_SIGNATURE_FAILURE"];
exports.UserErrorNotifier = class {
  constructor(e) {
    this.notifiedErrorCodes = [];
    e.get(r.CopilotTokenNotifier).on("onCopilotToken", e => {
      this.supportsSSC = "1" === e.getTokenValue("ssc");
    });
  }
  async notifyUser(e, t) {
    if (a.includes(t.code) && !this.didNotifyBefore(t.code)) {
      this.displayCertificateErrorNotification(e, t);
      this.notifiedErrorCodes.push(t.code);
    }
  }
  displayCertificateErrorNotification(e, t) {
    const n = "https://aka.ms/copilot-ssc";
    const r = this.certificateErrorMessage();
    new i.Logger(i.LogLevel.ERROR, "certificates").error(e, `${r} Please visit ${n} to learn more. Original cause: ${JSON.stringify(t)}`);
    this.showCertificateWarningMessage(e, r, n);
  }
  certificateErrorMessage() {
    return void 0 === this.supportsSSC ? "The proxy connection couldn't be established due to an untrusted self-signed certificate, or your Copilot license might not support their use." : this.supportsSSC ? "Your proxy connection requires a trusted certificate. Please make sure the proxy certificate and any issuers are configured correctly to support self-signed certificates." : "Your current Copilot license doesn't support proxy connections with self-signed certificates.";
  }
  showCertificateWarningMessage(e, t, n) {
    const r = {
      title: "Learn more"
    };
    e.get(o.NotificationSender).showWarningMessage(t, r).then(t => {
      if (t?.title === r.title) {
        e.get(s.UrlOpener).open(n);
      }
    });
  }
  didNotifyBefore(e) {
    return -1 !== this.notifiedErrorCodes.indexOf(e);
  }
};