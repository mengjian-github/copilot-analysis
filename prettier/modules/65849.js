Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CopilotExtensionApi = exports.getExtensionAPI = void 0;
const r = require(89496);
const i = require(51133);
const o = require(24419);
const s = require(15336);
const a = require(90715);
const c = require(26071);
exports.getExtensionAPI = async function () {
  return await r.extensions.all.find(e => e.id.startsWith("GitHub.copilot"))?.activate();
};
exports.CopilotExtensionApi = class {
  constructor(e) {
    this.ctx = e;
  }
  captureExtensionTelemetry(e) {
    return c.withInlineTelemetryCapture(this.ctx, e);
  }
  setupNextCompletion(e) {
    this.ctx.forceSet(o.OpenAIFetcher, new s.SyntheticCompletions(e));
    this.ctx.forceSet(i.BlockModeConfig, new a.FixedBlockModeConfig(i.BlockMode.Parsing));
  }
};