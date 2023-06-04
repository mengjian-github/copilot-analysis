require.d(exports, {
  x: () => i
});
var r = require(90928);
function i() {
  return function (e) {
    r.K.error(function (e) {
      return "string" == typeof e ? e : JSON.stringify(function (e) {
        for (t = {}, n = e, void 0; null !== n;) {
          var t;
          var n;
          Object.getOwnPropertyNames(n).forEach(function (e) {
            if (!t[e]) {
              var r = n[e];
              if (r) {
                t[e] = String(r);
              }
            }
          });
          n = Object.getPrototypeOf(n);
        }
        return t;
      }(e));
    }(e));
  };
}