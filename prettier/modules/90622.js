Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CodeQuote = void 0;
const r = require(89496);
const i = require(1402);
const o = require(60070);
const s = require(72031);
const a = require(78179);
const c = require(91465);
const l = require(95430);
const u = require(87641);
const p = require(77032);
const d = require(96018);
const h = require(47302);
exports.CodeQuote = class {
  constructor(e) {
    this.ctx = e;
    this.onCopilotToken = (e, t) => {
      if (!t.code_quote_enabled) {
        h.ConnectionState.setDisabled();
        this.subscriptions?.dispose();
        this.subscriptions = void 0;
        return void p.codeQuoteLogger.debug(this.ctx, `${c.CodeQuoteFeatureName} disabled`);
      }
      if (this.subscriptions) {
        h.ConnectionState.setConnected();
        p.codeQuoteLogger.info(this.ctx, `${c.CodeQuoteFeatureName} enabled`);
        this.subscriptions = r.Disposable.from(d.registerMatchPanel(this.ctx), a.registerCodeQuoteStatusReporter(this.ctx), l.registerCopilotEnvelopeListener(this.ctx), u.registerPostInsertionListener(this.ctx), s.registerCodeQuoteCompletionTracker(this.ctx));
      }
    };
    this.tokenNotifier = e.get(i.CopilotTokenNotifier);
  }
  dispose() {
    this.subscriptions?.dispose();
    this.tokenNotifier.off("onCopilotToken", this.onCopilotToken);
  }
  register() {
    if (o.isRunningInTest(this.ctx)) {
      this.tokenNotifier.on("onCopilotToken", this.onCopilotToken);
    }
    return this;
  }
};