var r = require(32728);
var i = require(9216);
var o = require(78213).I;
var s = require(16400);
var a = require(22826).U;
function SourceMapConsumer(e, t) {
  var n = e;
  if ("string" == typeof e) {
    n = r.parseSourceMapInput(e);
  }
  return null != n.sections ? new p(n, t) : new l(n, t);
}
function l(e, t) {
  var n = e;
  if ("string" == typeof e) {
    n = r.parseSourceMapInput(e);
  }
  var i = r.getArg(n, "version");
  var s = r.getArg(n, "sources");
  var a = r.getArg(n, "names", []);
  var c = r.getArg(n, "sourceRoot", null);
  var l = r.getArg(n, "sourcesContent", null);
  var u = r.getArg(n, "mappings");
  var p = r.getArg(n, "file", null);
  if (i != this._version) throw new Error("Unsupported version: " + i);
  if (c) {
    c = r.normalize(c);
  }
  s = s.map(String).map(r.normalize).map(function (e) {
    return c && r.isAbsolute(c) && r.isAbsolute(e) ? r.relative(c, e) : e;
  });
  this._names = o.fromArray(a.map(String), !0);
  this._sources = o.fromArray(s, !0);
  this._absoluteSources = this._sources.toArray().map(function (e) {
    return r.computeSourceURL(c, e, t);
  });
  this.sourceRoot = c;
  this.sourcesContent = l;
  this._mappings = u;
  this._sourceMapURL = t;
  this.file = p;
}
function u() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}
function p(e, t) {
  var n = e;
  if ("string" == typeof e) {
    n = r.parseSourceMapInput(e);
  }
  var i = r.getArg(n, "version");
  var s = r.getArg(n, "sections");
  if (i != this._version) throw new Error("Unsupported version: " + i);
  this._sources = new o();
  this._names = new o();
  var a = {
    line: -1,
    column: 0
  };
  this._sections = s.map(function (e) {
    if (e.url) throw new Error("Support for url field in sections not implemented.");
    var n = r.getArg(e, "offset");
    var i = r.getArg(n, "line");
    var o = r.getArg(n, "column");
    if (i < a.line || i === a.line && o < a.column) throw new Error("Section offsets must be ordered and non-overlapping.");
    a = n;
    return {
      generatedOffset: {
        generatedLine: i + 1,
        generatedColumn: o + 1
      },
      consumer: new SourceMapConsumer(r.getArg(e, "map"), t)
    };
  });
}
SourceMapConsumer.fromSourceMap = function (e, t) {
  return l.fromSourceMap(e, t);
};
SourceMapConsumer.prototype._version = 3;
SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
  configurable: !0,
  enumerable: !0,
  get: function () {
    if (this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }
    return this.__generatedMappings;
  }
});
SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
  configurable: !0,
  enumerable: !0,
  get: function () {
    if (this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }
    return this.__originalMappings;
  }
});
SourceMapConsumer.prototype._charIsMappingSeparator = function (e, t) {
  var n = e.charAt(t);
  return ";" === n || "," === n;
};
SourceMapConsumer.prototype._parseMappings = function (e, t) {
  throw new Error("Subclasses must implement _parseMappings");
};
SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;
SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;
SourceMapConsumer.prototype.eachMapping = function (e, t, n) {
  var i;
  var o = t || null;
  switch (n || SourceMapConsumer.GENERATED_ORDER) {
    case SourceMapConsumer.GENERATED_ORDER:
      i = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      i = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
  }
  var s = this.sourceRoot;
  i.map(function (e) {
    var t = null === e.source ? null : this._sources.at(e.source);
    return {
      source: t = r.computeSourceURL(s, t, this._sourceMapURL),
      generatedLine: e.generatedLine,
      generatedColumn: e.generatedColumn,
      originalLine: e.originalLine,
      originalColumn: e.originalColumn,
      name: null === e.name ? null : this._names.at(e.name)
    };
  }, this).forEach(e, o);
};
SourceMapConsumer.prototype.allGeneratedPositionsFor = function (e) {
  var t = r.getArg(e, "line");
  var n = {
    source: r.getArg(e, "source"),
    originalLine: t,
    originalColumn: r.getArg(e, "column", 0)
  };
  n.source = this._findSourceIndex(n.source);
  if (n.source < 0) return [];
  var o = [];
  var s = this._findMapping(n, this._originalMappings, "originalLine", "originalColumn", r.compareByOriginalPositions, i.LEAST_UPPER_BOUND);
  if (s >= 0) {
    var a = this._originalMappings[s];
    if (void 0 === e.column) for (var c = a.originalLine; a && a.originalLine === c;) {
      o.push({
        line: r.getArg(a, "generatedLine", null),
        column: r.getArg(a, "generatedColumn", null),
        lastColumn: r.getArg(a, "lastGeneratedColumn", null)
      });
      a = this._originalMappings[++s];
    } else for (var l = a.originalColumn; a && a.originalLine === t && a.originalColumn == l;) {
      o.push({
        line: r.getArg(a, "generatedLine", null),
        column: r.getArg(a, "generatedColumn", null),
        lastColumn: r.getArg(a, "lastGeneratedColumn", null)
      });
      a = this._originalMappings[++s];
    }
  }
  return o;
};
exports.SourceMapConsumer = SourceMapConsumer;
l.prototype = Object.create(SourceMapConsumer.prototype);
l.prototype.consumer = SourceMapConsumer;
l.prototype._findSourceIndex = function (e) {
  var t;
  var n = e;
  if (null != this.sourceRoot) {
    n = r.relative(this.sourceRoot, n);
  }
  if (this._sources.has(n)) return this._sources.indexOf(n);
  for (t = 0; t < this._absoluteSources.length; ++t) if (this._absoluteSources[t] == e) return t;
  return -1;
};
l.fromSourceMap = function (e, t) {
  var n = Object.create(l.prototype);
  var i = n._names = o.fromArray(e._names.toArray(), !0);
  var s = n._sources = o.fromArray(e._sources.toArray(), !0);
  n.sourceRoot = e._sourceRoot;
  n.sourcesContent = e._generateSourcesContent(n._sources.toArray(), n.sourceRoot);
  n.file = e._file;
  n._sourceMapURL = t;
  n._absoluteSources = n._sources.toArray().map(function (e) {
    return r.computeSourceURL(n.sourceRoot, e, t);
  });
  for (c = e._mappings.toArray().slice(), p = n.__generatedMappings = [], d = n.__originalMappings = [], h = 0, f = c.length, void 0; h < f; h++) {
    var c;
    var p;
    var d;
    var h;
    var f;
    var m = c[h];
    var g = new u();
    g.generatedLine = m.generatedLine;
    g.generatedColumn = m.generatedColumn;
    if (m.source) {
      g.source = s.indexOf(m.source);
      g.originalLine = m.originalLine;
      g.originalColumn = m.originalColumn;
      if (m.name) {
        g.name = i.indexOf(m.name);
      }
      d.push(g);
    }
    p.push(g);
  }
  a(n.__originalMappings, r.compareByOriginalPositions);
  return n;
};
l.prototype._version = 3;
Object.defineProperty(l.prototype, "sources", {
  get: function () {
    return this._absoluteSources.slice();
  }
});
l.prototype._parseMappings = function (e, t) {
  for (p = 1, d = 0, h = 0, f = 0, m = 0, g = 0, y = e.length, _ = 0, v = {}, b = {}, E = [], w = [], void 0; _ < y;) {
    var n;
    var i;
    var o;
    var c;
    var l;
    var p;
    var d;
    var h;
    var f;
    var m;
    var g;
    var y;
    var _;
    var v;
    var b;
    var E;
    var w;
    if (";" === e.charAt(_)) {
      p++;
      _++;
      d = 0;
    } else if ("," === e.charAt(_)) _++;else {
      for ((n = new u()).generatedLine = p, c = _; c < y && !this._charIsMappingSeparator(e, c); c++);
      if (o = v[i = e.slice(_, c)]) _ += i.length;else {
        for (o = []; _ < c;) {
          s.decode(e, _, b);
          l = b.value;
          _ = b.rest;
          o.push(l);
        }
        if (2 === o.length) throw new Error("Found a source, but no line and column");
        if (3 === o.length) throw new Error("Found a source and line, but no column");
        v[i] = o;
      }
      n.generatedColumn = d + o[0];
      d = n.generatedColumn;
      if (o.length > 1) {
        n.source = m + o[1];
        m += o[1];
        n.originalLine = h + o[2];
        h = n.originalLine;
        n.originalLine += 1;
        n.originalColumn = f + o[3];
        f = n.originalColumn;
        if (o.length > 4) {
          n.name = g + o[4];
          g += o[4];
        }
      }
      w.push(n);
      if ("number" == typeof n.originalLine) {
        E.push(n);
      }
    }
  }
  a(w, r.compareByGeneratedPositionsDeflated);
  this.__generatedMappings = w;
  a(E, r.compareByOriginalPositions);
  this.__originalMappings = E;
};
l.prototype._findMapping = function (e, t, n, r, o, s) {
  if (e[n] <= 0) throw new TypeError("Line must be greater than or equal to 1, got " + e[n]);
  if (e[r] < 0) throw new TypeError("Column must be greater than or equal to 0, got " + e[r]);
  return i.search(e, t, o, s);
};
l.prototype.computeColumnSpans = function () {
  for (var e = 0; e < this._generatedMappings.length; ++e) {
    var t = this._generatedMappings[e];
    if (e + 1 < this._generatedMappings.length) {
      var n = this._generatedMappings[e + 1];
      if (t.generatedLine === n.generatedLine) {
        t.lastGeneratedColumn = n.generatedColumn - 1;
        continue;
      }
    }
    t.lastGeneratedColumn = 1 / 0;
  }
};
l.prototype.originalPositionFor = function (e) {
  var t = {
    generatedLine: r.getArg(e, "line"),
    generatedColumn: r.getArg(e, "column")
  };
  var n = this._findMapping(t, this._generatedMappings, "generatedLine", "generatedColumn", r.compareByGeneratedPositionsDeflated, r.getArg(e, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
  if (n >= 0) {
    var i = this._generatedMappings[n];
    if (i.generatedLine === t.generatedLine) {
      var o = r.getArg(i, "source", null);
      if (null !== o) {
        o = this._sources.at(o);
        o = r.computeSourceURL(this.sourceRoot, o, this._sourceMapURL);
      }
      var s = r.getArg(i, "name", null);
      if (null !== s) {
        s = this._names.at(s);
      }
      return {
        source: o,
        line: r.getArg(i, "originalLine", null),
        column: r.getArg(i, "originalColumn", null),
        name: s
      };
    }
  }
  return {
    source: null,
    line: null,
    column: null,
    name: null
  };
};
l.prototype.hasContentsOfAllSources = function () {
  return !!this.sourcesContent && this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function (e) {
    return null == e;
  });
};
l.prototype.sourceContentFor = function (e, t) {
  if (!this.sourcesContent) return null;
  var n = this._findSourceIndex(e);
  if (n >= 0) return this.sourcesContent[n];
  var i;
  var o = e;
  if (null != this.sourceRoot) {
    o = r.relative(this.sourceRoot, o);
  }
  if (null != this.sourceRoot && (i = r.urlParse(this.sourceRoot))) {
    var s = o.replace(/^file:\/\//, "");
    if ("file" == i.scheme && this._sources.has(s)) return this.sourcesContent[this._sources.indexOf(s)];
    if ((!i.path || "/" == i.path) && this._sources.has("/" + o)) return this.sourcesContent[this._sources.indexOf("/" + o)];
  }
  if (t) return null;
  throw new Error('"' + o + '" is not in the SourceMap.');
};
l.prototype.generatedPositionFor = function (e) {
  var t = r.getArg(e, "source");
  if ((t = this._findSourceIndex(t)) < 0) return {
    line: null,
    column: null,
    lastColumn: null
  };
  var n = {
    source: t,
    originalLine: r.getArg(e, "line"),
    originalColumn: r.getArg(e, "column")
  };
  var i = this._findMapping(n, this._originalMappings, "originalLine", "originalColumn", r.compareByOriginalPositions, r.getArg(e, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
  if (i >= 0) {
    var o = this._originalMappings[i];
    if (o.source === n.source) return {
      line: r.getArg(o, "generatedLine", null),
      column: r.getArg(o, "generatedColumn", null),
      lastColumn: r.getArg(o, "lastGeneratedColumn", null)
    };
  }
  return {
    line: null,
    column: null,
    lastColumn: null
  };
};
p.prototype = Object.create(SourceMapConsumer.prototype);
p.prototype.constructor = SourceMapConsumer;
p.prototype._version = 3;
Object.defineProperty(p.prototype, "sources", {
  get: function () {
    for (e = [], t = 0, void 0; t < this._sections.length; t++) {
      var e;
      var t;
      for (var n = 0; n < this._sections[t].consumer.sources.length; n++) e.push(this._sections[t].consumer.sources[n]);
    }
    return e;
  }
});
p.prototype.originalPositionFor = function (e) {
  var t = {
    generatedLine: r.getArg(e, "line"),
    generatedColumn: r.getArg(e, "column")
  };
  var n = i.search(t, this._sections, function (e, t) {
    return e.generatedLine - t.generatedOffset.generatedLine || e.generatedColumn - t.generatedOffset.generatedColumn;
  });
  var o = this._sections[n];
  return o ? o.consumer.originalPositionFor({
    line: t.generatedLine - (o.generatedOffset.generatedLine - 1),
    column: t.generatedColumn - (o.generatedOffset.generatedLine === t.generatedLine ? o.generatedOffset.generatedColumn - 1 : 0),
    bias: e.bias
  }) : {
    source: null,
    line: null,
    column: null,
    name: null
  };
};
p.prototype.hasContentsOfAllSources = function () {
  return this._sections.every(function (e) {
    return e.consumer.hasContentsOfAllSources();
  });
};
p.prototype.sourceContentFor = function (e, t) {
  for (var n = 0; n < this._sections.length; n++) {
    var r = this._sections[n].consumer.sourceContentFor(e, !0);
    if (r) return r;
  }
  if (t) return null;
  throw new Error('"' + e + '" is not in the SourceMap.');
};
p.prototype.generatedPositionFor = function (e) {
  for (var t = 0; t < this._sections.length; t++) {
    var n = this._sections[t];
    if (-1 !== n.consumer._findSourceIndex(r.getArg(e, "source"))) {
      var i = n.consumer.generatedPositionFor(e);
      if (i) return {
        line: i.line + (n.generatedOffset.generatedLine - 1),
        column: i.column + (n.generatedOffset.generatedLine === i.line ? n.generatedOffset.generatedColumn - 1 : 0)
      };
    }
  }
  return {
    line: null,
    column: null
  };
};
p.prototype._parseMappings = function (e, t) {
  this.__generatedMappings = [];
  this.__originalMappings = [];
  for (var n = 0; n < this._sections.length; n++) for (i = this._sections[n], o = i.consumer._generatedMappings, s = 0, void 0; s < o.length; s++) {
    var i;
    var o;
    var s;
    var c = o[s];
    var l = i.consumer._sources.at(c.source);
    l = r.computeSourceURL(i.consumer.sourceRoot, l, this._sourceMapURL);
    this._sources.add(l);
    l = this._sources.indexOf(l);
    var u = null;
    if (c.name) {
      u = i.consumer._names.at(c.name);
      this._names.add(u);
      u = this._names.indexOf(u);
    }
    var p = {
      source: l,
      generatedLine: c.generatedLine + (i.generatedOffset.generatedLine - 1),
      generatedColumn: c.generatedColumn + (i.generatedOffset.generatedLine === c.generatedLine ? i.generatedOffset.generatedColumn - 1 : 0),
      originalLine: c.originalLine,
      originalColumn: c.originalColumn,
      name: u
    };
    this.__generatedMappings.push(p);
    if ("number" == typeof p.originalLine) {
      this.__originalMappings.push(p);
    }
  }
  a(this.__generatedMappings, r.compareByGeneratedPositionsDeflated);
  a(this.__originalMappings, r.compareByOriginalPositions);
};