const {
  AbortSignal: r
} = require(96829);
const {
  Body: i,
  cloneStream: o,
  guessContentType: s
} = require(95600);
const {
  Headers: a
} = require(9872);
const {
  isPlainObject: c
} = require(4544);
const {
  isFormData: l,
  FormDataSerializer: u
} = require(99407);
const p = Symbol("Request internals");
class d extends i {
  constructor(e, t = {}) {
    const n = e instanceof d ? e : null;
    const i = n ? new URL(n.url) : new URL(e);
    let h = t.method || n && n.method || "GET";
    h = h.toUpperCase();
    if ((null != t.body || n && null !== n.body) && ["GET", "HEAD"].includes(h)) throw new TypeError("Request with GET/HEAD method cannot have body");
    let f = t.body || (n && n.body ? o(n) : null);
    const m = new a(t.headers || n && n.headers || {});
    if (l(f) && !m.has("content-type")) {
      const e = new u(f);
      f = e.stream();
      m.set("content-type", e.contentType());
      if (m.has("transfer-encoding") || m.has("content-length")) {
        m.set("content-length", e.length());
      }
    }
    if (!m.has("content-type")) if (c(f)) {
      f = JSON.stringify(f);
      m.set("content-type", "application/json");
    } else {
      const e = s(f);
      if (e) {
        m.set("content-type", e);
      }
    }
    super(f);
    let g = n ? n.signal : null;
    if ("signal" in t) {
      g = t.signal;
    }
    if (g && !(g instanceof r)) throw new TypeError("signal needs to be an instance of AbortSignal");
    const y = t.redirect || n && n.redirect || "follow";
    if (!["follow", "error", "manual"].includes(y)) throw new TypeError(`'${y}' is not a valid redirect option`);
    const _ = t.cache || n && n.cache || "default";
    if (!["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"].includes(_)) throw new TypeError(`'${_}' is not a valid cache option`);
    this[p] = {
      init: {
        ...t
      },
      method: h,
      redirect: y,
      cache: _,
      headers: m,
      parsedURL: i,
      signal: g
    };
    if (void 0 === t.follow) {
      if (n && void 0 !== n.follow) {
        this.follow = n.follow;
      } else {
        this.follow = 20;
      }
    } else {
      this.follow = t.follow;
    }
    this.counter = t.counter || n && n.counter || 0;
    if (void 0 === t.compress) {
      if (n && void 0 !== n.compress) {
        this.compress = n.compress;
      } else {
        this.compress = !0;
      }
    } else {
      this.compress = t.compress;
    }
    if (void 0 === t.decode) {
      if (n && void 0 !== n.decode) {
        this.decode = n.decode;
      } else {
        this.decode = !0;
      }
    } else {
      this.decode = t.decode;
    }
  }
  get method() {
    return this[p].method;
  }
  get url() {
    return this[p].parsedURL.toString();
  }
  get headers() {
    return this[p].headers;
  }
  get redirect() {
    return this[p].redirect;
  }
  get cache() {
    return this[p].cache;
  }
  get signal() {
    return this[p].signal;
  }
  clone() {
    return new d(this);
  }
  get init() {
    return this[p].init;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
Object.defineProperties(d.prototype, {
  method: {
    enumerable: !0
  },
  url: {
    enumerable: !0
  },
  headers: {
    enumerable: !0
  },
  redirect: {
    enumerable: !0
  },
  cache: {
    enumerable: !0
  },
  clone: {
    enumerable: !0
  },
  signal: {
    enumerable: !0
  }
});
module.exports = {
  Request: d
};