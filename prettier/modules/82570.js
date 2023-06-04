Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.isContentTypeHeaderHtml = exports.insertSnippetByIndex = exports.getContentEncodingFromHeaders = exports.isSupportedContentEncoding = exports.findBufferEncodingType = exports.isBufferType = exports.getBrotliDecompressSync = exports.getBrotliDecompressAsync = exports.getBrotliCompressSync = exports.getBrotliCompressAsync = exports.inflateAsync = exports.deflateAsync = exports.gunzipAsync = exports.gzipAsync = exports.isBrotliSupperted = exports.bufferEncodingTypes = exports.contentEncodingMethod = void 0;
var r;
var i = require(59796);
var o = require(73837);
!function (e) {
  e.GZIP = "gzip";
  e.DEFLATE = "deflate";
  e.BR = "br";
}(r = exports.contentEncodingMethod || (exports.contentEncodingMethod = {}));
exports.bufferEncodingTypes = ["utf8", "utf16le", "latin1", "base64", "hex", "ascii", "binary", "ucs2"];
exports.isBrotliSupperted = function () {
  var e = process.versions.node.split(".")[0];
  return parseInt(e) >= 10;
};
exports.gzipAsync = o.promisify(i.gzip);
exports.gunzipAsync = o.promisify(i.gunzip);
exports.deflateAsync = o.promisify(i.deflate);
exports.inflateAsync = o.promisify(i.inflate);
exports.getBrotliCompressAsync = function (e) {
  return exports.isBrotliSupperted() && "function" == typeof e.brotliCompress ? o.promisify(e.brotliCompress) : null;
};
exports.getBrotliCompressSync = function (e) {
  return exports.isBrotliSupperted() && "function" == typeof e.brotliCompressSync ? e.brotliCompressSync : null;
};
exports.getBrotliDecompressAsync = function (e) {
  return exports.isBrotliSupperted() && "function" == typeof e.brotliDecompress ? o.promisify(e.brotliDecompress) : null;
};
exports.getBrotliDecompressSync = function (e) {
  return exports.isBrotliSupperted() && "function" == typeof e.brotliDecompressSync ? e.brotliDecompressSync : null;
};
exports.isBufferType = function (e, t) {
  var n = t || "utf8";
  var r = !1;
  if (Buffer.isEncoding(n)) {
    r = Buffer.from(e.toString(n), n).toJSON().data.toString() === e.toJSON().data.toString();
  }
  return r;
};
exports.findBufferEncodingType = function (e) {
  var n = null;
  for (var r in exports.bufferEncodingTypes) {
    var i = exports.bufferEncodingTypes[r];
    if (Buffer.isEncoding(i) && exports.isBufferType(e, i)) {
      n = i;
      break;
    }
  }
  return n;
};
exports.isSupportedContentEncoding = function (e) {
  var t = null;
  switch (e) {
    case "gzip":
      t = r.GZIP;
      break;
    case "br":
      t = r.BR;
      break;
    case "deflate":
      t = r.DEFLATE;
  }
  return t;
};
exports.getContentEncodingFromHeaders = function (e) {
  var n = [];
  var r = e.getHeader("Content-Encoding");
  if (!r) return null;
  if ("string" == typeof r) {
    var i = exports.isSupportedContentEncoding(r);
    if (i) {
      n.push(i);
    }
  }
  return n;
};
exports.insertSnippetByIndex = function (e, t, n) {
  return e < 0 ? null : t.substring(0, e) + '<script type="text/javascript">' + n + "<\/script>" + t.substring(e);
};
exports.isContentTypeHeaderHtml = function (e) {
  var t = !1;
  var n = e.getHeader("Content-Type");
  if (n) {
    t = "string" == typeof n ? n.indexOf("html") >= 0 : n.toString().indexOf("html") >= 0;
  }
  return t;
};