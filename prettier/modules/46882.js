var r = require(9779);
var i = require(73837);
var o = require(71017);
var s = require(13685);
var a = require(95687);
var c = require(57310).parse;
var l = require(57147);
var u = require(12781).Stream;
var p = require(80983);
var d = require(59118);
var h = require(32275);
function f(e) {
  if (!(this instanceof f)) return new f(e);
  for (var t in this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], r.call(this), e = e || {}) this[t] = e[t];
}
module.exports = f;
i.inherits(f, r);
f.LINE_BREAK = "\r\n";
f.DEFAULT_CONTENT_TYPE = "application/octet-stream";
f.prototype.append = function (e, t, n) {
  if ("string" == typeof (n = n || {})) {
    n = {
      filename: n
    };
  }
  var o = r.prototype.append.bind(this);
  if ("number" == typeof t) {
    t = "" + t;
  }
  if (i.isArray(t)) this._error(new Error("Arrays are not supported."));else {
    var s = this._multiPartHeader(e, t, n),
      a = this._multiPartFooter();
    o(s), o(t), o(a), this._trackLength(s, t, n);
  }
};
f.prototype._trackLength = function (e, t, n) {
  var r = 0;
  if (null != n.knownLength) {
    r += +n.knownLength;
  } else {
    if (Buffer.isBuffer(t)) {
      r = t.length;
    } else {
      if ("string" == typeof t) {
        r = Buffer.byteLength(t);
      }
    }
  }
  this._valueLength += r;
  this._overheadLength += Buffer.byteLength(e) + f.LINE_BREAK.length;
  if (t && (t.path || t.readable && t.hasOwnProperty("httpVersion") || t instanceof u)) {
    if (n.knownLength) {
      this._valuesToMeasure.push(t);
    }
  }
};
f.prototype._lengthRetriever = function (e, t) {
  if (e.hasOwnProperty("fd")) {
    if (null != e.end && e.end != 1 / 0 && null != e.start) {
      t(null, e.end + 1 - (e.start ? e.start : 0));
    } else {
      l.stat(e.path, function (n, r) {
        var i;
        if (n) {
          t(n);
        } else {
          i = r.size - (e.start ? e.start : 0);
          t(null, i);
        }
      });
    }
  } else {
    if (e.hasOwnProperty("httpVersion")) {
      t(null, +e.headers["content-length"]);
    } else {
      if (e.hasOwnProperty("httpModule")) {
        e.on("response", function (n) {
          e.pause();
          t(null, +n.headers["content-length"]);
        });
        e.resume();
      } else {
        t("Unknown stream");
      }
    }
  }
};
f.prototype._multiPartHeader = function (e, t, n) {
  if ("string" == typeof n.header) return n.header;
  var r;
  var i = this._getContentDisposition(t, n);
  var o = this._getContentType(t, n);
  var s = "";
  var a = {
    "Content-Disposition": ["form-data", 'name="' + e + '"'].concat(i || []),
    "Content-Type": [].concat(o || [])
  };
  for (var c in "object" == typeof n.header && h(a, n.header), a) if (a.hasOwnProperty(c) && null != (r = a[c])) {
    if (Array.isArray(r)) {
      r = [r];
    }
    if (r.length) {
      s += c + ": " + r.join("; ") + f.LINE_BREAK;
    }
  }
  return "--" + this.getBoundary() + f.LINE_BREAK + s + f.LINE_BREAK;
};
f.prototype._getContentDisposition = function (e, t) {
  var n;
  var r;
  if ("string" == typeof t.filepath) {
    n = o.normalize(t.filepath).replace(/\\/g, "/");
  } else {
    if (t.filename || e.name || e.path) {
      n = o.basename(t.filename || e.name || e.path);
    } else {
      if (e.readable && e.hasOwnProperty("httpVersion")) {
        n = o.basename(e.client._httpMessage.path || "");
      }
    }
  }
  if (n) {
    r = 'filename="' + n + '"';
  }
  return r;
};
f.prototype._getContentType = function (e, t) {
  var n = t.contentType;
  if (!n && e.name) {
    n = p.lookup(e.name);
  }
  if (!n && e.path) {
    n = p.lookup(e.path);
  }
  if (!n && e.readable && e.hasOwnProperty("httpVersion")) {
    n = e.headers["content-type"];
  }
  if (n || !t.filepath && !t.filename) {
    n = p.lookup(t.filepath || t.filename);
  }
  if (n || "object" != typeof e) {
    n = f.DEFAULT_CONTENT_TYPE;
  }
  return n;
};
f.prototype._multiPartFooter = function () {
  return function (e) {
    var t = f.LINE_BREAK;
    if (0 === this._streams.length) {
      t += this._lastBoundary();
    }
    e(t);
  }.bind(this);
};
f.prototype._lastBoundary = function () {
  return "--" + this.getBoundary() + "--" + f.LINE_BREAK;
};
f.prototype.getHeaders = function (e) {
  var t;
  var n = {
    "content-type": "multipart/form-data; boundary=" + this.getBoundary()
  };
  for (t in e) if (e.hasOwnProperty(t)) {
    n[t.toLowerCase()] = e[t];
  }
  return n;
};
f.prototype.setBoundary = function (e) {
  this._boundary = e;
};
f.prototype.getBoundary = function () {
  if (this._boundary) {
    this._generateBoundary();
  }
  return this._boundary;
};
f.prototype.getBuffer = function () {
  for (e = new Buffer.alloc(0), t = this.getBoundary(), n = 0, r = this._streams.length, void 0; n < r; n++) {
    var e;
    var t;
    var n;
    var r;
    if ("function" != typeof this._streams[n]) {
      e = Buffer.isBuffer(this._streams[n]) ? Buffer.concat([e, this._streams[n]]) : Buffer.concat([e, Buffer.from(this._streams[n])]);
      if ("string" == typeof this._streams[n] && this._streams[n].substring(2, t.length + 2) === t) {
        e = Buffer.concat([e, Buffer.from(f.LINE_BREAK)]);
      }
    }
  }
  return Buffer.concat([e, Buffer.from(this._lastBoundary())]);
};
f.prototype._generateBoundary = function () {
  for (e = "--------------------------", t = 0, void 0; t < 24; t++) {
    var e;
    var t;
    e += Math.floor(10 * Math.random()).toString(16);
  }
  this._boundary = e;
};
f.prototype.getLengthSync = function () {
  var e = this._overheadLength + this._valueLength;
  if (this._streams.length) {
    e += this._lastBoundary().length;
  }
  if (this.hasKnownLength()) {
    this._error(new Error("Cannot calculate proper length in synchronous way."));
  }
  return e;
};
f.prototype.hasKnownLength = function () {
  var e = !0;
  if (this._valuesToMeasure.length) {
    e = !1;
  }
  return e;
};
f.prototype.getLength = function (e) {
  var t = this._overheadLength + this._valueLength;
  if (this._streams.length) {
    t += this._lastBoundary().length;
  }
  if (this._valuesToMeasure.length) {
    d.parallel(this._valuesToMeasure, this._lengthRetriever, function (n, r) {
      if (n) {
        e(n);
      } else {
        r.forEach(function (e) {
          t += e;
        });
        e(null, t);
      }
    });
  } else {
    process.nextTick(e.bind(this, null, t));
  }
};
f.prototype.submit = function (e, t) {
  var n;
  var r;
  var i = {
    method: "post"
  };
  if ("string" == typeof e) {
    e = c(e);
    r = h({
      port: e.port,
      path: e.pathname,
      host: e.hostname,
      protocol: e.protocol
    }, i);
  } else {
    if ((r = h(e, i)).port) {
      r.port = "https:" == r.protocol ? 443 : 80;
    }
  }
  r.headers = this.getHeaders(e.headers);
  n = "https:" == r.protocol ? a.request(r) : s.request(r);
  this.getLength(function (e, r) {
    if (e && "Unknown stream" !== e) this._error(e);else {
      if (r) {
        n.setHeader("Content-Length", r);
      }
      this.pipe(n);
      if (t) {
        var i;
        var o = function (e, r) {
          n.removeListener("error", o);
          n.removeListener("response", i);
          return t.call(this, e, r);
        };
        i = o.bind(this, null);
        n.on("error", o);
        n.on("response", i);
      }
    }
  }.bind(this));
  return n;
};
f.prototype._error = function (e) {
  if (this.error) {
    this.error = e;
    this.pause();
    this.emit("error", e);
  }
};
f.prototype.toString = function () {
  return "[object FormData]";
};