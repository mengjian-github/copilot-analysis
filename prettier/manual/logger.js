Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.logger = exports.toPlainText = exports.Logger = exports.MultiLog = exports.OutputChannelLog = exports.ConsoleLog = exports.LogTarget = exports.verboseLogging = exports.LogVerbose = exports.LogLevel = void 0;
  const r = require(10299),
    i = require(51133),
    o = require(6333);
  var s;
  !function (e) {
    e[e.DEBUG = 0] = "DEBUG", e[e.INFO = 1] = "INFO", e[e.WARN = 2] = "WARN", e[e.ERROR = 3] = "ERROR";
  }(s = exports.LogLevel || (exports.LogLevel = {}));
  class a {
    constructor(e) {
      this.logVerbose = e;
    }
  }
  function c(e) {
    return e.get(a).logVerbose;
  }
  exports.LogVerbose = a, exports.verboseLogging = c;
  class l {
    shouldLog(e, t) {}
  }
  exports.LogTarget = l, exports.ConsoleLog = class extends l {
    constructor(e) {
      super(), this.console = e;
    }
    logIt(e, t, n, ...r) {
      c(e) || t == s.ERROR ? this.console.error(n, ...r) : t == s.WARN && this.console.warn(n, ...r);
    }
  }, exports.OutputChannelLog = class extends l {
    constructor(e) {
      super(), this.output = e;
    }
    logIt(e, t, n, ...r) {
      this.output.appendLine(`${n} ${r.map(p)}`);
    }
  }, exports.MultiLog = class extends l {
    constructor(e) {
      super(), this.targets = e;
    }
    logIt(e, t, n, ...r) {
      this.targets.forEach(i => i.logIt(e, t, n, ...r));
    }
  };
  class u {
    constructor(e, t) {
      this.minLoggedLevel = e, this.context = t;
    }
    setLevel(e) {
      this.minLoggedLevel = e;
    }
    stringToLevel(e) {
      return s[e];
    }
    log(e, t, ...n) {
      const i = s[t],
        o = e.get(l),
        a = o.shouldLog(e, t);
      if (!1 === a) return;
      if (void 0 === a && !this.shouldLog(e, t, this.context)) return;
      const c = e.get(r.Clock).now().toISOString(),
        u = `[${i}] [${this.context}] [${c}]`;
      o.logIt(e, t, u, ...n);
    }
    sendErrorTelemetry(e, t, n, r) {
      (0, o.telemetryError)(e, t, o.TelemetryData.createAndMarkAsIssued({
        context: this.context,
        level: s[s.ERROR],
        message: n
      }), !0), (0, o.telemetryError)(e, t, o.TelemetryData.createAndMarkAsIssued({
        context: this.context,
        level: s[s.ERROR],
        message: r
      }), !1);
    }
    telemetryMessage(...e) {
      return e.length > 0 ? JSON.stringify(e) : "no msg";
    }
    shouldLog(e, t, n) {
      if (c(e)) return !0;
      const r = (0, i.getConfig)(e, i.ConfigKey.DebugFilterLogCategories);
      if (r.length > 0 && !r.includes(n)) return !1;
      if ((0, i.isProduction)(e)) return t >= this.minLoggedLevel;
      const o = (0, i.getConfig)(e, i.ConfigKey.DebugOverrideLogLevels);
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
      this.sendErrorTelemetry(e, "log", this.telemetryMessage(...t), "[redacted]"), this.log(e, s.ERROR, ...t);
    }
    exception(e, t, n) {
      const r = n ? `${n}: ` : "",
        i = t instanceof Error ? t : new Error("Non-error thrown: " + t);
      (0, o.telemetryException)(e, i, n ?? "Error"), this.log(e, s.ERROR, `${r}(${i.constructor.name}) ${i.message}`);
    }
  }
  function p(e) {
    return "object" == typeof e ? JSON.stringify(e) : String(e);
  }
  exports.Logger = u, exports.toPlainText = p, exports.logger = new u(s.INFO, "default");