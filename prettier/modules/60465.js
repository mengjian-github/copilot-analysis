module.exports = function (e, t) {
  var n = [];
  n.push(function (e) {
    try {
      return Error.prototype.toString.call(e);
    } catch (e) {
      try {
        return "<error: " + e + ">";
      } catch (e) {
        return "<error>";
      }
    }
  }(e));
  for (var r = 0; r < t.length; r++) {
    var i;
    var o = t[r];
    try {
      i = o.toString();
    } catch (e) {
      try {
        i = "<error: " + e + ">";
      } catch (e) {
        i = "<error>";
      }
    }
    n.push("    at " + i);
  }
  return n.join("\n");
};