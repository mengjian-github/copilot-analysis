Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CodeQuoteHeaderContributor = void 0;
exports.CodeQuoteHeaderContributor = class {
  constructor(e) {
    this.codequoteEnabled = e ?? !1;
  }
  updateCodeQuoteEnabled(e) {
    this.codequoteEnabled = e ?? !1;
  }
  contributeHeaderValues(e) {
    e["Code-Quote-Enabled"] = String(this.codequoteEnabled);
  }
};