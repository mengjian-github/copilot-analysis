Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.completionsFromGhostTextResults = void 0;
const r = require(42600);
const i = require(16403);
const o = require(89334);
const s = require(43286);
exports.completionsFromGhostTextResults = function (e, texts, n, a, c, l, u) {
  const p = e.get(i.LocationFactory);
  const d = a.lineAt(c);
  let h = texts.map((text) => {
    let range;
    let newText = "";
    if (l) {
      text.completion = s.normalizeIndentCharacter(
        l,
        text.completion,
        d.isEmptyOrWhitespace
      );
    }
    if (text.completion.displayNeedsWsOffset && d.isEmptyOrWhitespace)
      (range = p.range(p.position(c.line, 0), c)),
        (newText = text.completion.completionText);
    else if (
      d.isEmptyOrWhitespace &&
      text.completion.completionText.startsWith(d.text)
    )
      (range = p.range(p.position(c.line, 0), c)),
        (newText = text.completion.completionText);
    else {
      const n = a.getWordRangeAtPosition(c);
      if (text.isMiddleOfTheLine) {
        const n = a.lineAt(c),
          r = p.range(p.position(c.line, 0), c),
          o = a.getText(r);
        (range = text.coversSuffix ? n.range : r),
          (newText = o + text.completion.displayText);
      } else if (n) {
        const r = a.getText(n);
        (range = p.range(n.start, c)), (newText = r + text.completion.completionText);
      } else {
        const n = p.range(p.position(c.line, 0), c);
        (range = n), (newText = a.getText(n) + text.completion.displayText);
      }
    }
    return {
      uuid: r.v4(),
      text: newText,
      range: range,
      file: a.uri,
      index: text.completion.completionIndex,
      telemetry: text.telemetry,
      displayText: text.completion.displayText,
      position: c,
      offset: a.offsetAt(c),
      resultType: n,
    };
  });
  if (n === o.ResultType.TypingAsSuggested && void 0 !== u) {
    const e = h.find((e) => e.index === u);
    if (e) {
      const t = h.filter((e) => e.index !== u);
      h = [e, ...t];
    }
  }
  return h;
};
