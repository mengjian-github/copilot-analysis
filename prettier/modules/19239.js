Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.WorkspaceFiles = void 0;
const r = require(71017);
const i = require(17373);
const o = require(43076);
const utils2 = require("./utils2");
const a = require(49674);
const c = require(31451);
class WorkspaceFiles {
  constructor(e, t, n) {
    this.docManager = e;
    this.neighboringLanguageType = t;
    this.workspaceFileSystem = n;
    this.workspaceFilesCache = this.computeInBackgroundAndMemoize(WorkspaceFiles.getWorkspaceFiles, 1);
  }
  async tryGetTextDocument(e) {
    try {
      return await this.docManager.getTextDocument(i.URI.parse(e));
    } catch (e) {
      return;
    }
  }
  filePathDistance(e, t) {
    const n = r.relative(e, t).split(r.sep).length;
    return {
      dist: n,
      lca: (e.split(r.sep).length + t.split(r.sep).length - n) / 2
    };
  }
  static async getWorkspaceFiles(e, t, n, o, s, u) {
    if (void 0 === e.workspaceFileSystem || void 0 === e.workspaceFilesCache) return [];
    const p = await e.workspaceFileSystem.getWorkspaceFolder(i.URI.file(t));
    if (void 0 === p) return [];
    let d;
    d = e.neighboringLanguageType === c.NeighboringLanguageType.Any ? `**/*.{${Object.keys(a.knownLanguages).map(e => a.knownLanguages[e].extensions.map(e => e.replace(/^\.+/g, "")).join(","))}}` : `**/*.{${a.knownLanguages[o].extensions.map(e => e.replace(/^\.+/g, "")).join(",")}}`;
    if (n === c.NeighboringFileType.WorkspaceSmallestPathDist) {
      const n = (await e.workspaceFileSystem.findFiles("**/.git/config")).map(e => r.dirname(r.dirname(e.fsPath))).sort((e, t) => t.split(r.sep).length - e.split(r.sep).length).find(e => t.startsWith(e));
      void 0 !== n && "" !== n && (d = `${n}/${d}`);
    } else {
      const e = r.relative(p.fsPath, r.dirname(t));
      "" !== e && (d = `${e}/${d}`);
    }
    const h = new Set(u.map(e => i.URI.parse(e.uri).fsPath));
    h.add(t);
    const f = `**/{${WorkspaceFiles.EXCLUDED_NEIGHBORS.join(",")},.*}/**`;
    const m = (await e.workspaceFileSystem.findFiles(d, f)).filter(e => !h.has(e.fsPath)).sort((n, r) => {
      const i = e.filePathDistance(n.fsPath, t);
      const o = e.filePathDistance(r.fsPath, t);
      return i.dist !== o.dist ? i.dist - o.dist : o.lca - i.lca;
    });
    const g = [];
    let y = 0;
    for (const t of m) {
      const n = await e.tryGetTextDocument(t.toString());
      if (!(void 0 === n || y + n.getText().length > c.NeighborSource.MAX_NEIGHBOR_AGGREGATE_LENGTH) && "file" == n.uri.scheme && c.considerNeighborFile(o, n.languageId, e.neighboringLanguageType) && (g.push({
        uri: n.uri.toString(),
        relativePath: await e.docManager.getRelativePath(n),
        languageId: n.languageId,
        source: n.getText()
      }), y += n.getText().length, g.length >= s)) break;
    }
    return g;
  }
  async truncateDocs(e, t, n, r) {
    const i = [];
    let o = 0;
    for (const s of e) if (!(o + s.getText().length > c.NeighborSource.MAX_NEIGHBOR_AGGREGATE_LENGTH) && ("file" == s.uri.scheme && s.fileName !== t && c.considerNeighborFile(n, s.languageId, this.neighboringLanguageType) && (i.push({
      uri: s.uri.toString(),
      relativePath: await this.docManager.getRelativePath(s),
      languageId: s.languageId,
      source: s.getText()
    }), o += s.getText().length), i.length >= r)) break;
    return i;
  }
  computeInBackgroundAndMemoize(e, t) {
    const n = new o.LRUCacheMap(t);
    const r = new Set();
    return (t, i, ...o) => {
      const s = t + i;
      const a = n.get(s);
      if (a) return a;
      if (r.has(s)) return null;
      const c = e(this, t, i, ...o);
      r.add(s);
      c.then(e => {
        n.set(s, e);
        r.delete(s);
      });
      return null;
    };
  }
  async getNeighborFiles(e, t, n, r) {
    let i = [];
    const o = new Map();
    i = await this.truncateDocs(utils2.sortByAccessTimes(this.docManager.textDocuments.filter(e => void 0 !== utils2.accessTimes.get(e.uri.toString()))), e.fsPath, n, r);
    o.set(c.NeighboringFileType.OpenTabs, i.map(e => e.uri));
    if (i.length < r) {
      let s = this.workspaceFilesCache(e.fsPath, t, n, r, i);
      if (null !== s) {
        const e = new Set(i.map(e => e.uri));
        s = s.filter(t => !e.has(t.uri)).slice(0, r - i.length), i.push(...s), o.set(t, s.map(e => e.uri));
      }
    }
    return {
      docs: i,
      neighborSource: o
    };
  }
}
WorkspaceFiles.EXCLUDED_NEIGHBORS = ["node_modules", "dist", "site-packages"];
exports.WorkspaceFiles = WorkspaceFiles;