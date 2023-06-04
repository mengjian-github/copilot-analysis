var r = {
  "./crypt32-ia32.node": 43041,
  "./crypt32-x64.node": 37538
};
function i(e) {
  var t = o(e);
  return require(t);
}
function o(e) {
  if (!require.o(r, e)) {
    var t = new Error("Cannot find module '" + e + "'");
    throw t.code = "MODULE_NOT_FOUND", t;
  }
  return r[e];
}
i.keys = function () {
  return Object.keys(r);
};
i.resolve = o;
module.exports = i;
i.id = 46837;