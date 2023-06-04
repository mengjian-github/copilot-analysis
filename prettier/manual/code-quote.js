Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.CodeQuote = void 0;
  const r = require(89496),
    i = require(1402),
    o = require(60070),
    s = require(72031),
    a = require(78179),
    c = require(91465),
    l = require(95430),
    u = require(87641),
    p = require(77032),
    d = require(96018),
    h = require(47302);
  exports.CodeQuote = class {
    constructor(e) {
      this.ctx = e, this.onCopilotToken = (e, t) => {
        if (!t.code_quote_enabled) return h.ConnectionState.setDisabled(), this.subscriptions?.dispose(), this.subscriptions = void 0, void p.codeQuoteLogger.debug(this.ctx, `${c.CodeQuoteFeatureName} disabled`);
        this.subscriptions || (h.ConnectionState.setConnected(), p.codeQuoteLogger.info(this.ctx, `${c.CodeQuoteFeatureName} enabled`), this.subscriptions = r.Disposable.from((0, d.registerMatchPanel)(this.ctx), (0, a.registerCodeQuoteStatusReporter)(this.ctx), (0, l.registerCopilotEnvelopeListener)(this.ctx), (0, u.registerPostInsertionListener)(this.ctx), (0, s.registerCodeQuoteCompletionTracker)(this.ctx)));
      }, this.tokenNotifier = e.get(i.CopilotTokenNotifier);
    }
    dispose() {
      this.subscriptions?.dispose(), this.tokenNotifier.off("onCopilotToken", this.onCopilotToken);
    }
    register() {
      return (0, o.isRunningInTest)(this.ctx) || this.tokenNotifier.on("onCopilotToken", this.onCopilotToken), this;
    }
  };