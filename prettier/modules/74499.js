function n(e) {
  const t = e.length;
  let n;
  let r = 0;
  let i = 0;
  for (; i < t;) {
    r++;
    n = e.charCodeAt(i++);
    if (n >= 55296 && n <= 56319 && i < t) {
      n = e.charCodeAt(i);
      if (56320 == (64512 & n)) {
        i++;
      }
    }
  }
  return r;
}
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = n;
n.code = 'require("ajv/dist/runtime/ucs2length").default';