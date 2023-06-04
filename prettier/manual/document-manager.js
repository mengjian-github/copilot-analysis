Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.TextDocumentManager = exports.getRelativePath = void 0;
  const r = require(71017);
  exports.getRelativePath = function (e, t) {
    for (const n of e) {
      const e = n.fsPath;
      if (t.startsWith(e + r.sep)) return r.relative(e, t);
    }
  }, exports.TextDocumentManager = class {
    async getWorkspaceFolder(e) {
      return this.getWorkspaceFolders().find(t => {
        if (e.fileName.startsWith(t.fsPath)) return t;
      });
    }
  };