Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.logger = exports.toPlainText = exports.Logger = exports.MultiLog = exports.OutputChannelLog = exports.ConsoleLog = exports.LogTarget = exports.verboseLogging = exports.LogVerbose = exports.LogLevel = void 0;
const r = require(10299);
const config = require("./config");
const telemetry = require("./telemetry");
var s;
!function (e) {
  e[e.DEBUG = 0] = "DEBUG";
  e[e.INFO = 1] = "INFO";
  e[e.WARN = 2] = "WARN";
  e[e.ERROR = 3] = "ERROR";
}(s = exports.LogLevel || (exports.LogLevel = {}));
class LogVerbose {
  constructor(e) {
    this.logVerbose = e;
  }
}
function verboseLogging(e) {
  return e.get(LogVerbose).logVerbose;
}
exports.LogVerbose = LogVerbose;
exports.verboseLogging = verboseLogging;
class LogTarget {
  shouldLog(e, t) {}
}
exports.LogTarget = LogTarget;
exports.ConsoleLog = class extends LogTarget {
  constructor(e) {
    super();
    this.console = e;
  }
  logIt(e, t, n, ...r) {
    if (verboseLogging(e) || t == s.ERROR) {
      this.console.error(n, ...r);
    } else {
      if (t == s.WARN) {
        this.console.warn(n, ...r);
      }
    }
  }
};
exports.OutputChannelLog = class extends LogTarget {
  constructor(e) {
    super();
    this.output = e;
  }
  logIt(e, t, n, ...r) {
    this.output.appendLine(`${n} ${r.map(toPlainText)}`);
  }
};
exports.MultiLog = class extends LogTarget {
  constructor(e) {
    super();
    this.targets = e;
  }
  logIt(e, t, n, ...r) {
    this.targets.forEach(i => i.logIt(e, t, n, ...r));
  }
};
class Logger {
  constructor(e, t) {
    this.minLoggedLevel = e;
    this.context = t;
  }
  setLevel(e) {
    this.minLoggedLevel = e;
  }
  stringToLevel(e) {
    return s[e];
  }
  log(e, t, ...n) {
    const i = s[t];
    const o = e.get(LogTarget);
    const a = o.shouldLog(e, t);
    if (!1 === a) return;
    if (void 0 === a && !this.shouldLog(e, t, this.context)) return;
    const c = e.get(r.Clock).now().toISOString();
    const u = `[${i}] [${this.context}] [${c}]`;
    o.logIt(e, t, u, ...n);
  }
  sendErrorTelemetry(e, t, n, r) {
    telemetry.telemetryError(e, t, telemetry.TelemetryData.createAndMarkAsIssued({
      context: this.context,
      level: s[s.ERROR],
      message: n
    }), !0);
    telemetry.telemetryError(e, t, telemetry.TelemetryData.createAndMarkAsIssued({
      context: this.context,
      level: s[s.ERROR],
      message: r
    }), !1);
  }
  telemetryMessage(...e) {
    return e.length > 0 ? JSON.stringify(e) : "no msg";
  }
  shouldLog(e, t, n) {
    if (verboseLogging(e)) return !0;
    const r = config.getConfig(e, config.ConfigKey.DebugFilterLogCategories);
    if (r.length > 0 && !r.includes(n)) return !1;
    if (config.isProduction(e)) return t >= this.minLoggedLevel;
    const o = config.getConfig(e, config.ConfigKey.DebugOverrideLogLevels);
    return t >= (this.stringToLevel(o["*"]) ?? this.stringToLevel(o[this.context]) ?? this.minLoggedLevel);
  }
  debug(e, ...t) {
    this.log(e, s.DEBUG, ...t);
  }
  info(e, ...t) {
    this.log(e, s.INFO, ...t);
  }
  warn(e, ...t) {
    this.log(e, s.WARN, ...t);
  }
  error(e, ...t) {
    this.sendErrorTelemetry(e, "log", this.telemetryMessage(...t), "[redacted]");
    this.log(e, s.ERROR, ...t);
  }
  exception(e, t, n) {
    const r = n ? `${n}: ` : "";
    const i = t instanceof Error ? t : new Error("Non-error thrown: " + t);
    telemetry.telemetryException(e, i, n ?? "Error");
    this.log(e, s.ERROR, `${r}(${i.constructor.name}) ${i.message}`);
  }
}
function toPlainText(e) {
  return "object" == typeof e ? JSON.stringify(e) : String(e);
}
exports.Logger = Logger;
exports.toPlainText = toPlainText;
exports.logger = new Logger(s.INFO, "default");