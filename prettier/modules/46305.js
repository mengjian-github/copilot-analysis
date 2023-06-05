Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NotebookLanguageDetection = exports.isNotebook = void 0;
const documentmanager = require("./document-manager");
const language = require("./language");
exports.isNotebook = function (e) {
  return e.endsWith(".ipynb");
};
exports.NotebookLanguageDetection = class {
  constructor(e) {
    this.ctx = e;
  }
  async detectLanguage(e) {
    const t = this.ctx.get(documentmanager.TextDocumentManager).findNotebook(e);
    return t ? this.detectCellLanguage(e, t) : new language.Language("python", !1, ".ipynb");
  }
  detectCellLanguage(e, t) {
    const n = t.getCells().find(t => t.document.uri === e.uri);
    if (n) {
      const e = n.metadata;
      return e?.custom?.metadata?.vscode?.languageId ? new language.Language(e.custom.metadata.vscode.languageId, !1, ".ipynb") : 2 === n.kind ? new language.Language("python", !1, ".ipynb") : new language.Language("markdown", !1, ".ipynb");
    }
    return new language.Language("unknown", !1, ".ipynb");
  }
};