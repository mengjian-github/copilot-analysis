Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FixedBlockModeConfig = void 0;
const config = require("./config");
class FixedBlockModeConfig extends config.BlockModeConfig {
  constructor(e) {
    super();
    this.blockMode = e;
  }
  async forLanguage(e, t) {
    return this.blockMode;
  }
}
exports.FixedBlockModeConfig = FixedBlockModeConfig;