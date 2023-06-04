var r;
var i;
var o;
var s = require(55234);
var a = require(71017).extname;
var c = /^\s*([^;\s]*)(?:;|\s|$)/;
var l = /^text\//i;
function charset(e) {
  if (!e || "string" != typeof e) return !1;
  var t = c.exec(e);
  var n = t && s[t[1].toLowerCase()];
  return n && n.charset ? n.charset : !(!t || !l.test(t[1])) && "UTF-8";
}
exports.charset = charset;
exports.charsets = {
  lookup: charset
};
exports.contentType = function (e) {
  if (!e || "string" != typeof e) return !1;
  var n = -1 === e.indexOf("/") ? exports.lookup(e) : e;
  if (!n) return !1;
  if (-1 === n.indexOf("charset")) {
    var r = exports.charset(n);
    if (r) {
      n += "; charset=" + r.toLowerCase();
    }
  }
  return n;
};
exports.extension = function (e) {
  if (!e || "string" != typeof e) return !1;
  var n = c.exec(e);
  var r = n && exports.extensions[n[1].toLowerCase()];
  return !(!r || !r.length) && r[0];
};
exports.extensions = Object.create(null);
exports.lookup = function (e) {
  if (!e || "string" != typeof e) return !1;
  var n = a("x." + e).toLowerCase().substr(1);
  return n && exports.types[n] || !1;
};
exports.types = Object.create(null);
r = exports.extensions;
i = exports.types;
o = ["nginx", "apache", void 0, "iana"];
Object.keys(s).forEach(function (e) {
  var t = s[e];
  var n = t.extensions;
  if (n && n.length) {
    r[e] = n;
    for (var a = 0; a < n.length; a++) {
      var c = n[a];
      if (i[c]) {
        var l = o.indexOf(s[i[c]].source);
        var u = o.indexOf(t.source);
        if ("application/octet-stream" !== i[c] && (l > u || l === u && "application/" === i[c].substr(0, 12))) continue;
      }
      i[c] = e;
    }
  }
});