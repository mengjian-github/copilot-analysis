Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ignoreDocument = void 0;
const r = require(51133);
const i = require(80256);
exports.ignoreDocument = function (e, t) {
  const n = t.languageId;
  return !r.getEnabledConfig(e, n) || !![i.CopilotPanelScheme, "output", "search-editor"].includes(t.uri.scheme);
};