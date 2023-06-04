module.exports = function (e, t) {
  if (!0 === t) {
    t = 0;
  }
  var n = "";
  if ("string" == typeof e) try {
    n = new URL(e).protocol;
  } catch (e) {} else if (e && e.constructor === URL) {
    n = e.protocol;
  }
  var r = n.split(/\:|\+/).filter(Boolean);
  return "number" == typeof t ? r[t] : r;
};