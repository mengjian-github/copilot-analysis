const r = require(15158)("helix-fetch:core");
const {
  request: i,
  setupContext: o,
  resetContext: s,
  RequestAbortedError: a,
  ALPN_HTTP2: c,
  ALPN_HTTP2C: l,
  ALPN_HTTP1_1: u,
  ALPN_HTTP1_0: p
} = require(9575);
class d {
  constructor(e) {
    this.options = {
      ...(e || {})
    };
    o(this);
  }
  api() {
    return {
      request: async (e, t) => this.request(e, t),
      context: (e = {}) => new d(e).api(),
      reset: async () => this.reset(),
      RequestAbortedError: a,
      ALPN_HTTP2: c,
      ALPN_HTTP2C: l,
      ALPN_HTTP1_1: u,
      ALPN_HTTP1_0: p
    };
  }
  async request(e, t) {
    return i(this, e, t);
  }
  async reset() {
    r("resetting context");
    return s(this);
  }
}
module.exports = new d().api();