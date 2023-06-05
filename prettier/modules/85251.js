Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.setupExperimentationService = exports.EditorExperimentFilters = exports.logger = void 0;
const config = require("./config");
const logger = require("./logger");
const o = require(59189);
const s = require(38142);
exports.logger = new logger.Logger(logger.LogLevel.INFO, "Exp");
class EditorExperimentFilters {}
function c(e) {
  return e.split("-")[0];
}
exports.EditorExperimentFilters = EditorExperimentFilters;
exports.setupExperimentationService = function (e) {
  const t = e.get(o.Features);
  t.registerStaticFilters(function (e) {
    const t = function (e) {
      const t = e.get(config.BuildInfo);
      const n = e.get(config.EditorAndPluginInfo).getEditorInfo();
      const i = e.get(config.EditorSession);
      return {
        [s.Filter.ApplicationVersion]: c(n.version),
        [s.Filter.ClientId]: i.machineId,
        [s.Filter.ExtensionName]: t.getName(),
        [s.Filter.ExtensionVersion]: c(t.getVersion()),
        [s.Filter.TargetPopulation]: s.TargetPopulation.Public
      };
    }(e);
    return {
      ...t,
      ...e.get(EditorExperimentFilters).addEditorSpecificFilters()
    };
  }(e));
  t.registerDynamicFilter(s.Filter.CopilotOverrideEngine, () => config.getConfig(e, config.ConfigKey.DebugOverrideEngine));
};