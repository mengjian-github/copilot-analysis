Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.hasMinLexemeLength = exports.checkInString = exports.lexemeLength = exports.SnippyWindowSize = exports.MinTokenLength = void 0;
const n = new RegExp("[_\\p{L}\\p{Nd}]+|====+|----+|####+|////+|\\*\\*\\*\\*+|[\\p{P}\\p{S}]", "gu");
function lexemeLength(e) {
  let r;
  let i = 0;
  n.lastIndex = 0;
  do {
    r = n.exec(e);
    if (r) {
      i += 1;
    }
    if (i >= exports.MinTokenLength) break;
  } while (r);
  return i;
}
function i(e, t) {
  let r;
  let i = 0;
  n.lastIndex = 0;
  do {
    r = n.exec(e);
    if (r && (i += 1, i >= t)) return n.lastIndex;
  } while (r);
  return e.length;
}
exports.MinTokenLength = 60;
exports.SnippyWindowSize = 60;
exports.lexemeLength = lexemeLength;
exports.checkInString = function (e, n) {
  let r;
  let o;
  if (void 0 === n) {
    r = 0;
    o = e.length;
  } else {
    r = function (e, t) {
      const n = e.split("").reverse().join("");
      const r = i(n, t);
      return n.length - r;
    }(e.slice(0, n[0]), exports.SnippyWindowSize);
    o = n[1] + i(e.slice(n[1]), exports.SnippyWindowSize);
  }
  return function (e, t) {
    let n = e.slice(r, o).indexOf(t.text);
    if (-1 !== n) {
      n += r;
    } else {
      n = e.indexOf(t.text);
    }
    return {
      foundAt: n > -1 ? n : void 0
    };
  };
};
exports.hasMinLexemeLength = function (e) {
  return lexemeLength(e) >= exports.MinTokenLength;
};