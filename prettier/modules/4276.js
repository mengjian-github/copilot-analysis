Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.diffJson = function (e, t, n) {
  return jsonDiff.diff(e, t, n);
};
exports.canonicalize = canonicalize;
exports.jsonDiff = void 0;
var r;
var i = (r = require(5913)) && r.__esModule ? r : {
  default: r
};
var o = require(8187);
function s(e) {
  s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e;
  } : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  };
  return s(e);
}
var a = Object.prototype.toString;
var jsonDiff = new i.default();
function canonicalize(e, t, n, r, i) {
  var o;
  var c;
  for (t = t || [], n = n || [], r && (e = r(i, e)), o = 0; o < t.length; o += 1) if (t[o] === e) return n[o];
  if ("[object Array]" === a.call(e)) {
    for (t.push(e), c = new Array(e.length), n.push(c), o = 0; o < e.length; o += 1) c[o] = canonicalize(e[o], t, n, r, i);
    t.pop();
    n.pop();
    return c;
  }
  if (e && e.toJSON) {
    e = e.toJSON();
  }
  if ("object" === s(e) && null !== e) {
    t.push(e), c = {}, n.push(c);
    var u,
      p = [];
    for (u in e) e.hasOwnProperty(u) && p.push(u);
    for (p.sort(), o = 0; o < p.length; o += 1) c[u = p[o]] = canonicalize(e[u], t, n, r, u);
    t.pop(), n.pop();
  } else c = e;
  return c;
}
exports.jsonDiff = jsonDiff;
jsonDiff.useLongestToken = !0;
jsonDiff.tokenize = o.lineDiff.tokenize;
jsonDiff.castInput = function (e) {
  var t = this.options;
  var n = t.undefinedReplacement;
  var r = t.stringifyReplacer;
  var i = void 0 === r ? function (e, t) {
    return void 0 === t ? n : t;
  } : r;
  return "string" == typeof e ? e : JSON.stringify(canonicalize(e, null, null, i), i, "  ");
};
jsonDiff.equals = function (e, t) {
  return i.default.prototype.equals.call(jsonDiff, e.replace(/,([\r\n])/g, "$1"), t.replace(/,([\r\n])/g, "$1"));
};