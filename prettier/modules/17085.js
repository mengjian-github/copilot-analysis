var r = require(34433).h;
var i = require(32728);
var o = /(\r?\n)/;
var s = "$$$isSourceNode$$$";
function a(e, t, n, r, i) {
  this.children = [];
  this.sourceContents = {};
  this.line = null == e ? null : e;
  this.column = null == t ? null : t;
  this.source = null == n ? null : n;
  this.name = null == i ? null : i;
  this[s] = !0;
  if (null != r) {
    this.add(r);
  }
}
a.fromStringWithSourceMap = function (e, t, n) {
  var r = new a();
  var s = e.split(o);
  var c = 0;
  var l = function () {
    return e() + (e() || "");
    function e() {
      return c < s.length ? s[c++] : void 0;
    }
  };
  var u = 1;
  var p = 0;
  var d = null;
  t.eachMapping(function (e) {
    if (null !== d) {
      if (!(u < e.generatedLine)) {
        var t = (n = s[c] || "").substr(0, e.generatedColumn - p);
        s[c] = n.substr(e.generatedColumn - p);
        p = e.generatedColumn;
        h(d, t);
        return void (d = e);
      }
      h(d, l());
      u++;
      p = 0;
    }
    for (; u < e.generatedLine;) {
      r.add(l());
      u++;
    }
    if (p < e.generatedColumn) {
      var n = s[c] || "";
      r.add(n.substr(0, e.generatedColumn));
      s[c] = n.substr(e.generatedColumn);
      p = e.generatedColumn;
    }
    d = e;
  }, this);
  if (c < s.length) {
    if (d) {
      h(d, l());
    }
    r.add(s.splice(c).join(""));
  }
  t.sources.forEach(function (e) {
    var o = t.sourceContentFor(e);
    if (null != o) {
      if (null != n) {
        e = i.join(n, e);
      }
      r.setSourceContent(e, o);
    }
  });
  return r;
  function h(e, t) {
    if (null === e || void 0 === e.source) r.add(t);else {
      var o = n ? i.join(n, e.source) : e.source;
      r.add(new a(e.originalLine, e.originalColumn, o, t, e.name));
    }
  }
};
a.prototype.add = function (e) {
  if (Array.isArray(e)) e.forEach(function (e) {
    this.add(e);
  }, this);else {
    if (!e[s] && "string" != typeof e) throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + e);
    if (e) {
      this.children.push(e);
    }
  }
  return this;
};
a.prototype.prepend = function (e) {
  if (Array.isArray(e)) for (var t = e.length - 1; t >= 0; t--) this.prepend(e[t]);else {
    if (!e[s] && "string" != typeof e) throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + e);
    this.children.unshift(e);
  }
  return this;
};
a.prototype.walk = function (e) {
  for (n = 0, r = this.children.length, void 0; n < r; n++) {
    var t;
    var n;
    var r;
    if ((t = this.children[n])[s]) {
      t.walk(e);
    } else {
      if ("" !== t) {
        e(t, {
          source: this.source,
          line: this.line,
          column: this.column,
          name: this.name
        });
      }
    }
  }
};
a.prototype.join = function (e) {
  var t;
  var n;
  var r = this.children.length;
  if (r > 0) {
    for (t = [], n = 0; n < r - 1; n++) {
      t.push(this.children[n]);
      t.push(e);
    }
    t.push(this.children[n]);
    this.children = t;
  }
  return this;
};
a.prototype.replaceRight = function (e, t) {
  var n = this.children[this.children.length - 1];
  if (n[s]) {
    n.replaceRight(e, t);
  } else {
    if ("string" == typeof n) {
      this.children[this.children.length - 1] = n.replace(e, t);
    } else {
      this.children.push("".replace(e, t));
    }
  }
  return this;
};
a.prototype.setSourceContent = function (e, t) {
  this.sourceContents[i.toSetString(e)] = t;
};
a.prototype.walkSourceContents = function (e) {
  for (t = 0, n = this.children.length, void 0; t < n; t++) {
    var t;
    var n;
    if (this.children[t][s]) {
      this.children[t].walkSourceContents(e);
    }
  }
  var r = Object.keys(this.sourceContents);
  for (t = 0, n = r.length; t < n; t++) e(i.fromSetString(r[t]), this.sourceContents[r[t]]);
};
a.prototype.toString = function () {
  var e = "";
  this.walk(function (t) {
    e += t;
  });
  return e;
};
a.prototype.toStringWithSourceMap = function (e) {
  var t = {
    code: "",
    line: 1,
    column: 0
  };
  var n = new r(e);
  var i = !1;
  var o = null;
  var s = null;
  var a = null;
  var c = null;
  this.walk(function (e, r) {
    t.code += e;
    if (null !== r.source && null !== r.line && null !== r.column) {
      if (o === r.source && s === r.line && a === r.column && c === r.name) {
        n.addMapping({
          source: r.source,
          original: {
            line: r.line,
            column: r.column
          },
          generated: {
            line: t.line,
            column: t.column
          },
          name: r.name
        });
      }
      o = r.source;
      s = r.line;
      a = r.column;
      c = r.name;
      i = !0;
    } else {
      if (i) {
        n.addMapping({
          generated: {
            line: t.line,
            column: t.column
          }
        });
        o = null;
        i = !1;
      }
    }
    for (l = 0, u = e.length, void 0; l < u; l++) {
      var l;
      var u;
      if (10 === e.charCodeAt(l)) {
        t.line++;
        t.column = 0;
        if (l + 1 === u) {
          o = null;
          i = !1;
        } else {
          if (i) {
            n.addMapping({
              source: r.source,
              original: {
                line: r.line,
                column: r.column
              },
              generated: {
                line: t.line,
                column: t.column
              },
              name: r.name
            });
          }
        }
      } else {
        t.column++;
      }
    }
  });
  this.walkSourceContents(function (e, t) {
    n.setSourceContent(e, t);
  });
  return {
    code: t.code,
    map: n
  };
};