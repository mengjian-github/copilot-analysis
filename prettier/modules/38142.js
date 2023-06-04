var n;
var r;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FilterSettings = exports.telmetryNames = exports.TargetPopulation = exports.Filter = void 0;
(function (e) {
  e.Market = "X-MSEdge-Market";
  e.CorpNet = "X-FD-Corpnet";
  e.ApplicationVersion = "X-VSCode-AppVersion";
  e.Build = "X-VSCode-Build";
  e.ClientId = "X-MSEdge-ClientId";
  e.ExtensionName = "X-VSCode-ExtensionName";
  e.ExtensionVersion = "X-VSCode-ExtensionVersion";
  e.Language = "X-VSCode-Language";
  e.TargetPopulation = "X-VSCode-TargetPopulation";
  e.CopilotClientTimeBucket = "X-Copilot-ClientTimeBucket";
  e.CopilotOverrideEngine = "X-Copilot-OverrideEngine";
  e.CopilotRepository = "X-Copilot-Repository";
  e.CopilotFileType = "X-Copilot-FileType";
  e.CopilotUserKind = "X-Copilot-UserKind";
  e.CopilotDogfood = "X-Copilot-Dogfood";
})(n = exports.Filter || (exports.Filter = {}));
(r = exports.TargetPopulation || (exports.TargetPopulation = {})).Team = "team";
r.Internal = "internal";
r.Insiders = "insider";
r.Public = "public";
exports.telmetryNames = {
  [n.CopilotClientTimeBucket]: "timeBucket",
  [n.CopilotOverrideEngine]: "engine",
  [n.CopilotRepository]: "repo",
  [n.CopilotFileType]: "fileType",
  [n.CopilotUserKind]: "userKind"
};
class FilterSettings {
  constructor(e) {
    this.filters = e;
    for (const [e, t] of Object.entries(this.filters)) if ("" === t) {
      delete this.filters[e];
    }
  }
  extends(e) {
    for (const [t, n] of Object.entries(e.filters)) if (this.filters[t] !== n) return !1;
    return !0;
  }
  addToTelemetry(e) {
    for (const [n, r] of Object.entries(this.filters)) {
      const i = exports.telmetryNames[n];
      if (void 0 !== i) {
        e.properties[i] = r;
      }
    }
  }
  stringify() {
    const e = Object.keys(this.filters);
    e.sort();
    return e.map(e => `${e}:${this.filters[e]}`).join(";");
  }
  toHeaders() {
    return {
      ...this.filters
    };
  }
  withChange(e, t) {
    return new FilterSettings({
      ...this.filters,
      [e]: t
    });
  }
}
exports.FilterSettings = FilterSettings;