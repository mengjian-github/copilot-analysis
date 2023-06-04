Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getNeighborSnippets = exports.neighborOptionToSelection = exports.NeighboringSnippetType = exports.NeighboringTabsOption = void 0;
const r = require(39491);
const i = require(7361);
const o = require(569);
var s;
var a;
(a = exports.NeighboringTabsOption || (exports.NeighboringTabsOption = {})).None = "none";
a.Conservative = "conservative";
a.Medium = "medium";
a.Eager = "eager";
a.EagerButLittle = "eagerButLittle";
a.EagerButMedium = "eagerButMedium";
a.EagerButMuch = "eagerButMuch";
a.RetrievalComparable = "retrievalComparable";
(function (e) {
  e.NeighboringFunctions = "neighboringFunction";
  e.NeighboringSnippets = "neighboringSnippet";
  e.CursorHistoryMatcher = "cursorhistorymatcher";
})(s = exports.NeighboringSnippetType || (exports.NeighboringSnippetType = {}));
exports.neighborOptionToSelection = {
  none: {
    snippetLength: 1,
    threshold: -1,
    numberOfSnippets: 0
  },
  conservative: {
    snippetLength: 10,
    threshold: .3,
    numberOfSnippets: 1
  },
  medium: {
    snippetLength: 20,
    threshold: .1,
    numberOfSnippets: 2
  },
  eager: {
    snippetLength: 60,
    threshold: 0,
    numberOfSnippets: 4
  },
  eagerButLittle: {
    snippetLength: 10,
    threshold: 0,
    numberOfSnippets: 1
  },
  eagerButMedium: {
    snippetLength: 20,
    threshold: 0,
    numberOfSnippets: 4
  },
  eagerButMuch: {
    snippetLength: 60,
    threshold: 0,
    numberOfSnippets: 6
  },
  retrievalComparable: {
    snippetLength: 30,
    threshold: 0,
    numberOfSnippets: 4
  }
};
exports.getNeighborSnippets = async function (e, n, a, c, l, u, p, d, h, f, m) {
  const g = {
    ...exports.neighborOptionToSelection[c]
  };
  const y = function (e, t, n, a, c, l, u, p = i.CursorSnippetsPickingStrategy.CursorJaccard) {
    let d;
    if (t === s.NeighboringSnippets) {
      d = void 0 !== c && void 0 !== l ? o.IndentationBasedJaccardMatcher.FACTORY(c, l, a) : o.FixedWindowSizeJaccardMatcher.FACTORY(n.snippetLength, a);
    } else {
      if (t === s.NeighboringFunctions) {
        d = o.FunctionJaccardMatcher.FACTORY(n.snippetLength, a, c, l);
      } else {
        r.ok(void 0 !== u, "lineCursorHistory should not be undefined");
        d = i.CursorHistoryMatcher.FACTORY(n.snippetLength, u, p, a);
      }
    }
    return d.to(e);
  }(e, a, g, l, u, p, f, m);
  return 0 === g.numberOfSnippets ? [] : (await n.filter(e => e.source.length < 1e4 && e.source.length > 0).slice(0, 20).reduce(async (e, t) => (await e).concat((await y.findMatches(t, d, h)).map(e => ({
    relativePath: t.relativePath,
    ...e
  }))), Promise.resolve([]))).filter(e => e.score && e.snippet && e.score > g.threshold).sort((e, t) => e.score - t.score).slice(-g.numberOfSnippets);
};