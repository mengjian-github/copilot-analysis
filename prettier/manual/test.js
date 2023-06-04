Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.TestNotificationSender = exports.TestUrlOpener = exports.rangeToString = exports.positionToString = void 0;
  const r = require(41547);
  function i(e) {
    return `${e.line}:${e.character}`;
  }
  exports.positionToString = i, exports.rangeToString = function (e) {
    return `[${i(e.start)}--${i(e.end)}]`;
  }, exports.TestUrlOpener = class {
    constructor() {
      this.openedUrls = [];
    }
    open(e) {
      this.openedUrls.push(e);
    }
  };
  class o extends r.NotificationSender {
    constructor() {
      super(), this.sentMessages = [], this.warningPromises = [];
    }
    showWarningMessage(e, ...t) {
      this.sentMessages.push(e);
      const n = t ? Promise.resolve(t[0]) : Promise.resolve(void 0);
      return this.warningPromises.push(n), n;
    }
    async waitForWarningMessages() {
      await Promise.all(this.warningPromises);
    }
  }
  exports.TestNotificationSender = o;