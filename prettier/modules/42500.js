const {
  Readable: r
} = require(12781);
const {
  Headers: i
} = require(9872);
const {
  Response: o
} = require(2981);
const s = Symbol("CacheableResponse internals");
class a extends o {
  constructor(e, t) {
    super(e, t);
    const n = new i(t.headers);
    this[s] = {
      headers: n,
      bufferedBody: e
    };
  }
  get headers() {
    return this[s].headers;
  }
  set headers(e) {
    if (!(e instanceof i)) throw new TypeError("instance of Headers expected");
    this[s].headers = e;
  }
  get body() {
    return r.from(this[s].bufferedBody);
  }
  get bodyUsed() {
    return !1;
  }
  async buffer() {
    return this[s].bufferedBody;
  }
  async arrayBuffer() {
    return (e = this[s].bufferedBody).buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
    var e;
  }
  async text() {
    return this[s].bufferedBody.toString();
  }
  async json() {
    return JSON.parse(await this.text());
  }
  clone() {
    const {
      url: e,
      status: t,
      statusText: n,
      headers: r,
      httpVersion: i,
      decoded: o,
      counter: c
    } = this;
    return new a(this[s].bufferedBody, {
      url: e,
      status: t,
      statusText: n,
      headers: r,
      httpVersion: i,
      decoded: o,
      counter: c
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
module.exports = {
  cacheableResponse: async e => {
    const t = await e.buffer();
    const {
      url: n,
      status: r,
      statusText: i,
      headers: o,
      httpVersion: s,
      decoded: c,
      counter: l
    } = e;
    return new a(t, {
      url: n,
      status: r,
      statusText: i,
      headers: o,
      httpVersion: s,
      decoded: c,
      counter: l
    });
  }
};