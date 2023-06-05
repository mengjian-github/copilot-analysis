Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CoCommittedFiles = void 0;
const r = require(17373);
const i = require(43076);
const utils2 = require("./utils2");
const s = require(31451);
class CoCommittedFiles {
  constructor(e, t) {
    this.docManager = e;
    this.commitFileResolver = t;
    this.cocommittedFilesCache = this.computeInBackgroundAndMemoize(CoCommittedFiles.getCoCommittedFiles, 1);
  }
  async tryGetTextDocument(e) {
    try {
      return await this.docManager.getTextDocument(r.URI.parse(e));
    } catch (e) {
      return;
    }
  }
  static async getCoCommittedFiles(e, t, n, r, i) {
    if (void 0 === e.commitFileResolver) return [];
    const o = await e.commitFileResolver.getCoCommitResult(t, i);
    let a = 0;
    const c = [];
    for (const n of o) {
      if (n.fsPath === t) continue;
      const o = await e.tryGetTextDocument(n.toString());
      if (!(void 0 === o || a + o.getText().length > s.NeighborSource.MAX_NEIGHBOR_AGGREGATE_LENGTH) && "file" == o.uri.scheme && o.languageId === r && (c.push({
        uri: o.uri.toString(),
        relativePath: await e.docManager.getRelativePath(o),
        languageId: o.languageId,
        source: o.getText()
      }), a += o.getText().length, c.length >= i)) break;
    }
    return c;
  }
  async truncateDocs(e, t, n, r) {
    const i = [];
    let o = 0;
    for (const a of e) if (!(o + a.getText().length > s.NeighborSource.MAX_NEIGHBOR_AGGREGATE_LENGTH) && ("file" == a.uri.scheme && a.fileName !== t && a.languageId === n && (i.push({
      uri: a.uri.toString(),
      relativePath: await this.docManager.getRelativePath(a),
      languageId: a.languageId,
      source: a.getText()
    }), o += a.getText().length), i.length >= r)) break;
    return i;
  }
  computeInBackgroundAndMemoize(e, t) {
    const n = new i.LRUCacheMap(t);
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
    const a = new Map();
    i = await this.truncateDocs(utils2.sortByAccessTimes(this.docManager.textDocuments.filter(e => void 0 !== utils2.accessTimes.get(e.uri.toString()))), e.fsPath, n, r);
    a.set(s.NeighboringFileType.OpenTabs, i.map(e => e.uri));
    if (i.length < r) {
      let o = this.cocommittedFilesCache(e.fsPath, t, n, r);
      if (null !== o) {
        const e = new Set(i.map(e => e.uri));
        o = o.filter(t => !e.has(t.uri)).slice(0, r - i.length), i.push(...o), a.set(t, o.map(e => e.uri));
      }
    }
    return {
      docs: i,
      neighborSource: a
    };
  }
}
exports.CoCommittedFiles = CoCommittedFiles;