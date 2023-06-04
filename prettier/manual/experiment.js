Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.setupExperimentationService = exports.EditorExperimentFilters = exports.logger = void 0;
  const r = require(51133),
    i = require(29899),
    o = require(59189),
    s = require(38142);
  exports.logger = new i.Logger(i.LogLevel.INFO, "Exp");
  class a {}
  function c(e) {
    return e.split("-")[0];
  }
  exports.EditorExperimentFilters = a, exports.setupExperimentationService = function (e) {
    const t = e.get(o.Features);
    t.registerStaticFilters(function (e) {
      const t = function (e) {
        const t = e.get(r.BuildInfo),
          n = e.get(r.EditorAndPluginInfo).getEditorInfo(),
          i = e.get(r.EditorSession);
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
        ...e.get(a).addEditorSpecificFilters()
      };
    }(e)), t.registerDynamicFilter(s.Filter.CopilotOverrideEngine, () => (0, r.getConfig)(e, r.ConfigKey.DebugOverrideEngine));
  };