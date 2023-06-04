Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.decodeLocation = exports.encodeLocation = exports.completionContextForDocument = exports.CompletionContext = exports.completionTypeToString = exports.CompletionType = exports.CopilotPanelScheme = void 0;
const r = require(17373);
const i = require(16403);
var o;
exports.CopilotPanelScheme = "copilot";
(function (e) {
  e[e.OPEN_COPILOT = 2] = "OPEN_COPILOT";
})(o = exports.CompletionType || (exports.CompletionType = {}));
exports.completionTypeToString = function (e) {
  return e === o.OPEN_COPILOT ? "open copilot" : "unknown";
};
class CompletionContext {
  constructor(e, t, n) {
    this.prependToCompletion = "";
    this.appendToCompletion = "";
    this.indentation = null;
    this.completionType = o.OPEN_COPILOT;
    this.insertPosition = e.get(i.LocationFactory).position(t.line, t.character);
    this.completionType = n;
  }
  static fromJSONParse(e, t) {
    const n = e.get(i.LocationFactory).position(t.insertPosition.line, t.insertPosition.character);
    const r = new CompletionContext(e, n, t.completionType);
    r.prependToCompletion = t.prependToCompletion;
    r.appendToCompletion = t.appendToCompletion;
    r.indentation = t.indentation;
    return r;
  }
}
exports.CompletionContext = CompletionContext;
exports.completionContextForDocument = function (e, t, n) {
  let r = n;
  const i = t.lineAt(n.line);
  if (i.isEmptyOrWhitespace) {
    r = i.range.end;
  }
  return new CompletionContext(e, r, o.OPEN_COPILOT);
};
let a = 0;
exports.encodeLocation = function (e, n) {
  const i = e.toString().split("#");
  const o = i.length > 1 ? i[1] : "";
  const s = JSON.stringify([i[0], n, o]);
  return r.URI.parse(`${exports.CopilotPanelScheme}:GitHub%20Copilot?${s}#${a++}`);
};
exports.decodeLocation = function (e, t) {
  const [n, i, o] = JSON.parse(t.query);
  return [r.URI.parse(o.length > 0 ? n + "#" + o : n), CompletionContext.fromJSONParse(e, i)];
};