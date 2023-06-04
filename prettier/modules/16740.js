var r;
require.d(exports, {
  n: () => r
});
(function (e) {
  e[e.NONE = 0] = "NONE";
  e[e.ERROR = 30] = "ERROR";
  e[e.WARN = 50] = "WARN";
  e[e.INFO = 60] = "INFO";
  e[e.DEBUG = 70] = "DEBUG";
  e[e.VERBOSE = 80] = "VERBOSE";
  e[e.ALL = 9999] = "ALL";
})(r || (r = {}));