Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ChangeTracker = void 0;
const r = require(93136);
exports.ChangeTracker = class {
  get offset() {
    return this._offset;
  }
  constructor(e, t, n) {
    this._referenceCount = 0;
    this._isDisposed = !1;
    this._offset = n;
    const i = e.get(r.TextDocumentManager);
    this._tracker = i.onDidChangeTextDocument(async e => {
      if (e.document.uri === t) for (const t of e.contentChanges) if (t.rangeOffset + t.rangeLength <= this.offset) {
        const e = t.text.length - t.rangeLength;
        this._offset = this._offset + e;
      }
    });
  }
  push(e, t) {
    if (this._isDisposed) throw new Error("Unable to push new actions to a disposed ChangeTracker");
    this._referenceCount++;
    setTimeout(() => {
      e();
      this._referenceCount--;
      if (0 === this._referenceCount) {
        this._tracker.dispose();
        this._isDisposed = !0;
      }
    }, t);
  }
};