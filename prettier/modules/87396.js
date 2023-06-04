Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerContextPreservation = exports.IsInitialized = void 0;
var r = require(95282);
var i = require(3063);
exports.IsInitialized = !i.JsonConfig.getInstance().noDiagnosticChannel;
var o = "DiagnosticChannel";
if (exports.IsInitialized) {
  var s = require(4106);
  var a = i.JsonConfig.getInstance().noPatchModules.split(",");
  var c = {
    bunyan: s.bunyan,
    console: s.console,
    mongodb: s.mongodb,
    mongodbCore: s.mongodbCore,
    mysql: s.mysql,
    redis: s.redis,
    pg: s.pg,
    pgPool: s.pgPool,
    winston: s.winston,
    azuresdk: s.azuresdk
  };
  for (var l in c) if (-1 === a.indexOf(l)) {
    c[l].enable();
    r.info(o, "Subscribed to " + l + " events");
  }
  if (a.length > 0) {
    r.info(o, "Some modules will not be patched", a);
  }
} else r.info(o, "Not subscribing to dependency autocollection because APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL was set");
exports.registerContextPreservation = function (e) {
  if (exports.IsInitialized) {
    require(84953).channel.addContextPreservation(e);
  }
};