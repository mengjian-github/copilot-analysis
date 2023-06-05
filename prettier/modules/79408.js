Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerDefaultHandlers = void 0;
const request = require("./request");
const telemetry = require("./telemetry");
exports.registerDefaultHandlers = function (e, t) {
  process.addListener("uncaughtException", t => {
    console.error("uncaughtException", t);
    telemetry.telemetryException(e, t, "uncaughtException");
  });
  let n = !1;
  process.addListener("unhandledRejection", (o, s) => {
    if (n) return;
    n = !0;
    if ("vscode" === t && !o) return;
    if ("aborted" === o.type || request.isAbortError(o)) return;
    if ("vscode" === t && ["ENOTFOUND", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENETDOWN", "ENETUNREACH", "EADDRNOTAVAIL"].includes(o.code)) return;
    if ("ENOENT" == o.code) return;
    let a = "";
    try {
      a = `${o.message} (${o.code})`;
      a = JSON.stringify(o);
    } catch (e) {
      a = "[actual reason JSON was cyclic]";
    }
    if ("{}" !== a) {
      console.error("unhandledRejection", a);
      telemetry.telemetryError(e, "unhandledRejection", telemetry.TelemetryData.createAndMarkAsIssued({
        origin: "unhandledRejection",
        reason: "Unhandled rejection logged to restricted telemetry"
      }), !1);
      telemetry.telemetryError(e, "unhandledRejection", telemetry.TelemetryData.createAndMarkAsIssued({
        origin: "unhandledRejection",
        reason: a
      }), !0);
      n = !1;
    }
  });
};