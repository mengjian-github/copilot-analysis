const {
  Body: r,
  cloneStream: i,
  guessContentType: o
} = require(95600);
const {
  Headers: s
} = require(9872);
const {
  isPlainObject: a
} = require(4544);
const {
  isFormData: c,
  FormDataSerializer: l
} = require(99407);
const u = Symbol("Response internals");
class p extends r {
  constructor(e = null, t = {}) {
    const n = new s(t.headers);
    let r = e;
    if (c(r) && !n.has("content-type")) {
      const e = new l(r);
      r = e.stream();
      n.set("content-type", e.contentType());
      if (n.has("transfer-encoding") || n.has("content-length")) {
        n.set("content-length", e.length());
      }
    }
    if (null !== r && !n.has("content-type")) if (a(r)) {
      r = JSON.stringify(r);
      n.set("content-type", "application/json");
    } else {
      const e = o(r);
      if (e) {
        n.set("content-type", e);
      }
    }
    super(r);
    this[u] = {
      url: t.url,
      status: t.status || 200,
      statusText: t.statusText || "",
      headers: n,
      httpVersion: t.httpVersion,
      decoded: t.decoded,
      counter: t.counter
    };
  }
  get url() {
    return this[u].url || "";
  }
  get status() {
    return this[u].status;
  }
  get statusText() {
    return this[u].statusText;
  }
  get ok() {
    return this[u].status >= 200 && this[u].status < 300;
  }
  get redirected() {
    return this[u].counter > 0;
  }
  get headers() {
    return this[u].headers;
  }
  get httpVersion() {
    return this[u].httpVersion;
  }
  get decoded() {
    return this[u].decoded;
  }
  static redirect(e, t = 302) {
    if (![301, 302, 303, 307, 308].includes(t)) throw new RangeError("Invalid status code");
    return new p(null, {
      headers: {
        location: new URL(e).toString()
      },
      status: t
    });
  }
  clone() {
    if (this.bodyUsed) throw new TypeError("Cannot clone: already read");
    return new p(i(this), {
      ...this[u]
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
Object.defineProperties(p.prototype, {
  url: {
    enumerable: !0
  },
  status: {
    enumerable: !0
  },
  ok: {
    enumerable: !0
  },
  redirected: {
    enumerable: !0
  },
  statusText: {
    enumerable: !0
  },
  headers: {
    enumerable: !0
  },
  clone: {
    enumerable: !0
  }
});
module.exports = {
  Response: p
};