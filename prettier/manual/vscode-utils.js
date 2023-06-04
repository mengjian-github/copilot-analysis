Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.VSCodeEditorInfo = exports.VSCodeConfigProvider = void 0;
  const r = require(89496),
    i = require(51133),
    o = require(44197),
    s = require(4147);
  function a(e) {
    return "string" == typeof e ? e : JSON.stringify(e);
  }
  class c extends i.ConfigProvider {
    getConfigKeyFromObject(e, t) {
      const n = this.config[e][t];
      return void 0 === n ? (0, i.getConfigDefaultForObjectKey)(e, t) : n;
    }
    constructor() {
      super(), this.config = r.workspace.getConfiguration(o.CopilotConfigPrefix), r.workspace.onDidChangeConfiguration(e => {
        e.affectsConfiguration(o.CopilotConfigPrefix) && (this.config = r.workspace.getConfiguration(o.CopilotConfigPrefix));
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
          "object" == typeof t && null !== t ? Object.keys(t).filter(e => "secret_key" !== e).forEach(r => e[`${n}.${r}`] = a(t[r])) : e[n] = a(t);
        }
      } catch (e) {
        console.error(`Failed to retrieve configuration properties ${e}`);
      }
      return e;
    }
    getLanguageConfig(e, t) {
      const n = this.getConfig(e);
      if (void 0 === t) {
        const e = r.window.activeTextEditor;
        t = e && e.document.languageId;
      }
      return t && t in n ? n[t] : n["*"];
    }
    updateEnabledConfig(e, t, n) {
      const r = e.get(i.ConfigProvider).getConfig(i.ConfigKey.Enable);
      return r[t] = n, this.config.update(i.ConfigKey.Enable, r, !0);
    }
  }
  exports.VSCodeConfigProvider = c;
  class l extends i.EditorAndPluginInfo {
    getEditorInfo() {
      return {
        name: "vscode",
        version: r.version
      };
    }
    getEditorPluginInfo() {
      return {
        name: "copilot",
        version: s.version
      };
    }
  }
  exports.VSCodeEditorInfo = l;