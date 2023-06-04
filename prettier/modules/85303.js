Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.diffWords = function (e, t, n) {
  n = o.generateOptions(n, {
    ignoreWhitespace: !0
  });
  return wordDiff.diff(e, t, n);
};
exports.diffWordsWithSpace = function (e, t, n) {
  return wordDiff.diff(e, t, n);
};
exports.wordDiff = void 0;
var r;
var i = (r = require(95913)) && r.__esModule ? r : {
  default: r
};
var o = require(68009);
var s = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var a = /\S/;
var wordDiff = new i.default();
exports.wordDiff = wordDiff;
wordDiff.equals = function (e, t) {
  if (this.options.ignoreCase) {
    e = e.toLowerCase();
    t = t.toLowerCase();
  }
  return e === t || this.options.ignoreWhitespace && !a.test(e) && !a.test(t);
};
wordDiff.tokenize = function (e) {
  for (t = e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/), n = 0, void 0; n < t.length - 1; n++) {
    var t;
    var n;
    if (!t[n + 1] && t[n + 2] && s.test(t[n]) && s.test(t[n + 2])) {
      t[n] += t[n + 2];
      t.splice(n + 1, 2);
      n--;
    }
  }
  return t;
};