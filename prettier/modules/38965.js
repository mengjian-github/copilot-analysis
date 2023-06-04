Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.contextualFilterScore = exports.getLastLineLength = exports.ContextualFilterManager = void 0;
const r = require(77744);
const i = require(13181);
class ContextualFilterManager {
  constructor() {
    this.previousLabel = 0;
    this.previousLabelTimestamp = Date.now() - 3600;
    this.probabilityAccept = 0;
  }
}
function getLastLineLength(e) {
  const t = e.split("\n");
  return t[t.length - 1].length;
}
exports.ContextualFilterManager = ContextualFilterManager;
exports.getLastLineLength = getLastLineLength;
exports.contextualFilterScore = function (e, t, n, a) {
  const c = e.get(ContextualFilterManager);
  const l = c.previousLabel;
  let u = 0;
  if ("afterCursorWhitespace" in t.properties && "true" === t.properties.afterCursorWhitespace) {
    u = 1;
  }
  const p = (Date.now() - c.previousLabelTimestamp) / 1e3;
  const d = Math.log(1 + p);
  let h = 0;
  let f = 0;
  const m = n.prefix;
  if (m) {
    h = Math.log(1 + getLastLineLength(m));
    const e = m.slice(-1);
    if (void 0 !== r.contextualFilterCharacterMap[e]) {
      f = r.contextualFilterCharacterMap[e];
    }
  }
  let g = 0;
  let y = 0;
  const _ = m.trimEnd();
  if (_) {
    g = Math.log(1 + getLastLineLength(_));
    const e = _.slice(-1);
    if (void 0 !== r.contextualFilterCharacterMap[e]) {
      y = r.contextualFilterCharacterMap[e];
    }
  }
  let v = 0;
  if ("documentLength" in t.measurements) {
    const e = t.measurements.documentLength;
    v = Math.log(1 + e);
  }
  let b = 0;
  if ("promptEndPos" in t.measurements) {
    const e = t.measurements.promptEndPos;
    b = Math.log(1 + e);
  }
  let E = 0;
  if ("promptEndPos" in t.measurements && "documentLength" in t.measurements) {
    const e = t.measurements.documentLength;
    E = (t.measurements.promptEndPos + .5) / (1 + e);
  }
  let w = 0;
  if (void 0 !== r.contextualFilterLanguageMap[t.properties.languageId]) {
    w = r.contextualFilterLanguageMap[t.properties.languageId];
  }
  let T = 0;
  if (a) {
    const e = new Array(221).fill(0);
    e[0] = l;
    e[1] = u;
    e[2] = d;
    e[3] = h;
    e[4] = g;
    e[5] = v;
    e[6] = b;
    e[7] = E;
    e[8 + w] = 1;
    e[29 + f] = 1;
    e[125 + y] = 1;
    T = i.treeScore(e)[1];
  } else {
    let e = r.contextualFilterIntercept;
    e += r.contextualFilterWeights[0] * l;
    e += r.contextualFilterWeights[1] * u;
    e += r.contextualFilterWeights[2] * d;
    e += r.contextualFilterWeights[3] * h;
    e += r.contextualFilterWeights[4] * g;
    e += r.contextualFilterWeights[5] * v;
    e += r.contextualFilterWeights[6] * b;
    e += r.contextualFilterWeights[7] * E;
    e += r.contextualFilterWeights[8 + w];
    e += r.contextualFilterWeights[29 + f];
    e += r.contextualFilterWeights[125 + y];
    T = 1 / (1 + Math.exp(-e));
  }
  e.get(ContextualFilterManager).probabilityAccept = T;
  return T;
};