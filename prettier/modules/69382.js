Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.domainSupportsProperties = exports.RemoteDependencyDataConstants = void 0;
var r = require(99958);
var RemoteDependencyDataConstants = function () {
  function e() {}
  e.TYPE_HTTP = "Http";
  e.TYPE_AI = "Http (tracked component)";
  return e;
}();
exports.RemoteDependencyDataConstants = RemoteDependencyDataConstants;
exports.domainSupportsProperties = function (e) {
  return "properties" in e || e instanceof r.EventData || e instanceof r.ExceptionData || e instanceof r.MessageData || e instanceof r.MetricData || e instanceof r.PageViewData || e instanceof r.RemoteDependencyData || e instanceof r.RequestData;
};