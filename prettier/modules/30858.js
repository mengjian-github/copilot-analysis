Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.call = void 0;
const token = require("./token");
const request = require("./request");
const o = require(91465);
const s = require(77032);
const a = require(47302);
const c = require(56437);
const l = require(72129);
exports.call = async function (e, t, n, u) {
  let p;
  let d;
  let h;
  try {
    p = (await e.get(token.CopilotTokenManager).getCopilotToken(e)).token;
  } catch (e) {
    a.ConnectionState.setDisconnected();
    return l.createErrorResponse(401, l.ErrorMessages[l.ErrorReasons.Unauthorized]);
  }
  s.codeQuoteLogger.info(e, `Calling ${t}`);
  if (a.ConnectionState.isRetrying()) return (0, l.createErrorResponse)(600, `Attempting to reconnect to ${o.CodeQuoteFeatureName} service.`);
  if (a.ConnectionState.isDisconnected()) return l.createErrorResponse(601, `${o.CodeQuoteFeatureName} service is offline.`);
  try {
    d = await e.get(request.Fetcher).fetch(`https://origin-tracker.githubusercontent.com/twirp/github.snippy.Snippy/${t}`, {
      method: n.method,
      body: "POST" === n.method ? JSON.stringify(n.body) : void 0,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${p}`
      },
      signal: u
    });
  } catch (t) {
    a.ConnectionState.enableRetry(e);
    return l.createErrorResponse(602, "Network error detected. Check your internet connection.");
  }
  try {
    h = await d.json();
  } catch (t) {
    const n = t.message;
    throw c.snippyTelemetry.handleUnexpectedError({
      context: e,
      origin: "snippyNetwork",
      reason: n
    }), t;
  }
  if (d.ok) return {
    kind: "success",
    ...h
  };
  const f = {
    ...h,
    code: Number(d.status)
  };
  const {
    code: m,
    msg: g,
    meta: y
  } = f;
  const _ = Number(m);
  const v = g || "unknown error";
  switch (l.getErrorType(_)) {
    case l.ErrorReasons.Unauthorized:
      return l.createErrorResponse(m, l.ErrorMessages[l.ErrorReasons.Unauthorized], y);
    case l.ErrorReasons.BadArguments:
      return l.createErrorResponse(m, v, y);
    case l.ErrorReasons.RateLimit:
      a.ConnectionState.enableRetry(e, 6e4);
      return l.createErrorResponse(m, l.ErrorMessages.RateLimitError, y);
    case l.ErrorReasons.InternalError:
      a.ConnectionState.enableRetry(e);
      return l.createErrorResponse(m, l.ErrorMessages[l.ErrorReasons.InternalError], y);
    default:
      return l.createErrorResponse(m, v, y);
  }
};