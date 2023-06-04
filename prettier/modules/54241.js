require.d(exports, {
  d: () => o
});
var r = require(22037);
var i = require(70450);
function o() {
  var e = i.Ds(process.env);
  return Object.assign({
    HOSTNAME: r.hostname()
  }, i.J9, e);
}