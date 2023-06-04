Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerPostInsertionListener = void 0;
const r = require(38523);
const i = require(89496);
const o = require(69636);
const s = require(78179);
const a = require(2135);
const c = require(91465);
const l = require(77032);
const u = require(19363);
const p = require(72129);
const d = require(43120);
const h = require(47302);
const f = require(56437);
const m = `Public code match detected in the current file.\n\n Click the ${c.CodeQuoteFeatureName} status bar item to view all matches for a file.`;
async function g(e, t) {
  const n = await t();
  var i;
  i = n;
  if (!r.Value.Check(d.MatchError, i)) return n;
  !function (e, t) {
    f.snippyTelemetry.handleSnippyNetworkError({
      context: e,
      origin: String(t.code),
      reason: t.reason,
      message: t.msg
    });
    if (t.reason !== p.ErrorReasons.Unauthorized && t.reason !== p.ErrorReasons.RateLimit) {
      e.get(s.CodeQuoteStatusReporter).setError(t.msg);
    }
  }(e, n);
}
async function y(e) {
  const {
    ctx: t,
    completionText: n,
    completionId: r,
    start: i,
    telemetryData: o,
    fileURI: c,
    insertionOffset: p
  } = e;
  if (!r || !i) return void f.snippyTelemetry.handleCompletionMissing({
    context: t,
    origin: "onPostInsertion",
    reason: "No completion metadata found."
  });
  if (!a.hasMinLexemeLength(n)) return;
  const d = await g(t, () => u.Match(t, n));
  if (!d || !d.snippets.length) return void l.codeQuoteLogger.info(t, "No match found");
  const y = {
    uuid: r,
    position: i,
    displayText: n,
    file: c,
    telemetry: o,
    offset: p
  };
  l.codeQuoteLogger.info(t, "Match found");
  const {
    snippets: _
  } = d;
  const v = _.map(e => ({
    match: e,
    files: [],
    licenseStats: null
  }));
  h.MatchState.addMatch(c.fsPath, {
    completion: y,
    snippets: v
  });
  if (h.NotificationState.getSnapshot().get(c.fsPath)) {
    t.get(s.CodeQuoteStatusReporter).setWarning(m);
    h.NotificationState.addNotification(c.fsPath);
  }
  const b = _.map(async e => {
    const n = await g(t, () => u.FilesForMatch(t, {
      cursor: e.cursor
    }));
    if (!n) return;
    const r = n.file_matches;
    const i = n.license_stats;
    return {
      match: e,
      files: r,
      licenseStats: i
    };
  });
  Promise.all(b).then(e => e.filter(Boolean)).then(e => {
    if (e.length) {
      l.codeQuoteLogger.info(t, "Citations fetched");
      h.MatchState.updateMatch(c.fsPath, {
        completion: y,
        snippets: e
      });
    }
  });
}
exports.registerPostInsertionListener = function (e) {
  const t = e.get(o.PostInsertionNotifier);
  t.on("onPostInsertion", y);
  return new i.Disposable(() => {
    t.off("onPostInsertion", y);
  });
};