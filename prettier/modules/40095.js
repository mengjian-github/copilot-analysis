Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getResourceProvider = exports.getOsPrefix = exports.isFunctionApp = exports.isWebApp = exports.isLinux = exports.isWindows = void 0;
exports.isWindows = function () {
  return "win32" === process.platform;
};
exports.isLinux = function () {
  return "linux" === process.platform;
};
exports.isWebApp = function () {
  return !!process.env.WEBSITE_SITE_NAME;
};
exports.isFunctionApp = function () {
  return !!process.env.FUNCTIONS_WORKER_RUNTIME;
};
exports.getOsPrefix = function () {
  return exports.isWindows() ? "w" : exports.isLinux() ? "l" : "u";
};
exports.getResourceProvider = function () {
  return exports.isWebApp() ? "a" : exports.isFunctionApp() ? "f" : "u";
};