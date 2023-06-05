Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.VSCodeEditorExperimentFilters = void 0;
const vscode = require("vscode");
const experiment = require("./experiment");
const o = require(38142);
class VSCodeEditorExperimentFilters extends experiment.EditorExperimentFilters {
  addEditorSpecificFilters() {
    return {
      [o.Filter.Build]: vscode.env.appName,
      [o.Filter.Language]: vscode.env.language
    };
  }
}
exports.VSCodeEditorExperimentFilters = VSCodeEditorExperimentFilters;