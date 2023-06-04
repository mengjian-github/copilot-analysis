Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.makePatchingRequire = void 0;
var r = require(71017);
var i = require(94014);
var o = require(84953);
var s = require(98188);
var a = Object.keys(process.binding("natives"));
var c = s.prototype.require;
exports.makePatchingRequire = function (e) {
  var t = {};
  return function (n) {
    var l = c.apply(this, arguments);
    if (e[n]) {
      var u = s._resolveFilename(n, this);
      if (t.hasOwnProperty(u)) return t[u];
      var p = void 0;
      if (a.indexOf(n) < 0) try {
        p = c.call(this, r.join(n, "package.json")).version;
      } catch (e) {
        return l;
      } else p = process.version.substring(1);
      var d = p.indexOf("-");
      if (d >= 0) {
        p = p.substring(0, d);
      }
      for (h = l, f = 0, m = e[n], void 0; f < m.length; f++) {
        var h;
        var f;
        var m;
        var g = m[f];
        if (i.satisfies(p, g.versionSpecifier) && (h = g.patch(h, u), o.channel)) {
          var y = g.publisherName || n;
          o.channel.addPatchedModule(y, p);
        }
      }
      return t[u] = h;
    }
    return l;
  };
};