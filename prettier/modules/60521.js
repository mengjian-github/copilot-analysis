Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.AggregatedMetricCounter = void 0;
exports.AggregatedMetricCounter = function (e) {
  this.dimensions = e;
  this.totalCount = 0;
  this.lastTotalCount = 0;
  this.intervalExecutionTime = 0;
  this.lastTime = +new Date();
  this.lastIntervalExecutionTime = 0;
};