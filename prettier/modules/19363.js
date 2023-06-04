Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FilesForMatch = exports.Match = void 0;
const r = require(50597);
const i = require(30858);
const o = require(43120);
exports.Match = async function (e, t, n) {
  const s = await i.call(e, "Match", {
    method: "POST",
    body: r.assertShape(o.MatchRequest, {
      source: t
    })
  }, n);
  return r.assertShape(o.MatchResponse, s);
};
exports.FilesForMatch = async function (e, {
  cursor: t
}, n) {
  const s = await i.call(e, "FilesForMatch", {
    method: "POST",
    body: r.assertShape(o.FileMatchRequest, {
      cursor: t
    })
  }, n);
  return r.assertShape(o.FileMatchResponse, s);
};