Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.GranularityDirectory = void 0;
const r = require(38142);
const i = require(70862);
const o = r.Filter.CopilotClientTimeBucket;
exports.GranularityDirectory = class {
  constructor(e, t) {
    this.specs = new Map();
    this.prefix = e;
    this.clock = t;
    this.defaultGranularity = i.DEFAULT_GRANULARITY(e);
  }
  selectGranularity(e) {
    for (const [t, n] of this.specs.entries()) if (e.extends(t)) return n;
    return this.defaultGranularity;
  }
  update(e, t, n) {
    t = t > 1 ? t : NaN;
    n = n > 0 ? n : NaN;
    if (isNaN(t) && isNaN(n)) this.specs.delete(e);else {
      const r = new i.TimeBucketGranularity(this.prefix);
      isNaN(t) || r.setByCallBuckets(t), isNaN(n) || r.setTimePeriod(3600 * n * 1e3), this.specs.set(e, r);
    }
  }
  extendFilters(e) {
    const t = this.selectGranularity(e);
    const [n, r] = t.getCurrentAndUpComingValues(this.clock.now());
    return {
      newFilterSettings: e.withChange(o, n),
      otherFilterSettingsToPrefetch: r.map(t => e.withChange(o, t))
    };
  }
};