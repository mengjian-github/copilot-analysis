Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.register = void 0;
const r = require(66277);
const request = require("./request");
const o = require(77032);
const s = Math.log(256) / Math.log(2) / 2;
const a = r.proxy({
  connection: "disabled",
  maxAttempts: s,
  retryAttempts: 0,
  initialWait: !1
});
let c;
exports.register = function () {
  if (c) return c;
  function e() {
    return "connected" === a.connection;
  }
  function t() {
    return "retry" === a.connection;
  }
  function n() {
    if (e()) {
      a.connection = "connected";
    }
    u(!1);
  }
  function l() {
    a.connection = "retry";
  }
  function u(e) {
    if (a.initialWait !== e) {
      a.initialWait = e;
    }
  }
  c = {
    setConnected: n,
    setDisconnected: function () {
      a.connection = "disconnected";
    },
    setRetrying: l,
    setDisabled: function () {
      a.connection = "disabled";
    },
    enableRetry: async function (e, r = 3e3) {
      if (t()) {
        l();
        u(!0);
        await async function (e, t) {
          var r;
          await (r = t, new Promise(e => setTimeout(e, r)));
          u(!1);
          const c = e.get(request.Fetcher);
          await async function e(t, r) {
            setTimeout(async () => {
              a.retryAttempts = Math.min(a.retryAttempts + 1, s);
              if (t > 256) a.connection = "disconnected";else try {
                o.codeQuoteLogger.info(r, `Pinging Snippy after ${t} second(s)`);
                const i = await c.fetch("https://origin-tracker.githubusercontent.com/_ping", {
                  method: "GET",
                  headers: {
                    "content-type": "application/json"
                  }
                });
                if (o.codeQuoteLogger.info(r, JSON.stringify(i)), 200 === i.status && i.ok) return o.codeQuoteLogger.info(r, "Successfully reconnected to Snippyv2"), void n();
                await e(t ** 2, r);
              } catch (n) {
                await e(t ** 2, r);
              }
            }, 1e3 * t);
          }(2, e);
        }(e, r);
      }
    },
    listen: function (e) {
      return {
        dispose: r.subscribe(a, e)
      };
    },
    isConnected: e,
    isDisconnected: function () {
      return "disconnected" === a.connection;
    },
    isRetrying: t,
    isDisabled: function () {
      return "disabled" === a.connection;
    },
    isInitialWait: function () {
      return a.initialWait;
    },
    getSnapshot: () => r.snapshot(a)
  };
  return c;
};