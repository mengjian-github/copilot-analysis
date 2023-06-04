var t = function () {
  function e(e) {
    this.fieldmap = [];
    if (e) {
      this.fieldmap = this.parseHeader(e);
    }
  }
  e.prototype.toString = function () {
    var e = this.fieldmap;
    return e && 0 != e.length ? e.join(", ") : null;
  };
  e.validateKeyChars = function (e) {
    var t = e.split("@");
    if (2 == t.length) {
      var n = t[0].trim();
      var r = t[1].trim();
      var i = Boolean(n.match(/^[\ ]?[a-z0-9\*\-\_/]{1,241}$/));
      var o = Boolean(r.match(/^[\ ]?[a-z0-9\*\-\_/]{1,14}$/));
      return i && o;
    }
    return 1 == t.length && Boolean(e.match(/^[\ ]?[a-z0-9\*\-\_/]{1,256}$/));
  };
  e.prototype.parseHeader = function (t) {
    var n = [];
    var r = {};
    var i = t.split(",");
    if (i.length > 32) return null;
    for (o = 0, s = i, void 0; o < s.length; o++) {
      var o;
      var s;
      var a = s[o].trim();
      if (0 !== a.length) {
        var c = a.split("=");
        if (2 !== c.length) return null;
        if (!e.validateKeyChars(c[0])) return null;
        if (r[c[0]]) return null;
        r[c[0]] = !0;
        n.push(a);
      }
    }
    return n;
  };
  e.strict = !0;
  return e;
}();
module.exports = t;