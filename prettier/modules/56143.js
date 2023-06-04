const {
  EventEmitter: r
} = require(82361);
const {
  Readable: i
} = require(12781);
const o = require(15158)("helix-fetch");
const s = require(8348);
const {
  Body: a
} = require(95600);
const {
  Headers: c
} = require(9872);
const {
  Request: l
} = require(48359);
const {
  Response: u
} = require(2981);
const {
  FetchBaseError: p,
  FetchError: d,
  AbortError: h
} = require(63683);
const {
  AbortController: f,
  AbortSignal: m,
  TimeoutSignal: g
} = require(96829);
const y = require(24193);
const {
  cacheableResponse: _
} = require(42500);
const {
  sizeof: v
} = require(4544);
const {
  isFormData: b
} = require(99407);
const {
  context: E,
  RequestAbortedError: w
} = require(33100);
const T = ["GET", "HEAD"];
const S = "push";
const x = async (e, t, n) => {
  const {
    request: r
  } = e.context;
  const o = t instanceof l && void 0 === n ? t : new l(t, n);
  const {
    method: s,
    body: a,
    signal: p,
    compress: f,
    decode: m,
    follow: g,
    redirect: y,
    init: {
      body: _
    }
  } = o;
  let v;
  if (p && p.aborted) {
    const e = new h("The operation was aborted.");
    throw o.init.body instanceof i && o.init.body.destroy(e), e;
  }
  try {
    v = await r(o.url, {
      ...n,
      method: s,
      headers: o.headers.plain(),
      body: !_ || _ instanceof i || b(_) ? a : _,
      compress: f,
      decode: m,
      follow: g,
      redirect: y,
      signal: p
    });
  } catch (e) {
    if (_ instanceof i) {
      _.destroy(e);
    }
    if (e instanceof TypeError) throw e;
    if (e instanceof w) throw new h("The operation was aborted.");
    throw new d(e.message, "system", e);
  }
  const E = () => {
    p.removeEventListener("abort", E);
    const e = new h("The operation was aborted.");
    if (o.init.body instanceof i) {
      o.init.body.destroy(e);
    }
    v.readable.emit("error", e);
  };
  if (p) {
    p.addEventListener("abort", E);
  }
  const {
    statusCode: T,
    statusText: S,
    httpVersion: C,
    headers: I,
    readable: A,
    decoded: k
  } = v;
  if ([301, 302, 303, 307, 308].includes(T)) {
    const {
      location: t
    } = I;
    const n = null == t ? null : new URL(t, o.url);
    switch (o.redirect) {
      case "manual":
        break;
      case "error":
        throw p && p.removeEventListener("abort", E), new d(`uri requested responds with a redirect, redirect mode is set to 'error': ${o.url}`, "no-redirect");
      case "follow":
        {
          if (null === n) break;
          if (o.counter >= o.follow) throw p && p.removeEventListener("abort", E), new d(`maximum redirect reached at: ${o.url}`, "max-redirect");
          const t = {
            headers: new c(o.headers),
            follow: o.follow,
            compress: o.compress,
            decode: o.decode,
            counter: o.counter + 1,
            method: o.method,
            body: o.body,
            signal: o.signal
          };
          if (303 !== T && o.body && o.init.body instanceof i) throw p && p.removeEventListener("abort", E), new d("Cannot follow redirect with body being a readable stream", "unsupported-redirect");
          if (303 !== T && (301 !== T && 302 !== T || "POST" !== o.method)) {
            t.method = "GET";
            t.body = void 0;
            t.headers.delete("content-length");
          }
          if (p) {
            p.removeEventListener("abort", E);
          }
          return x(e, new l(n, t));
        }
    }
  }
  if (p) {
    A.once("end", () => {
      p.removeEventListener("abort", E);
    });
    A.once("error", () => {
      p.removeEventListener("abort", E);
    });
  }
  return new u(A, {
    url: o.url,
    status: T,
    statusText: S,
    headers: I,
    httpVersion: C,
    decoded: k,
    counter: o.counter
  });
};
const C = async (e, t, n) => {
  if (0 === e.options.maxCacheSize) return n;
  if (!T.includes(t.method)) return n;
  const r = new y(t, n, {
    shared: !1
  });
  if (r.storable()) {
    const i = await _(n);
    e.cache.set(t.url, {
      policy: r,
      response: i
    }, r.timeToLive());
    return i;
  }
  return n;
};
const I = (e, t = {}) => {
  const n = new URL(e);
  if ("object" != typeof t || Array.isArray(t)) throw new TypeError("qs: object expected");
  Object.entries(t).forEach(([e, t]) => {
    if (Array.isArray(t)) {
      t.forEach(t => n.searchParams.append(e, t));
    } else {
      n.searchParams.append(e, t);
    }
  });
  return n.href;
};
const A = e => new g(e);
class k {
  constructor(e) {
    this.options = {
      ...e
    };
    const {
      maxCacheSize: t
    } = this.options;
    let n = "number" == typeof t && t >= 0 ? t : 104857600;
    let i = 500;
    if (0 === n) {
      n = 1;
      i = 1;
    }
    this.cache = new s({
      max: i,
      maxSize: n,
      sizeCalculation: ({
        response: e
      }, t) => v(e)
    });
    this.eventEmitter = new r();
    this.options.h2 = this.options.h2 || {};
    if (void 0 === this.options.h2.enablePush) {
      this.options.h2.enablePush = !0;
    }
    const {
      enablePush: o
    } = this.options.h2;
    if (o) {
      this.options.h2.pushPromiseHandler = (e, t, n) => {
        const r = {
          ...t
        };
        Object.keys(r).filter(e => e.startsWith(":")).forEach(e => delete r[e]);
        this.pushPromiseHandler(e, r, n);
      };
      this.options.h2.pushHandler = (e, t, n) => {
        const r = {
          ...t
        };
        Object.keys(r).filter(e => e.startsWith(":")).forEach(e => delete r[e]);
        const {
          statusCode: i,
          statusText: o,
          httpVersion: s,
          headers: a,
          readable: c,
          decoded: l
        } = n;
        this.pushHandler(e, r, new u(c, {
          url: e,
          status: i,
          statusText: o,
          headers: a,
          httpVersion: s,
          decoded: l
        }));
      };
    }
    this.context = E(this.options);
  }
  api() {
    return {
      fetch: async (e, t) => this.fetch(e, t),
      Body: a,
      Headers: c,
      Request: l,
      Response: u,
      AbortController: f,
      AbortSignal: m,
      FetchBaseError: p,
      FetchError: d,
      AbortError: h,
      context: (e = {}) => new k(e).api(),
      noCache: (e = {}) => new k({
        ...e,
        maxCacheSize: 0
      }).api(),
      h1: (e = {}) => new k({
        ...e,
        alpnProtocols: [this.context.ALPN_HTTP1_1]
      }).api(),
      keepAlive: (e = {}) => new k({
        ...e,
        alpnProtocols: [this.context.ALPN_HTTP1_1],
        h1: {
          keepAlive: !0
        }
      }).api(),
      h1NoCache: (e = {}) => new k({
        ...e,
        maxCacheSize: 0,
        alpnProtocols: [this.context.ALPN_HTTP1_1]
      }).api(),
      keepAliveNoCache: (e = {}) => new k({
        ...e,
        maxCacheSize: 0,
        alpnProtocols: [this.context.ALPN_HTTP1_1],
        h1: {
          keepAlive: !0
        }
      }).api(),
      reset: async () => this.context.reset(),
      onPush: e => this.onPush(e),
      offPush: e => this.offPush(e),
      createUrl: I,
      timeoutSignal: A,
      clearCache: () => this.clearCache(),
      cacheStats: () => this.cacheStats(),
      ALPN_HTTP2: this.context.ALPN_HTTP2,
      ALPN_HTTP2C: this.context.ALPN_HTTP2C,
      ALPN_HTTP1_1: this.context.ALPN_HTTP1_1,
      ALPN_HTTP1_0: this.context.ALPN_HTTP1_0
    };
  }
  async fetch(e, t) {
    return (async (e, t, n) => {
      const r = new l(t, n);
      if (0 !== e.options.maxCacheSize && T.includes(r.method) && !["no-store", "reload"].includes(r.cache)) {
        const {
          policy: t,
          response: n
        } = e.cache.get(r.url) || {};
        if (t && t.satisfiesWithoutRevalidation(r)) {
          n.headers = new c(t.responseHeaders(n));
          const e = n.clone();
          e.fromCache = !0;
          return e;
        }
      }
      const i = await x(e, r);
      return "no-store" !== r.cache ? C(e, r, i) : i;
    })(this, e, t);
  }
  onPush(e) {
    return this.eventEmitter.on(S, e);
  }
  offPush(e) {
    return this.eventEmitter.off(S, e);
  }
  clearCache() {
    this.cache.clear();
  }
  cacheStats() {
    return {
      size: this.cache.calculatedSize,
      count: this.cache.size
    };
  }
  pushPromiseHandler(e, t, n) {
    o(`received server push promise: ${e}, headers: ${JSON.stringify(t)}`);
    const r = new l(e, {
      headers: t
    });
    const {
      policy: i
    } = this.cache.get(e) || {};
    if (i && i.satisfiesWithoutRevalidation(r)) {
      o(`already cached, reject push promise: ${e}, headers: ${JSON.stringify(t)}`);
      n();
    }
  }
  async pushHandler(e, t, n) {
    o(`caching resource pushed by server: ${e}, reqHeaders: ${JSON.stringify(t)}, status: ${n.status}, respHeaders: ${JSON.stringify(n.headers)}`);
    const r = await C(this, new l(e, {
      headers: t
    }), n);
    this.eventEmitter.emit(S, e, r);
  }
}
module.exports = new k().api();