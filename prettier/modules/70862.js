Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.TimeBucketGranularity = exports.DEFAULT_GRANULARITY = exports.GranularityImplementation = void 0;
class GranularityImplementation {
  getCurrentAndUpComingValues(e) {
    return [this.getValue(e), this.getUpcomingValues(e)];
  }
  constructor(e) {
    this.prefix = e;
  }
}
exports.GranularityImplementation = GranularityImplementation;
class r extends GranularityImplementation {
  getValue(e) {
    return this.prefix;
  }
  getUpcomingValues(e) {
    return [];
  }
}
exports.DEFAULT_GRANULARITY = e => new r(e);
exports.TimeBucketGranularity = class extends GranularityImplementation {
  constructor(e, t = .5, n = new Date().setUTCHours(0, 0, 0, 0)) {
    super(e);
    this.prefix = e;
    this.fetchBeforeFactor = t;
    this.anchor = n;
  }
  setTimePeriod(e) {
    if (isNaN(e)) {
      this.timePeriodLengthMs = void 0;
    } else {
      this.timePeriodLengthMs = e;
    }
  }
  setByCallBuckets(e) {
    if (isNaN(e)) {
      this.numByCallBuckets = void 0;
    } else {
      this.numByCallBuckets = e;
    }
  }
  getValue(e) {
    return this.prefix + this.getTimePeriodBucketString(e) + (this.numByCallBuckets ? this.timeHash(e) : "");
  }
  getTimePeriodBucketString(e) {
    return this.timePeriodLengthMs ? this.dateToTimePartString(e) : "";
  }
  getUpcomingValues(e) {
    const t = [];
    const n = this.getUpcomingTimePeriodBucketStrings(e);
    const r = this.getUpcomingByCallBucketStrings();
    for (const e of n) for (const n of r) t.push(this.prefix + e + n);
    return t;
  }
  getUpcomingTimePeriodBucketStrings(e) {
    if (void 0 === this.timePeriodLengthMs) return [""];
    if ((e.getTime() - this.anchor) % this.timePeriodLengthMs < this.fetchBeforeFactor * this.timePeriodLengthMs) return [this.getTimePeriodBucketString(e)];
    {
      const t = new Date(e.getTime() + this.timePeriodLengthMs);
      return [this.getTimePeriodBucketString(e), this.getTimePeriodBucketString(t)];
    }
  }
  getUpcomingByCallBucketStrings() {
    return void 0 === this.numByCallBuckets ? [""] : Array.from(Array(this.numByCallBuckets).keys()).map(e => e.toString());
  }
  timeHash(e) {
    return null == this.numByCallBuckets ? 0 : e.getTime() % this.numByCallBuckets * 7883 % this.numByCallBuckets;
  }
  dateToTimePartString(e) {
    return null == this.timePeriodLengthMs ? "" : Math.floor((e.getTime() - this.anchor) / this.timePeriodLengthMs).toString();
  }
};