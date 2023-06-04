Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.codeQuoteLogger = void 0;
const r = require(29899);
const i = require(91465);
exports.codeQuoteLogger = new r.Logger(r.LogLevel.INFO, `${i.CodeQuoteFeatureName.toLowerCase()}`);