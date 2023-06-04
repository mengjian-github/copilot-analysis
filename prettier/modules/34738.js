var n = exports || this;
function r() {
  return {
    next: function () {},
    done: function () {},
    run: function (e) {
      return e();
    }
  };
}
n.sync = r;
n.async = r;