Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.ExpConfigNone = exports.ExpConfigFromTAS = exports.ExpConfigMaker = void 0;
  const r = require(82279),
    i = require(10219);
  class o {}
  exports.ExpConfigMaker = o, exports.ExpConfigFromTAS = class extends o {
    async fetchExperiments(e, t) {
      const n = e.get(r.Fetcher);
      let o;
      try {
        o = await n.fetch("https://default.exp-tas.com/vscode/ab", {
          method: "GET",
          headers: t
        });
      } catch (t) {
        return i.ExpConfig.createFallbackConfig(e, `Error fetching ExP config: ${t}`);
      }
      if (!o.ok) return i.ExpConfig.createFallbackConfig(e, `ExP responded with ${o.status}`);
      const s = await o.json(),
        a = s.Configs.find(e => "vscode" === e.Id) ?? {
          Id: "vscode",
          Parameters: {}
        },
        c = Object.entries(a.Parameters).map(([e, t]) => e + (t ? "" : "cf"));
      return new i.ExpConfig(a.Parameters, s.AssignmentContext, c.join(";"));
    }
  }, exports.ExpConfigNone = class extends o {
    async fetchExperiments(e, t) {
      return i.ExpConfig.createEmptyConfig();
    }
  };