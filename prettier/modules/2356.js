Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.startFakeTelemetryServerIfNecessary = void 0;
const r = require(3459);
const i = require(71017);
const o = require(71267);
let s;
let a;
exports.startFakeTelemetryServerIfNecessary = async function () {
  return void 0 === s ? new Promise(async e => {
    const t = await async function () {
      return await r.default({
        port: 5789
      });
    }();
    s = new o.Worker(i.resolve(__dirname, "..", "dist", "telemetryFakeWorker.js"), {
      workerData: {
        port: t
      }
    });
    s.on("message", () => {
      e(t);
    });
    a = t;
  }) : a;
};