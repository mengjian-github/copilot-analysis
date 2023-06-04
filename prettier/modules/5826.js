Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.convertChangesToXML = function (e) {
  for (t = [], n = 0, void 0; n < e.length; n++) {
    var t;
    var n;
    var r = e[n];
    if (r.added) {
      t.push("<ins>");
    } else {
      if (r.removed) {
        t.push("<del>");
      }
    }
    t.push(r.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"));
    if (r.added) {
      t.push("</ins>");
    } else {
      if (r.removed) {
        t.push("</del>");
      }
    }
  }
  return t.join("");
};