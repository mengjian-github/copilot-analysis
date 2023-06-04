Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NotebookLanguageDetection = exports.isNotebook = void 0;
const r = require(93136);
const i = require(55600);
exports.isNotebook = function (e) {
  return e.endsWith(".ipynb");
};
exports.NotebookLanguageDetection = class {
  constructor(e) {
    this.ctx = e;
  }
  async detectLanguage(e) {
    const t = this.ctx.get(r.TextDocumentManager).findNotebook(e);
    return t ? this.detectCellLanguage(e, t) : new i.Language("python", !1, ".ipynb");
  }
  detectCellLanguage(e, t) {
    const n = t.getCells().find(t => t.document.uri === e.uri);
    if (n) {
      const e = n.metadata;
      return e?.custom?.metadata?.vscode?.languageId ? new i.Language(e.custom.metadata.vscode.languageId, !1, ".ipynb") : 2 === n.kind ? new i.Language("python", !1, ".ipynb") : new i.Language("markdown", !1, ".ipynb");
    }
    return new i.Language("unknown", !1, ".ipynb");
  }
};