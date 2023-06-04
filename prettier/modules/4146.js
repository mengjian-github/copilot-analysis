var r;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.diffSentences = function (e, t, n) {
  return sentenceDiff.diff(e, t, n);
};
exports.sentenceDiff = void 0;
var sentenceDiff = new ((r = require(5913)) && r.__esModule ? r : {
  default: r
}).default();
exports.sentenceDiff = sentenceDiff;
sentenceDiff.tokenize = function (e) {
  return e.split(/(\S.+?[.!?])(?=\s+|$)/);
};