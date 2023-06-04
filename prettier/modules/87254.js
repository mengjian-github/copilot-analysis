Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CopilotStatusBar = void 0;
const r = require(89496);
const i = require(70106);
const o = require(51133);
const s = require(6333);
const a = require(73060);
exports.CopilotStatusBar = class {
  constructor(e, t) {
    this.ctx = e;
    this.outputChannel = t;
    this.showingMessage = !1;
    this.status = "Normal";
    this.errorMessage = "";
    this.disabledColor = new r.ThemeColor("statusBarItem.warningBackground");
    this.delayedUpdateDisplay = i.debounce(100, () => {
      this.updateDisplay();
    });
    this.enabled = this.checkEnabledForLanguage();
    this.item = r.window.createStatusBarItem("status", r.StatusBarAlignment.Right, 1);
    this.item.name = "Copilot Status";
    this.updateDisplay();
    this.item.show();
    r.window.onDidChangeActiveTextEditor(() => {
      this.updateStatusBarIndicator();
    });
    r.workspace.onDidCloseTextDocument(() => {
      if (r.window.activeTextEditor || "Inactive" !== this.status) {
        this.status = "Normal";
      }
      this.updateStatusBarIndicator();
    });
    r.workspace.onDidOpenTextDocument(() => {
      this.updateStatusBarIndicator();
    });
  }
  updateStatusBarIndicator() {
    this.enabled = this.checkEnabledForLanguage();
    this.updateDisplay();
  }
  checkEnabledForLanguage() {
    return o.getEnabledConfig(this.ctx) || !1;
  }
  updateDisplay() {
    switch (this.status) {
      case "Error":
        this.item.text = "$(copilot-notconnected)";
        this.item.command = a.CMDShowErrorMessage;
        this.item.tooltip = "Copilot error (click for details)";
        break;
      case "Warning":
        this.item.text = "$(copilot-warning)";
        this.item.command = this.errorMessage ? a.CMDShowErrorMessage : void 0;
        this.item.tooltip = "Copilot is encountering temporary issues (click for details)";
        break;
      case "InProgress":
        this.item.text = "$(loading~spin)";
        break;
      case "Inactive":
        this.item.text = "$(copilot-notconnected)";
        this.item.tooltip = this.errorMessage || "Copilot is currently inactive";
        break;
      case "Normal":
        this.item.text = "$(copilot-logo)";
        this.item.command = a.CMDToggleCopilot;
        this.item.tooltip = this.enabled ? "Deactivate Copilot" : "Activate Copilot";
        this.item.backgroundColor = this.enabled ? void 0 : this.disabledColor;
    }
  }
  getStatusBarItem() {
    return this.item;
  }
  setProgress() {
    if ("Error" !== this.status) {
      this.status = "InProgress";
      this.delayedUpdateDisplay();
    }
  }
  removeProgress() {
    if ("Error" !== this.status && "Warning" !== this.status) {
      this.status = "Normal";
      this.delayedUpdateDisplay();
    }
  }
  setWarning(e) {
    if ("Error" !== this.status) {
      this.status = "Warning";
      if (e) {
        this.errorMessage = e;
      }
      this.updateDisplay();
    }
  }
  setError(e, t) {
    this.status = "Error";
    this.errorMessage = e;
    this.errorRetry = t;
    this.updateDisplay();
    this.showErrorMessage();
  }
  setInactive(e) {
    this.status = "Inactive";
    this.errorMessage = e || "";
    this.errorRetry = void 0;
    this.updateDisplay();
  }
  forceNormal() {
    this.status = "Normal";
    this.errorMessage = "";
    this.errorRetry = void 0;
    this.updateDisplay();
  }
  toggleStatusBar() {
    const e = this.ctx.get(o.ConfigProvider);
    const t = this.enabled;
    const n = r.window.activeTextEditor?.document.languageId;
    const i = "editor.action.inlineSuggest.hide";
    if (this.showingMessage) return;
    const a = s.TelemetryData.createAndMarkAsIssued({
      languageId: n || "*"
    });
    if (o.getEnabledConfig(this.ctx, "*") == o.getEnabledConfig(this.ctx, n)) {
      this.showingMessage = !0;
      setTimeout(() => {
        this.showingMessage = !1;
      }, 15e3);
      const o = t ? "Disable" : "Enable";
      const c = `${o} Globally`;
      const l = n ? [c, `${o} for ${n}`] : [c];
      r.window.showInformationMessage(`Would you like to ${t ? "disable" : "enable"} Copilot?`, ...l).then(o => {
        const l = o === c;
        this.showingMessage = !1;
        if (void 0 === o) return void (0, s.telemetry)(this.ctx, "statusBar.cancelToggle");
        s.telemetry(this.ctx, "statusBar" + (l ? ".global" : ".language") + (t ? "Off" : "On"), a);
        if (t) {
          r.commands.executeCommand(i);
        }
        const u = l ? "*" : n;
        e.updateEnabledConfig(this.ctx, u, !t).then(() => {
          this.enabled = !t;
          this.updateDisplay();
        });
      });
    } else {
      s.telemetry(this.ctx, "statusBar.language" + (t ? "Off" : "On"), a);
      if (t) {
        r.commands.executeCommand(i);
      }
      e.updateEnabledConfig(this.ctx, n || "*", !t).then(() => {
        this.enabled = !t;
        this.updateDisplay();
      });
    }
    this.updateDisplay();
  }
  showErrorMessage() {
    if (this.showingMessage) return;
    this.showingMessage = !0;
    const e = "Show Output Log";
    const t = [e];
    if (this.errorRetry) {
      t.push("Retry");
    }
    r.window.showWarningMessage(this.errorMessage, ...t).then(t => {
      this.showingMessage = !1;
      if (t === e) {
        this.outputChannel.show();
      }
      if ("Retry" === t && this.errorRetry) {
        this.errorRetry();
      }
    });
  }
};