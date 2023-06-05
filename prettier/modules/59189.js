Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.Features = exports.Task = void 0;
const utils = require("./utils");
const i = require(10299);
const o = require(43076);
const config = require("./config");
const a = require(77744);
const c = require(31451);
const l = require(10219);
const abtest = require("./abtest");
const p = require(38142);
const d = require(29030);
class h {
  constructor(e) {
    this.ctx = e;
    this.cache = new o.LRUCacheMap(200);
  }
  async fetchExpConfig(e) {
    let t = this.cache.get(e.stringify());
    if (t) {
      t = new Task(() => this.ctx.get(abtest.ExpConfigMaker).fetchExperiments(this.ctx, e.toHeaders()), 36e5);
      this.cache.set(e.stringify(), t);
    }
    return t.run();
  }
  getCachedExpConfig(e) {
    return this.cache.get(e.stringify())?.value();
  }
}
class Task {
  constructor(e, t = 1 / 0) {
    this.producer = e;
    this.expirationMs = t;
  }
  async run() {
    if (void 0 === this.promise) {
      this.promise = this.producer();
      this.storeResult(this.promise).then(() => {
        if (this.expirationMs < 1 / 0 && void 0 !== this.promise) {
          setTimeout(() => this.promise = void 0, this.expirationMs);
        }
      });
    }
    return this.promise;
  }
  async storeResult(e) {
    try {
      this.result = await e;
    } finally {
      if (void 0 === this.result) {
        this.promise = void 0;
      }
    }
  }
  value() {
    return this.result;
  }
}
exports.Task = Task;
class Features {
  constructor(e) {
    this.ctx = e;
    this.staticFilters = {};
    this.dynamicFilters = {};
    this.upcomingDynamicFilters = {};
    this.assignments = new h(this.ctx);
  }
  registerStaticFilters(e) {
    Object.assign(this.staticFilters, e);
  }
  registerDynamicFilter(e, t) {
    this.dynamicFilters[e] = t;
  }
  getDynamicFilterValues() {
    const e = {};
    for (const [t, n] of Object.entries(this.dynamicFilters)) e[t] = n();
    return e;
  }
  registerUpcomingDynamicFilter(e, t) {
    this.upcomingDynamicFilters[e] = t;
  }
  async getAssignment(e, t = {}, n) {
    const r = this.getGranularityDirectory();
    const i = this.makeFilterSettings(t);
    const o = r.extendFilters(i);
    const s = await this.getExpConfig(o.newFilterSettings);
    r.update(i, +(s.variables[l.ExpTreatmentVariables.GranularityByCallBuckets] ?? NaN), +(s.variables[l.ExpTreatmentVariables.GranularityTimePeriodSizeInH] ?? NaN));
    const a = r.extendFilters(i);
    const c = a.newFilterSettings;
    const u = await this.getExpConfig(c);
    let p = new Promise(e => setTimeout(e, Features.upcomingDynamicFilterCheckDelayMs));
    for (const e of a.otherFilterSettingsToPrefetch) p = p.then(async () => {
      await new Promise(e => setTimeout(e, Features.upcomingDynamicFilterCheckDelayMs));
      this.getExpConfig(e);
    });
    this.prepareForUpcomingFilters(c);
    if (n) {
      n.filtersAndExp = {
        exp: u,
        filters: c
      };
    }
    return u.variables[e];
  }
  getGranularityDirectory() {
    if (!this.granularityDirectory) {
      const e = this.ctx.get(config.EditorSession).machineId;
      this.granularityDirectory = new d.GranularityDirectory(e, this.ctx.get(i.Clock));
    }
    return this.granularityDirectory;
  }
  makeFilterSettings(e) {
    return new p.FilterSettings({
      ...this.staticFilters,
      ...this.getDynamicFilterValues(),
      ...e
    });
  }
  async getExpConfig(e) {
    try {
      return this.assignments.fetchExpConfig(e);
    } catch (e) {
      return l.ExpConfig.createFallbackConfig(this.ctx, `Error fetching ExP config: ${e}`);
    }
  }
  async prepareForUpcomingFilters(e) {
    if (!(new Date().getMinutes() < 60 - Features.upcomingTimeBucketMinutes)) for (const [t, n] of Object.entries(this.upcomingDynamicFilters)) {
      await new Promise(e => setTimeout(e, Features.upcomingDynamicFilterCheckDelayMs));
      this.getExpConfig(e.withChange(t, n()));
    }
  }
  stringify() {
    const e = this.assignments.getCachedExpConfig(new p.FilterSettings({}));
    return JSON.stringify(e?.variables ?? {});
  }
  async addExpAndFilterToTelemetry(e) {
    const t = this.makeFilterSettings({});
    e.filtersAndExp = {
      filters: t,
      exp: await this.getExpConfig(t)
    };
  }
  async debounceMs() {
    return (await this.getAssignment(l.ExpTreatmentVariables.DebounceMs)) ?? 0;
  }
  async debouncePredict() {
    return (await this.getAssignment(l.ExpTreatmentVariables.DebouncePredict)) ?? !1;
  }
  async contextualFilterEnable() {
    return (await this.getAssignment(l.ExpTreatmentVariables.ContextualFilterEnable)) ?? !0;
  }
  async contextualFilterEnableTree() {
    return (await this.getAssignment(l.ExpTreatmentVariables.ContextualFilterEnableTree)) ?? !0;
  }
  async contextualFilterAcceptThreshold() {
    return (await this.getAssignment(l.ExpTreatmentVariables.ContextualFilterAcceptThreshold)) ?? a.contextualFilterAcceptThreshold;
  }
  async contextualFilterExplorationTraffic() {
    return (await this.getAssignment(l.ExpTreatmentVariables.ContextualFilterExplorationTraffic)) ?? a.contextualFilterExplorationTraffic;
  }
  async disableLogProb() {
    return (await this.getAssignment(l.ExpTreatmentVariables.disableLogProb)) ?? !0;
  }
  async overrideBlockMode() {
    return (await this.getAssignment(l.ExpTreatmentVariables.OverrideBlockMode)) || void 0;
  }
  async fastCancellation() {
    return (await this.getAssignment(l.ExpTreatmentVariables.FastCancellation)) ?? !0;
  }
  async overrideNumGhostCompletions() {
    return await this.getAssignment(l.ExpTreatmentVariables.OverrideNumGhostCompletions);
  }
  async dropCompletionReasons() {
    const e = await this.getAssignment(l.ExpTreatmentVariables.DropCompletionReasons);
    if (e) return e.split(",");
  }
  async customEngine({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r,
    telemetryData: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.CustomEngine, o, i)) ?? "";
  }
  async beforeRequestWaitMs({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r,
    telemetryData: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.BeforeRequestWaitMs, o, i)) ?? 0;
  }
  async multiLogitBias({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r,
    telemetryData: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.MultiLogitBias, o, i)) ?? !1;
  }
  async requestMultilineExploration({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r,
    telemetryData: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.RequestMultilineExploration, o, i)) ?? !1;
  }
  async indentationMinLength({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.IndentationMinLength, i)) ?? void 0;
  }
  async indentationMaxLength({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.IndentationMaxLength, i)) ?? void 0;
  }
  async suffixPercent({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return config.getConfig(this.ctx, config.ConfigKey.DebugOverrideEngine) ? 0 : (await this.getAssignment(l.ExpTreatmentVariables.SuffixPercent, i)) ?? 15;
  }
  async suffixMatchThreshold({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.SuffixMatchThreshold, i)) ?? 10;
  }
  async fimSuffixLengthThreshold({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.FimSuffixLengthThreshold, i)) ?? 0;
  }
  async suffixStartMode({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: i
    };
    switch (await this.getAssignment(l.ExpTreatmentVariables.SuffixStartMode, o)) {
      case "cursor":
        return utils.SuffixStartMode.Cursor;
      case "cursortrimstart":
      default:
        return utils.SuffixStartMode.CursorTrimStart;
      case "siblingblock":
        return utils.SuffixStartMode.SiblingBlock;
      case "siblingblocktrimstart":
        return utils.SuffixStartMode.SiblingBlockTrimStart;
    }
  }
  async tokenizerName({
    repoNwo: e,
    userKind: t
  }) {
    const n = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: t
    };
    switch (await this.getAssignment(l.ExpTreatmentVariables.TokenizerName, n)) {
      case "cushman001":
        return utils.TokenizerName.cushman001;
      case "cushman002":
      default:
        return utils.TokenizerName.cushman002;
      case "mock":
        return utils.TokenizerName.mock;
    }
  }
  async numberOfSnippets({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: i
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.NumberOfSnippets, o)) ?? utils.DEFAULT_NUM_OF_SNIPPETS;
  }
  async snippetPercent({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.SnippetPercent, i)) ?? 0;
  }
  async neighboringTabsOption({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: i
    };
    switch (await this.getAssignment(l.ExpTreatmentVariables.NeighboringTabsOption, o)) {
      case "none":
        return utils.NeighboringTabsOption.None;
      case "conservative":
        return utils.NeighboringTabsOption.Conservative;
      case "medium":
        return utils.NeighboringTabsOption.Medium;
      case "eager":
      default:
        return utils.NeighboringTabsOption.Eager;
      case "eagerbutlittle":
        return utils.NeighboringTabsOption.EagerButLittle;
      case "eagerbutmedium":
        return utils.NeighboringTabsOption.EagerButMedium;
      case "eagerbutmuch":
        return utils.NeighboringTabsOption.EagerButMuch;
      case "retrievalcomparable":
        return utils.NeighboringTabsOption.RetrievalComparable;
    }
  }
  async neighboringSnippetTypes({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: i
    };
    switch (await this.getAssignment(l.ExpTreatmentVariables.NeighboringSnippetTypes, o)) {
      case "function":
        return utils.NeighboringSnippetType.NeighboringFunctions;
      case "snippet":
      default:
        return utils.NeighboringSnippetType.NeighboringSnippets;
      case "cursor":
        return utils.NeighboringSnippetType.CursorHistoryMatcher;
    }
  }
  async neighboringFileType({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotDogfood]: r
    };
    switch (await this.getAssignment(l.ExpTreatmentVariables.NeighboringFileType, i)) {
      case "none":
        return c.NeighboringFileType.None;
      case "cursormostrecent":
        return c.NeighboringFileType.CursorMostRecent;
      case "cursormostcount":
        return c.NeighboringFileType.CursorMostCount;
      case "workspacesharingsamefolder":
        return c.NeighboringFileType.WorkspaceSharingSameFolder;
      case "workspacesmallestpathdist":
        return c.NeighboringFileType.WorkspaceSmallestPathDist;
      case "cocommitted":
        return c.NeighboringFileType.OpenTabsAndCocommitted;
      default:
        return c.NeighboringFileType.OpenTabs;
    }
  }
  async neighboringLanguageType({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotDogfood]: r
    };
    return "any" === (await this.getAssignment(l.ExpTreatmentVariables.NeighboringLanguageType, i)) ? c.NeighboringLanguageType.Any : c.NeighboringLanguageType.Match;
  }
  async cursorSnippetsPickingStrategy({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: i
  }) {
    const o = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotDogfood]: i
    };
    switch (await this.getAssignment(l.ExpTreatmentVariables.CursorSnippetsPickingStrategy, o)) {
      case "cursoronly":
        return utils.CursorSnippetsPickingStrategy.CursorOnly;
      case "jaccardcursor":
        return utils.CursorSnippetsPickingStrategy.JaccardCursor;
      default:
        return utils.CursorSnippetsPickingStrategy.CursorJaccard;
    }
  }
  async retrievalStrategy({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.RetrievalStrategy, i)) ?? !1;
  }
  async symbolDefinitionStrategy({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.SymbolDefinitionStrategy, i)) ?? !1;
  }
  async maxPromptCompletionTokens({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.MaxPromptCompletionTokens, i)) ?? 2048;
  }
  async cursorContextFix({
    repoNwo: e,
    fileType: t,
    userKind: n,
    dogFood: r
  }) {
    const i = {
      [p.Filter.CopilotRepository]: e,
      [p.Filter.CopilotFileType]: t,
      [p.Filter.CopilotUserKind]: n,
      [p.Filter.CopilotDogfood]: r
    };
    return (await this.getAssignment(l.ExpTreatmentVariables.CursorContextFix, i)) ?? !1;
  }
}
Features.upcomingDynamicFilterCheckDelayMs = 20;
Features.upcomingTimeBucketMinutes = 5 + Math.floor(11 * Math.random());
exports.Features = Features;