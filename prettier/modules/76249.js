Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerNotificationState = void 0;
const r = require(66277);
const i = require(27995).proxyMap();
exports.registerNotificationState = function () {
  return {
    addNotification: function (e) {
      i.set(e, !0);
    },
    getSnapshot: function () {
      return r.snapshot(i);
    },
    listen: function (e) {
      return {
        dispose: r.subscribe(i, e)
      };
    }
  };
};