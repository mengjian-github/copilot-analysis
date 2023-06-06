Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.ghostTextScoreQuantile = exports.ghostTextScoreConfidence = void 0;
  const logger = require("./logger");
  const i = require(37481);
  const o = (new logger.Logger(logger.LogLevel.INFO, "restraint"), {
    link: e => Math.exp(e) / (1 + Math.exp(e)),
    unlink: e => Math.log(e / (1 - e))
  });
  class s {
    constructor(e, t, n) {
      this.name = e;
      this.coefficient = t;
      this.transformation = n || (e => e);
    }
    contribution(e) {
      return this.coefficient * this.transformation(e);
    }
  }
  const a = new class {
    constructor(e, t, n) {
      this.link = o;
      this.intercept = e;
      this.coefficients = t;
      this.logitsToQuantiles = new Map();
      this.logitsToQuantiles.set(0, 0);
      this.logitsToQuantiles.set(1, 1);
      if (n) for (const e in n) this.logitsToQuantiles.set(n[e], Number(e));
    }
    predict(e, t) {
      let n = this.intercept;
      for (const e of this.coefficients) {
        const r = t[e.name];
        if (void 0 === r) return NaN;
        n += e.contribution(r);
      }
      return this.link.link(n);
    }
    quantile(e, t) {
      return function (e, t) {
        const n = Math.min(...Array.from(t.keys()).filter(t => t >= e));
        const r = Math.max(...Array.from(t.keys()).filter(t => t < e));
        const i = t.get(n);
        const o = t.get(r);
        return o + (i - o) * (e - r) / (n - r);
      }(this.predict(e, t), this.logitsToQuantiles);
    }
  }(i.ghostTextDisplayInterceptParameter, [new s("compCharLen", i.ghostTextDisplayLog1pcompCharLenParameter, e => Math.log(1 + e)), new s("meanLogProb", i.ghostTextDisplayMeanLogProbParameter), new s("meanAlternativeLogProb", i.ghostTextDisplayMeanAlternativeLogProbParameter)].concat(Object.entries(i.ghostTextDisplayLanguageParameters).map(e => new s(e[0], e[1]))), i.ghostTextDisplayQuantiles);
  exports.ghostTextScoreConfidence = function (e, t) {
    const n = {
      ...t.measurements
    };
    Object.keys(i.ghostTextDisplayLanguageParameters).forEach(e => {
      n[e] = t.properties["customDimensions.languageId"] == e ? 1 : 0;
    });
    return a.predict(e, n);
  };
  exports.ghostTextScoreQuantile = function (e, t) {
    const n = {
      ...t.measurements
    };
    Object.keys(i.ghostTextDisplayLanguageParameters).forEach(e => {
      n[e] = t.properties["customDimensions.languageId"] == e ? 1 : 0;
    });
    return a.quantile(e, n);
  };