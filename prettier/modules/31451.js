Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NeighborSource = exports.considerNeighborFile = exports.NeighboringLanguageType = exports.NeighboringFileType = void 0;
const r = require(84936);
const i = require(59189);
const o = require(93136);
const s = require(88560);
const a = require(93480);
const c = require(38296);
const l = require(3488);
const u = require(19239);
var p;
var d;
!function (e) {
  e.None = "none";
  e.OpenTabs = "opentabs";
  e.CursorMostRecent = "cursormostrecent";
  e.CursorMostCount = "cursormostcount";
  e.WorkspaceSharingSameFolder = "workspacesharingsamefolder";
  e.WorkspaceSmallestPathDist = "workspacesmallestpathdist";
  e.OpenTabsAndCocommitted = "opentabsandcocommitted";
}(p = exports.NeighboringFileType || (exports.NeighboringFileType = {}));
(function (e) {
  e.Match = "match";
  e.Any = "any";
})(d = exports.NeighboringLanguageType || (exports.NeighboringLanguageType = {}));
exports.considerNeighborFile = function (e, t, n) {
  switch (n) {
    case d.Any:
      return !0;
    case d.Match:
    default:
      return e === t;
  }
};
class NeighborSource {
  static reset() {
    NeighborSource.instance = void 0;
  }
  static async getNeighborFiles(e, t, n) {
    const d = await e.get(i.Features).neighboringFileType(n);
    const f = await e.get(i.Features).neighboringLanguageType(n);
    if (d === p.None) return {
      docs: [],
      neighborSource: new Map()
    };
    if (void 0 === NeighborSource.instance) {
      const t = e.get(o.TextDocumentManager);
      if (d === p.WorkspaceSharingSameFolder || d === p.WorkspaceSmallestPathDist) {
        const n = e.get(s.WorkspaceFileSystem);
        NeighborSource.instance = new u.WorkspaceFiles(t, f, n);
      } else if (d == p.OpenTabsAndCocommitted) {
        const n = e.get(r.CommitFileResolver);
        NeighborSource.instance = new a.CoCommittedFiles(t, n);
      } else if (d === p.CursorMostCount || d === p.CursorMostRecent) {
        NeighborSource.instance = new c.CursorHistoryFiles(t, f);
      } else {
        NeighborSource.instance = new l.OpenTabFiles(t, f);
      }
    }
    return await NeighborSource.instance.getNeighborFiles(t, d, n.fileType, NeighborSource.MAX_NEIGHBOR_FILES);
  }
}
NeighborSource.MAX_NEIGHBOR_AGGREGATE_LENGTH = 2e5;
NeighborSource.MAX_NEIGHBOR_FILES = 20;
NeighborSource.EXCLUDED_NEIGHBORS = ["node_modules", "dist", "site-packages"];
exports.NeighborSource = NeighborSource;