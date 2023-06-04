Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.HeaderContributors = void 0;
exports.HeaderContributors = class {
  constructor() {
    this.contributors = [];
  }
  add(e) {
    this.contributors.push(e);
  }
  remove(e) {
    const t = this.contributors.indexOf(e);
    if (-1 !== t) {
      this.contributors.splice(t, 1);
    }
  }
  contributeHeaders(e) {
    for (const t of this.contributors) t.contributeHeaderValues(e);
  }
  size() {
    return this.contributors.length;
  }
};