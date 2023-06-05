Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.handleGhostTextResultTelemetry = exports.mkBasicResultTelemetry = exports.mkCanceledResultTelemetry = exports.telemetryRejected = exports.telemetryAccepted = exports.telemetryShown = void 0;
  const telemetry = require("./telemetry");
  const i = require(38965);
  exports.telemetryShown = function (e, t, n, i) {
    n.markAsDisplayed();
    const o = i ? `${t}.shownFromCache` : `${t}.shown`;
    telemetry.telemetry(e, o, n);
  };
  exports.telemetryAccepted = function (e, t, n) {
    const o = t + ".accepted";
    const s = e.get(i.ContextualFilterManager);
    s.previousLabel = 1;
    s.previousLabelTimestamp = Date.now();
    telemetry.telemetry(e, o, n);
  };
  exports.telemetryRejected = function (e, t, n) {
    const o = t + ".rejected";
    const s = e.get(i.ContextualFilterManager);
    s.previousLabel = 0;
    s.previousLabelTimestamp = Date.now();
    telemetry.telemetry(e, o, n);
  };
  exports.mkCanceledResultTelemetry = function (e, t = {}) {
    return {
      ...t,
      telemetryBlob: e
    };
  };
  exports.mkBasicResultTelemetry = function (e) {
    return {
      headerRequestId: e.properties.headerRequestId,
      copilot_trackingId: e.properties.copilot_trackingId
    };
  };
  exports.handleGhostTextResultTelemetry = async function (e, t) {
    if ("success" === t.type) {
      telemetry.telemetryRaw(e, "ghostText.produced", t.telemetryData, {});
      return t.value;
    }
    if ("abortedBeforeIssued" !== t.type) {
      if ("canceled" !== t.type) {
        telemetry.telemetryRaw(e, `ghostText.${t.type}`, {
          ...t.telemetryData,
          reason: t.reason
        }, {});
      } else {
        telemetry.telemetry(e, "ghostText.canceled", t.telemetryData.telemetryBlob.extendedBy({
          reason: t.reason,
          cancelledNetworkRequest: t.telemetryData.cancelledNetworkRequest ? "true" : "false"
        }));
      }
    }
  };