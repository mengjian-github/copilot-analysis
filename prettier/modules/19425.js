Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.VSCodeEditorInfo = exports.VSCodeConfigProvider = void 0;
const vscode = require("vscode");
const config = require("./config");
const o = require(44197);
const s = require(4147);
function a(e) {
  return "string" == typeof e ? e : JSON.stringify(e);
}
class VSCodeConfigProvider extends config.ConfigProvider {
  getConfigKeyFromObject(e, t) {
    const n = this.config[e][t];
    return void 0 === n ? config.getConfigDefaultForObjectKey(e, t) : n;
  }
  constructor() {
    super();
    this.config = vscode.workspace.getConfiguration(o.CopilotConfigPrefix);
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration(o.CopilotConfigPrefix)) {
        this.config = vscode.workspace.getConfiguration(o.CopilotConfigPrefix);
      }
    });
  }
  getConfig(e) {
    if (Array.isArray(e)) return this.getConfigKeyFromObject(e[0], e[1]);
    const t = this.config.get(e);
    if (void 0 === t) throw new Error(`Missing config default value: ${o.CopilotConfigPrefix}.${e}`);
    return t;
  }
  isDefaultSettingOverwritten(e) {
    if (Array.isArray(e)) return void 0 !== this.config[e[0]][e[1]];
    const t = this.config.inspect(e);
    return !!t && !!(t.globalValue || t.workspaceValue || t.workspaceFolderValue || t.defaultLanguageValue || t.globalLanguageValue || t.workspaceLanguageValue || t.workspaceFolderLanguageValue);
  }
  dumpConfig() {
    const e = {};
    try {
      const t = s.contributes.configuration[0].properties;
      for (const n in t) {
        const t = n.replace(`${o.CopilotConfigPrefix}.`, "").split(".").reduce((e, t) => e[t], this.config);
        if ("object" == typeof t && null !== t) {
          Object.keys(t).filter(e => "secret_key" !== e).forEach(r => e[`${n}.${r}`] = a(t[r]));
        } else {
          e[n] = a(t);
        }
      }
    } catch (e) {
      console.error(`Failed to retrieve configuration properties ${e}`);
    }
    return e;
  }
  getLanguageConfig(e, t) {
    const n = this.getConfig(e);
    if (void 0 === t) {
      const e = vscode.window.activeTextEditor;
      t = e && e.document.languageId;
    }
    return t && t in n ? n[t] : n["*"];
  }
  updateEnabledConfig(e, t, n) {
    const r = e.get(config.ConfigProvider).getConfig(config.ConfigKey.Enable);
    r[t] = n;
    return this.config.update(config.ConfigKey.Enable, r, !0);
  }
}
exports.VSCodeConfigProvider = VSCodeConfigProvider;
class VSCodeEditorInfo extends config.EditorAndPluginInfo {
  getEditorInfo() {
    return {
      name: "vscode",
      version: vscode.version
    };
  }
  getEditorPluginInfo() {
    return {
      name: "copilot",
      version: s.version
    };
  }
}
exports.VSCodeEditorInfo = VSCodeEditorInfo;