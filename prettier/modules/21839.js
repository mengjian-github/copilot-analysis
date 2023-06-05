Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerCursorTracker = exports.cursorHistoryManager = exports.registerDocumentTracker = exports.sortByAccessTimes = exports.accessTimes = void 0;
const r = require(43076);
const i = require(24600);
const documentmanager = require("./document-manager");
exports.accessTimes = new r.LRUCacheMap();
exports.sortByAccessTimes = function (e) {
  return [...e].sort((e, n) => {
    const r = exports.accessTimes.get(e.uri.toString()) ?? 0;
    return (exports.accessTimes.get(n.uri.toString()) ?? 0) - r;
  });
};
exports.registerDocumentTracker = e => e.get(documentmanager.TextDocumentManager).onDidFocusTextDocument(e => {
  if (e) {
    exports.accessTimes.set(e.document.uri.toString(), Date.now());
  }
});
exports.cursorHistoryManager = new i.CursorHistoryManager();
exports.registerCursorTracker = e => e.get(documentmanager.TextDocumentManager).onDidChangeCursor(e => {
  if (e && e.selections) for (const n of e.selections) {
    exports.cursorHistoryManager.add(e.textEditor.document, n.anchor.line, Date.now());
    exports.cursorHistoryManager.add(e.textEditor.document, n.active.line, Date.now());
  }
});