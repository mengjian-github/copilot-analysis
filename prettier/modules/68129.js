Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ExtensionLocationFactory = void 0;
const vscode = require("vscode");
const locationfactory = require("./location-factory");
class ExtensionLocationFactory extends locationfactory.LocationFactory {
  range(e, t, n, i) {
    return void 0 !== n && void 0 !== i ? new vscode.Range(e, t, n, i) : new vscode.Range(e, t);
  }
  position(e, t) {
    return new vscode.Position(e, t);
  }
}
exports.ExtensionLocationFactory = ExtensionLocationFactory;