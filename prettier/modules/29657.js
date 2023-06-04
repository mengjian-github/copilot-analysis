Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.isRepetitive = void 0;
const n = [{
  max_token_sequence_length: 1,
  last_tokens_to_consider: 10
}, {
  max_token_sequence_length: 10,
  last_tokens_to_consider: 30
}, {
  max_token_sequence_length: 20,
  last_tokens_to_consider: 45
}, {
  max_token_sequence_length: 30,
  last_tokens_to_consider: 60
}];
function r(e) {
  const t = function (e) {
    const t = Array(e.length).fill(0);
    t[0] = -1;
    let n = -1;
    for (let r = 1; r < e.length; r++) {
      for (; n >= 0 && e[n + 1] !== e[r];) n = t[n];
      if (e[n + 1] === e[r]) {
        n++;
      }
      t[r] = n;
    }
    return t;
  }(e);
  for (const r of n) if (!(e.length < r.last_tokens_to_consider) && r.last_tokens_to_consider - 1 - t[r.last_tokens_to_consider - 1] <= r.max_token_sequence_length) return !0;
  return !1;
}
exports.isRepetitive = function (e) {
  const t = e.slice();
  t.reverse();
  return r(t) || r(t.filter(e => e.trim().length > 0));
};