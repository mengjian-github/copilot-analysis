Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.decomposeHoverText = exports.ExtensionSymbolDefinitionProvider = void 0;
const utils = require("./utils");
const vscode = require("vscode");
const vscode = require("vscode");
function decomposeHoverText(e) {
  const t = e.match(/```\w+\n(class|\(\w+\))\s([^`]*)```.*/m);
  if (null != t) {
    const e = function (e) {
      switch (e = e.replace("(", "").replace(")", "")) {
        case "function":
          return utils.SnippetSemantics.Function;
        case "variable":
          return utils.SnippetSemantics.Variable;
        case "parameter":
          return utils.SnippetSemantics.Parameter;
        case "method":
          return utils.SnippetSemantics.Method;
        case "class":
          return utils.SnippetSemantics.Class;
        case "module":
          return utils.SnippetSemantics.Module;
        case "alias":
          return utils.SnippetSemantics.Alias;
        case "enum":
          return utils.SnippetSemantics.Enum;
        case "interface":
          return utils.SnippetSemantics.Interface;
        default:
          return utils.SnippetSemantics.Snippet;
      }
    }(t[1]);
    return [t[2].trim(), e];
  }
  return ["", utils.SnippetSemantics.Snippet];
}
exports.ExtensionSymbolDefinitionProvider = class {
  async getSymbolDefinition(e) {
    const t = {
      line: e.position.line,
      character: e.position.character,
      uri: vscode.Uri.parse(e.uri)
    };
    const [n, o] = await this.getHoverTextAndDecompose(t);
    return "" === n ? [] : [{
      snippet: n,
      score: 1,
      startLine: t.line,
      endLine: t.line,
      semantics: o,
      provider: utils.SnippetProvider.SymbolDef
    }];
  }
  async getHoverTextAndDecompose(e) {
    const t = await vscode.commands.executeCommand("vscode.executeHoverProvider", e.uri, new vscode.Position(e.line, e.character));
    return t[0] && t[0].contents[0] instanceof vscode.MarkdownString ? decomposeHoverText(t[0].contents[0].value) : ["", utils.SnippetSemantics.Snippet];
  }
};
exports.decomposeHoverText = decomposeHoverText;