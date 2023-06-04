Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.ExtensionTextDocumentManager = void 0;
  const r = require(71017),
    i = require(89496),
    o = require(54913),
    s = require(93136);
  class a extends s.TextDocumentManager {
    constructor(e) {
      super(), this.onDidFocusTextDocument = i.window.onDidChangeActiveTextEditor, this.onDidChangeTextDocument = i.workspace.onDidChangeTextDocument, this.onDidChangeCursor = i.window.onDidChangeTextEditorSelection, this.copilotIgnoreManager = e.get(o.CopilotIgnoreManager);
    }
    get textDocuments() {
      return i.workspace.textDocuments.filter(e => !this.copilotIgnoreManager.isIgnored(e.uri));
    }
    async getTextDocument(e) {
      if (!this.copilotIgnoreManager.isIgnored(e)) return i.workspace.openTextDocument(e);
    }
    async getRelativePath(e) {
      const t = e;
      if (t) {
        if (t.isUntitled) return;
        return (0, s.getRelativePath)(this.getWorkspaceFolders(), t.fileName) ?? r.basename(t.fileName);
      }
    }
    findNotebook(e) {
      const t = e;
      return i.workspace.notebookDocuments.find(e => e.getCells().some(e => e.document === t));
    }
    getWorkspaceFolders() {
      return i.workspace.workspaceFolders?.map(e => e.uri) ?? [];
    }
  }
  exports.ExtensionTextDocumentManager = a;