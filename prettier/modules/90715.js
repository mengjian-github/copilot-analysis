Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FixedBlockModeConfig = void 0;
const r = require(51133);
class FixedBlockModeConfig extends r.BlockModeConfig {
  constructor(e) {
    super();
    this.blockMode = e;
  }
  async forLanguage(e, t) {
    return this.blockMode;
  }
}
exports.FixedBlockModeConfig = FixedBlockModeConfig;