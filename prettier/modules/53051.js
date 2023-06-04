Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.calcLineCount = calcLineCount;
exports.merge = function (e, t, n) {
  e = l(e, n);
  t = l(t, n);
  var r = {};
  if (e.index || t.index) {
    r.index = e.index || t.index;
  }
  if (e.newFileName || t.newFileName) {
    if (u(e)) {
      if (u(t)) {
        r.oldFileName = p(r, e.oldFileName, t.oldFileName);
        r.newFileName = p(r, e.newFileName, t.newFileName);
        r.oldHeader = p(r, e.oldHeader, t.oldHeader);
        r.newHeader = p(r, e.newHeader, t.newHeader);
      } else {
        r.oldFileName = e.oldFileName;
        r.newFileName = e.newFileName;
        r.oldHeader = e.oldHeader;
        r.newHeader = e.newHeader;
      }
    } else {
      r.oldFileName = t.oldFileName || e.oldFileName;
      r.newFileName = t.newFileName || e.newFileName;
      r.oldHeader = t.oldHeader || e.oldHeader;
      r.newHeader = t.newHeader || e.newHeader;
    }
  }
  r.hunks = [];
  for (i = 0, o = 0, s = 0, a = 0, void 0; i < e.hunks.length || o < t.hunks.length;) {
    var i;
    var o;
    var s;
    var a;
    var c = e.hunks[i] || {
      oldStart: 1 / 0
    };
    var m = t.hunks[o] || {
      oldStart: 1 / 0
    };
    if (d(c, m)) {
      r.hunks.push(h(c, s));
      i++;
      a += c.newLines - c.oldLines;
    } else if (d(m, c)) {
      r.hunks.push(h(m, a));
      o++;
      s += m.newLines - m.oldLines;
    } else {
      var g = {
        oldStart: Math.min(c.oldStart, m.oldStart),
        oldLines: 0,
        newStart: Math.min(c.newStart + s, m.oldStart + a),
        newLines: 0,
        lines: []
      };
      f(g, c.oldStart, c.lines, m.oldStart, m.lines);
      o++;
      i++;
      r.hunks.push(g);
    }
  }
  return r;
};
var r = require(81286);
var i = require(33719);
var o = require(67780);
function s(e) {
  return function (e) {
    if (Array.isArray(e)) return a(e);
  }(e) || function (e) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e);
  }(e) || function (e, t) {
    if (e) {
      if ("string" == typeof e) return a(e, t);
      var n = Object.prototype.toString.call(e).slice(8, -1);
      if ("Object" === n && e.constructor) {
        n = e.constructor.name;
      }
      return "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? a(e, t) : void 0;
    }
  }(e) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function a(e, t) {
  if (null == t || t > e.length) {
    t = e.length;
  }
  for (n = 0, r = new Array(t), void 0; n < t; n++) {
    var n;
    var r;
    r[n] = e[n];
  }
  return r;
}
function calcLineCount(e) {
  var t = T(e.lines);
  var n = t.oldLines;
  var r = t.newLines;
  if (void 0 !== n) {
    e.oldLines = n;
  } else {
    delete e.oldLines;
  }
  if (void 0 !== r) {
    e.newLines = r;
  } else {
    delete e.newLines;
  }
}
function l(e, t) {
  if ("string" == typeof e) {
    if (/^@@/m.test(e) || /^Index:/m.test(e)) return i.parsePatch(e)[0];
    if (!t) throw new Error("Must provide a base reference or pass in a patch");
    return r.structuredPatch(void 0, void 0, t, e);
  }
  return e;
}
function u(e) {
  return e.newFileName && e.newFileName !== e.oldFileName;
}
function p(e, t, n) {
  return t === n ? t : (e.conflict = !0, {
    mine: t,
    theirs: n
  });
}
function d(e, t) {
  return e.oldStart < t.oldStart && e.oldStart + e.oldLines < t.oldStart;
}
function h(e, t) {
  return {
    oldStart: e.oldStart,
    oldLines: e.oldLines,
    newStart: e.newStart + t,
    newLines: e.newLines,
    lines: e.lines
  };
}
function f(e, t, n, r, i) {
  var o = {
    offset: t,
    lines: n,
    index: 0
  };
  var a = {
    offset: r,
    lines: i,
    index: 0
  };
  for (_(e, o, a), _(e, a, o); o.index < o.lines.length && a.index < a.lines.length;) {
    var l = o.lines[o.index];
    var u = a.lines[a.index];
    if ("-" !== l[0] && "+" !== l[0] || "-" !== u[0] && "+" !== u[0]) {
      if ("+" === l[0] && " " === u[0]) {
        var p;
        (p = e.lines).push.apply(p, s(b(o)));
      } else if ("+" === u[0] && " " === l[0]) {
        var d;
        (d = e.lines).push.apply(d, s(b(a)));
      } else if ("-" === l[0] && " " === u[0]) {
        g(e, o, a);
      } else {
        if ("-" === u[0] && " " === l[0]) {
          g(e, a, o, !0);
        } else {
          if (l === u) {
            e.lines.push(l);
            o.index++;
            a.index++;
          } else {
            y(e, b(o), b(a));
          }
        }
      }
    } else m(e, o, a);
  }
  v(e, o);
  v(e, a);
  calcLineCount(e);
}
function m(e, t, n) {
  var r = b(t);
  var i = b(n);
  if (E(r) && E(i)) {
    var a;
    var c;
    if (o.arrayStartsWith(r, i) && w(n, r, r.length - i.length)) return void (a = e.lines).push.apply(a, s(r));
    if (o.arrayStartsWith(i, r) && w(t, i, i.length - r.length)) return void (c = e.lines).push.apply(c, s(i));
  } else if (o.arrayEqual(r, i)) {
    var l;
    return void (l = e.lines).push.apply(l, s(r));
  }
  y(e, r, i);
}
function g(e, t, n, r) {
  var i;
  var o = b(t);
  var a = function (e, t) {
    for (n = [], r = [], i = 0, o = !1, s = !1, void 0; i < t.length && e.index < e.lines.length;) {
      var n;
      var r;
      var i;
      var o;
      var s;
      var a = e.lines[e.index];
      var c = t[i];
      if ("+" === c[0]) break;
      o = o || " " !== a[0];
      r.push(c);
      i++;
      if ("+" === a[0]) for (s = !0; "+" === a[0];) n.push(a), a = e.lines[++e.index];
      if (c.substr(1) === a.substr(1)) {
        n.push(a);
        e.index++;
      } else {
        s = !0;
      }
    }
    if ("+" === (t[i] || "")[0] && o) {
      s = !0;
    }
    if (s) return n;
    for (; i < t.length;) r.push(t[i++]);
    return {
      merged: r,
      changes: n
    };
  }(n, o);
  if (a.merged) {
    (i = e.lines).push.apply(i, s(a.merged));
  } else {
    y(e, r ? a : o, r ? o : a);
  }
}
function y(e, t, n) {
  e.conflict = !0;
  e.lines.push({
    conflict: !0,
    mine: t,
    theirs: n
  });
}
function _(e, t, n) {
  for (; t.offset < n.offset && t.index < t.lines.length;) {
    var r = t.lines[t.index++];
    e.lines.push(r);
    t.offset++;
  }
}
function v(e, t) {
  for (; t.index < t.lines.length;) {
    var n = t.lines[t.index++];
    e.lines.push(n);
  }
}
function b(e) {
  for (t = [], n = e.lines[e.index][0], void 0; e.index < e.lines.length;) {
    var t;
    var n;
    var r = e.lines[e.index];
    if ("-" === n && "+" === r[0]) {
      n = "+";
    }
    if (n !== r[0]) break;
    t.push(r);
    e.index++;
  }
  return t;
}
function E(e) {
  return e.reduce(function (e, t) {
    return e && "-" === t[0];
  }, !0);
}
function w(e, t, n) {
  for (var r = 0; r < n; r++) {
    var i = t[t.length - n + r].substr(1);
    if (e.lines[e.index + r] !== " " + i) return !1;
  }
  e.index += n;
  return !0;
}
function T(e) {
  var t = 0;
  var n = 0;
  e.forEach(function (e) {
    if ("string" != typeof e) {
      var r = T(e.mine);
      var i = T(e.theirs);
      if (void 0 !== t) {
        if (r.oldLines === i.oldLines) {
          t += r.oldLines;
        } else {
          t = void 0;
        }
      }
      if (void 0 !== n) {
        if (r.newLines === i.newLines) {
          n += r.newLines;
        } else {
          n = void 0;
        }
      }
    } else {
      if (void 0 === n || "+" !== e[0] && " " !== e[0]) {
        n++;
      }
      if (void 0 === t || "-" !== e[0] && " " !== e[0]) {
        t++;
      }
    }
  });
  return {
    oldLines: t,
    newLines: n
  };
}