Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.VSCodeEditorExperimentFilters = void 0;
  const r = require(89496),
    i = require(85251),
    o = require(38142);
  class s extends i.EditorExperimentFilters {
    addEditorSpecificFilters() {
      return {
        [o.Filter.Build]: r.env.appName,
        [o.Filter.Language]: r.env.language
      };
    }
  }
  exports.VSCodeEditorExperimentFilters = s;