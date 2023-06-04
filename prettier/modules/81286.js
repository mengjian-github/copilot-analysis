Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.structuredPatch = structuredPatch;
exports.formatPatch = formatPatch;
exports.createTwoFilesPatch = createTwoFilesPatch;
exports.createPatch = function (e, t, n, r, i, o) {
  return createTwoFilesPatch(e, e, t, n, r, i, o);
};
var r = require(18187);
function i(e) {
  return function (e) {
    if (Array.isArray(e)) return o(e);
  }(e) || function (e) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e);
  }(e) || function (e, t) {
    if (e) {
      if ("string" == typeof e) return o(e, t);
      var n = Object.prototype.toString.call(e).slice(8, -1);
      if ("Object" === n && e.constructor) {
        n = e.constructor.name;
      }
      return "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? o(e, t) : void 0;
    }
  }(e) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function o(e, t) {
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
function structuredPatch(e, t, n, o, s, a, c) {
  if (c) {
    c = {};
  }
  if (void 0 === c.context) {
    c.context = 4;
  }
  var l = r.diffLines(n, o, c);
  if (l) {
    l.push({
      value: "",
      lines: []
    });
    for (u = [], p = 0, d = 0, h = [], f = 1, m = 1, g = function (e) {
      var t = l[e];
      var r = t.lines || t.value.replace(/\n$/, "").split("\n");
      t.lines = r;
      if (t.added || t.removed) {
        var s;
        if (!p) {
          var a = l[e - 1];
          p = f, d = m, a && (h = c.context > 0 ? _(a.lines.slice(-c.context)) : [], p -= h.length, d -= h.length);
        }
        (s = h).push.apply(s, i(r.map(function (e) {
          return (t.added ? "+" : "-") + e;
        }))), t.added ? m += r.length : f += r.length;
      } else {
        if (p) if (r.length <= 2 * c.context && e < l.length - 2) {
          var g;
          (g = h).push.apply(g, i(_(r)));
        } else {
          var y,
            v = Math.min(r.length, c.context);
          (y = h).push.apply(y, i(_(r.slice(0, v))));
          var b = {
            oldStart: p,
            oldLines: f - p + v,
            newStart: d,
            newLines: m - d + v,
            lines: h
          };
          if (e >= l.length - 2 && r.length <= c.context) {
            var E = /\n$/.test(n),
              w = /\n$/.test(o),
              T = 0 == r.length && h.length > b.oldLines;
            !E && T && n.length > 0 && h.splice(b.oldLines, 0, "\\ No newline at end of file"), (E || T) && w || h.push("\\ No newline at end of file");
          }
          u.push(b), p = 0, d = 0, h = [];
        }
        f += r.length, m += r.length;
      }
    }, y = 0, void 0; y < l.length; y++) {
      var u;
      var p;
      var d;
      var h;
      var f;
      var m;
      var g;
      var y;
      g(y);
    }
    return {
      oldFileName: e,
      newFileName: t,
      oldHeader: s,
      newHeader: a,
      hunks: u
    };
  }
  function _(e) {
    return e.map(function (e) {
      return " " + e;
    });
  }
}
function formatPatch(e) {
  var t = [];
  if (e.oldFileName == e.newFileName) {
    t.push("Index: " + e.oldFileName);
  }
  t.push("===================================================================");
  t.push("--- " + e.oldFileName + (void 0 === e.oldHeader ? "" : "\t" + e.oldHeader));
  t.push("+++ " + e.newFileName + (void 0 === e.newHeader ? "" : "\t" + e.newHeader));
  for (var n = 0; n < e.hunks.length; n++) {
    var r = e.hunks[n];
    if (0 === r.oldLines) {
      r.oldStart -= 1;
    }
    if (0 === r.newLines) {
      r.newStart -= 1;
    }
    t.push("@@ -" + r.oldStart + "," + r.oldLines + " +" + r.newStart + "," + r.newLines + " @@");
    t.push.apply(t, r.lines);
  }
  return t.join("\n") + "\n";
}
function createTwoFilesPatch(e, t, n, r, i, o, c) {
  return formatPatch(structuredPatch(e, t, n, r, i, o, c));
}