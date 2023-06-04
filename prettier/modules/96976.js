var r;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.diffArrays = function (e, t, n) {
  return arrayDiff.diff(e, t, n);
};
exports.arrayDiff = void 0;
var arrayDiff = new ((r = require(95913)) && r.__esModule ? r : {
  default: r
}).default();
exports.arrayDiff = arrayDiff;
arrayDiff.tokenize = function (e) {
  return e.slice();
};
arrayDiff.join = arrayDiff.removeEmpty = function (e) {
  return e;
};