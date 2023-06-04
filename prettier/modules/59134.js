module.exports = function () {
  return "undefined" != typeof window && "object" == typeof window.process && "renderer" === window.process.type || !("undefined" == typeof process || "object" != typeof process.versions || !process.versions.electron) || "object" == typeof navigator && "string" == typeof navigator.userAgent && navigator.userAgent.indexOf("Electron") >= 0;
};