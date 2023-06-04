Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NetworkStatsbeat = void 0;
exports.NetworkStatsbeat = function (e, t) {
  this.endpoint = e;
  this.host = t;
  this.totalRequestCount = 0;
  this.totalSuccesfulRequestCount = 0;
  this.totalFailedRequestCount = [];
  this.retryCount = [];
  this.exceptionCount = [];
  this.throttleCount = [];
  this.intervalRequestExecutionTime = 0;
  this.lastIntervalRequestExecutionTime = 0;
  this.lastTime = +new Date();
  this.lastRequestCount = 0;
};