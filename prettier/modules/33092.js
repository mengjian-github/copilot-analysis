var r;
var i = this && this.__extends || (r = function (e, t) {
  r = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
      e[n] = t[n];
    }
  };
  return r(e, t);
}, function (e, t) {
  function n() {
    this.constructor = e;
  }
  r(e, t);
  e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
var o = function (e) {
  function t() {
    var t = e.call(this) || this;
    t.ver = 2;
    t.metrics = [];
    t.properties = {};
    return t;
  }
  i(t, e);
  return t;
}(require(78934));
module.exports = o;