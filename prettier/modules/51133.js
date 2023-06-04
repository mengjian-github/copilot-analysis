Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.editorVersionHeaders = exports.EditorAndPluginInfo = exports.formatNameAndVersion = exports.EditorSession = exports.getVersion = exports.getBuild = exports.getBuildType = exports.isProduction = exports.BuildInfo = exports.getEnabledConfig = exports.getLanguageConfig = exports.dumpConfig = exports.getHiddenConfig = exports.isDefaultSettingOverwritten = exports.getConfig = exports.getConfigDefaultForObjectKey = exports.getConfigDefaultForKey = exports.InMemoryConfigProvider = exports.DefaultsOnlyConfigProvider = exports.ConfigProvider = exports.ConfigBlockModeConfig = exports.BlockModeConfig = exports.BuildType = exports.shouldDoServerTrimming = exports.shouldDoParsingTrimming = exports.BlockMode = exports.ConfigKey = void 0;
const r = require(23055);
const i = require(44197);
const o = require(59189);
const s = require(4147);
var a;
var c;
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
};
(function (e) {
  e.Parsing = "parsing";
  e.Server = "server";
  e.ParsingAndServer = "parsingandserver";
})(a = exports.BlockMode || (exports.BlockMode = {}));
exports.shouldDoParsingTrimming = function (e) {
  return [a.Parsing, a.ParsingAndServer].includes(e);
};
exports.shouldDoServerTrimming = function (e) {
  return [a.Server, a.ParsingAndServer].includes(e);
};
(c = exports.BuildType || (exports.BuildType = {})).DEV = "dev";
c.PROD = "prod";
c.NIGHTLY = "nightly";
class BlockModeConfig {}
function u(e, t) {
  switch (e) {
    case a.Parsing:
      return r.isSupportedLanguageId(t) ? a.Parsing : a.Server;
    case a.Server:
      return a.Server;
    case a.ParsingAndServer:
    default:
      return r.isSupportedLanguageId(t) ? a.ParsingAndServer : a.Server;
  }
}
exports.BlockModeConfig = BlockModeConfig;
exports.ConfigBlockModeConfig = class extends BlockModeConfig {
  async forLanguage(e, n) {
    if (e.get(ConfigProvider).isDefaultSettingOverwritten(exports.ConfigKey.IndentationMode)) switch (e.get(ConfigProvider).getLanguageConfig(exports.ConfigKey.IndentationMode, n)) {
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
    return i ? u(i, n) : "ruby" == n ? a.Parsing : r.isSupportedLanguageId(n) ? a.ParsingAndServer : a.Server;
  }
};
class ConfigProvider {}
function getConfigDefaultForKey(e) {
  try {
    const t = s.contributes.configuration[0].properties[`${i.CopilotConfigPrefix}.${e}`].default;
    if (void 0 === t) throw new Error(`Missing config default value: ${i.CopilotConfigPrefix}.${e}`);
    return t;
  } catch (t) {
    throw new Error(`Error inspecting config default value ${i.CopilotConfigPrefix}.${e}: ${t}`);
  }
}
function getConfigDefaultForObjectKey(e, t) {
  try {
    const n = s.contributes.configuration[0].properties[`${i.CopilotConfigPrefix}.${e}`].properties[t].default;
    if (void 0 === n) throw new Error(`Missing config default value: ${i.CopilotConfigPrefix}.${e}`);
    return n;
  } catch (n) {
    throw new Error(`Error inspecting config default value ${i.CopilotConfigPrefix}.${e}.${t}: ${n}`);
  }
}
function getConfig(e, t) {
  return e.get(ConfigProvider).getConfig(t);
}
function isDefaultSettingOverwritten(e, t) {
  return e.get(ConfigProvider).isDefaultSettingOverwritten(t);
}
function getLanguageConfig(e, t, n) {
  return e.get(ConfigProvider).getLanguageConfig(t, n);
}
exports.ConfigProvider = ConfigProvider;
exports.DefaultsOnlyConfigProvider = class extends ConfigProvider {
  getConfig(e) {
    return Array.isArray(e) ? getConfigDefaultForObjectKey(e[0], e[1]) : getConfigDefaultForKey(e);
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
};
exports.InMemoryConfigProvider = class {
  constructor(e, t) {
    this.baseConfigProvider = e;
    this.overrides = t;
  }
  getConfig(e) {
    const t = this.overrides.get(e);
    return void 0 !== t ? t : this.baseConfigProvider.getConfig(e);
  }
  setConfig(e, t) {
    if (void 0 !== t) {
      this.overrides.set(e, t);
    } else {
      this.overrides.delete(e);
    }
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
    this.overrides.forEach((t, n) => {
      e[this.keyAsString(n)] = JSON.stringify(t);
    });
    return e;
  }
  getLanguageConfig(e, t) {
    const n = this.overrides.get(e);
    return void 0 !== n ? void 0 !== t ? n[t] : n["*"] : this.baseConfigProvider.getLanguageConfig(e, t);
  }
};
exports.getConfigDefaultForKey = getConfigDefaultForKey;
exports.getConfigDefaultForObjectKey = getConfigDefaultForObjectKey;
exports.getConfig = getConfig;
exports.isDefaultSettingOverwritten = isDefaultSettingOverwritten;
exports.getHiddenConfig = function (e, t, n) {
  return isDefaultSettingOverwritten(e, t) ? getConfig(e, t) : n.default;
};
exports.dumpConfig = function (e) {
  return e.get(ConfigProvider).dumpConfig();
};
exports.getLanguageConfig = getLanguageConfig;
exports.getEnabledConfig = function (e, n) {
  return getLanguageConfig(e, exports.ConfigKey.Enable, n);
};
class BuildInfo {
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
function formatNameAndVersion({
  name: e,
  version: t
}) {
  return `${e}/${t}`;
}
exports.BuildInfo = BuildInfo;
exports.isProduction = function (e) {
  return e.get(BuildInfo).isProduction();
};
exports.getBuildType = function (e) {
  return e.get(BuildInfo).getBuildType();
};
exports.getBuild = function (e) {
  return e.get(BuildInfo).getBuild();
};
exports.getVersion = function (e) {
  return e.get(BuildInfo).getVersion();
};
exports.EditorSession = class {
  constructor(e, t) {
    this.sessionId = e;
    this.machineId = t;
  }
};
exports.formatNameAndVersion = formatNameAndVersion;
class EditorAndPluginInfo {}
exports.EditorAndPluginInfo = EditorAndPluginInfo;
exports.editorVersionHeaders = function (e) {
  const t = e.get(EditorAndPluginInfo);
  return {
    "Editor-Version": formatNameAndVersion(t.getEditorInfo()),
    "Editor-Plugin-Version": formatNameAndVersion(t.getEditorPluginInfo())
  };
};