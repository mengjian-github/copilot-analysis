module.exports = function (e, t) {
  Object.keys(t).forEach(function (n) {
    e[n] = e[n] || t[n];
  });
  return e;
};