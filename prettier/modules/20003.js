Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getEngineURL = exports.getProxyURLWithPath = exports.TEST_ENGINE_PATHS = exports.OPENAI_PROXY_HOST = void 0;
const r = require(51133);
const i = require(59189);
const o = require(60070);
exports.OPENAI_PROXY_HOST = "https://copilot-proxy.githubusercontent.com";
const s = "/v1/engines/copilot-codex";
function getProxyURLWithPath(e, n) {
  let i = function (e) {
    return o.isRunningInTest(e) ? r.getConfig(e, r.ConfigKey.DebugTestOverrideProxyUrl) : r.getConfig(e, r.ConfigKey.DebugOverrideProxyUrl);
  }(e);
  if (0 == i.length) {
    i = exports.OPENAI_PROXY_HOST;
  }
  return `${i}${n}`;
}
exports.TEST_ENGINE_PATHS = [s];
exports.getProxyURLWithPath = getProxyURLWithPath;
exports.getEngineURL = async function (e, t = "", n, o = "", c = "", l) {
  return getProxyURLWithPath(e, await async function (e, t, n, o, a, c) {
    const l = r.getConfig(e, r.ConfigKey.DebugOverrideEngine);
    if (l) return `/v1/engines/${l}`;
    const u = await e.get(i.Features).customEngine({
      repoNwo: t,
      fileType: n,
      userKind: a,
      dogFood: o,
      telemetryData: c
    });
    return "" !== u ? `/v1/engines/${u}` : s;
  }(e, t, n, o, c, l));
};