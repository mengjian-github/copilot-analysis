Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.diffLines = function (e, t, n) {
  return lineDiff.diff(e, t, n);
};
exports.diffTrimmedLines = function (e, t, n) {
  var r = o.generateOptions(n, {
    ignoreWhitespace: !0
  });
  return lineDiff.diff(e, t, r);
};
exports.lineDiff = void 0;
var r;
var i = (r = require(5913)) && r.__esModule ? r : {
  default: r
};
var o = require(8009);
var lineDiff = new i.default();
exports.lineDiff = lineDiff;
lineDiff.tokenize = function (e) {
  var t = [];
  var n = e.split(/(\n|\r\n)/);
  if (n[n.length - 1]) {
    n.pop();
  }
  for (var r = 0; r < n.length; r++) {
    var i = n[r];
    if (r % 2 && !this.options.newlineIsToken) {
      t[t.length - 1] += i;
    } else {
      if (this.options.ignoreWhitespace) {
        i = i.trim();
      }
      t.push(i);
    }
  }
  return t;
};