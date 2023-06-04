Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ComputationStatus = exports.getRepoUrlFromConfigText = exports.parseRepoUrl = exports.extractRepoInfoForTesting = exports.extractRepoInfoInBackground = exports.tryGetGitHubNWO = exports.getDogFood = exports.getUserKind = exports.isNotRepo = exports.isRepoInfo = void 0;
const r = require(23055);
const i = require(73458);
const o = require(71017);
const s = require(30362);
const a = require(43076);
function tryGetGitHubNWO(e) {
  if (void 0 !== e && e !== h.PENDING) return "github.com" === e.hostname ? e.owner + "/" + e.repo : void 0;
}
exports.isRepoInfo = function (e) {
  return void 0 !== e && e !== h.PENDING;
};
exports.isNotRepo = function (e) {
  return void 0 === e;
};
exports.getUserKind = async function (e) {
  const t = (await e.get(s.CopilotTokenManager).getCopilotToken(e, !1)).organization_list ?? [];
  return ["a5db0bcaae94032fe715fb34a5e4bce2", "7184f66dfcee98cb5f08a1cb936d5225", "4535c7beffc844b46bb1ed4aa04d759a"].find(e => t.includes(e)) ?? "";
};
exports.getDogFood = function (e) {
  if (void 0 === e) return "";
  if (e === h.PENDING) return "";
  const t = tryGetGitHubNWO(e);
  if ("github/github" === t) return t;
  const n = function (e) {
    if (void 0 !== e && e !== h.PENDING) return e.hostname.endsWith("azure.com") || e.hostname.endsWith("visualstudio.com") ? e.owner + "/" + e.repo : void 0;
  }(e)?.toLowerCase();
  return void 0 !== n ? n : "";
};
exports.tryGetGitHubNWO = tryGetGitHubNWO;
exports.extractRepoInfoInBackground = function (e, t) {
  if (!t) return;
  const n = o.dirname(t);
  return l(e, n);
};
const l = function (e, t) {
  const n = new a.LRUCacheMap(1e4);
  const r = new Set();
  return (t, ...i) => {
    const o = JSON.stringify(i);
    const s = n.get(o);
    if (s) return s.result;
    if (r.has(o)) return h.PENDING;
    const a = e(t, ...i);
    r.add(o);
    a.then(e => {
      n.set(o, new f(e));
      r.delete(o);
    });
    return h.PENDING;
  };
}(u);
async function u(e, t) {
  const n = await async function (e, t) {
    let n = t + "_add_to_make_longer";
    const i = e.get(r.FileSystem);
    for (; t.length > 1 && t.length < n.length;) {
      const e = o.join(t, ".git", "config");
      let r = !1;
      try {
        await i.stat(e);
        r = !0;
      } catch (e) {
        r = !1;
      }
      if (r) return t;
      n = t;
      t = o.dirname(t);
    }
  }(e, t);
  if (!n) return;
  const i = e.get(r.FileSystem);
  const s = o.join(n, ".git", "config");
  const a = getRepoUrlFromConfigText((await i.readFile(s)).toString()) ?? "";
  const c = parseRepoUrl(a);
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
function parseRepoUrl(e) {
  let t = {};
  try {
    t = i(e);
    if ("" == t.host || "" == t.owner || "" == t.name || "" == t.pathname) return;
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
function getRepoUrlFromConfigText(e) {
  const t = /^\s*\[\s*remote\s+"((\\\\|\\"|[^\\"])+)"/;
  const n = /^\s*\[remote.([^"\s]+)/;
  const r = /^\s*url\s*=\s*([^\s#;]+)/;
  const i = /^\s*\[/;
  let o;
  let s;
  let a = !1;
  for (const c of e.split("\n")) if (a && void 0 !== o) {
    o += c;
    if (c.endsWith("\\")) o = o.substring(0, o.length - 1);else if (a = !1, "origin" === s) return o;
  } else {
    const e = c.match(t) ?? c.match(n);
    if (e) s = e[1];else if (c.match(i)) s = void 0;else {
      if (o && "origin" !== s) continue;
      {
        const e = c.match(r);
        if (e) {
          o = e[1];
          if (o.endsWith("\\")) {
            o = o.substring(0, o.length - 1);
            a = !0;
          } else if ("origin" === s) return o;
        }
      }
    }
  }
  return o;
}
var h;
exports.extractRepoInfoForTesting = async function (e, t) {
  return u(e, t);
};
exports.parseRepoUrl = parseRepoUrl;
exports.getRepoUrlFromConfigText = getRepoUrlFromConfigText;
(function (e) {
  e[e.PENDING = 0] = "PENDING";
})(h = exports.ComputationStatus || (exports.ComputationStatus = {}));
class f {
  constructor(e) {
    this.result = e;
  }
}