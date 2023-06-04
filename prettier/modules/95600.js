const {
  PassThrough: r,
  Readable: i
} = require(12781);
const {
  types: {
    isAnyArrayBuffer: o
  }
} = require(73837);
const {
  FetchError: s,
  FetchBaseError: a
} = require(63683);
const {
  streamToBuffer: c
} = require(4544);
const l = Buffer.alloc(0);
const u = Symbol("Body internals");
const p = async e => {
  if (e[u].disturbed) throw new TypeError("Already read");
  if (e[u].error) throw new TypeError(`Stream had error: ${e[u].error.message}`);
  e[u].disturbed = !0;
  const {
    stream: t
  } = e[u];
  return null === t ? l : c(t);
};
class d {
  constructor(e) {
    let t;
    t = null == e ? null : e instanceof URLSearchParams ? i.from(e.toString()) : e instanceof i ? e : Buffer.isBuffer(e) ? i.from(e) : o(e) ? i.from(Buffer.from(e)) : "string" == typeof e || e instanceof String ? i.from(e) : i.from(String(e));
    this[u] = {
      stream: t,
      disturbed: !1,
      error: null
    };
    if (e instanceof i) {
      t.on("error", e => {
        const t = e instanceof a ? e : new s(`Invalid response body while trying to fetch ${this.url}: ${e.message}`, "system", e);
        this[u].error = t;
      });
    }
  }
  get body() {
    return this[u].stream;
  }
  get bodyUsed() {
    return this[u].disturbed;
  }
  async buffer() {
    return p(this);
  }
  async arrayBuffer() {
    return (e = await this.buffer()).buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
    var e;
  }
  async text() {
    return (await p(this)).toString();
  }
  async json() {
    return JSON.parse(await this.text());
  }
}
Object.defineProperties(d.prototype, {
  body: {
    enumerable: !0
  },
  bodyUsed: {
    enumerable: !0
  },
  arrayBuffer: {
    enumerable: !0
  },
  json: {
    enumerable: !0
  },
  text: {
    enumerable: !0
  }
});
module.exports = {
  Body: d,
  cloneStream: e => {
    if (e[u].disturbed) throw new TypeError("Cannot clone: already read");
    const {
      stream: t
    } = e[u];
    let n = t;
    if (t instanceof i) {
      n = new r();
      const i = new r();
      t.pipe(n);
      t.pipe(i);
      e[u].stream = i;
    }
    return n;
  },
  guessContentType: e => null === e ? null : "string" == typeof e ? "text/plain; charset=utf-8" : e instanceof URLSearchParams ? "application/x-www-form-urlencoded; charset=utf-8" : Buffer.isBuffer(e) || o(e) || e instanceof i ? null : "text/plain; charset=utf-8"
};