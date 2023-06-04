function getErrorType(e) {
  return 401 === e ? exports.ErrorReasons.Unauthorized : 400 === e ? exports.ErrorReasons.BadArguments : 404 === e ? exports.ErrorReasons.NotFound : 429 === e ? exports.ErrorReasons.RateLimit : e >= 500 && e < 600 ? exports.ErrorReasons.InternalError : e >= 600 ? exports.ErrorReasons.ConnectionError : exports.ErrorReasons.Unknown;
}
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.createErrorResponse = exports.getErrorType = exports.ErrorMessages = exports.ErrorReasons = void 0;
exports.ErrorReasons = {
  BadArguments: "BadArgumentsError",
  Unauthorized: "NotAuthorized",
  NotFound: "NotFoundError",
  RateLimit: "RateLimitError",
  InternalError: "InternalError",
  ConnectionError: "ConnectionError",
  Unknown: "UnknownError"
};
exports.ErrorMessages = {
  [exports.ErrorReasons.Unauthorized]: "Invalid GitHub token. Please sign out from your GitHub account using VSCode UI and try again",
  [exports.ErrorReasons.InternalError]: "Internal error: matches to public code will not be detected. It is advised to disable Copilot until the service is reconnected.",
  [exports.ErrorReasons.RateLimit]: "You've reached your quota and limit, code matching will be unavailable until the limit resets"
};
exports.getErrorType = getErrorType;
exports.createErrorResponse = function (e, t, r = {}) {
  return {
    kind: "failure",
    reason: getErrorType(Number(e)),
    code: Number(e),
    msg: t,
    meta: r
  };
};