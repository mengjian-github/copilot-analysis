function t(e) {
  var t = new Error("Cannot find module '" + e + "'");
  throw t.code = "MODULE_NOT_FOUND", t;
}
t.keys = () => [];
t.resolve = t;
t.id = 80420;
module.exports = t;