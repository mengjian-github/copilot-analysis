Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.rebuildTree = exports.foldTree = exports.visitTreeConditionally = exports.visitTree = exports.resetLineNumbers = exports.mapLabels = exports.clearLabelsIf = exports.clearLabels = void 0;
const r = require(4876);
function visitTree(e, t, n) {
  !function e(r) {
    if ("topDown" === n) {
      t(r);
    }
    r.subs.forEach(t => {
      e(t);
    });
    if ("bottomUp" === n) {
      t(r);
    }
  }(e);
}
exports.clearLabels = function (e) {
  visitTree(e, e => {
    e.label = void 0;
  }, "bottomUp");
  return e;
};
exports.clearLabelsIf = function (e, t) {
  visitTree(e, e => {
    e.label = e.label ? t(e.label) ? void 0 : e.label : void 0;
  }, "bottomUp");
  return e;
};
exports.mapLabels = function e(t, n) {
  switch (t.type) {
    case "line":
    case "virtual":
      const r = t.subs.map(t => e(t, n));
      return {
        ...t,
        subs: r,
        label: t.label ? n(t.label) : void 0
      };
    case "blank":
      return {
        ...t,
        label: t.label ? n(t.label) : void 0
      };
    case "top":
      return {
        ...t,
        subs: t.subs.map(t => e(t, n)),
        label: t.label ? n(t.label) : void 0
      };
  }
};
exports.resetLineNumbers = function (e) {
  let t = 0;
  visitTree(e, function (e) {
    if (r.isVirtual(e) || r.isTop(e)) {
      e.lineNumber = t;
      t++;
    }
  }, "topDown");
};
exports.visitTree = visitTree;
exports.visitTreeConditionally = function (e, t, n) {
  !function e(r) {
    if ("topDown" === n && !t(r)) return !1;
    let i = !0;
    r.subs.forEach(t => {
      i = i && e(t);
    });
    if ("bottomUp" === n) {
      i = i && t(r);
    }
    return i;
  }(e);
};
exports.foldTree = function (e, t, n, r) {
  let o = t;
  visitTree(e, function (e) {
    o = n(e, o);
  }, r);
  return o;
};
exports.rebuildTree = function (e, t, n) {
  const i = e => {
    if (void 0 !== n && n(e)) return e;
    {
      const n = e.subs.map(i).filter(e => void 0 !== e);
      e.subs = n;
      return t(e);
    }
  };
  const o = i(e);
  return void 0 !== o ? o : r.topNode();
};