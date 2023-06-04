module.exports = (e, t) => class extends e {
  constructor(e) {
    var n;
    var r;
    super(function (e, o) {
      n = this;
      r = [function (n) {
        t(i, !1);
        return e(n);
      }, function (e) {
        t(i, !1);
        return o(e);
      }];
    });
    var i = this;
    try {
      e.apply(n, r);
    } catch (e) {
      r[1](e);
    }
    return i;
  }
};