Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ElidableText = void 0;
const r = require(23228);
const i = require(68484);
const o = require(36911);
class ElidableText {
  constructor(...e) {
    this.lines = [];
    const t = [];
    for (const n of e) {
      const e = Array.isArray(n) ? n[1] : 1;
      const r = Array.isArray(n) ? n[0] : n;
      if ("string" == typeof r) {
        r.split("\n").forEach(n => t.push(new o.LineWithValueAndCost(n, e)));
      } else {
        if (r instanceof ElidableText) {
          t.push(...r.lines.map(t => t.copy().adjustValue(e)));
        } else {
          if ("source" in r && "languageId" in r) {
            t.push(...i.elidableTextForSourceCode(r).lines.map(t => t.copy().adjustValue(e)));
          }
        }
      }
    }
    this.lines = t;
  }
  adjust(e) {
    this.lines.forEach(t => t.adjustValue(e));
  }
  recost(e = e => r.getTokenizer().tokenLength(e + "\n")) {
    this.lines.forEach(t => t.recost(e));
  }
  makePrompt(e, t = "[...]", n = !0, i = "removeLeastDesirable", s = r.getTokenizer()) {
    return function (e, t, n, r, i, s) {
      if (s.tokenLength(n + "\n") > t) throw new Error("maxTokens must be larger than the ellipsis length");
      if ("removeLeastBangForBuck" === i) {
        e.forEach(e => e.adjustValue(1 / e.cost));
      }
      const a = e.reduce((e, t) => Math.max(e, t.value), 0) + 1;
      const c = e.reduce((e, t) => Math.max(e, t.text.length), 0) + 1;
      const l = n.trim();
      let u = e.reduce((e, t) => e + t.cost, 0);
      let p = e.length + 1;
      for (; u > t && p-- >= -1;) {
        const t = e.reduce((e, t) => t.value < e.value ? t : e);
        const i = e.indexOf(t);
        const p = e.slice(0, i + 1).reverse().find(e => "" !== e.text.trim()) ?? {
          text: ""
        };
        const d = r ? Math.min(p.text.match(/^\s*/)?.[0].length ?? 0, e[i - 1]?.text.trim() === l ? e[i - 1]?.text.match(/^\s*/)?.[0].length ?? 0 : c, e[i + 1]?.text.trim() === l ? e[i + 1]?.text.match(/^\s*/)?.[0].length ?? 0 : c) : 0;
        const h = " ".repeat(d) + n;
        const f = new o.LineWithValueAndCost(h, a, s.tokenLength(h + "\n"), "loose");
        e.splice(i, 1, f);
        if (e[i + 1]?.text.trim() === l) {
          e.splice(i + 1, 1);
        }
        if (e[i - 1]?.text.trim() === l) {
          e.splice(i - 1, 1);
        }
        const m = e.reduce((e, t) => e + t.cost, 0);
        if (m >= u && e.every(e => e.value === a)) {
          r = !1;
        }
        u = m;
      }
      if (p < 0) throw new Error(`Infinite loop in ElidableText.makePrompt: Defensive counter < 0 in ElidableText.makePrompt with end text:\n ${e.map(e => e.text).join("\n")}`);
      return e.map(e => e.text).join("\n");
    }(this.lines.map(e => e.copy()), e, t, n, i, s);
  }
}
exports.ElidableText = ElidableText;