Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CursorHistoryManager = void 0;
const r = require(43076);
exports.CursorHistoryManager = class {
  constructor() {
    this.lineCursorHistory = new r.LRUCacheMap(100);
    this.fileCursorHistory = new r.LRUCacheMap(100);
  }
  add(e, t, n) {
    const r = e.uri.toString();
    const i = this.lineCursorHistory.get(r) ?? new Map();
    const o = i.get(t) ?? 0;
    i.set(t, o + 1);
    this.lineCursorHistory.set(r, i);
    this.fileCursorHistory.set(r, {
      uri: r,
      doc: e,
      clickCount: (this.fileCursorHistory.get(r)?.clickCount ?? 0) + 1,
      lastClickTime: n
    });
  }
  getDocs() {
    const e = [];
    for (const t of this.fileCursorHistory.keys()) {
      const n = this.fileCursorHistory.get(t);
      if (void 0 !== n) {
        e.push(n);
      }
    }
    return e;
  }
  sortedDocsByClickTime() {
    return this.getDocs().sort((e, t) => t.lastClickTime - e.lastClickTime).map(e => e.doc);
  }
  sortedDocsByClickCount() {
    return this.getDocs().sort((e, t) => t.clickCount === e.clickCount ? t.lastClickTime - e.lastClickTime : t.clickCount - e.clickCount).map(e => e.doc);
  }
};