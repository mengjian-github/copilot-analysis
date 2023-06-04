var r;
var i;
var o;
var s;
var a;
var c = this && this.__classPrivateFieldGet || function (e, t, n, r) {
  if ("a" === n && !r) throw new TypeError("Private accessor was defined without a getter");
  if ("function" == typeof t ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return "m" === n ? r : "a" === n ? r.call(e) : r ? r.value : t.get(e);
};
var l = this && this.__classPrivateFieldSet || function (e, t, n, r, i) {
  if ("m" === r) throw new TypeError("Private method is not writable");
  if ("a" === r && !i) throw new TypeError("Private accessor was defined without a setter");
  if ("function" == typeof t ? e !== t || !i : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  if ("a" === r) {
    i.call(e, n);
  } else {
    if (i) {
      i.value = n;
    } else {
      t.set(e, n);
    }
  }
  return n;
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CopilotIgnore = exports.COPILOT_IGNORE_FILE = exports.copilotIgnoreLogger = void 0;
const u = require(15151);
const p = require(71017);
const d = require(29899);
const h = require(6333);
function f(e, t) {
  return e === t || (e.charAt(e.length - 1) !== p.sep && (e += p.sep), p.normalize(t).startsWith(p.normalize(e)));
}
exports.copilotIgnoreLogger = new d.Logger(d.LogLevel.INFO, "copilotIgnore");
exports.COPILOT_IGNORE_FILE = ".copilotignore";
exports.CopilotIgnore = class {
  constructor(e) {
    r.add(this);
    this.ctx = e;
    i.set(this, new Map());
    o.set(this, null);
  }
  setPattern(e, n) {
    exports.copilotIgnoreLogger.info(this.ctx, "setting patterns", e.fsPath);
    c(this, i, "f").set(e.fsPath, u.default().add(n));
    c(this, r, "m", a).call(this, "set");
    l(this, o, null, "f");
  }
  removePattern(e) {
    exports.copilotIgnoreLogger.info(this.ctx, "removing patterns", e.fsPath);
    c(this, r, "m", a).call(this, "remove");
    c(this, i, "f").delete(e.fsPath);
    l(this, o, null, "f");
  }
  removeWorkspace(e) {
    exports.copilotIgnoreLogger.info(this.ctx, "removing workspace", {
      workspace: e
    });
    let n = 0;
    for (const t of c(this, i, "f").keys()) if (f(e.fsPath, t)) {
      c(this, i, "f").delete(t);
      n += 1;
    }
    if (n > 0) {
      c(this, r, "m", a).call(this, "workspace.remove", void 0, {
        fileCount: n
      });
    }
    l(this, o, null, "f");
  }
  isIgnored(e) {
    if ("file" !== e.scheme) return !1;
    if (0 === c(this, i, "f").size) return !1;
    const n = Date.now();
    const o = e.fsPath;
    let l = 0;
    let u = {
      ignored: !1,
      unignored: !1
    };
    const d = c(this, r, "a", s);
    e: for (const e of d) {
      l += 1;
      const n = p.dirname(e);
      const r = p.relative(n, o);
      if (!r.startsWith("..") && f(n, o) && (u = c(this, i, "f").get(e).test(r), u.ignored && exports.copilotIgnoreLogger.debug(this.ctx, "ignoring file", {
        file: r,
        root: e
      }), u.ignored || u.unignored)) break e;
    }
    const h = Date.now();
    c(this, r, "m", a).call(this, "isIgnored", {
      ignored: String(u.ignored),
      unignored: String(u.unignored)
    }, {
      iterations: l,
      ignoreFileCount: d.length,
      startTimeMs: n,
      endTimeMs: h,
      deltaMs: h - n
    });
    return u.ignored;
  }
};
i = new WeakMap();
o = new WeakMap();
r = new WeakSet();
s = function () {
  if (null !== c(this, o, "f")) return c(this, o, "f");
  const e = {};
  const t = e => e.split(p.sep).length;
  return l(this, o, [...c(this, i, "f").keys()].sort((n, r) => (e[r] || (e[r] = t(r))) - (e[n] || (e[n] = t(n)))), "f");
};
a = function (e, t, n, r) {
  h.telemetry(this.ctx, `copilotIgnore.${e}`, h.TelemetryData.createAndMarkAsIssued(t, n), r);
};