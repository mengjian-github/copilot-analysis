Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.OpenTabFiles = void 0;
const utils2 = require("./utils2");
const i = require(31451);
exports.OpenTabFiles = class {
  constructor(e, t) {
    this.docManager = e;
    this.neighboringLanguageType = t;
  }
  async truncateDocs(e, t, n, r) {
    const o = [];
    let s = 0;
    for (const a of e) if (!(s + a.getText().length > i.NeighborSource.MAX_NEIGHBOR_AGGREGATE_LENGTH) && ("file" == a.uri.scheme && a.fileName !== t && i.considerNeighborFile(n, a.languageId, this.neighboringLanguageType) && (o.push({
      uri: a.uri.toString(),
      relativePath: await this.docManager.getRelativePath(a),
      languageId: a.languageId,
      source: a.getText()
    }), s += a.getText().length), o.length >= r)) break;
    return o;
  }
  async getNeighborFiles(e, t, n, o) {
    let s = [];
    const a = new Map();
    s = await this.truncateDocs(utils2.sortByAccessTimes(this.docManager.textDocuments), e.fsPath, n, o);
    a.set(i.NeighboringFileType.OpenTabs, s.map(e => e.uri));
    return {
      docs: s,
      neighborSource: a
    };
  }
};