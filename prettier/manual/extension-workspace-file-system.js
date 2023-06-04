Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.ExtensionWorkspaceFileSystem = void 0;
  const r = require(89496),
    i = require(88560);
  class o extends i.WorkspaceFileSystem {
    async findFiles(e, t, n) {
      return await r.workspace.findFiles(e, t, n);
    }
    async getWorkspaceFolder(e) {
      const t = r.workspace.getWorkspaceFolder(e);
      if (void 0 !== t) return t.uri;
    }
  }
  exports.ExtensionWorkspaceFileSystem = o;