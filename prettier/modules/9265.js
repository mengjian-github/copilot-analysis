module.exports = function (e) {
  var t = "function" == typeof setImmediate ? setImmediate : "object" == typeof process && "function" == typeof process.nextTick ? process.nextTick : null;
  if (t) {
    t(e);
  } else {
    setTimeout(e, 0);
  }
};