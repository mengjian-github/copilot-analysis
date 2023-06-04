Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getRetrievalOptions = exports.queryRetrievalSnippets = exports.lineBasedSnippetMatcher = exports.breakUpLongLines = exports.buildSnippetMatcher = exports.RETRIEVAL_CACHE_SNIPPET_MATCHERS = void 0;
const r = require(64063);
const i = require(23055);
const o = require(6113);
const s = require(42600);
const a = require(30362);
const c = require(43076);
const l = require(59189);
const u = require(29899);
const p = require(82279);
const d = require(20003);
const h = require(35120);
const f = require(6333);
const m = new u.Logger(u.LogLevel.DEBUG, "retrieval");
function g(e) {
  return {
    snippet: e.text.before + e.text.snippet + e.text.after,
    score: e.distance,
    startLine: e.line_info.before_start_line,
    endLine: e.line_info.after_end_line,
    relativePath: e.file,
    restrictedTelemetry: {
      corpusId: e.corpus_config.corpus_id,
      repoNwo: e.corpus_config.repo_nwo,
      repoSha: e.corpus_config.repo_sha,
      indexTimestamp: e.corpus_config.index_timestamp
    }
  };
}
function buildSnippetMatcher(e, t) {
  switch (e) {
    case "exact":
    default:
      return _;
    case "editDistanceRelative":
      if (void 0 === t || t < 0 || t > 100) throw new Error("Invalid threshold for editDistanceRelative matcher");
      return E(t / 100, "relative");
    case "editDistanceAbsolute":
      if (void 0 === t || t < 0) throw new Error("Invalid threshold for editDistanceAbsolute matcher");
      return E(t, "absolute");
    case "lineBasedRelative":
      if (void 0 === t || t < 0 || t > 100) throw new Error("Invalid threshold for lineBasedRelative matcher");
      return lineBasedSnippetMatcher(t / 100, "relative", 100);
    case "lineBasedAbsolute":
      if (void 0 === t || t < 0) throw new Error("Invalid threshold for lineBasedAbsolute matcher");
      return lineBasedSnippetMatcher(t, "absolute", 100);
  }
}
function _(e, t) {
  return e.querySnippet === t.querySnippet;
}
function breakUpLongLines(e, t) {
  const n = new Set();
  for (const r of e.split("\n")) {
    if (r.length <= t) {
      n.add(r);
      continue;
    }
    let e = 0;
    for (; e < r.length;) {
      n.add(r.substring(e, e + t));
      e += t;
    }
  }
  return n;
}
function lineBasedSnippetMatcher(e, t, n) {
  return (r, i) => {
    const o = breakUpLongLines(r.querySnippet, n);
    const s = breakUpLongLines(i.querySnippet, n);
    const a = new Set([...o].filter(e => s.has(e)));
    return "relative" === t ? 1 - a.size / (o.size + s.size - a.size) <= e : Math.max(o.size, s.size) - a.size <= e;
  };
}
function E(e, t) {
  return (n, r) => {
    const i = h.editDistance(n.querySnippet, r.querySnippet);
    return "relative" === t ? i.distance <= e * Math.max(n.querySnippet.length, r.querySnippet.length) : i.distance <= e;
  };
}
exports.RETRIEVAL_CACHE_SNIPPET_MATCHERS = ["exact", "editDistanceRelative", "editDistanceAbsolute", "lineBasedRelative", "lineBasedAbsolute"];
exports.buildSnippetMatcher = buildSnippetMatcher;
exports.breakUpLongLines = breakUpLongLines;
exports.lineBasedSnippetMatcher = lineBasedSnippetMatcher;
class w {
  constructor(e, t) {
    this.uriToCache = new Map();
    this.matcher = e;
    this.maxUriCacheSize = t;
  }
  hashContext(e) {
    return o.createHash("sha1").update(e.querySnippet).digest("hex");
  }
  get(e, t) {
    const n = this.uriToCache.get(e);
    if (void 0 !== n) for (const e of n.keys()) {
      const {
        context: r,
        retrievalId: i,
        snippets: o
      } = n.get(e);
      if (this.matcher(t, r)) return {
        retrievalId: i,
        snippets: o
      };
    }
  }
  put(e, t, n, r) {
    let i = this.uriToCache.get(e);
    if (void 0 === i) {
      i = new c.LRUCacheMap(this.maxUriCacheSize);
      this.uriToCache.set(e, i);
    }
    i.set(this.hashContext(n), {
      context: n,
      retrievalId: t,
      snippets: r
    });
  }
}
const T = new Map();
let S;
let x;
exports.queryRetrievalSnippets = async function (e, t, n) {
  if (void 0 === S || !r(x, n)) {
    const e = buildSnippetMatcher(n.cache.snippetMatcherName, n.cache.snippetMatcherThreshold);
    x = n;
    S = new w(e, n.cache.maxUriCacheSize);
  }
  const o = T.get(t.uri) ?? {
    state: "idle"
  };
  if ("pending" === o.state) {
    (function (e, t) {
      f.telemetry(e, "retrieval.debounced", f.TelemetryData.createAndMarkAsIssued({
        pendingRetrievalId: t
      }), !1);
    })(e, o.retrievalId);
    return [];
  }
  if ("response" === o.state) {
    await async function (e, t, n, i, o, s) {
      T.set(t.uri, {
        state: "idle"
      });
      if (!r(s, x)) return;
      const a = await o.json();
      try {
        if (null === a) throw new Error("Retrieval response body is null");
        m.info(e, `Retrieval request for ${t.uri} processed. Got ${a?.results?.length} snippets back`);
        const r = a.results.map(g).filter(function (e) {
          return t => void 0 === t.relativePath || !(e.uri.endsWith(t.relativePath) || t.relativePath.endsWith(e.uri));
        }(t));
        m.info(e, `There were ${r.length} after filtering`);
        S?.put(t.uri, n, i, r.map(e => {
          const {
            restrictedTelemetry: t,
            ...n
          } = e;
          return n;
        }));
        (function (e, t, n, r) {
          const i = {
            numSnippetsFromServer: n?.results?.length || -1,
            numFilteredSnippets: r.length
          };
          f.telemetry(e, "retrieval.retrieved", f.TelemetryData.createAndMarkAsIssued({
            retrievalId: t
          }, {
            ...i,
            elapsedEmbeddingNs: n?.metadata?.elapsed_embedding_ns || -1,
            elapsedKnnNs: n?.metadata?.elapsed_knn_ns || -1,
            elapsedFindSourceNs: n?.metadata?.elapsed_find_source_ns || -1
          }), !1);
          f.telemetry(e, "retrieval.retrieved", f.TelemetryData.createAndMarkAsIssued({
            retrievalId: t,
            snippets: JSON.stringify(r.map(e => {
              const {
                restrictedTelemetry: t,
                ...n
              } = e;
              return {
                ...n,
                ...t
              };
            }))
          }, {
            ...i
          }), !0);
        })(e, n, a, r);
      } catch (t) {
        m.exception(e, t, "Error while processing retrieval response");
        (function (e, t, n, r) {
          f.telemetry(e, "retrieval.errorProcess", f.TelemetryData.createAndMarkAsIssued({
            retrievalId: t
          }), !1);
          f.telemetry(e, "retrieval.errorProcess", f.TelemetryData.createAndMarkAsIssued({
            retrievalId: t,
            body: JSON.stringify(n) ?? "unknown",
            error: JSON.stringify(r) ?? "unknown"
          }), !0);
        })(e, n, a, t);
      }
    }(e, t, o.retrievalId, o.retrievalContext, o.response, o.retrievalOptions);
  }
  const c = function (e, t) {
    const n = i.getCursorContext(e, t);
    return {
      querySnippet: n.context,
      offset: e.offset,
      tokenLength: n.tokenLength,
      lineCount: n.lineCount
    };
  }(t, n.context);
  if (c.lineCount < (n.context.minLineCount ?? 0) || c.tokenLength < (n.context.minTokenLength ?? 0)) {
    (function (e, t, n) {
      const r = {
        retrievalContextTokens: n.tokenLength,
        retrievalLineCount: n.lineCount,
        cursorPos: t.offset
      };
      f.telemetry(e, "retrieval.tooShortContext", f.TelemetryData.createAndMarkAsIssued({}, r), !1);
      f.telemetry(e, "retrieval.tooShortContext", f.TelemetryData.createAndMarkAsIssued({
        file: t.uri,
        retrievalContext: n.querySnippet
      }, r), !0);
    })(e, t, c);
    return [];
  }
  const l = function (e, t, n, r) {
    const i = Date.now();
    const o = t.get(n.uri, r);
    (function (e, t, n) {
      f.telemetry(e, "retrieval.cacheLookup", f.TelemetryData.createAndMarkAsIssued({
        cacheHit: t ? "true" : "false"
      }, {
        cacheLookupElapsed: n
      }), !1);
    })(e, void 0 !== o, Date.now() - i);
    return o;
  }(e, S, t, c);
  return void 0 === l ? (await async function (e, t, n, r) {
    const i = s.v4();
    T.set(t.uri, {
      state: "pending",
      retrievalId: i
    });
    const o = (await e.get(a.CopilotTokenManager).getCopilotToken(e)).token;
    var c;
    !function (e, t, n, r, i) {
      const o = {
        retrievalContextTokens: r.tokenLength,
        retrievalLineCount: r.lineCount,
        cursorPos: t.offset
      };
      f.telemetry(e, "retrieval.issued", f.TelemetryData.createAndMarkAsIssued({
        retrievalId: n
      }, o), !1);
      f.telemetry(e, "retrieval.issued", f.TelemetryData.createAndMarkAsIssued({
        retrievalId: n,
        file: t.uri,
        retrievalContext: r.querySnippet
      }, o), !0);
    }(e, t, i, n);
    p.postRequest(e, (c = r.repoNwo, d.OPENAI_PROXY_HOST + `/v0/retrieval?repo=${c}`), o, void 0, s.v4(), {
      query: n.querySnippet,
      options: {
        ...r.server
      }
    }).then(async o => {
      m.info(e, `Retrieval request for ${t.uri} finished`);
      if (200 !== o.status) throw new Error(`Retrieval request failed with status ${o.status}`);
      T.set(t.uri, {
        state: "response",
        retrievalId: i,
        retrievalContext: n,
        response: o,
        retrievalOptions: r
      });
      (function (e, t, n) {
        f.telemetry(e, "retrieval.response", f.TelemetryData.createAndMarkAsIssued({
          retrievalId: t
        }), !1);
      })(e, i);
    }).catch(n => {
      m.info(e, `Retrieval request for ${t.uri} failed. Error: ${n}`);
      (function (e, t, n) {
        f.telemetry(e, "retrieval.error", f.TelemetryData.createAndMarkAsIssued({
          retrievalId: t,
          error: JSON.stringify(n) ?? "unknown"
        }), !1);
      })(e, i, n);
      T.set(t.uri, {
        state: "idle"
      });
    });
  }(e, t, c, n), []) : (function (e, t, n) {
    f.telemetry(e, "retrieval.cacheHit", f.TelemetryData.createAndMarkAsIssued({
      cachedRetrievalId: t
    }, {
      numSnippetsReturned: n.length
    }), !1);
  }(e, l.retrievalId, l.snippets), m.debug(e, `Retrieval cache hit for ${t.uri}`), l.snippets.map(e => ({
    provider: i.SnippetProvider.Retrieval,
    semantics: i.SnippetSemantics.Snippet,
    ...e
  })));
};
exports.getRetrievalOptions = async function (e, t) {
  if (await e.get(l.Features).retrievalStrategy(t)) return {
    repoNwo: t.repoNwo,
    context: {
      maxLineCount: 30,
      maxTokenLength: 1e3,
      minLineCount: 8,
      minTokenLength: 30
    },
    server: {
      results: 10,
      language: t.fileType
    },
    cache: {
      snippetMatcherName: "lineBasedRelative",
      snippetMatcherThreshold: 40,
      maxUriCacheSize: 5
    }
  };
};