require.r(exports);
require.d(exports, {
  RestError: () => Ve,
  bearerTokenAuthenticationPolicy: () => It,
  bearerTokenAuthenticationPolicyName: () => xt,
  createDefaultHttpClient: () => st,
  createEmptyPipeline: () => o,
  createHttpHeaders: () => Je,
  createPipelineFromOptions: () => Ke,
  createPipelineRequest: () => yt,
  decompressResponsePolicy: () => Z,
  decompressResponsePolicyName: () => Q,
  defaultRetryPolicy: () => de,
  exponentialRetryPolicy: () => vt,
  exponentialRetryPolicyName: () => _t,
  formDataPolicy: () => ge,
  formDataPolicyName: () => me,
  getDefaultProxySettings: () => Ce,
  isRestError: () => He,
  logPolicy: () => j,
  logPolicyName: () => F,
  ndJsonPolicy: () => kt,
  ndJsonPolicyName: () => At,
  proxyPolicy: () => Ae,
  proxyPolicyName: () => Ee,
  redirectPolicy: () => V,
  redirectPolicyName: () => U,
  retryPolicy: () => pe,
  setClientRequestIdPolicy: () => Pe,
  setClientRequestIdPolicyName: () => ke,
  systemErrorRetryPolicy: () => Et,
  systemErrorRetryPolicyName: () => bt,
  throttlingRetryPolicy: () => Tt,
  throttlingRetryPolicyName: () => wt,
  tlsPolicy: () => Oe,
  tlsPolicyName: () => Ne,
  tracingPolicy: () => ze,
  tracingPolicyName: () => qe,
  userAgentPolicy: () => W,
  userAgentPolicyName: () => G
});
const r = new Set(["Deserialize", "Serialize", "Retry", "Sign"]);
class i {
  constructor(e) {
    var t;
    this._policies = [];
    this._policies = null !== (t = null == e ? void 0 : e.slice(0)) && void 0 !== t ? t : [];
    this._orderedPolicies = void 0;
  }
  addPolicy(e, t = {}) {
    if (t.phase && t.afterPhase) throw new Error("Policies inside a phase cannot specify afterPhase.");
    if (t.phase && !r.has(t.phase)) throw new Error(`Invalid phase name: ${t.phase}`);
    if (t.afterPhase && !r.has(t.afterPhase)) throw new Error(`Invalid afterPhase name: ${t.afterPhase}`);
    this._policies.push({
      policy: e,
      options: t
    });
    this._orderedPolicies = void 0;
  }
  removePolicy(e) {
    const t = [];
    this._policies = this._policies.filter(n => !(e.name && n.policy.name === e.name || e.phase && n.options.phase === e.phase) || (t.push(n.policy), !1));
    this._orderedPolicies = void 0;
    return t;
  }
  sendRequest(e, t) {
    return this.getOrderedPolicies().reduceRight((e, t) => n => t.sendRequest(n, e), t => e.sendRequest(t))(t);
  }
  getOrderedPolicies() {
    if (this._orderedPolicies) {
      this._orderedPolicies = this.orderPolicies();
    }
    return this._orderedPolicies;
  }
  clone() {
    return new i(this._policies);
  }
  static create() {
    return new i();
  }
  orderPolicies() {
    const e = [];
    const t = new Map();
    function n(e) {
      return {
        name: e,
        policies: new Set(),
        hasRun: !1,
        hasAfterPolicies: !1
      };
    }
    const r = n("Serialize");
    const i = n("None");
    const o = n("Deserialize");
    const s = n("Retry");
    const a = n("Sign");
    const c = [r, i, o, s, a];
    function l(e) {
      return "Retry" === e ? s : "Serialize" === e ? r : "Deserialize" === e ? o : "Sign" === e ? a : i;
    }
    for (const e of this._policies) {
      const n = e.policy;
      const r = e.options;
      const i = n.name;
      if (t.has(i)) throw new Error("Duplicate policy names not allowed in pipeline");
      const o = {
        policy: n,
        dependsOn: new Set(),
        dependants: new Set()
      };
      if (r.afterPhase) {
        o.afterPhase = l(r.afterPhase);
        o.afterPhase.hasAfterPolicies = !0;
      }
      t.set(i, o);
      l(r.phase).policies.add(o);
    }
    for (const e of this._policies) {
      const {
        policy: n,
        options: r
      } = e;
      const i = n.name;
      const o = t.get(i);
      if (!o) throw new Error(`Missing node for policy ${i}`);
      if (r.afterPolicies) for (const e of r.afterPolicies) {
        const n = t.get(e);
        if (n) {
          o.dependsOn.add(n);
          n.dependants.add(o);
        }
      }
      if (r.beforePolicies) for (const e of r.beforePolicies) {
        const n = t.get(e);
        if (n) {
          n.dependsOn.add(o);
          o.dependants.add(n);
        }
      }
    }
    function u(n) {
      n.hasRun = !0;
      for (const r of n.policies) if ((!r.afterPhase || r.afterPhase.hasRun && !r.afterPhase.policies.size) && 0 === r.dependsOn.size) {
        e.push(r.policy);
        for (const e of r.dependants) e.dependsOn.delete(r);
        t.delete(r.policy.name);
        n.policies.delete(r);
      }
    }
    function p() {
      for (const e of c) {
        u(e);
        if (e.policies.size > 0 && e !== i) return void (i.hasRun || u(i));
        if (e.hasAfterPolicies) {
          u(i);
        }
      }
    }
    let d = 0;
    for (; t.size > 0;) {
      d++;
      const t = e.length;
      p();
      if (e.length <= t && d > 1) throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
    }
    return e;
  }
}
function o() {
  return i.create();
}
var s = require(73837);
var a = require.n(s);
var c = require(22037);
const l = "undefined" != typeof process && process.env && process.env.DEBUG || void 0;
let u;
let p = [];
let d = [];
const h = [];
if (l) {
  m(l);
}
const f = Object.assign(e => y(e), {
  enable: m,
  enabled: g,
  disable: function () {
    const e = u || "";
    m("");
    return e;
  },
  log: function (e, ...t) {
    process.stderr.write(`${a().format(e, ...t)}${c.EOL}`);
  }
});
function m(e) {
  u = e;
  p = [];
  d = [];
  const t = /\*/g;
  const n = e.split(",").map(e => e.trim().replace(t, ".*?"));
  for (const e of n) if (e.startsWith("-")) {
    d.push(new RegExp(`^${e.substr(1)}$`));
  } else {
    p.push(new RegExp(`^${e}$`));
  }
  for (const e of h) e.enabled = g(e.namespace);
}
function g(e) {
  if (e.endsWith("*")) return !0;
  for (const t of d) if (t.test(e)) return !1;
  for (const t of p) if (t.test(e)) return !0;
  return !1;
}
function y(e) {
  const t = Object.assign(function (...n) {
    if (t.enabled) {
      if (n.length > 0) {
        n[0] = `${e} ${n[0]}`;
      }
      t.log(...n);
    }
  }, {
    enabled: g(e),
    destroy: _,
    log: f.log,
    namespace: e,
    extend: v
  });
  h.push(t);
  return t;
}
function _() {
  const e = h.indexOf(this);
  return e >= 0 && (h.splice(e, 1), !0);
}
function v(e) {
  const t = y(`${this.namespace}:${e}`);
  t.log = this.log;
  return t;
}
const b = f;
const E = new Set();
const w = "undefined" != typeof process && process.env && process.env.AZURE_LOG_LEVEL || void 0;
let T;
const S = b("azure");
S.log = (...e) => {
  b.log(...e);
};
const x = ["verbose", "info", "warning", "error"];
if (w) {
  if (N(w)) {
    (function (e) {
      if (e && !N(e)) throw new Error(`Unknown log level '${e}'. Acceptable values: ${x.join(",")}`);
      T = e;
      const t = [];
      for (const e of E) if (P(e)) {
        t.push(e.namespace);
      }
      b.enable(t.join(","));
    })(w);
  } else {
    console.error(`AZURE_LOG_LEVEL set to unknown log level '${w}'; logging is not enabled. Acceptable values: ${x.join(", ")}.`);
  }
}
const C = {
  verbose: 400,
  info: 300,
  warning: 200,
  error: 100
};
function I(e) {
  const t = S.extend(e);
  A(S, t);
  return {
    error: k(t, "error"),
    warning: k(t, "warning"),
    info: k(t, "info"),
    verbose: k(t, "verbose")
  };
}
function A(e, t) {
  t.log = (...t) => {
    e.log(...t);
  };
}
function k(e, t) {
  const n = Object.assign(e.extend(t), {
    level: t
  });
  A(e, n);
  if (P(n)) {
    const e = b.disable();
    b.enable(e + "," + n.namespace);
  }
  E.add(n);
  return n;
}
function P(e) {
  return !!(T && C[e.level] <= C[T]);
}
function N(e) {
  return x.includes(e);
}
const O = I("core-rest-pipeline");
function R(e) {
  return !("object" != typeof e || null === e || Array.isArray(e) || e instanceof RegExp || e instanceof Date);
}
const M = "REDACTED";
const L = ["x-ms-client-request-id", "x-ms-return-client-request-id", "x-ms-useragent", "x-ms-correlation-request-id", "x-ms-request-id", "client-request-id", "ms-cv", "return-client-request-id", "traceparent", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Origin", "Accept", "Accept-Encoding", "Cache-Control", "Connection", "Content-Length", "Content-Type", "Date", "ETag", "Expires", "If-Match", "If-Modified-Since", "If-None-Match", "If-Unmodified-Since", "Last-Modified", "Pragma", "Request-Id", "Retry-After", "Server", "Transfer-Encoding", "User-Agent", "WWW-Authenticate"];
const D = ["api-version"];
class B {
  constructor({
    additionalAllowedHeaderNames: e = [],
    additionalAllowedQueryParameters: t = []
  } = {}) {
    e = L.concat(e);
    t = D.concat(t);
    this.allowedHeaderNames = new Set(e.map(e => e.toLowerCase()));
    this.allowedQueryParameters = new Set(t.map(e => e.toLowerCase()));
  }
  sanitize(e) {
    const t = new Set();
    return JSON.stringify(e, (e, n) => {
      if (n instanceof Error) return Object.assign(Object.assign({}, n), {
        name: n.name,
        message: n.message
      });
      if ("headers" === e) return this.sanitizeHeaders(n);
      if ("url" === e) return this.sanitizeUrl(n);
      if ("query" === e) return this.sanitizeQuery(n);
      if ("body" !== e && "response" !== e && "operationSpec" !== e) {
        if (Array.isArray(n) || R(n)) {
          if (t.has(n)) return "[Circular]";
          t.add(n);
        }
        return n;
      }
    }, 2);
  }
  sanitizeHeaders(e) {
    const t = {};
    for (const n of Object.keys(e)) if (this.allowedHeaderNames.has(n.toLowerCase())) {
      t[n] = e[n];
    } else {
      t[n] = M;
    }
    return t;
  }
  sanitizeQuery(e) {
    if ("object" != typeof e || null === e) return e;
    const t = {};
    for (const n of Object.keys(e)) if (this.allowedQueryParameters.has(n.toLowerCase())) {
      t[n] = e[n];
    } else {
      t[n] = M;
    }
    return t;
  }
  sanitizeUrl(e) {
    if ("string" != typeof e || null === e) return e;
    const t = new URL(e);
    if (!t.search) return e;
    for (const [e] of t.searchParams) if (this.allowedQueryParameters.has(e.toLowerCase())) {
      t.searchParams.set(e, M);
    }
    return t.toString();
  }
}
const F = "logPolicy";
function j(e = {}) {
  var t;
  const n = null !== (t = e.logger) && void 0 !== t ? t : O.info;
  const r = new B({
    additionalAllowedHeaderNames: e.additionalAllowedHeaderNames,
    additionalAllowedQueryParameters: e.additionalAllowedQueryParameters
  });
  return {
    name: F,
    async sendRequest(e, t) {
      if (!n.enabled) return t(e);
      n(`Request: ${r.sanitize(e)}`);
      const i = await t(e);
      n(`Response status code: ${i.status}`);
      n(`Headers: ${r.sanitize(i.headers)}`);
      return i;
    }
  };
}
const U = "redirectPolicy";
const $ = ["GET", "HEAD"];
function V(e = {}) {
  const {
    maxRetries: t = 20
  } = e;
  return {
    name: U,
    async sendRequest(e, n) {
      const r = await n(e);
      return H(n, r, t);
    }
  };
}
async function H(e, t, n, r = 0) {
  const {
    request: i,
    status: o,
    headers: s
  } = t;
  const a = s.get("location");
  if (a && (300 === o || 301 === o && $.includes(i.method) || 302 === o && $.includes(i.method) || 303 === o && "POST" === i.method || 307 === o) && r < n) {
    const t = new URL(a, i.url);
    i.url = t.toString();
    if (303 === o) {
      i.method = "GET";
      i.headers.delete("Content-Length");
      delete i.body;
    }
    i.headers.delete("Authorization");
    const s = await e(i);
    return H(e, s, n, r + 1);
  }
  return t;
}
const q = "1.10.1";
function z(e) {
  const t = new Map();
  var n;
  t.set("core-rest-pipeline", q);
  (n = t).set("Node", process.version);
  n.set("OS", `(${c.arch()}-${c.type()}-${c.release()})`);
  const r = function (e) {
    const t = [];
    for (const [n, r] of e) {
      const e = r ? `${n}/${r}` : n;
      t.push(e);
    }
    return t.join(" ");
  }(t);
  return e ? `${e} ${r}` : r;
}
const K = "User-Agent";
const G = "userAgentPolicy";
function W(e = {}) {
  const t = z(e.userAgentPrefix);
  return {
    name: G,
    sendRequest: async (e, n) => (e.headers.has(K) || e.headers.set(K, t), n(e))
  };
}
const Q = "decompressResponsePolicy";
function Z() {
  return {
    name: Q,
    sendRequest: async (e, t) => ("HEAD" !== e.method && e.headers.set("Accept-Encoding", "gzip,deflate"), t(e))
  };
}
const X = new WeakMap();
const Y = new WeakMap();
class J {
  constructor() {
    this.onabort = null;
    X.set(this, []);
    Y.set(this, !1);
  }
  get aborted() {
    if (!Y.has(this)) throw new TypeError("Expected `this` to be an instance of AbortSignal.");
    return Y.get(this);
  }
  static get none() {
    return new J();
  }
  addEventListener(e, t) {
    if (!X.has(this)) throw new TypeError("Expected `this` to be an instance of AbortSignal.");
    X.get(this).push(t);
  }
  removeEventListener(e, t) {
    if (!X.has(this)) throw new TypeError("Expected `this` to be an instance of AbortSignal.");
    const n = X.get(this);
    const r = n.indexOf(t);
    if (r > -1) {
      n.splice(r, 1);
    }
  }
  dispatchEvent(e) {
    throw new Error("This is a stub dispatchEvent implementation that should not be used.  It only exists for type-checking purposes.");
  }
}
function ee(e) {
  if (e.aborted) return;
  if (e.onabort) {
    e.onabort.call(e);
  }
  const t = X.get(e);
  if (t) {
    t.slice().forEach(t => {
      t.call(e, {
        type: "abort"
      });
    });
  }
  Y.set(e, !0);
}
class te extends Error {
  constructor(e) {
    super(e);
    this.name = "AbortError";
  }
}
class ne {
  constructor(e) {
    this._signal = new J();
    if (e) {
      Array.isArray(e) || (e = arguments);
      for (const t of e) t.aborted ? this.abort() : t.addEventListener("abort", () => {
        this.abort();
      });
    }
  }
  get signal() {
    return this._signal;
  }
  abort() {
    ee(this._signal);
  }
  static timeout(e) {
    const t = new J();
    const n = setTimeout(ee, e, t);
    if ("function" == typeof n.unref) {
      n.unref();
    }
    return t;
  }
}
function re(e, t, n) {
  return new Promise((r, i) => {
    let o;
    let s;
    const a = () => i(new te((null == n ? void 0 : n.abortErrorMsg) ? null == n ? void 0 : n.abortErrorMsg : "The operation was aborted."));
    const c = () => {
      if ((null == n ? void 0 : n.abortSignal) && s) {
        n.abortSignal.removeEventListener("abort", s);
      }
    };
    s = () => (o && clearTimeout(o), c(), a());
    if ((null == n ? void 0 : n.abortSignal) && n.abortSignal.aborted) return a();
    o = setTimeout(() => {
      c();
      r(t);
    }, e);
    if (null == n ? void 0 : n.abortSignal) {
      n.abortSignal.addEventListener("abort", s);
    }
  });
}
function ie(e, t) {
  const n = e.headers.get(t);
  if (!n) return;
  const r = Number(n);
  return Number.isNaN(r) ? void 0 : r;
}
const oe = "Retry-After";
const se = ["retry-after-ms", "x-ms-retry-after-ms", oe];
function ae(e) {
  if (e && [429, 503].includes(e.status)) try {
    for (const t of se) {
      const n = ie(e, t);
      if (0 === n || n) return n * (t === oe ? 1e3 : 1);
    }
    const t = e.headers.get(oe);
    if (!t) return;
    const n = Date.parse(t) - Date.now();
    return Number.isFinite(n) ? Math.max(0, n) : void 0;
  } catch (e) {
    return;
  }
}
function ce() {
  return {
    name: "throttlingRetryStrategy",
    retry({
      response: e
    }) {
      const t = ae(e);
      return Number.isFinite(t) ? {
        retryAfterInMs: t
      } : {
        skipStrategy: !0
      };
    }
  };
}
function le(e = {}) {
  var t;
  var n;
  const r = null !== (t = e.retryDelayInMs) && void 0 !== t ? t : 1e3;
  const i = null !== (n = e.maxRetryDelayInMs) && void 0 !== n ? n : 64e3;
  let o = r;
  return {
    name: "exponentialRetryStrategy",
    retry({
      retryCount: t,
      response: n,
      responseError: r
    }) {
      const s = !!(p = r) && ("ETIMEDOUT" === p.code || "ESOCKETTIMEDOUT" === p.code || "ECONNREFUSED" === p.code || "ECONNRESET" === p.code || "ENOENT" === p.code);
      const a = s && e.ignoreSystemErrors;
      const c = function (e) {
        return Boolean(e && void 0 !== e.status && (e.status >= 500 || 408 === e.status) && 501 !== e.status && 505 !== e.status);
      }(n);
      const l = c && e.ignoreHttpStatusCodes;
      const u = n && (function (e) {
        return Number.isFinite(ae(e));
      }(n) || !c);
      var p;
      if (u || l || a) return {
        skipStrategy: !0
      };
      if (r && !s && !c) return {
        errorToThrow: r
      };
      const d = o * Math.pow(2, t);
      const h = Math.min(i, d);
      var f;
      var m;
      o = h / 2 + (f = 0, m = h / 2, f = Math.ceil(f), m = Math.floor(m), Math.floor(Math.random() * (m - f + 1)) + f);
      return {
        retryAfterInMs: o
      };
    }
  };
}
const ue = I("core-rest-pipeline retryPolicy");
function pe(e, t = {
  maxRetries: 3
}) {
  const n = t.logger || ue;
  return {
    name: "retryPolicy",
    async sendRequest(r, i) {
      var o;
      var s;
      let a;
      let c;
      let l = -1;
      e: for (;;) {
        l += 1;
        a = void 0;
        c = void 0;
        try {
          n.info(`Retry ${l}: Attempting to send request`, r.requestId);
          a = await i(r);
          n.info(`Retry ${l}: Received a response from request`, r.requestId);
        } catch (e) {
          n.error(`Retry ${l}: Received an error from request`, r.requestId);
          c = e;
          if (!e || "RestError" !== c.name) throw e;
          a = c.response;
        }
        if (null === (o = r.abortSignal) || void 0 === o ? void 0 : o.aborted) throw n.error(`Retry ${l}: Request aborted.`), new te();
        if (l >= (null !== (s = t.maxRetries) && void 0 !== s ? s : 3)) {
          n.info(`Retry ${l}: Maximum retries reached. Returning the last received response, or throwing the last received error.`);
          if (c) throw c;
          if (a) return a;
          throw new Error("Maximum retries reached with no response or error to throw");
        }
        n.info(`Retry ${l}: Processing ${e.length} retry strategies.`);
        t: for (const t of e) {
          const e = t.logger || ue;
          e.info(`Retry ${l}: Processing retry strategy ${t.name}.`);
          const n = t.retry({
            retryCount: l,
            response: a,
            responseError: c
          });
          if (n.skipStrategy) {
            e.info(`Retry ${l}: Skipped.`);
            continue t;
          }
          const {
            errorToThrow: i,
            retryAfterInMs: o,
            redirectTo: s
          } = n;
          if (i) throw e.error(`Retry ${l}: Retry strategy ${t.name} throws error:`, i), i;
          if (o || 0 === o) {
            e.info(`Retry ${l}: Retry strategy ${t.name} retries after ${o}`);
            await re(o, void 0, {
              abortSignal: r.abortSignal
            });
            continue e;
          }
          if (s) {
            e.info(`Retry ${l}: Retry strategy ${t.name} redirects to ${s}`);
            r.url = s;
            continue e;
          }
        }
        if (c) throw n.info("None of the retry strategies could work with the received error. Throwing it."), c;
        if (a) {
          n.info("None of the retry strategies could work with the received response. Returning it.");
          return a;
        }
      }
    }
  };
}
function de(e = {}) {
  var t;
  return {
    name: "defaultRetryPolicy",
    sendRequest: pe([ce(), le(e)], {
      maxRetries: null !== (t = e.maxRetries) && void 0 !== t ? t : 3
    }).sendRequest
  };
}
var he = require(46882);
var fe = require.n(he);
const me = "formDataPolicy";
function ge() {
  return {
    name: me,
    async sendRequest(e, t) {
      if (e.formData) {
        const t = e.headers.get("Content-Type");
        if (t && -1 !== t.indexOf("application/x-www-form-urlencoded")) {
          e.body = function (e) {
            const t = new URLSearchParams();
            for (const [n, r] of Object.entries(e)) if (Array.isArray(r)) for (const e of r) t.append(n, e.toString());else t.append(n, r.toString());
            return t.toString();
          }(e.formData);
          e.formData = void 0;
        } else {
          await async function (e, t) {
            const n = new (fe())();
            for (const t of Object.keys(e)) {
              const r = e[t];
              if (Array.isArray(r)) for (const e of r) n.append(t, e);else n.append(t, r);
            }
            t.body = n;
            t.formData = void 0;
            const r = t.headers.get("Content-Type");
            if (r && -1 !== r.indexOf("multipart/form-data")) {
              t.headers.set("Content-Type", `multipart/form-data; boundary=${n.getBoundary()}`);
            }
            try {
              const e = await new Promise((e, t) => {
                n.getLength((n, r) => {
                  if (n) {
                    t(n);
                  } else {
                    e(r);
                  }
                });
              });
              t.headers.set("Content-Length", e);
            } catch (e) {}
          }(e.formData, e);
        }
      }
      return t(e);
    }
  };
}
var ye;
const _e = "undefined" != typeof process && Boolean(process.version) && Boolean(null === (ye = process.versions) || void 0 === ye ? void 0 : ye.node);
var ve = require(26018);
var be = require(74476);
const Ee = "proxyPolicy";
const we = [];
let Te = !1;
const Se = new Map();
function xe(e) {
  return process.env[e] ? process.env[e] : process.env[e.toLowerCase()] ? process.env[e.toLowerCase()] : void 0;
}
function Ce(e) {
  if (!e && !(e = function () {
    if (!process) return;
    const e = xe("HTTPS_PROXY");
    const t = xe("ALL_PROXY");
    const n = xe("HTTP_PROXY");
    return e || t || n;
  }())) return;
  const t = new URL(e);
  return {
    host: (t.protocol ? t.protocol + "//" : "") + t.hostname,
    port: Number.parseInt(t.port || "80"),
    username: t.username,
    password: t.password
  };
}
function Ie(e, {
  headers: t,
  tlsSettings: n
}) {
  let r;
  try {
    r = new URL(e.host);
  } catch (t) {
    throw new Error(`Expecting a valid host string in proxy settings, but found "${e.host}".`);
  }
  if (n) {
    O.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
  }
  const i = {
    hostname: r.hostname,
    port: e.port,
    protocol: r.protocol,
    headers: t.toJSON()
  };
  if (e.username && e.password) {
    i.auth = `${e.username}:${e.password}`;
  } else {
    if (e.username) {
      i.auth = `${e.username}`;
    }
  }
  return i;
}
function Ae(e = Ce(), t) {
  if (Te) {
    we.push(...function () {
      const e = xe("NO_PROXY");
      Te = !0;
      return e ? e.split(",").map(e => e.trim()).filter(e => e.length) : [];
    }());
  }
  const n = {};
  return {
    name: Ee,
    async sendRequest(r, i) {
      var o;
      if (r.proxySettings || function (e, t, n) {
        if (0 === t.length) return !1;
        const r = new URL(e).hostname;
        if (null == n ? void 0 : n.has(r)) return n.get(r);
        let i = !1;
        for (const e of t) if ("." === e[0]) {
          if (r.endsWith(e) || r.length === e.length - 1 && r === e.slice(1)) {
            i = !0;
          }
        } else {
          if (r === e) {
            i = !0;
          }
        }
        if (null == n) {
          n.set(r, i);
        }
        return i;
      }(r.url, null !== (o = null == t ? void 0 : t.customNoProxyList) && void 0 !== o ? o : we, (null == t ? void 0 : t.customNoProxyList) ? void 0 : Se)) {
        r.proxySettings = e;
      }
      if (r.proxySettings) {
        (function (e, t) {
          if (e.agent) return;
          const n = "https:" !== new URL(e.url).protocol;
          const r = e.proxySettings;
          if (r) if (n) {
            if (!t.httpProxyAgent) {
              const n = Ie(r, e);
              t.httpProxyAgent = new be.HttpProxyAgent(n);
            }
            e.agent = t.httpProxyAgent;
          } else {
            if (!t.httpsProxyAgent) {
              const n = Ie(r, e);
              t.httpsProxyAgent = new ve.HttpsProxyAgent(n);
            }
            e.agent = t.httpsProxyAgent;
          }
        })(r, n);
      }
      return i(r);
    }
  };
}
const ke = "setClientRequestIdPolicy";
function Pe(e = "x-ms-client-request-id") {
  return {
    name: ke,
    sendRequest: async (t, n) => (t.headers.has(e) || t.headers.set(e, t.requestId), n(t))
  };
}
const Ne = "tlsPolicy";
function Oe(e) {
  return {
    name: Ne,
    sendRequest: async (t, n) => (t.tlsSettings || (t.tlsSettings = e), n(t))
  };
}
const Re = {
  span: Symbol.for("@azure/core-tracing span"),
  namespace: Symbol.for("@azure/core-tracing namespace")
};
function Me(e = {}) {
  let t = new Le(e.parentContext);
  if (e.span) {
    t = t.setValue(Re.span, e.span);
  }
  if (e.namespace) {
    t = t.setValue(Re.namespace, e.namespace);
  }
  return t;
}
class Le {
  constructor(e) {
    this._contextMap = e instanceof Le ? new Map(e._contextMap) : new Map();
  }
  setValue(e, t) {
    const n = new Le(this);
    n._contextMap.set(e, t);
    return n;
  }
  getValue(e) {
    return this._contextMap.get(e);
  }
  deleteValue(e) {
    const t = new Le(this);
    t._contextMap.delete(e);
    return t;
  }
}
let De;
function Be() {
  if (De) {
    De = {
      createRequestHeaders: () => ({}),
      parseTraceparentHeader: () => {},
      startSpan: (e, t) => ({
        span: {
          end: () => {},
          isRecording: () => !1,
          recordException: () => {},
          setAttribute: () => {},
          setStatus: () => {}
        },
        tracingContext: Me({
          parentContext: t.tracingContext
        })
      }),
      withContext: (e, t, ...n) => t(...n)
    };
  }
  return De;
}
function Fe(e) {
  if (R(e)) {
    const t = "string" == typeof e.name;
    const n = "string" == typeof e.message;
    return t && n;
  }
  return !1;
}
function je(e) {
  if (Fe(e)) return e.message;
  {
    let t;
    try {
      t = "object" == typeof e && e ? JSON.stringify(e) : String(e);
    } catch (e) {
      t = "[unable to stringify input]";
    }
    return `Unknown error ${t}`;
  }
}
const Ue = s.inspect.custom;
const $e = new B();
class Ve extends Error {
  constructor(e, t = {}) {
    super(e);
    this.name = "RestError";
    this.code = t.code;
    this.statusCode = t.statusCode;
    this.request = t.request;
    this.response = t.response;
    Object.setPrototypeOf(this, Ve.prototype);
  }
  [Ue]() {
    return `RestError: ${this.message} \n ${$e.sanitize(this)}`;
  }
}
function He(e) {
  return e instanceof Ve || Fe(e) && "RestError" === e.name;
}
Ve.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
Ve.PARSE_ERROR = "PARSE_ERROR";
const qe = "tracingPolicy";
function ze(e = {}) {
  const t = z(e.userAgentPrefix);
  const n = function () {
    try {
      return function (e) {
        const {
          namespace: t,
          packageName: n,
          packageVersion: r
        } = e;
        function i(e, i, o) {
          var s;
          const a = Be().startSpan(e, Object.assign(Object.assign({}, o), {
            packageName: n,
            packageVersion: r,
            tracingContext: null === (s = null == i ? void 0 : i.tracingOptions) || void 0 === s ? void 0 : s.tracingContext
          }));
          let c = a.tracingContext;
          const l = a.span;
          if (c.getValue(Re.namespace)) {
            c = c.setValue(Re.namespace, t);
          }
          l.setAttribute("az.namespace", c.getValue(Re.namespace));
          return {
            span: l,
            updatedOptions: Object.assign({}, i, {
              tracingOptions: Object.assign(Object.assign({}, null == i ? void 0 : i.tracingOptions), {
                tracingContext: c
              })
            })
          };
        }
        function o(e, t, ...n) {
          return Be().withContext(e, t, ...n);
        }
        return {
          startSpan: i,
          withSpan: async function (e, t, n, r) {
            const {
              span: s,
              updatedOptions: a
            } = i(e, t, r);
            try {
              const e = await o(a.tracingOptions.tracingContext, () => Promise.resolve(n(a, s)));
              s.setStatus({
                status: "success"
              });
              return e;
            } catch (e) {
              throw s.setStatus({
                status: "error",
                error: e
              }), e;
            } finally {
              s.end();
            }
          },
          withContext: o,
          parseTraceparentHeader: function (e) {
            return Be().parseTraceparentHeader(e);
          },
          createRequestHeaders: function (e) {
            return Be().createRequestHeaders(e);
          }
        };
      }({
        namespace: "",
        packageName: "@azure/core-rest-pipeline",
        packageVersion: q
      });
    } catch (e) {
      return void O.warning(`Error when creating the TracingClient: ${je(e)}`);
    }
  }();
  return {
    name: qe,
    async sendRequest(e, r) {
      var i;
      var o;
      if (!n || !(null === (i = e.tracingOptions) || void 0 === i ? void 0 : i.tracingContext)) return r(e);
      const {
        span: s,
        tracingContext: a
      } = null !== (o = function (e, t, n) {
        try {
          const {
            span: r,
            updatedOptions: i
          } = e.startSpan(`HTTP ${t.method}`, {
            tracingOptions: t.tracingOptions
          }, {
            spanKind: "client",
            spanAttributes: {
              "http.method": t.method,
              "http.url": t.url,
              requestId: t.requestId
            }
          });
          if (!r.isRecording()) return void r.end();
          if (n) {
            r.setAttribute("http.user_agent", n);
          }
          const o = e.createRequestHeaders(i.tracingOptions.tracingContext);
          for (const [e, n] of Object.entries(o)) t.headers.set(e, n);
          return {
            span: r,
            tracingContext: i.tracingOptions.tracingContext
          };
        } catch (e) {
          return void O.warning(`Skipping creating a tracing span due to an error: ${je(e)}`);
        }
      }(n, e, t)) && void 0 !== o ? o : {};
      if (!s || !a) return r(e);
      try {
        const t = await n.withContext(a, r, e);
        (function (e, t) {
          try {
            e.setAttribute("http.status_code", t.status);
            const n = t.headers.get("x-ms-request-id");
            if (n) {
              e.setAttribute("serviceRequestId", n);
            }
            e.setStatus({
              status: "success"
            });
            e.end();
          } catch (e) {
            O.warning(`Skipping tracing span processing due to an error: ${je(e)}`);
          }
        })(s, t);
        return t;
      } catch (e) {
        throw function (e, t) {
          try {
            e.setStatus({
              status: "error",
              error: Fe(t) ? t : void 0
            });
            if (He(t) && t.statusCode) {
              e.setAttribute("http.status_code", t.statusCode);
            }
            e.end();
          } catch (e) {
            O.warning(`Skipping tracing span processing due to an error: ${je(e)}`);
          }
        }(s, e), e;
      }
    }
  };
}
function Ke(e) {
  const t = o();
  if (_e) {
    if (e.tlsOptions) {
      t.addPolicy(Oe(e.tlsOptions));
    }
    t.addPolicy(Ae(e.proxyOptions));
    t.addPolicy(Z());
  }
  t.addPolicy(ge());
  t.addPolicy(W(e.userAgentOptions));
  t.addPolicy(Pe());
  t.addPolicy(de(e.retryOptions), {
    phase: "Retry"
  });
  t.addPolicy(ze(e.userAgentOptions), {
    afterPhase: "Retry"
  });
  if (_e) {
    t.addPolicy(V(e.redirectOptions), {
      afterPhase: "Retry"
    });
  }
  t.addPolicy(j(e.loggingOptions), {
    afterPhase: "Sign"
  });
  return t;
}
var Ge = require(13685);
var We = require(95687);
var Qe = require(59796);
var Ze = require(12781);
function Xe(e) {
  return e.toLowerCase();
}
class Ye {
  constructor(e) {
    this._headersMap = new Map();
    if (e) for (const t of Object.keys(e)) this.set(t, e[t]);
  }
  set(e, t) {
    this._headersMap.set(Xe(e), {
      name: e,
      value: String(t)
    });
  }
  get(e) {
    var t;
    return null === (t = this._headersMap.get(Xe(e))) || void 0 === t ? void 0 : t.value;
  }
  has(e) {
    return this._headersMap.has(Xe(e));
  }
  delete(e) {
    this._headersMap.delete(Xe(e));
  }
  toJSON(e = {}) {
    const t = {};
    if (e.preserveCase) for (const e of this._headersMap.values()) t[e.name] = e.value;else for (const [e, n] of this._headersMap) t[e] = n.value;
    return t;
  }
  toString() {
    return JSON.stringify(this.toJSON({
      preserveCase: !0
    }));
  }
  [Symbol.iterator]() {
    return function* (e) {
      for (const t of e.values()) yield [t.name, t.value];
    }(this._headersMap);
  }
}
function Je(e) {
  return new Ye(e);
}
const et = {};
function tt(e) {
  return e && "function" == typeof e.pipe;
}
function nt(e) {
  return new Promise(t => {
    e.on("close", t);
    e.on("end", t);
    e.on("error", t);
  });
}
function rt(e) {
  return e && "number" == typeof e.byteLength;
}
class it extends Ze.Transform {
  constructor(e) {
    super();
    this.loadedBytes = 0;
    this.progressCallback = e;
  }
  _transform(e, t, n) {
    this.push(e);
    this.loadedBytes += e.length;
    try {
      this.progressCallback({
        loadedBytes: this.loadedBytes
      });
      n();
    } catch (e) {
      n(e);
    }
  }
}
class ot {
  constructor() {
    this.cachedHttpsAgents = new WeakMap();
  }
  async sendRequest(e) {
    var t;
    var n;
    var r;
    const i = new ne();
    let o;
    if (e.abortSignal) {
      if (e.abortSignal.aborted) throw new te("The operation was aborted.");
      o = e => {
        if ("abort" === e.type) {
          i.abort();
        }
      };
      e.abortSignal.addEventListener("abort", o);
    }
    if (e.timeout > 0) {
      setTimeout(() => {
        i.abort();
      }, e.timeout);
    }
    const s = e.headers.get("Accept-Encoding");
    const a = (null == s ? void 0 : s.includes("gzip")) || (null == s ? void 0 : s.includes("deflate"));
    let c;
    let l = "function" == typeof e.body ? e.body() : e.body;
    if (l && !e.headers.has("Content-Length")) {
      const t = function (e) {
        return e ? Buffer.isBuffer(e) ? e.length : tt(e) ? null : rt(e) ? e.byteLength : "string" == typeof e ? Buffer.from(e).length : null : 0;
      }(l);
      if (null !== t) {
        e.headers.set("Content-Length", t);
      }
    }
    try {
      if (l && e.onUploadProgress) {
        const t = e.onUploadProgress;
        const n = new it(t);
        n.on("error", e => {
          O.error("Error in upload progress", e);
        });
        if (tt(l)) {
          l.pipe(n);
        } else {
          n.end(l);
        }
        l = n;
      }
      const s = await this.makeRequest(e, i, l);
      const p = function (e) {
        const t = Je();
        for (const n of Object.keys(e.headers)) {
          const r = e.headers[n];
          if (Array.isArray(r)) {
            if (r.length > 0) {
              t.set(n, r[0]);
            }
          } else {
            if (r) {
              t.set(n, r);
            }
          }
        }
        return t;
      }(s);
      const d = {
        status: null !== (t = s.statusCode) && void 0 !== t ? t : 0,
        headers: p,
        request: e
      };
      if ("HEAD" === e.method) {
        s.resume();
        return d;
      }
      c = a ? function (e, t) {
        const n = t.get("Content-Encoding");
        if ("gzip" === n) {
          const t = Qe.createGunzip();
          e.pipe(t);
          return t;
        }
        if ("deflate" === n) {
          const t = Qe.createInflate();
          e.pipe(t);
          return t;
        }
        return e;
      }(s, p) : s;
      const h = e.onDownloadProgress;
      if (h) {
        const e = new it(h);
        e.on("error", e => {
          O.error("Error in download progress", e);
        });
        c.pipe(e);
        c = e;
      }
      if ((null === (n = e.streamResponseStatusCodes) || void 0 === n ? void 0 : n.has(Number.POSITIVE_INFINITY)) || (null === (r = e.streamResponseStatusCodes) || void 0 === r ? void 0 : r.has(d.status))) {
        d.readableStreamBody = c;
      } else {
        d.bodyAsText = await (u = c, new Promise((e, t) => {
          const n = [];
          u.on("data", e => {
            if (Buffer.isBuffer(e)) {
              n.push(e);
            } else {
              n.push(Buffer.from(e));
            }
          });
          u.on("end", () => {
            e(Buffer.concat(n).toString("utf8"));
          });
          u.on("error", e => {
            if (e && "AbortError" === (null == e ? void 0 : e.name)) {
              t(e);
            } else {
              t(new Ve(`Error reading response as text: ${e.message}`, {
                code: Ve.PARSE_ERROR
              }));
            }
          });
        }));
      }
      return d;
    } finally {
      if (e.abortSignal && o) {
        let t = Promise.resolve();
        if (tt(l)) {
          t = nt(l);
        }
        let n = Promise.resolve();
        if (tt(c)) {
          n = nt(c);
        }
        Promise.all([t, n]).then(() => {
          var t;
          if (o) {
            if (null === (t = e.abortSignal) || void 0 === t) {
              t.removeEventListener("abort", o);
            }
          }
        }).catch(e => {
          O.warning("Error when cleaning up abortListener on httpRequest", e);
        });
      }
    }
    var u;
  }
  makeRequest(e, t, n) {
    var r;
    const i = new URL(e.url);
    const o = "https:" !== i.protocol;
    if (o && !e.allowInsecureConnection) throw new Error(`Cannot connect to ${e.url} while allowInsecureConnection is false.`);
    const s = {
      agent: null !== (r = e.agent) && void 0 !== r ? r : this.getOrCreateAgent(e, o),
      hostname: i.hostname,
      path: `${i.pathname}${i.search}`,
      port: i.port,
      method: e.method,
      headers: e.headers.toJSON({
        preserveCase: !0
      })
    };
    return new Promise((r, i) => {
      const a = o ? Ge.request(s, r) : We.request(s, r);
      a.once("error", t => {
        var n;
        i(new Ve(t.message, {
          code: null !== (n = t.code) && void 0 !== n ? n : Ve.REQUEST_SEND_ERROR,
          request: e
        }));
      });
      t.signal.addEventListener("abort", () => {
        const e = new te("The operation was aborted.");
        a.destroy(e);
        i(e);
      });
      if (n && tt(n)) {
        n.pipe(a);
      } else {
        if (n) {
          if ("string" == typeof n || Buffer.isBuffer(n)) {
            a.end(n);
          } else {
            if (rt(n)) {
              a.end(ArrayBuffer.isView(n) ? Buffer.from(n.buffer) : Buffer.from(n));
            } else {
              O.error("Unrecognized body type", n);
              i(new Ve("Unrecognized body type"));
            }
          }
        } else {
          a.end();
        }
      }
    });
  }
  getOrCreateAgent(e, t) {
    var n;
    const r = e.disableKeepAlive;
    if (t) return r ? Ge.globalAgent : (this.cachedHttpAgent || (this.cachedHttpAgent = new Ge.Agent({
      keepAlive: !0
    })), this.cachedHttpAgent);
    {
      if (r && !e.tlsSettings) return We.globalAgent;
      const t = null !== (n = e.tlsSettings) && void 0 !== n ? n : et;
      let i = this.cachedHttpsAgents.get(t);
      if (i && i.options.keepAlive === !r) {
        O.info("No cached TLS Agent exist, creating a new Agent");
        i = new We.Agent(Object.assign({
          keepAlive: !r
        }, t));
        this.cachedHttpsAgents.set(t, i);
      }
      return i;
    }
  }
}
function st() {
  return new ot();
}
var at = require(6113);
var ct = require.n(at);
const lt = new Uint8Array(256);
let ut = lt.length;
function pt() {
  if (ut > lt.length - 16) {
    ct().randomFillSync(lt);
    ut = 0;
  }
  return lt.slice(ut, ut += 16);
}
const dt = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
const ht = [];
for (let e = 0; e < 256; ++e) ht.push((e + 256).toString(16).substr(1));
const ft = function (e, t = 0) {
  const n = (ht[e[t + 0]] + ht[e[t + 1]] + ht[e[t + 2]] + ht[e[t + 3]] + "-" + ht[e[t + 4]] + ht[e[t + 5]] + "-" + ht[e[t + 6]] + ht[e[t + 7]] + "-" + ht[e[t + 8]] + ht[e[t + 9]] + "-" + ht[e[t + 10]] + ht[e[t + 11]] + ht[e[t + 12]] + ht[e[t + 13]] + ht[e[t + 14]] + ht[e[t + 15]]).toLowerCase();
  if (!function (e) {
    return "string" == typeof e && dt.test(e);
  }(n)) throw TypeError("Stringified UUID is invalid");
  return n;
};
const mt = function (e, t, n) {
  const r = (e = e || {}).random || (e.rng || pt)();
  r[6] = 15 & r[6] | 64;
  r[8] = 63 & r[8] | 128;
  if (t) {
    n = n || 0;
    for (let e = 0; e < 16; ++e) t[n + e] = r[e];
    return t;
  }
  return ft(r);
};
class gt {
  constructor(e) {
    var t;
    var n;
    var r;
    var i;
    var o;
    var s;
    var a;
    this.url = e.url;
    this.body = e.body;
    this.headers = null !== (t = e.headers) && void 0 !== t ? t : Je();
    this.method = null !== (n = e.method) && void 0 !== n ? n : "GET";
    this.timeout = null !== (r = e.timeout) && void 0 !== r ? r : 0;
    this.formData = e.formData;
    this.disableKeepAlive = null !== (i = e.disableKeepAlive) && void 0 !== i && i;
    this.proxySettings = e.proxySettings;
    this.streamResponseStatusCodes = e.streamResponseStatusCodes;
    this.withCredentials = null !== (o = e.withCredentials) && void 0 !== o && o;
    this.abortSignal = e.abortSignal;
    this.tracingOptions = e.tracingOptions;
    this.onUploadProgress = e.onUploadProgress;
    this.onDownloadProgress = e.onDownloadProgress;
    this.requestId = e.requestId || mt();
    this.allowInsecureConnection = null !== (s = e.allowInsecureConnection) && void 0 !== s && s;
    this.enableBrowserStreams = null !== (a = e.enableBrowserStreams) && void 0 !== a && a;
  }
}
function yt(e) {
  return new gt(e);
}
const _t = "exponentialRetryPolicy";
function vt(e = {}) {
  var t;
  return pe([le(Object.assign(Object.assign({}, e), {
    ignoreSystemErrors: !0
  }))], {
    maxRetries: null !== (t = e.maxRetries) && void 0 !== t ? t : 3
  });
}
const bt = "systemErrorRetryPolicy";
function Et(e = {}) {
  var t;
  return {
    name: bt,
    sendRequest: pe([le(Object.assign(Object.assign({}, e), {
      ignoreHttpStatusCodes: !0
    }))], {
      maxRetries: null !== (t = e.maxRetries) && void 0 !== t ? t : 3
    }).sendRequest
  };
}
const wt = "throttlingRetryPolicy";
function Tt(e = {}) {
  var t;
  return {
    name: wt,
    sendRequest: pe([ce()], {
      maxRetries: null !== (t = e.maxRetries) && void 0 !== t ? t : 3
    }).sendRequest
  };
}
const St = {
  forcedRefreshWindowInMs: 1e3,
  retryIntervalInMs: 3e3,
  refreshWindowInMs: 12e4
};
const xt = "bearerTokenAuthenticationPolicy";
async function Ct(e) {
  const {
    scopes: t,
    getAccessToken: n,
    request: r
  } = e;
  const i = {
    abortSignal: r.abortSignal,
    tracingOptions: r.tracingOptions
  };
  const o = await n(t, i);
  if (o) {
    e.request.headers.set("Authorization", `Bearer ${o.token}`);
  }
}
function It(e) {
  var t;
  const {
    credential: n,
    scopes: r,
    challengeCallbacks: i
  } = e;
  const o = e.logger || O;
  const s = Object.assign({
    authorizeRequest: null !== (t = null == i ? void 0 : i.authorizeRequest) && void 0 !== t ? t : Ct,
    authorizeRequestOnChallenge: null == i ? void 0 : i.authorizeRequestOnChallenge
  }, i);
  const a = n ? function (e, t) {
    let n;
    let r = null;
    let i = null;
    const o = Object.assign(Object.assign({}, St), t);
    const s = {
      get isRefreshing() {
        return null !== r;
      },
      get shouldRefresh() {
        var e;
        return !s.isRefreshing && (null !== (e = null == i ? void 0 : i.expiresOnTimestamp) && void 0 !== e ? e : 0) - o.refreshWindowInMs < Date.now();
      },
      get mustRefresh() {
        return null === i || i.expiresOnTimestamp - o.forcedRefreshWindowInMs < Date.now();
      }
    };
    function a(t, a) {
      var c;
      if (s.isRefreshing) {
        r = async function (e, t, n) {
          async function r() {
            if (!(Date.now() < n)) {
              const t = await e();
              if (null === t) throw new Error("Failed to refresh access token.");
              return t;
            }
            try {
              return await e();
            } catch (e) {
              return null;
            }
          }
          let i = await r();
          for (; null === i;) {
            await re(t);
            i = await r();
          }
          return i;
        }(() => e.getToken(t, a), o.retryIntervalInMs, null !== (c = null == i ? void 0 : i.expiresOnTimestamp) && void 0 !== c ? c : Date.now()).then(e => (r = null, i = e, n = a.tenantId, i)).catch(e => {
          throw r = null, i = null, n = void 0, e;
        });
      }
      return r;
    }
    return async (e, t) => n !== t.tenantId || Boolean(t.claims) || s.mustRefresh ? a(e, t) : (s.shouldRefresh && a(e, t), i);
  }(n) : () => Promise.resolve(null);
  return {
    name: xt,
    async sendRequest(e, t) {
      if (!e.url.toLowerCase().startsWith("https://")) throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
      let n;
      let i;
      await s.authorizeRequest({
        scopes: Array.isArray(r) ? r : [r],
        request: e,
        getAccessToken: a,
        logger: o
      });
      try {
        n = await t(e);
      } catch (e) {
        i = e;
        n = e.response;
      }
      if (s.authorizeRequestOnChallenge && 401 === (null == n ? void 0 : n.status) && function (e) {
        const t = e.headers.get("WWW-Authenticate");
        if (401 === e.status && t) return t;
      }(n) && (await s.authorizeRequestOnChallenge({
        scopes: Array.isArray(r) ? r : [r],
        request: e,
        response: n,
        getAccessToken: a,
        logger: o
      }))) return t(e);
      if (i) throw i;
      return n;
    }
  };
}
const At = "ndJsonPolicy";
function kt() {
  return {
    name: At,
    async sendRequest(e, t) {
      if ("string" == typeof e.body && e.body.startsWith("[")) {
        const t = JSON.parse(e.body);
        if (Array.isArray(t)) {
          e.body = t.map(e => JSON.stringify(e) + "\n").join("");
        }
      }
      return t(e);
    }
  };
}