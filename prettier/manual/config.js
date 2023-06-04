Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.editorVersionHeaders = exports.EditorAndPluginInfo = exports.formatNameAndVersion = exports.EditorSession = exports.getVersion = exports.getBuild = exports.getBuildType = exports.isProduction = exports.BuildInfo = exports.getEnabledConfig = exports.getLanguageConfig = exports.dumpConfig = exports.getHiddenConfig = exports.isDefaultSettingOverwritten = exports.getConfig = exports.getConfigDefaultForObjectKey = exports.getConfigDefaultForKey = exports.InMemoryConfigProvider = exports.DefaultsOnlyConfigProvider = exports.ConfigProvider = exports.ConfigBlockModeConfig = exports.BlockModeConfig = exports.BuildType = exports.shouldDoServerTrimming = exports.shouldDoParsingTrimming = exports.BlockMode = exports.ConfigKey = void 0;
  const r = require(23055),
    i = require(44197),
    o = require(59189),
    s = require(4147);
  var a, c;
  exports.ConfigKey = {
    Enable: "enable",
    InlineSuggestEnable: "inlineSuggest.enable",
    ShowEditorCompletions: ["editor", "showEditorCompletions"],
    EnableAutoCompletions: ["editor", "enableAutoCompletions"],
    DelayCompletions: ["editor", "delayCompletions"],
    FilterCompletions: ["editor", "filterCompletions"],
    DisplayStyle: ["advanced", "displayStyle"],
    SecretKey: ["advanced", "secret_key"],
    SolutionLength: ["advanced", "length"],
    Stops: ["advanced", "stops"],
    Temperature: ["advanced", "temperature"],
    TopP: ["advanced", "top_p"],
    IndentationMode: ["advanced", "indentationMode"],
    InlineSuggestCount: ["advanced", "inlineSuggestCount"],
    ListCount: ["advanced", "listCount"],
    DebugOverrideProxyUrl: ["advanced", "debug.overrideProxyUrl"],
    DebugTestOverrideProxyUrl: ["advanced", "debug.testOverrideProxyUrl"],
    DebugOverrideEngine: ["advanced", "debug.overrideEngine"],
    DebugShowScores: ["advanced", "debug.showScores"],
    DebugOverrideLogLevels: ["advanced", "debug.overrideLogLevels"],
    DebugFilterLogCategories: ["advanced", "debug.filterLogCategories"],
    ConversationEngine: ["advanced", "conversationEngine"],
    ConversationMaxMessageTokens: ["advanced", "maxMessageTokens"],
    ConversationMaxResponseTokens: ["advanced", "maxResponseTokens"],
    ConversationTemperature: ["advanced", "conversationTemperature"],
    ConversationTopP: ["advanced", "conversationTop_p"],
    ConversationSlashCommandEnablements: ["advanced", "slashCommands"],
    ConversationAdditionalPromptContext: ["advanced", "conversationAdditionalPromptContext"],
    InteractiveEditorRichContext: ["advanced", "interactiveEditorRichContext"],
    InteractiveEditorIntentDetection: ["advanced", "interactiveEditorIntentDetection"],
    ConversationLoggingEnabled: ["advanced", "conversationLoggingEnabled"]
  }, function (e) {
    e.Parsing = "parsing", e.Server = "server", e.ParsingAndServer = "parsingandserver";
  }(a = exports.BlockMode || (exports.BlockMode = {})), exports.shouldDoParsingTrimming = function (e) {
    return [a.Parsing, a.ParsingAndServer].includes(e);
  }, exports.shouldDoServerTrimming = function (e) {
    return [a.Server, a.ParsingAndServer].includes(e);
  }, (c = exports.BuildType || (exports.BuildType = {})).DEV = "dev", c.PROD = "prod", c.NIGHTLY = "nightly";
  class l {}
  function u(e, t) {
    switch (e) {
      case a.Parsing:
        return (0, r.isSupportedLanguageId)(t) ? a.Parsing : a.Server;
      case a.Server:
        return a.Server;
      case a.ParsingAndServer:
      default:
        return (0, r.isSupportedLanguageId)(t) ? a.ParsingAndServer : a.Server;
    }
  }
  exports.BlockModeConfig = l, exports.ConfigBlockModeConfig = class extends l {
    async forLanguage(e, n) {
      if (e.get(p).isDefaultSettingOverwritten(exports.ConfigKey.IndentationMode)) switch (e.get(p).getLanguageConfig(exports.ConfigKey.IndentationMode, n)) {
        case "client":
        case !0:
        case "server":
          return a.Server;
        case "clientandserver":
          return u(a.ParsingAndServer, n);
        default:
          return a.Parsing;
      }
      const i = await e.get(o.Features).overrideBlockMode();
      return i ? u(i, n) : "ruby" == n ? a.Parsing : (0, r.isSupportedLanguageId)(n) ? a.ParsingAndServer : a.Server;
    }
  };
  class p {}
  function d(e) {
    try {
      const t = s.contributes.configuration[0].properties[`${i.CopilotConfigPrefix}.${e}`].default;
      if (void 0 === t) throw new Error(`Missing config default value: ${i.CopilotConfigPrefix}.${e}`);
      return t;
    } catch (t) {
      throw new Error(`Error inspecting config default value ${i.CopilotConfigPrefix}.${e}: ${t}`);
    }
  }
  function h(e, t) {
    try {
      const n = s.contributes.configuration[0].properties[`${i.CopilotConfigPrefix}.${e}`].properties[t].default;
      if (void 0 === n) throw new Error(`Missing config default value: ${i.CopilotConfigPrefix}.${e}`);
      return n;
    } catch (n) {
      throw new Error(`Error inspecting config default value ${i.CopilotConfigPrefix}.${e}.${t}: ${n}`);
    }
  }
  function f(e, t) {
    return e.get(p).getConfig(t);
  }
  function m(e, t) {
    return e.get(p).isDefaultSettingOverwritten(t);
  }
  function g(e, t, n) {
    return e.get(p).getLanguageConfig(t, n);
  }
  exports.ConfigProvider = p, exports.DefaultsOnlyConfigProvider = class extends p {
    getConfig(e) {
      return Array.isArray(e) ? h(e[0], e[1]) : d(e);
    }
    isDefaultSettingOverwritten(e) {
      return !1;
    }
    dumpConfig() {
      return {};
    }
    getLanguageConfig(e, t) {
      const n = this.getConfig(e);
      return t && t in n ? n[t] : n["*"];
    }
  }, exports.InMemoryConfigProvider = class {
    constructor(e, t) {
      this.baseConfigProvider = e, this.overrides = t;
    }
    getConfig(e) {
      const t = this.overrides.get(e);
      return void 0 !== t ? t : this.baseConfigProvider.getConfig(e);
    }
    setConfig(e, t) {
      void 0 !== t ? this.overrides.set(e, t) : this.overrides.delete(e);
    }
    setLanguageEnablement(e, n) {
      this.overrides.set(exports.ConfigKey.Enable, {
        [e]: n
      });
    }
    isDefaultSettingOverwritten(e) {
      return !!this.overrides.has(e) || this.baseConfigProvider.isDefaultSettingOverwritten(e);
    }
    keyAsString(e) {
      return Array.isArray(e) ? e.join(".") : e;
    }
    dumpConfig() {
      const e = this.baseConfigProvider.dumpConfig();
      return this.overrides.forEach((t, n) => {
        e[this.keyAsString(n)] = JSON.stringify(t);
      }), e;
    }
    getLanguageConfig(e, t) {
      const n = this.overrides.get(e);
      return void 0 !== n ? void 0 !== t ? n[t] : n["*"] : this.baseConfigProvider.getLanguageConfig(e, t);
    }
  }, exports.getConfigDefaultForKey = d, exports.getConfigDefaultForObjectKey = h, exports.getConfig = f, exports.isDefaultSettingOverwritten = m, exports.getHiddenConfig = function (e, t, n) {
    return m(e, t) ? f(e, t) : n.default;
  }, exports.dumpConfig = function (e) {
    return e.get(p).dumpConfig();
  }, exports.getLanguageConfig = g, exports.getEnabledConfig = function (e, n) {
    return g(e, exports.ConfigKey.Enable, n);
  };
  class y {
    constructor() {
      this.packageJson = s;
    }
    isProduction() {
      return "dev" != this.getBuildType();
    }
    getBuildType() {
      return this.packageJson.buildType;
    }
    getVersion() {
      return this.packageJson.version;
    }
    getBuild() {
      return this.packageJson.build;
    }
    getName() {
      return this.packageJson.name;
    }
  }
  function _({
    name: e,
    version: t
  }) {
    return `${e}/${t}`;
  }
  exports.BuildInfo = y, exports.isProduction = function (e) {
    return e.get(y).isProduction();
  }, exports.getBuildType = function (e) {
    return e.get(y).getBuildType();
  }, exports.getBuild = function (e) {
    return e.get(y).getBuild();
  }, exports.getVersion = function (e) {
    return e.get(y).getVersion();
  }, exports.EditorSession = class {
    constructor(e, t) {
      this.sessionId = e, this.machineId = t;
    }
  }, exports.formatNameAndVersion = _;
  class v {}
  exports.EditorAndPluginInfo = v, exports.editorVersionHeaders = function (e) {
    const t = e.get(v);
    return {
      "Editor-Version": _(t.getEditorInfo()),
      "Editor-Plugin-Version": _(t.getEditorPluginInfo())
    };
  };