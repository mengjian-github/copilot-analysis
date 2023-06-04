function t(e) {
  if ("function" == typeof this.jobs[e]) {
    this.jobs[e]();
  }
}
module.exports = function (e) {
  Object.keys(e.jobs).forEach(t.bind(e));
  e.jobs = {};
};