Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.checkSuffix = exports.postProcessChoice = void 0;
const promptlibproxy = require("./prompt-lib-proxy");
const telemetry = require("./telemetry");
const env = require("./env");
const s = require(29657);
exports.postProcessChoice = async function (e, t, n, a, c, l, u) {
  if (s.isRepetitive(c.tokens)) {
    const t = telemetry.TelemetryData.createAndMarkAsIssued();
    t.extendWithRequestId(c.requestId);
    telemetry.telemetry(e, "repetition.detected", t, !0);
    return void u.info(e, "Filtered out repetitive solution");
  }
  const p = {
    ...c
  };
  if (function (e, t, n) {
    let r = "";
    let i = t.line + 1;
    for (; "" === r && i < e.lineCount;) {
      r = e.lineAt(i).text.trim();
      if (r === n.trim()) return !0;
      i++;
    }
    return !1;
  }(n, a, p.completionText)) {
    const t = telemetry.TelemetryData.createAndMarkAsIssued();
    t.extendWithRequestId(c.requestId);
    telemetry.telemetry(e, "completion.alreadyInDocument", t);
    telemetry.telemetry(e, "completion.alreadyInDocument", t.extendedBy({
      completionTextJson: JSON.stringify(p.completionText)
    }), !0);
    return void u.info(e, "Filtered out solution matching next line");
  }
  p.completionText = await async function (e, t, n, i, s) {
    if ("" === i) return i;
    let a = "}";
    try {
      a = promptlibproxy.getBlockCloseToken(t.languageId) ?? "}";
    } catch (e) {}
    let c = i.length;
    do {
      const r = i.lastIndexOf("\n", c - 2) + 1;
      const l = i.substring(r, c);
      if (l.trim() === a) {
        for (let e = n.line; e < t.lineCount; e++) {
          let o = t.lineAt(e).text;
          if (e === n.line) {
            o = o.substr(n.character);
          }
          if (o.startsWith(l.trimRight())) return i.substring(0, Math.max(0, s ? r : r - 1));
          if ("" !== o.trim()) break;
        }
        break;
      }
      if (c === r) {
        if (env.shouldFailForDebugPurposes(e)) throw Error(`Aborting: maybeSnipCompletion would have looped on completion: ${i}`);
        break;
      }
      c = r;
    } while (c > 1);
    return i;
  }(e, n, a, p.completionText, l);
  return p.completionText ? p : void 0;
};
exports.checkSuffix = function (e, t, n) {
  const r = e.lineAt(t.line).text.substring(t.character);
  if (r.length > 0) {
    if (-1 !== n.completionText.indexOf(r)) return !0;
    {
      let e = 0;
      for (const t of r) {
        const r = n.completionText.indexOf(t, e + 1);
        if (!(r > e)) {
          e = -1;
          break;
        }
        e = r;
      }
      return -1 !== e;
    }
  }
  return !1;
};