Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ExtensionCommitFileResolver = void 0;
const r = require(71017);
const vscode = require("vscode");
const commitfileresolver = require("./commit-file-resolver");
class ExtensionCommitFileResolver extends commitfileresolver.CommitFileResolver {
  async getCoCommitResult(e, t) {
    const n = vscode.extensions.getExtension("vscode.git");
    if (void 0 === n) return [];
    const o = n.exports.getAPI(1);
    if (void 0 === o) return [];
    if (0 === o.repositories.length) return [];
    const s = o.repositories;
    const a = [];
    const c = new Set();
    const l = new Set([6, 12, 13, 2, 15]);
    c.add(e);
    const u = {
      path: e
    };
    for (const n of s) {
      const i = r.relative(n.rootUri.fsPath, e);
      if (!i || i.startsWith("..") || r.isAbsolute(i)) continue;
      const o = await n.log(u);
      for (const e of o) {
        const r = e.parents;
        for (const i of r) {
          const r = await n.diffBetween(i, e.hash);
          for (const e of r) if (!l.has(e.status) && !c.has(e.uri.fsPath) && (c.add(e.uri.fsPath), a.push(e.uri), a.length >= t)) return a;
        }
      }
    }
    return a;
  }
}
exports.ExtensionCommitFileResolver = ExtensionCommitFileResolver;