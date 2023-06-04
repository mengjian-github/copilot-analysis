Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.registerDefaultHandlers = void 0;
  const r = require(82279),
    i = require(6333);
  exports.registerDefaultHandlers = function (e, t) {
    process.addListener("uncaughtException", t => {
      console.error("uncaughtException", t), i.telemetryException(e, t, "uncaughtException");
    });
    let n = !1;
    process.addListener("unhandledRejection", (o, s) => {
      if (n) return;
      if (n = !0, "vscode" === t && !o) return;
      if ("aborted" === o.type || (0, r.isAbortError)(o)) return;
      if ("vscode" === t && ["ENOTFOUND", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENETDOWN", "ENETUNREACH", "EADDRNOTAVAIL"].includes(o.code)) return;
      if ("ENOENT" == o.code) return;
      let a = "";
      try {
        a = `${o.message} (${o.code})`, a = JSON.stringify(o);
      } catch (e) {
        a = "[actual reason JSON was cyclic]";
      }
      "{}" !== a && (console.error("unhandledRejection", a), i.telemetryError(e, "unhandledRejection", i.TelemetryData.createAndMarkAsIssued({
        origin: "unhandledRejection",
        reason: "Unhandled rejection logged to restricted telemetry"
      }), !1), i.telemetryError(e, "unhandledRejection", i.TelemetryData.createAndMarkAsIssued({
        origin: "unhandledRejection",
        reason: a
      }), !0), n = !1);
    });
  };