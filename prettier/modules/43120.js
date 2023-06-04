Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FileMatchResponse = exports.PageInfo = exports.FileMatch = exports.FileMatchRequest = exports.MatchResponse = exports.MatchRequest = exports.Snippet = exports.MatchError = void 0;
const r = require(14350);
exports.MatchError = r.Type.Object({
  kind: r.Type.Literal("failure"),
  reason: r.Type.String(),
  code: r.Type.Number(),
  msg: r.Type.String(),
  meta: r.Type.Optional(r.Type.Any())
});
exports.Snippet = r.Type.Object({
  matched_source: r.Type.String(),
  occurrences: r.Type.String(),
  capped: r.Type.Boolean(),
  cursor: r.Type.String()
});
exports.MatchRequest = r.Type.Object({
  source: r.Type.String()
});
const i = r.Type.Object({
  snippets: r.Type.Array(exports.Snippet)
});
exports.MatchResponse = r.Type.Union([i, exports.MatchError]);
exports.FileMatchRequest = r.Type.Object({
  cursor: r.Type.String()
});
exports.FileMatch = r.Type.Object({
  commit_id: r.Type.String(),
  license: r.Type.String(),
  nwo: r.Type.String(),
  path: r.Type.String(),
  url: r.Type.String()
});
exports.PageInfo = r.Type.Object({
  has_next_page: r.Type.Boolean(),
  cursor: r.Type.String()
});
const o = r.Type.Object({
  count: r.Type.Record(r.Type.String(), r.Type.String())
});
const s = r.Type.Object({
  file_matches: r.Type.Array(exports.FileMatch),
  page_info: exports.PageInfo,
  license_stats: o
});
exports.FileMatchResponse = r.Type.Union([s, exports.MatchError]);