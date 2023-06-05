var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u = this && this.__classPrivateFieldGet || function (e, t, n, r) {
  if ("a" === n && !r) throw new TypeError("Private accessor was defined without a getter");
  if ("function" == typeof t ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return "m" === n ? r : "a" === n ? r.call(e) : r ? r.value : t.get(e);
};
var p = this && this.__classPrivateFieldSet || function (e, t, n, r, i) {
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
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerMatchPanel = exports.MatchPanel = void 0;
const vscode = require("vscode");
const h = require(91465);
const f = require(32064);
const m = require(47302);
const g = require(56437);
const y = require(86289);
const _ = ["file", "untitled"];
const v = "onCodeQuoteMatchPanelClosed";
function b(e) {
  return !_.includes(e.uri.scheme);
}
async function E(e) {
  return await vscode.commands.executeCommand("markdown.api.render", e);
}
class w extends vscode.EventEmitter {
  constructor() {
    super(...arguments);
    r.set(this, void 0);
    i.set(this, !1);
  }
  render(e) {
    if (u(this, r, "f")) {
      this.update(e);
    } else {
      this.create(e);
    }
  }
  create(e) {
    if (u(this, r, "f")) return;
    p(this, r, vscode.window.createWebviewPanel("codequoteMatchesPreview", `${h.CodeQuoteFeatureName} Public Code Matches`, {
      viewColumn: vscode.ViewColumn.Beside,
      preserveFocus: !0
    }, {
      enableScripts: !1,
      localResourceRoots: []
    }), "f");
    const t = u(this, r, "f").onDidDispose(() => {
      p(this, r, void 0, "f");
      p(this, i, !1, "f");
      t.dispose();
      this.fire(v);
    });
    if (e) {
      u(this, r, "f").webview.html = e;
    }
    p(this, i, !0, "f");
  }
  update(e) {
    if (u(this, r, "f") && u(this, i, "f")) {
      u(this, r, "f").webview.html = e;
    }
  }
  dispose() {
    u(this, r, "f")?.dispose();
    super.dispose();
  }
  get isOpen() {
    return u(this, i, "f");
  }
}
r = new WeakMap();
i = new WeakMap();
class MatchPanel {
  constructor(e) {
    this.ctx = e;
    this.subscriptions = [];
    o.set(this, e => {
      if (e === v) {
        g.matchPanelTelemetry.handleClose({
          context: this.ctx,
          actor: "user"
        });
      }
    });
    s.set(this, e => {
      if (e && !b(e.document)) {
        this.document = e.document;
        if (this.panel.isOpen) {
          u(this, l, "f").call(this);
        }
      }
    });
    a.set(this, e => {
      var t;
      var n;
      if (b(e)) {
        if (this.document) {
          t = e;
          if ((n = this.document) && f.getDocumentFilename(t) === f.getDocumentFilename(n) && t.uri.toString() === n.uri.toString()) {
            u(this, c, "f").call(this);
            m.MatchState.removeEditorRef(f.getDocumentFilename(this.document));
            this.document = void 0;
          }
        }
      }
    });
    c.set(this, () => {
      if (this.panel.isOpen) {
        g.matchPanelTelemetry.handleClose({
          context: this.ctx,
          actor: "system"
        });
        this.panel.dispose();
      }
    });
    l.set(this, () => {
      if (this.document && this.panel.isOpen) {
        E(this.provideContent()).then(e => {
          this.panel.update(e);
        });
      }
    });
    this.panel = new w();
    this.subscriptions = [vscode.Disposable.from(m.MatchState.listen(u(this, l, "f")), this.panel.event(u(this, o, "f")), vscode.window.onDidChangeActiveTextEditor(u(this, s, "f")), vscode.workspace.onDidCloseTextDocument(u(this, a, "f")))];
  }
  async create() {
    const e = f.getActiveEditor();
    if (!e || b(e.document)) return;
    this.document = e.document;
    const t = await E(this.provideContent());
    this.panel.render(t);
    g.matchPanelTelemetry.handleOpen({
      context: this.ctx,
      actor: "user"
    });
  }
  dispose() {
    this.panel?.dispose();
    vscode.Disposable.from(...this.subscriptions).dispose();
  }
  provideContent() {
    const e = f.getDocumentFilename(this.document);
    const t = m.MatchState.getEditorRefSnapshot(e);
    return t ? y.FormattedDocument.create(e, Array.from(t.values())) : "";
  }
}
exports.MatchPanel = MatchPanel;
o = new WeakMap();
s = new WeakMap();
a = new WeakMap();
c = new WeakMap();
l = new WeakMap();
exports.registerMatchPanel = function (e) {
  const t = new MatchPanel(e);
  t.subscriptions.push(vscode.commands.registerCommand(h.MatchPanelCommand, function () {
    t.create();
  }));
  return t;
};