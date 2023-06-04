var r;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.diffCss = function (e, t, n) {
  return cssDiff.diff(e, t, n);
};
exports.cssDiff = void 0;
var cssDiff = new ((r = require(95913)) && r.__esModule ? r : {
  default: r
}).default();
exports.cssDiff = cssDiff;
cssDiff.tokenize = function (e) {
  return e.split(/([{}:;,]|\s+)/);
};