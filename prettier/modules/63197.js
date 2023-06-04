Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerGhostText = exports.handleGhostTextPostInsert = exports.handleGhostTextShown = exports.resetPartialAcceptanceState = exports.resetStateForLastCompletion = exports.handlePartialGhostTextPostInsert = exports.provideInlineCompletions = exports.ghostTextLogger = exports.getInsertionTextFromCompletion = void 0;
const r = require(89496);
const i = require(51133);
const o = require(42218);
const s = require(89334);
const a = require(40750);
const c = require(29899);
const l = require(57017);
const u = require(6333);
const p = require(91238);
const d = require(54540);
const h = "_ghostTextPostInsert";
function getInsertionTextFromCompletion(e) {
  return e.insertText;
}
let m;
let g;
exports.getInsertionTextFromCompletion = getInsertionTextFromCompletion;
exports.ghostTextLogger = new c.Logger(c.LogLevel.INFO, "ghostText");
let y;
let _;
let v = [];
async function provideInlineCompletions(e, n, c, p, f) {
  const b = await async function (e, n, a, c, p) {
    const f = u.TelemetryData.createAndMarkAsIssued();
    if (!function (e) {
      return i.getConfig(e, i.ConfigKey.InlineSuggestEnable);
    }(e)) return {
      type: "abortedBeforeIssued",
      reason: "ghost text is disabled"
    };
    if (d.ignoreDocument(e, n)) return {
      type: "abortedBeforeIssued",
      reason: "document is ignored"
    };
    exports.ghostTextLogger.debug(e, `Ghost text called at [${a.line}, ${a.character}], with triggerKind ${c.triggerKind}`);
    if (p.isCancellationRequested) return exports.ghostTextLogger.info(e, "Cancelled before extractPrompt"), {
      type: "abortedBeforeIssued",
      reason: "cancelled before extractPrompt"
    };
    const b = await s.getGhostText(e, n, a, c.triggerKind === r.InlineCompletionTriggerKind.Invoke, f, p);
    if ("success" !== b.type) {
      exports.ghostTextLogger.debug(e, "Breaking, no results from getGhostText -- " + b.type + ": " + b.reason);
      return b;
    }
    const [E, w] = b.value;
    if (m && g && (!m.isEqual(a) || g !== n.uri) && w !== s.ResultType.TypingAsSuggested) {
      const t = function () {
        const e = [];
        v.forEach(t => {
          if (t.displayText && t.telemetry) {
            let n;
            let r;
            if (_) {
              n = t.displayText.substring(_ - 1);
              r = t.telemetry.extendedBy({
                compType: "partial"
              }, {
                compCharLen: n.length
              });
            } else {
              n = t.displayText;
              r = t.telemetry;
            }
            const i = {
              completionText: n,
              completionTelemetryData: r
            };
            e.push(i);
          }
        });
        return e;
      }();
      if (t.length > 0) {
        l.postRejectionTasks(e, "ghostText", n.offsetAt(m), g, t);
      }
      _ = void 0;
    }
    m = a;
    g = n.uri;
    v = [];
    if (p.isCancellationRequested) return exports.ghostTextLogger.info(e, "Cancelled after getGhostText"), {
      type: "canceled",
      reason: "after getGhostText",
      telemetryData: {
        telemetryBlob: b.telemetryBlob
      }
    };
    const T = o.completionsFromGhostTextResults(e, E, w, n, a, function (e) {
      return r.window.visibleTextEditors.find(t => t.document === e)?.options;
    }(n), y);
    const S = T.map(e => {
      const {
        text: t,
        range: i
      } = e;
      const o = new r.Range(new r.Position(i.start.line, i.start.character), new r.Position(i.end.line, i.end.character));
      const s = new r.InlineCompletionItem(t, o);
      s.index = e.index;
      s.telemetry = e.telemetry;
      s.displayText = e.displayText;
      s.resultType = e.resultType;
      s.id = e.uuid;
      s.uri = n.uri;
      s.insertOffset = n.offsetAt(new r.Position(e.position.line, e.position.character));
      s.command = {
        title: "PostInsertTask",
        command: h,
        arguments: [s]
      };
      return s;
    });
    return 0 === S.length ? {
      type: "empty",
      reason: "no completions in final result",
      telemetryData: b.telemetryData
    } : {
      ...b,
      value: S
    };
  }(e, n, c, p, f);
  return await a.handleGhostTextResultTelemetry(e, b);
}
exports.provideInlineCompletions = provideInlineCompletions;
class E {
  constructor(e) {
    this.ctx = e;
  }
  async provideInlineCompletionItems(e, t, n, o) {
    if (n.triggerKind === r.InlineCompletionTriggerKind.Automatic && (s = this.ctx, !i.getConfig(s, i.ConfigKey.EnableAutoCompletions))) return;
    var s;
    const a = await provideInlineCompletions(this.ctx, e, t, n, o);
    return a ? {
      items: a,
      suppressSuggestions: !0
    } : void 0;
  }
  handleDidShowCompletionItem(e) {
    handleGhostTextShown(this.ctx, e);
  }
  handleDidPartiallyAcceptCompletionItem(e, t) {
    handlePartialGhostTextPostInsert(this.ctx, e, t);
  }
}
async function handlePartialGhostTextPostInsert(e, n, r) {
  if (r === getInsertionTextFromCompletion(n).length) {
    resetStateForLastCompletion();
  }
  exports.ghostTextLogger.debug(e, "Ghost text partial post insert");
  if (n.telemetry && n.uri && n.displayText && n.insertOffset && n.range && n.id) {
    const t = function (e, t) {
      if (!e.range || !e.range.start || !e.range.end) return;
      const n = getInsertionTextFromCompletion(e);
      return e.displayText !== n && n.trim() === e.displayText ? t : t - e.range.end.character + e.range.start.character;
    }(n, r);
    if (t) {
      const i = n.telemetry.extendedBy({
        compType: "partial"
      }, {
        compCharLen: t
      });
      _ = r;
      const o = n.displayText.substring(0, t);
      await (0, l.postInsertionTasks)(e, "ghostText", o, n.insertOffset, n.uri, i, n.id, n.range.start);
    }
  }
}
function resetStateForLastCompletion() {
  v = [];
  g = void 0;
  m = void 0;
}
function resetPartialAcceptanceState() {
  _ = void 0;
}
function handleGhostTextShown(e, n) {
  y = n.index;
  if (!v.find(e => e.index === n.index) && (v.push(n), n.telemetry && n.displayText)) {
    const r = !(n.resultType === s.ResultType.Network);
    exports.ghostTextLogger.debug(e, `[${n.telemetry.properties.headerRequestId}] shown choiceIndex: ${n.telemetry.properties.choiceIndex}, fromCache ${r}`), n.telemetry.measurements.compCharLen = n.displayText.length, (0, a.telemetryShown)(e, "ghostText", n.telemetry, r);
  }
}
async function handleGhostTextPostInsert(e, n) {
  resetStateForLastCompletion();
  exports.ghostTextLogger.debug(e, "Ghost text post insert");
  if (n.telemetry && n.uri && n.displayText && void 0 !== n.insertOffset && n.range && n.id) {
    const t = n.telemetry.extendedBy({
      compType: _ ? "partial" : "full"
    }, {
      compCharLen: n.displayText.length
    });
    resetPartialAcceptanceState(), await (0, l.postInsertionTasks)(e, "ghostText", n.displayText, n.insertOffset, n.uri, t, n.id, n.range.start);
  }
}
exports.handlePartialGhostTextPostInsert = handlePartialGhostTextPostInsert;
exports.resetStateForLastCompletion = resetStateForLastCompletion;
exports.resetPartialAcceptanceState = resetPartialAcceptanceState;
exports.handleGhostTextShown = handleGhostTextShown;
exports.handleGhostTextPostInsert = handleGhostTextPostInsert;
exports.registerGhostText = function (e) {
  const t = new E(e);
  const n = r.languages.registerInlineCompletionItemProvider({
    pattern: "**"
  }, t);
  const i = r.commands.registerCommand(h, async t => handleGhostTextPostInsert(e, t));
  e.get(p.VsCodeExtensionContext).subscriptions.push(n, i);
};