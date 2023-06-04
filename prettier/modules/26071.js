Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FailingTelemetryReporter = exports.assertHasProperty = exports.withInlineTelemetryCapture = exports.withOptionalTelemetryCapture = exports.withTelemetryCapture = exports.withInMemoryTelemetry = exports.allEvents = exports.isException = exports.isEvent = exports.isRestrictedTelemetryMessage = exports.isStandardTelemetryMessage = exports.collectCapturedTelemetry = exports.TestPromiseQueue = exports.PromiseQueue = void 0;
const r = require(39491);
const i = require(47870);
const o = require(82279);
const s = require(6333);
const a = require(89176);
const c = require(2356);
const l = require(66036);
class PromiseQueue {
  async register(e) {
    return e;
  }
}
exports.PromiseQueue = PromiseQueue;
class TestPromiseQueue {
  constructor() {
    this.promises = [];
  }
  async register(e) {
    this.promises.push(e);
    return e;
  }
  async awaitPromises() {
    await Promise.all(this.promises);
  }
}
async function collectCapturedTelemetry(e) {
  const t = e.get(s.TelemetryEndpointUrl).getUrl();
  const n = await e.get(o.Fetcher).fetch(t, {});
  const i = (await n.json()).messages ?? [];
  for (const e of i) r.strictEqual(e.tags["ai.cloud.roleInstance"], "REDACTED");
  return i;
}
function isEvent(e) {
  return "EventData" === e.data.baseType;
}
async function f(e, t, n) {
  const r = await c.startFakeTelemetryServerIfNecessary();
  const i = Math.floor(1e5 * Math.random()).toString();
  delete process.env.http_proxy;
  delete process.env.https_proxy;
  const o = e.get(s.TelemetryEndpointUrl).getUrl();
  e.get(s.TelemetryEndpointUrl).setUrlForTesting(`http://localhost:${r}/${i}`);
  a.setupTelemetryReporters(e, "copilot-test", t);
  try {
    const t = new TestPromiseQueue();
    e.forceSet(PromiseQueue, t);
    const r = await n(e);
    await t.awaitPromises();
    await e.get(s.TelemetryReporters).deactivate();
    const i = await async function (e) {
      for (let t = 0; t < 3; t++) {
        await new Promise(e => setTimeout(e, 1e3 * t));
        const n = await collectCapturedTelemetry(e);
        if (n.length > 0) return n;
        console.warn("Retrying to collect telemetry messages #" + (t + 1));
      }
      return [];
    }(e);
    return [i, r];
  } finally {
    e.get(s.TelemetryEndpointUrl).setUrlForTesting(o);
  }
}
exports.TestPromiseQueue = TestPromiseQueue;
exports.collectCapturedTelemetry = collectCapturedTelemetry;
exports.isStandardTelemetryMessage = function (e) {
  return e.iKey === a.APP_INSIGHTS_KEY;
};
exports.isRestrictedTelemetryMessage = function (e) {
  return e.iKey === a.APP_INSIGHTS_KEY_SECURE;
};
exports.isEvent = isEvent;
exports.isException = function (e) {
  return "ExceptionData" === e.data.baseType;
};
exports.allEvents = function (e) {
  for (const t of e) if (!isEvent(t)) return !1;
  return !0;
};
exports.withInMemoryTelemetry = async function (e, t) {
  const n = new l.TelemetrySpy();
  const r = new l.TelemetrySpy();
  e.get(s.TelemetryReporters).setReporter(n);
  e.get(s.TelemetryReporters).setSecureReporter(r);
  const i = new TestPromiseQueue();
  e.forceSet(PromiseQueue, i);
  const o = await t(e);
  await i.awaitPromises();
  return {
    reporter: n,
    restrictedReporter: r,
    result: o
  };
};
exports.withTelemetryCapture = async function (e, t) {
  return f(new i.Context(e), !0, t);
};
exports.withOptionalTelemetryCapture = async function (e, t) {
  return f(new i.Context(e), !1, t);
};
exports.withInlineTelemetryCapture = async function (e, t) {
  return f(e, !0, t);
};
exports.assertHasProperty = function (e, t) {
  r.ok(e.filter(e => "ghostText.produced" !== e.data.baseData.name.split("/")[1]).every(e => {
    const n = e.data.baseData.properties;
    return t.call(n, n);
  }));
};
exports.FailingTelemetryReporter = class {
  sendTelemetryEvent(e, t, n) {
    throw new Error("Telemetry disabled");
  }
  sendTelemetryErrorEvent(e, t, n, r) {
    throw new Error("Telemetry disabled");
  }
  sendTelemetryException(e, t, n) {
    throw new Error("Telemetry disabled");
  }
  dispose() {
    return Promise.resolve();
  }
  hackOptOutListener() {}
};