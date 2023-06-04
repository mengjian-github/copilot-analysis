Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getDocumentFilename = exports.getActiveEditorFilename = exports.getActiveEditor = void 0;
const r = require(89496);
function getActiveEditor() {
  return r.window.activeTextEditor;
}
function getDocumentFilename(e) {
  return e?.uri.fsPath ?? "";
}
exports.getActiveEditor = getActiveEditor;
exports.getActiveEditorFilename = function () {
  return getDocumentFilename(getActiveEditor()?.document);
};
exports.getDocumentFilename = getDocumentFilename;