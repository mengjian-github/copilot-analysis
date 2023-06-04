var r;
var i;
var o;
var s;
var a = this && this.__classPrivateFieldGet || function (e, t, n, r) {
  if ("a" === n && !r) throw new TypeError("Private accessor was defined without a getter");
  if ("function" == typeof t ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return "m" === n ? r : "a" === n ? r.call(e) : r ? r.value : t.get(e);
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerCodeQuoteStatusReporter = exports.CodeQuoteStatusReporter = void 0;
const c = require(89496);
const l = require(86722);
const u = require(91465);
const p = require(32064);
const d = require(47302);
const h = require(56437);
const f = "codeQuoteStatusReporter.showMatchList";
const m = "View all matches for this file";
class CodeQuoteStatusReporter extends l.StatusReporter {
  constructor(e) {
    super();
    this.ctx = e;
    this.status = "Normal";
    this.warningColor = new c.ThemeColor("statusBarItem.warningBackground");
    this.errorColor = new c.ThemeColor("statusBarItem.errorBackground");
    this.baseColor = new c.ThemeColor("statusBarItem.background");
    this.subscriptions = [];
    this.showingMessage = !1;
    this.progress = null;
    r.set(this, () => {
      c.commands.executeCommand(u.MatchPanelCommand);
    });
    i.set(this, e => {
      const t = d.MatchState.getEditorRefSnapshot(p.getDocumentFilename(e?.document));
      const n = Array.from(t.values()).filter(e => !e.deletedAt);
      this.updateItem(Boolean(n.length));
    });
    o.set(this, e => {
      this.item.text = `${u.CodeQuoteFeatureName} - ${e}`;
    });
    s.set(this, e => {
      this.item.backgroundColor = e;
    });
    this.subscriptions.push(c.commands.registerCommand(f, a(this, r, "f")));
    this.item = c.window.createStatusBarItem("codequote", c.StatusBarAlignment.Right, 0);
    this.item.name = "Copilot CodeQuote";
    this.item.command = f;
    this.subscriptions.push(d.ConnectionState.listen(() => {
      if (d.ConnectionState.isDisabled()) this.item?.hide();else {
        if (d.ConnectionState.isConnected()) {
          a(this, i, "f").call(this, p.getActiveEditor());
          return void this.setNormal(`${u.CodeQuoteFeatureName} has reconnected to the server.`);
        }
        if (d.ConnectionState.isConnected()) {
          a(this, s, "f").call(this, this.errorColor);
          this.item.tooltip = "Public code will not be matched.";
        }
        if (d.ConnectionState.isDisconnected()) a(this, o, "f").call(this, "Disconnected");else if (d.ConnectionState.isRetrying()) {
          if (a(this, o, "f").call(this, "Connecting"), d.ConnectionState.isInitialWait()) return;
          this.setProgress();
        }
      }
    }));
    this.subscriptions.push(d.MatchState.listen(() => {
      a(this, i, "f").call(this, p.getActiveEditor());
    }));
    this.subscriptions.push(c.window.onDidChangeActiveTextEditor(e => {
      a(this, i, "f").call(this, e);
    }));
  }
  dispose() {
    c.Disposable.from(...this.subscriptions).dispose();
  }
  updateItem(e) {
    const t = e ? "Matches found" : "No Matches";
    const n = e ? this.warningColor : this.baseColor;
    a(this, o, "f").call(this, t);
    a(this, s, "f").call(this, n);
    this.item.tooltip = m;
    this.item.show();
  }
  setProgress() {
    if (this.progress) {
      this.progress = c.window.withProgress({
        location: c.ProgressLocation.Notification,
        title: "Reconnecting to CodeQuote"
      }, e => new Promise(t => {
        const n = d.ConnectionState.listen(() => {
          if (d.ConnectionState.isRetrying()) {
            t(n.dispose());
            this.progress = null;
          }
          const {
            maxAttempts: r,
            retryAttempts: i
          } = d.ConnectionState.getSnapshot();
          if (i === r) {
            t(n.dispose());
            this.progress = null;
          }
          const o = Math.floor(i / r * 100);
          e.report({
            increment: o,
            message: `Retrying ... attempt ${i} of ${r}`
          });
        });
      }));
    }
  }
  removeProgress() {}
  setError(e) {
    if (this.showingMessage) {
      this.showingMessage = !0;
      c.window.showErrorMessage(e).then(() => {
        this.showingMessage = !1;
      });
    }
  }
  setNormal(e) {
    if (e) {
      this.forceNormal();
      c.window.showInformationMessage(e);
    }
  }
  setInactive() {}
  setWarning(e) {
    if (e) {
      this.status = "Warning";
      c.window.showWarningMessage(e, m).then(e => {
        const t = {
          context: this.ctx,
          actor: "user"
        };
        switch (e) {
          case m:
            h.matchNotificationTelemetry.handleDoAction(t);
            c.commands.executeCommand(u.MatchPanelCommand);
            break;
          case void 0:
            h.matchNotificationTelemetry.handleDismiss(t);
        }
      });
    }
  }
  forceNormal() {
    this.status = "Normal";
  }
}
exports.CodeQuoteStatusReporter = CodeQuoteStatusReporter;
r = new WeakMap();
i = new WeakMap();
o = new WeakMap();
s = new WeakMap();
exports.registerCodeQuoteStatusReporter = function (e) {
  const t = new CodeQuoteStatusReporter(e);
  e.forceSet(CodeQuoteStatusReporter, t);
  return t;
};