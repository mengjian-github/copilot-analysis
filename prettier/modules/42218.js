Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.completionsFromGhostTextResults = void 0;
const r = require(42600);
const i = require(16403);
const o = require(89334);
const s = require(43286);
exports.completionsFromGhostTextResults = function (e, t, n, a, c, l, u) {
  const p = e.get(i.LocationFactory);
  const d = a.lineAt(c);
  let h = t.map(e => {
    let t;
    let i = "";
    if (l) {
      e.completion = s.normalizeIndentCharacter(l, e.completion, d.isEmptyOrWhitespace);
    }
    if (e.completion.displayNeedsWsOffset && d.isEmptyOrWhitespace) t = p.range(p.position(c.line, 0), c), i = e.completion.completionText;else if (d.isEmptyOrWhitespace && e.completion.completionText.startsWith(d.text)) t = p.range(p.position(c.line, 0), c), i = e.completion.completionText;else {
      const n = a.getWordRangeAtPosition(c);
      if (e.isMiddleOfTheLine) {
        const n = a.lineAt(c),
          r = p.range(p.position(c.line, 0), c),
          o = a.getText(r);
        t = e.coversSuffix ? n.range : r, i = o + e.completion.displayText;
      } else if (n) {
        const r = a.getText(n);
        t = p.range(n.start, c), i = r + e.completion.completionText;
      } else {
        const n = p.range(p.position(c.line, 0), c);
        t = n, i = a.getText(n) + e.completion.displayText;
      }
    }
    return {
      uuid: r.v4(),
      text: i,
      range: t,
      file: a.uri,
      index: e.completion.completionIndex,
      telemetry: e.telemetry,
      displayText: e.completion.displayText,
      position: c,
      offset: a.offsetAt(c),
      resultType: n
    };
  });
  if (n === o.ResultType.TypingAsSuggested && void 0 !== u) {
    const e = h.find(e => e.index === u);
    if (e) {
      const t = h.filter(e => e.index !== u);
      h = [e, ...t];
    }
  }
  return h;
};