Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.getLanguageDetection = exports.primeLanguageDetectionCache = exports.LanguageDetection = exports.Language = void 0;
  const r = require(43076),
    i = require(49674),
    o = require(28e3),
    s = require(46305),
    a = require(71017);
  class c {
    constructor(e, t, n) {
      this.languageId = e, this.isGuess = t, this.fileExtension = n;
    }
  }
  exports.Language = c;
  class l {}
  exports.LanguageDetection = l, exports.primeLanguageDetectionCache = function (e, t) {
    e.get(l).detectLanguage(t);
  }, exports.getLanguageDetection = function (e) {
    return new u(new p(), new s.NotebookLanguageDetection(e));
  };
  class u extends l {
    constructor(e, t) {
      super(), this.delegate = e, this.notebookDelegate = t, this.cache = new r.LRUCacheMap(100);
    }
    async detectLanguage(e) {
      const t = a.basename(e.fileName);
      return (0, s.isNotebook)(t) ? this.notebookDelegate.detectLanguage(e) : this.detectLanguageForRegularFile(t, e);
    }
    async detectLanguageForRegularFile(e, t) {
      let n = this.cache.get(e);
      return n || (n = await this.delegate.detectLanguage(t), n.isGuess || this.cache.set(e, n)), n;
    }
  }
  class p extends l {
    constructor() {
      super(...arguments), this.languageIdByExtensionTracker = new d();
    }
    async detectLanguage(e) {
      const t = a.basename(e.fileName),
        n = a.extname(t).toLowerCase(),
        r = this.extensionWithoutTemplateLanguage(t, n),
        i = this.detectLanguageId(t, r);
      return new c(i.languageId, i.isGuess, this.computeFullyQualifiedExtension(n, r));
    }
    extensionWithoutTemplateLanguage(e, t) {
      if (o.knownTemplateLanguageExtensions.includes(t)) {
        const n = e.substring(0, e.lastIndexOf(".")),
          r = a.extname(n).toLowerCase();
        if (r.length > 0 && o.knownFileExtensions.includes(r) && this.isExtensionValidForTemplateLanguage(t, r)) return r;
      }
      return t;
    }
    isExtensionValidForTemplateLanguage(e, t) {
      const n = o.templateLanguageLimitations[e];
      return !n || n.includes(t);
    }
    detectLanguageId(e, t) {
      const n = [];
      for (const r in i.knownLanguages) {
        const o = i.knownLanguages[r];
        if (o.filenames && o.filenames.includes(e)) return {
          languageId: r,
          isGuess: !1
        };
        o.extensions.includes(t) && n.push(r);
      }
      return this.determineLanguageIdByCandidates(n);
    }
    determineLanguageIdByCandidates(e) {
      return 1 === e.length ? (this.languageIdByExtensionTracker.track(e[0]), {
        languageId: e[0],
        isGuess: !1
      }) : e.length > 1 ? this.determineMostSeenLanguages(e) : {
        languageId: "unknown",
        isGuess: !0
      };
    }
    determineMostSeenLanguages(e) {
      const t = this.languageIdByExtensionTracker.mostRecentLanguageId(e);
      return t ? {
        languageId: t,
        isGuess: !0
      } : {
        languageId: e[0],
        isGuess: !0
      };
    }
    computeFullyQualifiedExtension(e, t) {
      return e !== t ? t + e : e;
    }
  }
  class d {
    constructor() {
      this.seenLanguages = new r.LRUCacheMap(25);
    }
    track(e) {
      this.seenLanguages.set(e, this.preciseTimestamp());
    }
    preciseTimestamp() {
      return process.hrtime.bigint();
    }
    mostRecentLanguageId(e) {
      const t = e.map(e => ({
        id: e,
        seen: this.seenLanguages.get(e)
      })).filter(e => e.seen).sort((e, t) => Number(t.seen) - Number(e.seen)).map(e => e.id);
      if (t.length > 0) return t[0];
    }
  }