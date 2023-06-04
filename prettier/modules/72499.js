Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.redactPaths = void 0;
exports.redactPaths = function (e) {
  return e.replace(/([\s|(]|file:\/\/)(\/[^\s]+)/g, "$1[redacted]").replace(/([\s|(]|file:\/\/)([a-zA-Z]:[(\\|/){1,2}][^\s]+)/gi, "$1[redacted]").replace(/([\s|(]|file:\/\/)(\\[^\s]+)/gi, "$1[redacted]");
};