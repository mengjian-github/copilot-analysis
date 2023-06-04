Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.parseTree = exports.registerLanguageSpecificParser = exports.flattenVirtual = exports.groupBlocks = exports.combineClosersAndOpeners = exports.buildLabelRules = exports.labelVirtualInherited = exports.labelLines = exports.parseRaw = void 0;
const r = require(29608);
const i = require(79829);
function parseRaw(e) {
  const t = e.split("\n");
  const n = t.map(e => e.match(/^\s*/)[0].length);
  const i = t.map(e => e.trimLeft());
  function o(e) {
    const [t, o] = s(e + 1, n[e]);
    return [r.lineNode(n[e], e, i[e], t), o];
  }
  function s(e, t) {
    let s;
    const a = [];
    let c;
    let l = e;
    for (; l < i.length && ("" === i[l] || n[l] > t);) if ("" === i[l]) {
      if (void 0 === c) {
        c = l;
      }
      l += 1;
    } else {
      if (void 0 !== c) {
        for (let e = c; e < l; e++) a.push(r.blankNode(e));
        c = void 0;
      }
      [s, l] = o(l);
      a.push(s);
    }
    if (void 0 !== c) {
      l = c;
    }
    return [a, l];
  }
  const [a, c] = s(0, -1);
  let l = c;
  for (; l < i.length && "" === i[l];) {
    a.push(r.blankNode(l));
    l += 1;
  }
  if (l < i.length) throw new Error(`Parsing did not go to end of file. Ended at ${l} out of ${i.length}`);
  return r.topNode(a);
}
function labelLines(e, t) {
  i.visitTree(e, function (e) {
    if (r.isLine(e)) {
      const n = t.find(t => t.matches(e.sourceLine));
      if (n) {
        e.label = n.label;
      }
    }
  }, "bottomUp");
}
function buildLabelRules(e) {
  return Object.keys(e).map(t => {
    let n;
    n = e[t].test ? n => e[t].test(n) : e[t];
    return {
      matches: n,
      label: t
    };
  });
}
function combineClosersAndOpeners(e) {
  const t = i.rebuildTree(e, function (e) {
    if (0 === e.subs.length || -1 === e.subs.findIndex(e => "closer" === e.label || "opener" === e.label)) return e;
    const t = [];
    let n;
    for (let i = 0; i < e.subs.length; i++) {
      const o = e.subs[i];
      const s = e.subs[i - 1];
      if ("opener" === o.label && void 0 !== s && r.isLine(s)) {
        s.subs.push(o);
        o.subs.forEach(e => s.subs.push(e));
        o.subs = [];
      } else if ("closer" === o.label && void 0 !== n && (r.isLine(o) || r.isVirtual(o)) && o.indentation >= n.indentation) {
        let e = t.length - 1;
        for (; e > 0 && r.isBlank(t[e]);) e -= 1;
        n.subs.push(...t.splice(e + 1));
        if (o.subs.length > 0) {
          const e = n.subs.findIndex(e => "newVirtual" !== e.label),
            t = n.subs.slice(0, e),
            i = n.subs.slice(e),
            s = i.length > 0 ? [(0, r.virtualNode)(o.indentation, i, "newVirtual")] : [];
          n.subs = [...t, ...s, o];
        } else n.subs.push(o);
      } else {
        t.push(o);
        if (r.isBlank(o)) {
          n = o;
        }
      }
    }
    e.subs = t;
    return e;
  });
  i.clearLabelsIf(e, e => "newVirtual" === e);
  return t;
}
exports.parseRaw = parseRaw;
exports.labelLines = labelLines;
exports.labelVirtualInherited = function (e) {
  i.visitTree(e, function (e) {
    if (r.isVirtual(e) && void 0 === e.label) {
      const t = e.subs.filter(e => !r.isBlank(e));
      if (1 === t.length) {
        e.label = t[0].label;
      }
    }
  }, "bottomUp");
};
exports.buildLabelRules = buildLabelRules;
exports.combineClosersAndOpeners = combineClosersAndOpeners;
exports.groupBlocks = function (e, t = r.isBlank, n) {
  return i.rebuildTree(e, function (e) {
    if (e.subs.length <= 1) return e;
    const i = [];
    let o;
    let s = [];
    let a = !1;
    function c(e = !1) {
      if (void 0 !== o && (i.length > 0 || !e)) {
        const e = r.virtualNode(o, s, n);
        i.push(e);
      } else s.forEach(e => i.push(e));
    }
    for (let n = 0; n < e.subs.length; n++) {
      const i = e.subs[n];
      const l = t(i);
      if (!l && a) {
        c();
        s = [];
      }
      a = l;
      s.push(i);
      if (r.isBlank(i)) {
        o = o ?? i.indentation;
      }
    }
    c(!0);
    e.subs = i;
    return e;
  });
};
exports.flattenVirtual = function (e) {
  return i.rebuildTree(e, function (e) {
    return r.isVirtual(e) && void 0 === e.label && e.subs.length <= 1 ? 0 === e.subs.length ? void 0 : e.subs[0] : (1 === e.subs.length && r.isVirtual(e.subs[0]) && void 0 === e.subs[0].label && (e.subs = e.subs[0].subs), e);
  });
};
const l = buildLabelRules({
  opener: /^[\[({]/,
  closer: /^[\])}]/
});
const u = {};
exports.registerLanguageSpecificParser = function (e, t) {
  u[e] = t;
};
exports.parseTree = function (e, t) {
  const n = parseRaw(e);
  const r = u[t ?? ""];
  return r ? r(n) : (labelLines(n, l), combineClosersAndOpeners(n));
};