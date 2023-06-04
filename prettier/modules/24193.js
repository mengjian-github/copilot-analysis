const r = require(26214);
const {
  Headers: i
} = require(9872);
const o = e => ({
  url: e.url,
  method: e.method,
  headers: e.headers.plain()
});
const s = e => ({
  status: e.status,
  headers: e.headers.plain()
});
module.exports = class {
  constructor(e, t, n) {
    this.policy = new r(o(e), s(t), n);
  }
  storable() {
    return this.policy.storable();
  }
  satisfiesWithoutRevalidation(e) {
    return this.policy.satisfiesWithoutRevalidation(o(e));
  }
  responseHeaders(e) {
    return new i(this.policy.responseHeaders(s(e)));
  }
  timeToLive() {
    return this.policy.timeToLive();
  }
};