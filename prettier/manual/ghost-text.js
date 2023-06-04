Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.registerGhostText = exports.handleGhostTextPostInsert = exports.handleGhostTextShown = exports.resetPartialAcceptanceState = exports.resetStateForLastCompletion = exports.handlePartialGhostTextPostInsert = exports.provideInlineCompletions = exports.ghostTextLogger = exports.getInsertionTextFromCompletion = void 0;
  const r = require(89496),
    i = require(51133),
    o = require(42218),
    s = require(89334),
    a = require(40750),
    c = require(29899),
    l = require(57017),
    u = require(6333),
    p = require(91238),
    d = require(54540),
    h = "_ghostTextPostInsert";
  function f(e) {
    return e.insertText;
  }
  let m, g;
  exports.getInsertionTextFromCompletion = f, exports.ghostTextLogger = new c.Logger(c.LogLevel.INFO, "ghostText");
  let y,
    _,
    v = [];
  async function b(e, n, c, p, f) {
    const b = await async function (e, n, a, c, p) {
      const f = u.TelemetryData.createAndMarkAsIssued();
      if (!function (e) {
        return (0, i.getConfig)(e, i.ConfigKey.InlineSuggestEnable);
      }(e)) return {
        type: "abortedBeforeIssued",
        reason: "ghost text is disabled"
      };
      if ((0, d.ignoreDocument)(e, n)) return {
        type: "abortedBeforeIssued",
        reason: "document is ignored"
      };
      if (exports.ghostTextLogger.debug(e, `Ghost text called at [${a.line}, ${a.character}], with triggerKind ${c.triggerKind}`), p.isCancellationRequested) return exports.ghostTextLogger.info(e, "Cancelled before extractPrompt"), {
        type: "abortedBeforeIssued",
        reason: "cancelled before extractPrompt"
      };
      const b = await (0, s.getGhostText)(e, n, a, c.triggerKind === r.InlineCompletionTriggerKind.Invoke, f, p);
      if ("success" !== b.type) return exports.ghostTextLogger.debug(e, "Breaking, no results from getGhostText -- " + b.type + ": " + b.reason), b;
      const [E, w] = b.value;
      if (m && g && (!m.isEqual(a) || g !== n.uri) && w !== s.ResultType.TypingAsSuggested) {
        const t = function () {
          const e = [];
          return v.forEach(t => {
            if (t.displayText && t.telemetry) {
              let n, r;
              _ ? (n = t.displayText.substring(_ - 1), r = t.telemetry.extendedBy({
                compType: "partial"
              }, {
                compCharLen: n.length
              })) : (n = t.displayText, r = t.telemetry);
              const i = {
                completionText: n,
                completionTelemetryData: r
              };
              e.push(i);
            }
          }), e;
        }();
        t.length > 0 && (0, l.postRejectionTasks)(e, "ghostText", n.offsetAt(m), g, t), _ = void 0;
      }
      if (m = a, g = n.uri, v = [], p.isCancellationRequested) return exports.ghostTextLogger.info(e, "Cancelled after getGhostText"), {
        type: "canceled",
        reason: "after getGhostText",
        telemetryData: {
          telemetryBlob: b.telemetryBlob
        }
      };
      const T = (0, o.completionsFromGhostTextResults)(e, E, w, n, a, function (e) {
          return r.window.visibleTextEditors.find(t => t.document === e)?.options;
        }(n), y),
        S = T.map(e => {
          const {
              text: t,
              range: i
            } = e,
            o = new r.Range(new r.Position(i.start.line, i.start.character), new r.Position(i.end.line, i.end.character)),
            s = new r.InlineCompletionItem(t, o);
          return s.index = e.index, s.telemetry = e.telemetry, s.displayText = e.displayText, s.resultType = e.resultType, s.id = e.uuid, s.uri = n.uri, s.insertOffset = n.offsetAt(new r.Position(e.position.line, e.position.character)), s.command = {
            title: "PostInsertTask",
            command: h,
            arguments: [s]
          }, s;
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
    return await (0, a.handleGhostTextResultTelemetry)(e, b);
  }
  exports.provideInlineCompletions = b;
  class E {
    constructor(e) {
      this.ctx = e;
    }
    async provideInlineCompletionItems(e, t, n, o) {
      if (n.triggerKind === r.InlineCompletionTriggerKind.Automatic && (s = this.ctx, !(0, i.getConfig)(s, i.ConfigKey.EnableAutoCompletions))) return;
      var s;
      const a = await b(this.ctx, e, t, n, o);
      return a ? {
        items: a,
        suppressSuggestions: !0
      } : void 0;
    }
    handleDidShowCompletionItem(e) {
      x(this.ctx, e);
    }
    handleDidPartiallyAcceptCompletionItem(e, t) {
      w(this.ctx, e, t);
    }
  }
  async function w(e, n, r) {
    if (r === f(n).length && T(), exports.ghostTextLogger.debug(e, "Ghost text partial post insert"), n.telemetry && n.uri && n.displayText && n.insertOffset && n.range && n.id) {
      const t = function (e, t) {
        if (!e.range || !e.range.start || !e.range.end) return;
        const n = f(e);
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
  function T() {
    v = [], g = void 0, m = void 0;
  }
  function S() {
    _ = void 0;
  }
  function x(e, n) {
    if (y = n.index, !v.find(e => e.index === n.index) && (v.push(n), n.telemetry && n.displayText)) {
      const r = !(n.resultType === s.ResultType.Network);
      exports.ghostTextLogger.debug(e, `[${n.telemetry.properties.headerRequestId}] shown choiceIndex: ${n.telemetry.properties.choiceIndex}, fromCache ${r}`), n.telemetry.measurements.compCharLen = n.displayText.length, (0, a.telemetryShown)(e, "ghostText", n.telemetry, r);
    }
  }
  async function C(e, n) {
    if (T(), exports.ghostTextLogger.debug(e, "Ghost text post insert"), n.telemetry && n.uri && n.displayText && void 0 !== n.insertOffset && n.range && n.id) {
      const t = n.telemetry.extendedBy({
        compType: _ ? "partial" : "full"
      }, {
        compCharLen: n.displayText.length
      });
      S(), await (0, l.postInsertionTasks)(e, "ghostText", n.displayText, n.insertOffset, n.uri, t, n.id, n.range.start);
    }
  }
  exports.handlePartialGhostTextPostInsert = w, exports.resetStateForLastCompletion = T, exports.resetPartialAcceptanceState = S, exports.handleGhostTextShown = x, exports.handleGhostTextPostInsert = C, exports.registerGhostText = function (e) {
    const t = new E(e),
      n = r.languages.registerInlineCompletionItemProvider({
        pattern: "**"
      }, t),
      i = r.commands.registerCommand(h, async t => C(e, t));
    e.get(p.VsCodeExtensionContext).subscriptions.push(n, i);
  };