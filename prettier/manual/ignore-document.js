Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.ignoreDocument = void 0;
  const config = require("./config");
  const i = require(80256);
  exports.ignoreDocument = function (e, t) {
    const n = t.languageId;
    return !config.getEnabledConfig(e, n) || !![i.CopilotPanelScheme, "output", "search-editor"].includes(t.uri.scheme);
  };