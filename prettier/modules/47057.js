Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.RealUrlOpener = exports.UrlOpener = void 0;
const r = require(78318);
exports.UrlOpener = class {};
exports.RealUrlOpener = class {
  async open(e) {
    await r(e);
  }
};