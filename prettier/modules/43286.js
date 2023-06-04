Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.normalizeIndentCharacter = void 0;
exports.normalizeIndentCharacter = function (e, t, n) {
  function r(e, t, n) {
    const r = new RegExp(`^(${t})+`, "g");
    return e.split("\n").map(e => {
      const t = e.replace(r, "");
      const i = e.length - t.length;
      return n(i) + t;
    }).join("\n");
  }
  let i;
  i = void 0 === e.tabSize || "string" == typeof e.tabSize ? 4 : e.tabSize;
  if (!1 === e.insertSpaces) {
    const e = e => r(e, " ", e => "\t".repeat(Math.floor(e / i)) + " ".repeat(e % i));
    t.displayText = e(t.displayText), t.completionText = e(t.completionText);
  } else if (!0 === e.insertSpaces) {
    const e = e => r(e, "\t", e => " ".repeat(e * i));
    if (t.displayText = e(t.displayText), t.completionText = e(t.completionText), n) {
      const e = e => {
        const t = e.length - e.trimLeft().length,
          n = t % i;
        return 0 !== n && t > 0 ? r(e, " ".repeat(n), e => " ".repeat((Math.floor(e / i) + 1) * i)) : e;
      };
      t.displayText = e(t.displayText), t.completionText = e(t.completionText);
    }
  }
  return t;
};