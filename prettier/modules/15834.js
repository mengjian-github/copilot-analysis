function r(e) {
  return Symbol.for(e);
}
require.d(exports, {
  I: () => i,
  Y: () => r
});
var i = new function e(t) {
  var n = this;
  n._currentContext = t ? new Map(t) : new Map();
  n.getValue = function (e) {
    return n._currentContext.get(e);
  };
  n.setValue = function (t, r) {
    var i = new e(n._currentContext);
    i._currentContext.set(t, r);
    return i;
  };
  n.deleteValue = function (t) {
    var r = new e(n._currentContext);
    r._currentContext.delete(t);
    return r;
  };
}();