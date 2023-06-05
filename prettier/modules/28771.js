Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.TestNotificationSender = exports.TestUrlOpener = exports.rangeToString = exports.positionToString = void 0;
const notification = require("./notification");
function positionToString(e) {
  return `${e.line}:${e.character}`;
}
exports.positionToString = positionToString;
exports.rangeToString = function (e) {
  return `[${positionToString(e.start)}--${positionToString(e.end)}]`;
};
exports.TestUrlOpener = class {
  constructor() {
    this.openedUrls = [];
  }
  open(e) {
    this.openedUrls.push(e);
  }
};
class TestNotificationSender extends notification.NotificationSender {
  constructor() {
    super();
    this.sentMessages = [];
    this.warningPromises = [];
  }
  showWarningMessage(e, ...t) {
    this.sentMessages.push(e);
    const n = t ? Promise.resolve(t[0]) : Promise.resolve(void 0);
    this.warningPromises.push(n);
    return n;
  }
  async waitForWarningMessages() {
    await Promise.all(this.warningPromises);
  }
}
exports.TestNotificationSender = TestNotificationSender;