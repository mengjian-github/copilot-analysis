Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ExpConfig = exports.ExpTreatmentVariables = void 0;
const telemetry = require("./telemetry");
const i = require(46500);
var o;
(o = exports.ExpTreatmentVariables || (exports.ExpTreatmentVariables = {})).AA = "copilotaa";
o.CustomEngine = "copilotcustomengine";
o.Fetcher = "copilotfetcher";
o.OverrideBlockMode = "copilotoverrideblockmode";
o.FastCancellation = "copilotoverridefastcancellation";
o.OverrideNumGhostCompletions = "copilotoverridednumghostcompletions";
o.SuffixPercent = "CopilotSuffixPercent";
o.BeforeRequestWaitMs = "copilotlms";
o.NeighboringTabsOption = "copilotneighboringtabs";
o.NumberOfSnippets = "copilotnumberofsnippets";
o.NeighboringSnippetTypes = "copilotneighboringsnippettypes";
o.DebounceMs = "copilotdebouncems";
o.DebouncePredict = "copilotdebouncepredict";
o.ContextualFilterEnable = "copilotcontextualfilterenable";
o.ContextualFilterEnableTree = "copilotcontextualfilterenabletree";
o.ContextualFilterAcceptThreshold = "copilotcontextualfilteracceptthreshold";
o.ContextualFilterExplorationTraffic = "copilotcontextualfilterexplorationtraffic";
o.RequestMultilineExploration = "copilotrequestmultilineexploration";
o.disableLogProb = "copilotdisablelogprob";
o.DropCompletionReasons = "copilotdropcompletionreasons";
o.SymbolDefinitionStrategy = "copilotsymboldefinitionstrategy";
o.CursorContextFix = "copilotcursorcontextfix";
o.GranularityTimePeriodSizeInH = "copilottimeperiodsizeinh";
o.GranularityByCallBuckets = "copilotbycallbuckets";
o.SuffixStartMode = "copilotsuffixstartmode";
o.SuffixMatchThreshold = "copilotsuffixmatchthreshold";
o.FimSuffixLengthThreshold = "copilotfimsuffixlenthreshold";
o.MultiLogitBias = "copilotlbeot";
o.TokenizerName = "copilottokenizername";
o.IndentationMinLength = "copilotindentationminlength";
o.IndentationMaxLength = "copilotindentationmaxlength";
o.SnippetPercent = "snippetpercent";
o.NeighboringFileType = "copilotneighboringfiletype";
o.CursorSnippetsPickingStrategy = "cursorsnippetspickingstrategy";
o.NeighboringLanguageType = "copilotneighboringlanguagetype";
o.WorkspaceStrategy = "copilotworkspacestrategy";
o.RetrievalStrategy = "retrieval";
o.MaxPromptCompletionTokens = "maxpromptcompletionTokens";
class ExpConfig {
  constructor(e, t, n) {
    this.variables = e;
    this.assignmentContext = t;
    this.features = n;
  }
  static createFallbackConfig(e, t) {
    telemetry.telemetryExpProblem(e, {
      reason: t
    });
    return this.createEmptyConfig();
  }
  static createEmptyConfig() {
    return new ExpConfig({}, "", "");
  }
  addToTelemetry(e) {
    e.properties[i.ExpServiceTelemetryNames.featuresTelemetryPropertyName] = this.features;
    e.properties[i.ExpServiceTelemetryNames.assignmentContextTelemetryPropertyName] = this.assignmentContext;
  }
}
exports.ExpConfig = ExpConfig;