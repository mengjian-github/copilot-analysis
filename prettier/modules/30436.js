Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.lastLineOf = exports.firstLineOf = exports.encodeTree = exports.describeTree = exports.deparseAndCutTree = exports.deparseTree = exports.deparseLine = void 0;
const r = require(29608);
const i = require(79829);
function deparseLine(e) {
  return " ".repeat(e.indentation) + e.sourceLine + "\n";
}
function deparseTree(e) {
  return i.foldTree(e, "", function (e, t) {
    let n = "";
    if (r.isLine(e)) {
      n = deparseLine(e);
    } else {
      if (r.isBlank(e)) {
        n = "\n";
      }
    }
    return t + n;
  }, "topDown");
}
exports.deparseLine = deparseLine;
exports.deparseTree = deparseTree;
exports.deparseAndCutTree = function (e, t) {
  const n = new Set(t);
  const i = [];
  let a = "";
  (function e(t) {
    if (void 0 !== t.label && n.has(t.label)) {
      if ("" !== a) {
        i.push({
          label: void 0,
          source: a
        });
      }
      i.push({
        label: t.label,
        source: deparseTree(t)
      });
      a = "";
    } else {
      if (r.isLine(t)) {
        a += deparseLine(t);
      }
      t.subs.forEach(e);
    }
  })(e);
  if ("" !== a) {
    i.push({
      label: void 0,
      source: a
    });
  }
  return i;
};
exports.describeTree = function e(t, n = 0) {
  const i = " ".repeat(n);
  if (void 0 === t) return "UNDEFINED NODE";
  let o;
  o = void 0 === t.subs ? "UNDEFINED SUBS" : t.subs.map(t => e(t, n + 2)).join(",\n");
  o = "" === o ? "[]" : `[\n${o}\n      ${i}]`;
  const s = (r.isVirtual(t) || r.isTop(t) ? "   " : String(t.lineNumber).padStart(3, " ")) + `:  ${i}`;
  const a = void 0 === t.label ? "" : JSON.stringify(t.label);
  return r.isVirtual(t) || r.isTop(t) ? `${s}vnode(${t.indentation}, ${a}, ${o})` : r.isBlank(t) ? `${s}blank(${a ?? ""})` : `${s}lnode(${t.indentation}, ${a}, ${JSON.stringify(t.sourceLine)}, ${o})`;
};
exports.encodeTree = function e(t, n = "") {
  const i = void 0 === t.label ? "" : `, ${JSON.stringify(t.label)}`;
  const o = !r.isBlank(t) && t.subs.length > 0 ? `[\n${t.subs.map(t => e(t, n + "  ")).join(", \n")}\n${n}]` : "[]";
  switch (t.type) {
    case "blank":
      return `${n}blankNode(${t.lineNumber}${i})`;
    case "top":
      return `topNode(${o}${i})`;
    case "virtual":
      return `${n}virtualNode(${t.indentation}, ${o}${i})`;
    case "line":
      return `${n}lineNode(${t.indentation}, ${t.lineNumber}, "${t.sourceLine}", ${o}${i})`;
  }
};
exports.firstLineOf = function e(t) {
  if (r.isLine(t) || r.isBlank(t)) return t.lineNumber;
  for (const n of t.subs) {
    const t = e(n);
    if (void 0 !== t) return t;
  }
};
exports.lastLineOf = function e(t) {
  let n;
  let i = t.subs.length - 1;
  for (; i >= 0 && void 0 === n;) {
    n = e(t.subs[i]);
    i--;
  }
  return void 0 !== n || r.isVirtual(t) || r.isTop(t) ? n : t.lineNumber;
};