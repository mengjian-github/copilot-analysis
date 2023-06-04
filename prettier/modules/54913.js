var r;
var i;
var o = this && this.__classPrivateFieldSet || function (e, t, n, r, i) {
  if ("m" === r) throw new TypeError("Private method is not writable");
  if ("a" === r && !i) throw new TypeError("Private accessor was defined without a setter");
  if ("function" == typeof t ? e !== t || !i : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  if ("a" === r) {
    i.call(e, n);
  } else {
    if (i) {
      i.value = n;
    } else {
      t.set(e, n);
    }
  }
  return n;
};
var s = this && this.__classPrivateFieldGet || function (e, t, n, r) {
  if ("a" === n && !r) throw new TypeError("Private accessor was defined without a getter");
  if ("function" == typeof t ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return "m" === n ? r : "a" === n ? r.call(e) : r ? r.value : t.get(e);
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NoOPCopilotIgnoreManager = exports.CopilotIgnoreManager = void 0;
const a = require(25112);
const c = require(86722);
class CopilotIgnoreManager {
  constructor(e) {
    this.ctx = e;
    r.set(this, void 0);
    i.set(this, !0);
    o(this, r, new a.CopilotIgnore(e), "f");
  }
  enabled(e = !0) {
    a.copilotIgnoreLogger.info(this.ctx, e ? "active" : "inactive");
    o(this, i, e, "f");
  }
  onDidOpenTextDocument(e) {
    this.setIgnoredStatus(e);
  }
  isIgnored(e) {
    return !1 !== s(this, i, "f") && s(this, r, "f").isIgnored(e);
  }
  onDidWorkspaceRemove(e) {
    s(this, r, "f").removeWorkspace(e);
  }
  onDidIgnorePatternMove(e, t, n) {
    this.onDidIgnorePatternDelete(e);
    this.onDidIgnorePatternCreate(t, n);
  }
  onDidIgnorePatternDelete(e) {
    if (this.isCopilotIgnoreFile(e)) {
      s(this, r, "f").removePattern(e);
    }
  }
  onDidIgnorePatternCreate(e, t) {
    if (this.isCopilotIgnoreFile(e)) {
      s(this, r, "f").setPattern(e, t);
    }
  }
  setIgnoredStatus(e) {
    if (!e || "file" !== e?.scheme) return;
    const t = this.ctx.get(c.StatusReporter);
    if (s(this, r, "f").isIgnored(e)) {
      t.setInactive("Copilot is ignoring this file as per the .copilotignore settings");
    } else {
      t.forceNormal();
    }
  }
  isCopilotIgnoreFile(e) {
    return e.fsPath.endsWith(a.COPILOT_IGNORE_FILE);
  }
}
exports.CopilotIgnoreManager = CopilotIgnoreManager;
r = new WeakMap();
i = new WeakMap();
exports.NoOPCopilotIgnoreManager = class extends CopilotIgnoreManager {
  isIgnored() {
    return !1;
  }
};