Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.postInsertionTasks = exports.postRejectionTasks = exports.captureCode = exports.postInsertConfiguration = void 0;
const r = require(66881);
const telemetryutils = require("./telemetry-utils");
const logger = require("./logger");
const s = require(27727);
const a = require(94969);
const c = require(35120);
const telemetry = require("./telemetry");
const u = require(69636);
const env = require("./env");
const documentmanager = require("./document-manager");
const h = new logger.Logger(logger.LogLevel.INFO, "post-insertion");
const f = [{
  seconds: 15,
  captureCode: !1,
  captureRejection: !1
}, {
  seconds: 30,
  captureCode: !0,
  captureRejection: !0
}, {
  seconds: 120,
  captureCode: !1,
  captureRejection: !1
}, {
  seconds: 300,
  captureCode: !1,
  captureRejection: !1
}, {
  seconds: 600,
  captureCode: !1,
  captureRejection: !1
}];
async function captureCode(e, t, n) {
  const r = await e.get(documentmanager.TextDocumentManager).getTextDocument(t);
  if (!r) {
    h.info(e, `Could not get document for ${t.fsPath}. Maybe it was closed by the editor.`);
    return {
      prompt: {
        prefix: "",
        suffix: "",
        isFimEnabled: !1,
        promptElementRanges: []
      },
      capturedCode: "",
      terminationOffset: 0
    };
  }
  const i = r.getText();
  const o = i.substring(0, n);
  const c = r.positionAt(n);
  const l = await a.extractPrompt(e, r, c);
  const u = "prompt" === l.type ? l.prompt : {
    prefix: o,
    suffix: "",
    isFimEnabled: !1,
    promptElementRanges: []
  };
  const p = i.substring(n);
  const f = s.contextIndentationFromText(o, n, r.languageId);
  const m = s.indentationBlockFinished(f, void 0);
  const g = await m(p);
  const y = Math.min(i.length, n + (g ? 2 * g : 500));
  return {
    prompt: u,
    capturedCode: i.substring(n, y),
    terminationOffset: g ?? -1
  };
}
function g(e, t, n, r) {
  const i = e.substring(Math.max(0, r - n), Math.min(e.length, r + t.length + n));
  const o = c.lexEditDistance(i, t);
  const s = o.lexDistance / o.needleLexLength;
  const {
    distance: a
  } = c.editDistance(i.substring(o.startOffset, o.endOffset), t);
  return {
    relativeLexEditDistance: s,
    charEditDistance: a,
    completionLexLength: o.needleLexLength,
    foundOffset: o.startOffset + Math.max(0, r - n),
    lexEditDistance: o.lexDistance,
    stillInCodeHeuristic: s <= .5 ? 1 : 0
  };
}
exports.postInsertConfiguration = {
  triggerPostInsertionSynchroneously: !1
};
exports.captureCode = captureCode;
exports.postRejectionTasks = function (e, t, n, o, s) {
  s.forEach(({
    completionText: n,
    completionTelemetryData: r
  }) => {
    h.debug(e, `${t}.rejected choiceIndex: ${r.properties.choiceIndex}`);
    telemetryutils.telemetryRejected(e, t, r);
  });
  const a = new r.ChangeTracker(e, o, n);
  f.filter(e => e.captureRejection).map(r => {
    a.push(async () => {
      h.debug(e, `Original offset: ${n}, Tracked offset: ${a.offset}`);
      const {
        completionTelemetryData: i
      } = s[0];
      const {
        prompt: c,
        capturedCode: u,
        terminationOffset: p
      } = await captureCode(e, o, a.offset);
      let d;
      d = c.isFimEnabled ? {
        hypotheticalPromptPrefixJson: JSON.stringify(c.prefix),
        hypotheticalPromptSuffixJson: JSON.stringify(c.suffix)
      } : {
        hypotheticalPromptJson: JSON.stringify(c.prefix)
      };
      const f = i.extendedBy({
        ...d,
        capturedCodeJson: JSON.stringify(u)
      }, {
        timeout: r.seconds,
        insertionOffset: n,
        trackedOffset: a.offset,
        terminationOffsetInCapturedCode: p
      });
      h.debug(e, `${t}.capturedAfterRejected choiceIndex: ${i.properties.choiceIndex}`, f);
      telemetry.telemetry(e, t + ".capturedAfterRejected", f, !0);
    }, 1e3 * r.seconds);
  });
};
exports.postInsertionTasks = async function (e, n, o, s, a, c, y, _) {
  h.debug(e, `${n}.accepted choiceIndex: ${c.properties.choiceIndex}`);
  telemetryutils.telemetryAccepted(e, n, c);
  const v = o.trim();
  const b = new r.ChangeTracker(e, a, s);
  const E = async t => {
    await async function (e, t, n, r, i, o, s, a) {
      const c = await e.get(documentmanager.TextDocumentManager).getTextDocument(i);
      if (c) {
        const u = c.getText();
        let p = g(u, n, 50, a.offset);
        if (p.stillInCodeHeuristic) {
          p = g(u, n, 1500, a.offset);
        }
        h.debug(e, `stillInCode: ${p.stillInCodeHeuristic ? "Found" : "Not found"}! Completion '${n}' in file ${i.fsPath}. lexEditDistance fraction was ${p.relativeLexEditDistance}. Char edit distance was ${p.charEditDistance}. Inserted at ${r}, tracked at ${a.offset}, found at ${p.foundOffset}. choiceIndex: ${s.properties.choiceIndex}`);
        const d = s.extendedBy({}, {
          timeout: o.seconds,
          insertionOffset: r,
          trackedOffset: a.offset
        }).extendedBy({}, p);
        telemetry.telemetry(e, t + ".stillInCode", d);
        if (o.captureCode) {
          const {
            prompt: n,
            capturedCode: c,
            terminationOffset: u
          } = await captureCode(e, i, a.offset);
          let p;
          p = n.isFimEnabled ? {
            hypotheticalPromptPrefixJson: JSON.stringify(n.prefix),
            hypotheticalPromptSuffixJson: JSON.stringify(n.suffix)
          } : {
            hypotheticalPromptJson: JSON.stringify(n.prefix)
          };
          const f = s.extendedBy({
            ...p,
            capturedCodeJson: JSON.stringify(c)
          }, {
            timeout: o.seconds,
            insertionOffset: r,
            trackedOffset: a.offset,
            terminationOffsetInCapturedCode: u
          });
          h.debug(e, `${t}.capturedAfterAccepted choiceIndex: ${s.properties.choiceIndex}`, d), (0, telemetry.telemetry)(e, t + ".capturedAfterAccepted", f, !0);
        }
      }
    }(e, n, v, s, a, t, c, b);
  };
  if (exports.postInsertConfiguration.triggerPostInsertionSynchroneously && env.isRunningInTest(e)) {
    await E({
      seconds: 0,
      captureCode: !1,
      captureRejection: !1
    });
  } else {
    f.map(e => b.push(() => E(e), 1e3 * e.seconds));
  }
  e.get(u.PostInsertionNotifier).emit("onPostInsertion", {
    ctx: e,
    insertionCategory: n,
    insertionOffset: s,
    fileURI: a,
    completionText: o,
    telemetryData: c,
    completionId: y,
    start: _
  });
};