Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.logger = exports.createProductionContext = void 0;
  const r = require(1402),
    i = require(10299),
    o = require(51133),
    s = require(47870),
    a = require(68281),
    c = require(59189),
    l = require(69748),
    u = require(38965),
    p = require(94777),
    d = require(55600),
    h = require(29899),
    f = require(29094),
    m = require(45808),
    g = require(82279),
    y = require(24419),
    _ = require(69636),
    v = require(6333),
    b = require(60070),
    E = require(26071),
    w = require(47057);
  exports.createProductionContext = function (e) {
    const n = new s.Context();
    return n.set(o.ConfigProvider, e), n.set(i.Clock, new i.Clock()), n.set(o.BuildInfo, new o.BuildInfo()), function (e) {
      e.set(b.RuntimeMode, b.RuntimeMode.fromEnvironment(!1)), e.set(h.LogVerbose, new h.LogVerbose((0, b.isVerboseLoggingEnabled)(e))), e.set(h.LogTarget, new h.ConsoleLog(console));
    }(n), exports.logger.debug(n, "Initializing main context"), n.set(r.CopilotTokenNotifier, new r.CopilotTokenNotifier()), n.set(f.RootCertificateReader, (0, f.getRootCertificateReader)(n)), n.set(g.Fetcher, new m.HelixFetcher(n)), n.set(d.LanguageDetection, (0, d.getLanguageDetection)(n)), n.set(c.Features, new c.Features(n)), n.set(_.PostInsertionNotifier, new _.PostInsertionNotifier()), n.set(v.TelemetryUserConfig, new v.TelemetryUserConfig(n)), n.set(v.TelemetryEndpointUrl, new v.TelemetryEndpointUrl()), n.set(v.TelemetryReporters, new v.TelemetryReporters()), n.set(p.HeaderContributors, new p.HeaderContributors()), n.set(a.UserErrorNotifier, new a.UserErrorNotifier(n)), n.set(u.ContextualFilterManager, new u.ContextualFilterManager()), n.set(y.OpenAIFetcher, new y.LiveOpenAIFetcher()), n.set(o.BlockModeConfig, new o.ConfigBlockModeConfig()), n.set(w.UrlOpener, new w.RealUrlOpener()), n.set(l.ExpConfigMaker, new l.ExpConfigNone()), n.set(E.PromiseQueue, new E.PromiseQueue()), n;
  }, exports.logger = new h.Logger(h.LogLevel.DEBUG, "context");