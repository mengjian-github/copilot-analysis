Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.indentationBlockFinished = exports.completionCutOrContinue = exports.contextIndentationFromText = exports.contextIndentation = exports.getNodeStart = exports.isBlockBodyFinished = exports.isEmptyBlockStart = void 0;
const locationfactory = require("./location-factory");
const promptlibproxy = require("./prompt-lib-proxy");
exports.isEmptyBlockStart = function (e, t) {
  return promptlibproxy.isEmptyBlockStart(e.languageId, e.getText(), e.offsetAt(t));
};
exports.isBlockBodyFinished = function (e, t, n, o) {
  const s = e.get(locationfactory.LocationFactory);
  const a = t.getText(s.range(s.position(0, 0), n));
  const c = t.offsetAt(n);
  return promptlibproxy.isBlockBodyFinished(t.languageId, a, o, c);
};
exports.getNodeStart = async function (e, t, n, o) {
  const s = e.get(locationfactory.LocationFactory);
  const a = t.getText(s.range(s.position(0, 0), n)) + o;
  const c = await promptlibproxy.getNodeStart(t.languageId, a, t.offsetAt(n));
  if (c) return t.positionAt(c);
};
const o = ["\\{", "\\}", "\\[", "\\]", "\\(", "\\)"].concat(["then", "else", "elseif", "elif", "catch", "finally", "fi", "done", "end", "loop", "until", "where", "when"].map(e => e + "\\b"));
const s = new RegExp(`^(${o.join("|")})`);
function a(e) {
  return s.test(e.trimLeft().toLowerCase());
}
function c(e) {
  const t = /^(\s*)([^]*)$/.exec(e);
  return t && t[2] && t[2].length > 0 ? t[1].length : void 0;
}
function contextIndentationFromText(e, t, n) {
  const r = e.slice(0, t).split("\n");
  const i = e.slice(t).split("\n");
  function o(e, t, r) {
    let i;
    let o;
    let s = t;
    for (; void 0 === i && s >= 0 && s < e.length;) {
      i = c(e[s]);
      o = s;
      s += r;
    }
    if ("python" === n && -1 === r) {
      s++;
      const t = e[s].trim();
      if (t.endsWith('"""')) {
        if (!t.startsWith('"""') || '"""' === t) for (s--; s >= 0 && !e[s].trim().startsWith('"""');) s--;
        if (s >= 0) for (i = void 0, s--; void 0 === i && s >= 0;) {
          i = c(e[s]);
          o = s;
          s--;
        }
      }
    }
    return [i, o];
  }
  const [s, a] = o(r, r.length - 1, -1);
  const l = (() => {
    if (void 0 !== s && void 0 !== a) for (let e = a - 1; e >= 0; e--) {
      const t = c(r[e]);
      if (void 0 !== t && t < s) return t;
    }
  })();
  const [u] = o(i, 1, 1);
  return {
    prev: l,
    current: s ?? 0,
    next: u
  };
}
function completionCutOrContinue(e, t, n) {
  const r = e.split("\n");
  const i = void 0 !== n;
  const o = n?.split("\n").pop();
  let s = 0;
  if (i && "" != o?.trim() && "" !== r[0].trim()) {
    s++;
  }
  if (i) {
    s++;
  }
  if (r.length === s) return "continue";
  const l = Math.max(t.current, t.next ?? 0);
  for (let e = s; e < r.length; e++) {
    let t = r[e];
    if (0 == e && void 0 !== o) {
      t = o + t;
    }
    const n = c(t);
    if (void 0 !== n && (n < l || n === l && !a(t))) return r.slice(0, e).join("\n").length;
  }
  return "continue";
}
exports.contextIndentation = function (e, t) {
  return contextIndentationFromText(e.getText(), e.offsetAt(t), e.languageId);
};
exports.contextIndentationFromText = contextIndentationFromText;
exports.completionCutOrContinue = completionCutOrContinue;
exports.indentationBlockFinished = function (e, t) {
  return async n => {
    const r = completionCutOrContinue(n, e, t);
    return "continue" === r ? void 0 : r;
  };
};