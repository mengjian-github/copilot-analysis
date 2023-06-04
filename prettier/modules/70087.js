var r;
require.d(exports, {
  M: () => r
});
(function (e) {
  e[e.INTERNAL = 0] = "INTERNAL";
  e[e.SERVER = 1] = "SERVER";
  e[e.CLIENT = 2] = "CLIENT";
  e[e.PRODUCER = 3] = "PRODUCER";
  e[e.CONSUMER = 4] = "CONSUMER";
})(r || (r = {}));