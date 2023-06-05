Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.extensionFileSystem = void 0;
const vscode = require("vscode");
exports.extensionFileSystem = {
  readFile: async function (e) {
    return await vscode.workspace.fs.readFile(vscode.Uri.file(e));
  },
  mtime: async function (e) {
    return (await vscode.workspace.fs.stat(vscode.Uri.file(e))).mtime;
  },
  stat: async function (e) {
    return await vscode.workspace.fs.stat(vscode.Uri.file(e));
  }
};