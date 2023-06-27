Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getNeighborSnippets =
  exports.neighborOptionToSelection =
  exports.NeighboringSnippetType =
  exports.NeighboringTabsOption =
    void 0;
const r = require(9491);
const i = require(6845);
const o = require(9404);
var s;
var a;
(a =
  exports.NeighboringTabsOption || (exports.NeighboringTabsOption = {})).None =
  "none";
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
})(
  (s = exports.NeighboringSnippetType || (exports.NeighboringSnippetType = {}))
);
exports.neighborOptionToSelection = {
  none: {
    snippetLength: 1,
    threshold: -1,
    numberOfSnippets: 0,
  },
  conservative: {
    snippetLength: 10,
    threshold: 0.3,
    numberOfSnippets: 1,
  },
  medium: {
    snippetLength: 20,
    threshold: 0.1,
    numberOfSnippets: 2,
  },
  eager: {
    snippetLength: 60,
    threshold: 0,
    numberOfSnippets: 4,
  },
  eagerButLittle: {
    snippetLength: 10,
    threshold: 0,
    numberOfSnippets: 1,
  },
  eagerButMedium: {
    snippetLength: 20,
    threshold: 0,
    numberOfSnippets: 4,
  },
  eagerButMuch: {
    snippetLength: 60,
    threshold: 0,
    numberOfSnippets: 6,
  },
  retrievalComparable: {
    snippetLength: 30,
    threshold: 0,
    numberOfSnippets: 4,
  },
};

/**
 * 
 * @param {resourceInfo,
          neighborDocs,
          promptOpts.neighboringSnippetTypes,
          promptOpts.neighboringTabs,
          promptOpts.cursorContextFix,
          promptOpts.indentationMinLength,
          promptOpts.indentationMaxLength,
          promptOpts.snippetSelection,
          promptOpts.snippetSelectionK,
          lineCursorHistory,
          promptOpts.cursorSnippetsPickingStrategy}  
 * @returns 
 */
exports.getNeighborSnippets = async function (
  resourceInfo,
  neighborDocs,
  neighboringSnippetTypes,
  neighboringTabs,
  cursorContextFix,
  indentationMinLength,
  indentationMaxLength,
  snippetSelection,
  snippetSelectionK,
  lineCursorHistory,
  cursorSnippetsPickingStrategy
) {
  const options = {
    ...exports.neighborOptionToSelection[neighboringTabs],
  };
  const y = (function (
    resourceInfo,
    neighboringSnippetTypes,
    options,
    cursorContextFix,
    indentationMinLength,
    indentationMaxLength,
    lineCursorHistory,
    cursorSnippetsPickingStrategy = i.CursorSnippetsPickingStrategy
      .CursorJaccard
  ) {
    let d;
    if (neighboringSnippetTypes === s.NeighboringSnippets) {
      d =
        void 0 !== indentationMinLength && void 0 !== indentationMaxLength
          ? o.IndentationBasedJaccardMatcher.FACTORY(
              indentationMinLength,
              indentationMaxLength,
              cursorContextFix
            )
          : o.FixedWindowSizeJaccardMatcher.FACTORY(
              options.snippetLength,
              cursorContextFix
            );
    } else {
      if (neighboringSnippetTypes === s.NeighboringFunctions) {
        d = o.FunctionJaccardMatcher.FACTORY(
          options.snippetLength,
          cursorContextFix,
          indentationMinLength,
          indentationMaxLength
        );
      } else {
        r.ok(
          void 0 !== lineCursorHistory,
          "lineCursorHistory should not be undefined"
        );
        d = i.CursorHistoryMatcher.FACTORY(
          options.snippetLength,
          lineCursorHistory,
          cursorSnippetsPickingStrategy,
          cursorContextFix
        );
      }
    }
    return d.to(resourceInfo);
  })(
    resourceInfo,
    neighboringSnippetTypes,
    options,
    cursorContextFix,
    indentationMinLength,
    indentationMaxLength,
    lineCursorHistory,
    cursorSnippetsPickingStrategy
  );
  return 0 === options.numberOfSnippets
    ? []
    : (
        await neighborDocs
          .filter((e) => e.source.length < 1e4 && e.source.length > 0)
          .slice(0, 20)
          .reduce(
            async (e, t) =>
              (
                await e
              ).concat(
                (
                  await y.findMatches(t, snippetSelection, snippetSelectionK)
                ).map((e) => ({
                  relativePath: t.relativePath,
                  ...e,
                }))
              ),
            Promise.resolve([])
          )
      )
        .filter((e) => e.score && e.snippet && e.score > options.threshold)
        .sort((e, t) => e.score - t.score)
        .slice(-options.numberOfSnippets);
};
