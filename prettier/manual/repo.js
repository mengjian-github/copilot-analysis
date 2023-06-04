Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.ComputationStatus = exports.getRepoUrlFromConfigText = exports.parseRepoUrl = exports.extractRepoInfoForTesting = exports.extractRepoInfoInBackground = exports.tryGetGitHubNWO = exports.getDogFood = exports.getUserKind = exports.isNotRepo = exports.isRepoInfo = void 0;
  const r = require(23055),
    i = require(73458),
    o = require(71017),
    s = require(30362),
    a = require(43076);
  function c(e) {
    if (void 0 !== e && e !== h.PENDING) return "github.com" === e.hostname ? e.owner + "/" + e.repo : void 0;
  }
  exports.isRepoInfo = function (e) {
    return void 0 !== e && e !== h.PENDING;
  }, exports.isNotRepo = function (e) {
    return void 0 === e;
  }, exports.getUserKind = async function (e) {
    const t = (await e.get(s.CopilotTokenManager).getCopilotToken(e, !1)).organization_list ?? [];
    return ["a5db0bcaae94032fe715fb34a5e4bce2", "7184f66dfcee98cb5f08a1cb936d5225", "4535c7beffc844b46bb1ed4aa04d759a"].find(e => t.includes(e)) ?? "";
  }, exports.getDogFood = function (e) {
    if (void 0 === e) return "";
    if (e === h.PENDING) return "";
    const t = c(e);
    if ("github/github" === t) return t;
    const n = function (e) {
      if (void 0 !== e && e !== h.PENDING) return e.hostname.endsWith("azure.com") || e.hostname.endsWith("visualstudio.com") ? e.owner + "/" + e.repo : void 0;
    }(e)?.toLowerCase();
    return void 0 !== n ? n : "";
  }, exports.tryGetGitHubNWO = c, exports.extractRepoInfoInBackground = function (e, t) {
    if (!t) return;
    const n = (0, o.dirname)(t);
    return l(e, n);
  };
  const l = function (e, t) {
    const n = new a.LRUCacheMap(1e4),
      r = new Set();
    return (t, ...i) => {
      const o = JSON.stringify(i),
        s = n.get(o);
      if (s) return s.result;
      if (r.has(o)) return h.PENDING;
      const a = e(t, ...i);
      return r.add(o), a.then(e => {
        n.set(o, new f(e)), r.delete(o);
      }), h.PENDING;
    };
  }(u);
  async function u(e, t) {
    const n = await async function (e, t) {
      let n = t + "_add_to_make_longer";
      const i = e.get(r.FileSystem);
      for (; t.length > 1 && t.length < n.length;) {
        const e = (0, o.join)(t, ".git", "config");
        let r = !1;
        try {
          await i.stat(e), r = !0;
        } catch (e) {
          r = !1;
        }
        if (r) return t;
        n = t, t = (0, o.dirname)(t);
      }
    }(e, t);
    if (!n) return;
    const i = e.get(r.FileSystem),
      s = (0, o.join)(n, ".git", "config"),
      a = d((await i.readFile(s)).toString()) ?? "",
      c = p(a);
    return void 0 === c ? {
      baseFolder: n,
      url: a,
      hostname: "",
      owner: "",
      repo: "",
      pathname: ""
    } : {
      baseFolder: n,
      url: a,
      ...c
    };
  }
  function p(e) {
    let t = {};
    try {
      if (t = i(e), "" == t.host || "" == t.owner || "" == t.name || "" == t.pathname) return;
    } catch (e) {
      return;
    }
    return {
      hostname: t.host,
      owner: t.owner,
      repo: t.name,
      pathname: t.pathname
    };
  }
  function d(e) {
    const t = /^\s*\[\s*remote\s+"((\\\\|\\"|[^\\"])+)"/,
      n = /^\s*\[remote.([^"\s]+)/,
      r = /^\s*url\s*=\s*([^\s#;]+)/,
      i = /^\s*\[/;
    let o,
      s,
      a = !1;
    for (const c of e.split("\n")) if (a && void 0 !== o) {
      if (o += c, c.endsWith("\\")) o = o.substring(0, o.length - 1);else if (a = !1, "origin" === s) return o;
    } else {
      const e = c.match(t) ?? c.match(n);
      if (e) s = e[1];else if (c.match(i)) s = void 0;else {
        if (o && "origin" !== s) continue;
        {
          const e = c.match(r);
          if (e) if (o = e[1], o.endsWith("\\")) o = o.substring(0, o.length - 1), a = !0;else if ("origin" === s) return o;
        }
      }
    }
    return o;
  }
  var h;
  exports.extractRepoInfoForTesting = async function (e, t) {
    return u(e, t);
  }, exports.parseRepoUrl = p, exports.getRepoUrlFromConfigText = d, function (e) {
    e[e.PENDING = 0] = "PENDING";
  }(h = exports.ComputationStatus || (exports.ComputationStatus = {}));
  class f {
    constructor(e) {
      this.result = e;
    }
  }