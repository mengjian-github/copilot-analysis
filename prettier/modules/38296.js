Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CursorHistoryFiles = void 0;
const r = require(21839);
const i = require(31451);
exports.CursorHistoryFiles = class {
  constructor(e, t) {
    this.docManager = e;
    this.neighboringLanguageType = t;
  }
  async truncateDocs(e, t, n, r) {
    const o = [];
    let s = 0;
    for (const a of e) if (!(s + a.getText().length > i.NeighborSource.MAX_NEIGHBOR_AGGREGATE_LENGTH) && ("file" == a.uri.scheme && a.fileName !== t && i.considerNeighborFile(n, a.languageId, this.neighboringLanguageType) && (o.push({
      uri: a.uri.toString(),
      relativePath: await this.docManager.getRelativePath(a),
      languageId: a.languageId,
      source: a.getText()
    }), s += a.getText().length), o.length >= r)) break;
    return o;
  }
  async getNeighborFiles(e, t, n, o) {
    let s = [];
    const a = new Map();
    if (t === i.NeighboringFileType.CursorMostRecent) {
      s = await this.truncateDocs(r.cursorHistoryManager.sortedDocsByClickTime(), e.fsPath, n, o);
      a.set(i.NeighboringFileType.CursorMostRecent, s.map(e => e.uri));
    } else {
      if (t === i.NeighboringFileType.CursorMostCount) {
        s = await this.truncateDocs(r.cursorHistoryManager.sortedDocsByClickCount(), e.fsPath, n, o);
        a.set(i.NeighboringFileType.CursorMostCount, s.map(e => e.uri));
      }
    }
    return {
      docs: s,
      neighborSource: a
    };
  }
};