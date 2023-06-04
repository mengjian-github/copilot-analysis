Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.decomposeHoverText = exports.ExtensionSymbolDefinitionProvider = void 0;
const r = require(23055);
const i = require(89496);
const o = require(89496);
function decomposeHoverText(e) {
  const t = e.match(/```\w+\n(class|\(\w+\))\s([^`]*)```.*/m);
  if (null != t) {
    const e = function (e) {
      switch (e = e.replace("(", "").replace(")", "")) {
        case "function":
          return r.SnippetSemantics.Function;
        case "variable":
          return r.SnippetSemantics.Variable;
        case "parameter":
          return r.SnippetSemantics.Parameter;
        case "method":
          return r.SnippetSemantics.Method;
        case "class":
          return r.SnippetSemantics.Class;
        case "module":
          return r.SnippetSemantics.Module;
        case "alias":
          return r.SnippetSemantics.Alias;
        case "enum":
          return r.SnippetSemantics.Enum;
        case "interface":
          return r.SnippetSemantics.Interface;
        default:
          return r.SnippetSemantics.Snippet;
      }
    }(t[1]);
    return [t[2].trim(), e];
  }
  return ["", r.SnippetSemantics.Snippet];
}
exports.ExtensionSymbolDefinitionProvider = class {
  async getSymbolDefinition(e) {
    const t = {
      line: e.position.line,
      character: e.position.character,
      uri: i.Uri.parse(e.uri)
    };
    const [n, o] = await this.getHoverTextAndDecompose(t);
    return "" === n ? [] : [{
      snippet: n,
      score: 1,
      startLine: t.line,
      endLine: t.line,
      semantics: o,
      provider: r.SnippetProvider.SymbolDef
    }];
  }
  async getHoverTextAndDecompose(e) {
    const t = await i.commands.executeCommand("vscode.executeHoverProvider", e.uri, new o.Position(e.line, e.character));
    return t[0] && t[0].contents[0] instanceof i.MarkdownString ? decomposeHoverText(t[0].contents[0].value) : ["", r.SnippetSemantics.Snippet];
  }
};
exports.decomposeHoverText = decomposeHoverText;