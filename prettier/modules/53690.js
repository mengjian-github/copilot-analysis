Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.applyPatch = applyPatch;
exports.applyPatches = function (e, t) {
  if ("string" == typeof e) {
    e = i.parsePatch(e);
  }
  var n = 0;
  !function r() {
    var i = e[n++];
    if (!i) return t.complete();
    t.loadFile(i, function (e, n) {
      if (e) return t.complete(e);
      var o = applyPatch(n, i, t);
      t.patched(i, o, function (e) {
        if (e) return t.complete(e);
        r();
      });
    });
  }();
};
var r;
var i = require(33719);
var o = (r = require(38169)) && r.__esModule ? r : {
  default: r
};
function applyPatch(e, t) {
  var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  if ("string" == typeof t) {
    t = i.parsePatch(t);
  }
  if (Array.isArray(t)) {
    if (t.length > 1) throw new Error("applyPatch only works with a single input.");
    t = t[0];
  }
  var r;
  var s;
  var a = e.split(/\r\n|[\n\v\f\r\x85]/);
  var c = e.match(/\r\n|[\n\v\f\r\x85]/g) || [];
  var l = t.hunks;
  var u = n.compareLine || function (e, t, n, r) {
    return t === r;
  };
  var p = 0;
  var d = n.fuzzFactor || 0;
  var h = 0;
  var f = 0;
  function m(e, t) {
    for (var n = 0; n < e.lines.length; n++) {
      var r = e.lines[n];
      var i = r.length > 0 ? r[0] : " ";
      var o = r.length > 0 ? r.substr(1) : r;
      if (" " === i || "-" === i) {
        if (!u(t + 1, a[t], i, o) && ++p > d) return !1;
        t++;
      }
    }
    return !0;
  }
  for (var g = 0; g < l.length; g++) {
    for (y = l[g], _ = a.length - y.oldLines, v = 0, b = f + y.oldStart - 1, E = o.default(b, h, _), void 0; void 0 !== v; v = E()) {
      var y;
      var _;
      var v;
      var b;
      var E;
      if (m(y, b + v)) {
        y.offset = f += v;
        break;
      }
    }
    if (void 0 === v) return !1;
    h = y.offset + y.oldStart + y.oldLines;
  }
  for (w = 0, T = 0, void 0; T < l.length; T++) {
    var w;
    var T;
    var S = l[T];
    var x = S.oldStart + S.offset + w - 1;
    w += S.newLines - S.oldLines;
    for (var C = 0; C < S.lines.length; C++) {
      var I = S.lines[C];
      var A = I.length > 0 ? I[0] : " ";
      var k = I.length > 0 ? I.substr(1) : I;
      var P = S.linedelimiters[C];
      if (" " === A) x++;else if ("-" === A) {
        a.splice(x, 1);
        c.splice(x, 1);
      } else if ("+" === A) {
        a.splice(x, 0, k);
        c.splice(x, 0, P);
        x++;
      } else if ("\\" === A) {
        var N = S.lines[C - 1] ? S.lines[C - 1][0] : null;
        if ("+" === N) {
          r = !0;
        } else {
          if ("-" === N) {
            s = !0;
          }
        }
      }
    }
  }
  if (r) for (; !a[a.length - 1];) {
    a.pop();
    c.pop();
  } else if (s) {
    a.push("");
    c.push("\n");
  }
  for (var O = 0; O < a.length - 1; O++) a[O] = a[O] + c[O];
  return a.join("");
}