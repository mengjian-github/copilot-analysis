Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getDocumentFilename = exports.getActiveEditorFilename = exports.getActiveEditor = void 0;
const vscode = require("vscode");
function getActiveEditor() {
  return vscode.window.activeTextEditor;
}
function getDocumentFilename(e) {
  return e?.uri.fsPath ?? "";
}
exports.getActiveEditor = getActiveEditor;
exports.getActiveEditorFilename = function () {
  return getDocumentFilename(getActiveEditor()?.document);
};
exports.getDocumentFilename = getDocumentFilename;