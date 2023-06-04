var r;
var i;
var o;
var s;
var a;
var c;
var l;
var u;
var p;
var d = this && this.__classPrivateFieldSet || function (e, t, n, r, i) {
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
var h = this && this.__classPrivateFieldGet || function (e, t, n, r) {
  if ("a" === n && !r) throw new TypeError("Private accessor was defined without a getter");
  if ("function" == typeof t ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return "m" === n ? r : "a" === n ? r.call(e) : r ? r.value : t.get(e);
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerCodeQuoteCompletionTracker = exports.CodeQuoteCompletionsTracker = exports.SweepInterval = void 0;
const f = require(70106);
const m = require(93136);
const g = require(2135);
const y = require(77032);
const _ = require(47302);
function v(e) {
  return e.replace(/(\s+|"|')/g, (e, t) => t ? "'" : " ");
}
const b = ["file", "untitled"];
exports.SweepInterval = 6e4;
class E {
  static createJSON(e, t) {
    return new E(e, t).toJSON();
  }
  constructor(e, t) {
    r.add(this);
    i.set(this, void 0);
    o.set(this, void 0);
    s.set(this, void 0);
    a.set(this, void 0);
    c.set(this, void 0);
    d(this, i, e.completion.uuid, "f");
    d(this, o, e.snippets.map(e => e.match.matched_source), "f");
    d(this, c, e.completion.offset, "f");
    d(this, s, e.completion.offset, "f");
    d(this, a, e.completion.offset, "f");
    h(this, r, "m", l).call(this, t);
  }
  toJSON() {
    return {
      id: h(this, i, "f"),
      text: h(this, o, "f"),
      initialOffset: h(this, c, "f"),
      lastOffset: h(this, a, "f"),
      offset: h(this, s, "f")
    };
  }
}
i = new WeakMap();
o = new WeakMap();
s = new WeakMap();
a = new WeakMap();
c = new WeakMap();
r = new WeakSet();
l = function (e) {
  for (const t of e) if (t.rangeOffset + t.rangeLength <= h(this, s, "f")) {
    const e = t.text.length - t.rangeLength;
    d(this, a, h(this, s, "f"), "f");
    d(this, s, h(this, s, "f") + e, "f");
  }
};
const w = {
  sweepInterval: exports.SweepInterval,
  changeTrackInterval: 2e3
};
class CodeQuoteCompletionsTracker {
  constructor(e, n = w) {
    this.ctx = e;
    u.set(this, void 0);
    p.set(this, void 0);
    this.onDocumentChange = e => {
      const {
        document: t,
        contentChanges: n
      } = e;
      if (b.includes(t.uri.scheme)) {
        this.trackChanges(t, n);
      }
    };
    this.trackChanges = (e, t) => {
      const n = _.MatchState.getEditorRefSnapshot(e.uri.fsPath);
      const r = this.ctx.get(m.TextDocumentManager).textDocuments.find(t => t.uri.fsPath === e.uri.fsPath);
      if (!n.size) return;
      if (!r) return void _.MatchState.removeEditorRef(e.uri.fsPath);
      const i = Array.from(n.values()).map(e => E.createJSON(e, t)).flatMap(e => {
        const t = r.getText();
        const n = v(t);
        const i = e.text.map(r => {
          const i = v(r);
          return g.checkInString(t, [e.offset, r.length])(n, {
            text: i
          });
        }).find(e => void 0 !== e.foundAt)?.foundAt ?? void 0;
        return {
          id: e.id,
          foundAt: i
        };
      });
      i.forEach(e => {
        if (void 0 === e.foundAt) {
          _.MatchState.markForRemoval(r.uri.fsPath, e.id);
        } else {
          if (n.get(e.id)?.deletedAt) {
            _.MatchState.unmarkForRemoval(r.uri.fsPath, e.id);
          }
        }
      });
      y.codeQuoteLogger.info(this.ctx, "onDidChangeTextDocument", i);
    };
    this.sweep = () => {
      const e = this.ctx.get(m.TextDocumentManager).textDocuments.map(e => e.uri.fsPath);
      _.MatchState.removeMatches(e, e => {
        const n = Date.now();
        return Boolean(e.deletedAt && n - e.deletedAt > exports.SweepInterval);
      });
    };
    this.trackChanges = f.debounce(n.changeTrackInterval, this.trackChanges);
    if (void 0 !== n.sweepInterval) {
      d(this, p, setInterval(this.sweep, n.sweepInterval), "f");
    }
  }
  listen() {
    if (h(this, u, "f")) return;
    const e = this.ctx.get(m.TextDocumentManager);
    d(this, u, e.onDidChangeTextDocument(this.onDocumentChange), "f");
  }
  dispose() {
    h(this, u, "f")?.dispose();
    clearInterval(h(this, p, "f"));
  }
}
exports.CodeQuoteCompletionsTracker = CodeQuoteCompletionsTracker;
u = new WeakMap();
p = new WeakMap();
exports.registerCodeQuoteCompletionTracker = function (e) {
  const t = new CodeQuoteCompletionsTracker(e);
  t.listen();
  return t;
};