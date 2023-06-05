Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ExtensionTextDocumentManager = void 0;
const r = require(71017);
const vscode = require("vscode");
const o = require(54913);
const documentmanager = require("./document-manager");
class ExtensionTextDocumentManager extends documentmanager.TextDocumentManager {
  constructor(e) {
    super();
    this.onDidFocusTextDocument = vscode.window.onDidChangeActiveTextEditor;
    this.onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument;
    this.onDidChangeCursor = vscode.window.onDidChangeTextEditorSelection;
    this.copilotIgnoreManager = e.get(o.CopilotIgnoreManager);
  }
  get textDocuments() {
    return vscode.workspace.textDocuments.filter(e => !this.copilotIgnoreManager.isIgnored(e.uri));
  }
  async getTextDocument(e) {
    if (!this.copilotIgnoreManager.isIgnored(e)) return vscode.workspace.openTextDocument(e);
  }
  async getRelativePath(e) {
    const t = e;
    if (t) {
      if (t.isUntitled) return;
      return documentmanager.getRelativePath(this.getWorkspaceFolders(), t.fileName) ?? r.basename(t.fileName);
    }
  }
  findNotebook(e) {
    const t = e;
    return vscode.workspace.notebookDocuments.find(e => e.getCells().some(e => e.document === t));
  }
  getWorkspaceFolders() {
    return vscode.workspace.workspaceFolders?.map(e => e.uri) ?? [];
  }
}
exports.ExtensionTextDocumentManager = ExtensionTextDocumentManager;