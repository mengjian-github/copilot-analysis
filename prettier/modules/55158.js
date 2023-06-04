var r = require(63580);
var i = function () {
  function e() {}
  e.parse = function (t) {
    if (!t) return {};
    var n = t.split(e._FIELDS_SEPARATOR).reduce(function (t, n) {
      var r = n.split(e._FIELD_KEY_VALUE_SEPARATOR);
      if (2 === r.length) {
        var i = r[0].toLowerCase();
        var o = r[1];
        t[i] = o;
      }
      return t;
    }, {});
    if (Object.keys(n).length > 0) {
      if (n.endpointsuffix) {
        var i = n.location ? n.location + "." : "";
        n.ingestionendpoint = n.ingestionendpoint || "https://" + i + "dc." + n.endpointsuffix;
        n.liveendpoint = n.liveendpoint || "https://" + i + "live." + n.endpointsuffix;
      }
      n.ingestionendpoint = n.ingestionendpoint || r.DEFAULT_BREEZE_ENDPOINT;
      n.liveendpoint = n.liveendpoint || r.DEFAULT_LIVEMETRICS_ENDPOINT;
    }
    return n;
  };
  e.isIkeyValid = function (e) {
    return !(!e || "" == e) && new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$").test(e);
  };
  e._FIELDS_SEPARATOR = ";";
  e._FIELD_KEY_VALUE_SEPARATOR = "=";
  return e;
}();
module.exports = i;