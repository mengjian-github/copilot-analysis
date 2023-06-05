Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.codeQuoteLogger = void 0;
const logger = require("./logger");
const i = require(91465);
exports.codeQuoteLogger = new logger.Logger(logger.LogLevel.INFO, `${i.CodeQuoteFeatureName.toLowerCase()}`);