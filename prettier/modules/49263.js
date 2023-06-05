Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ExtensionWorkspaceFileSystem = void 0;
const vscode = require("vscode");
const workspacefilesystem = require("./workspace-file-system");
class ExtensionWorkspaceFileSystem extends workspacefilesystem.WorkspaceFileSystem {
  async findFiles(e, t, n) {
    return await vscode.workspace.findFiles(e, t, n);
  }
  async getWorkspaceFolder(e) {
    const t = vscode.workspace.getWorkspaceFolder(e);
    if (void 0 !== t) return t.uri;
  }
}
exports.ExtensionWorkspaceFileSystem = ExtensionWorkspaceFileSystem;