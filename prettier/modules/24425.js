Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.checkFileOnLoad = exports.registerCopilotIgnore = void 0;
const vscode = require("vscode");
const i = require(1402);
const o = require(25112);
const s = require(54913);
const env = require("./env");
async function c(e) {
  return await vscode.workspace.fs.readFile(e).then(e => e.toString());
}
exports.registerCopilotIgnore = async function (e) {
  const t = [];
  const n = new s.CopilotIgnoreManager(e);
  async function l() {
    const e = await vscode.workspace.findFiles(`**/${o.COPILOT_IGNORE_FILE}`);
    for (const [t, r] of await async function (e) {
      const t = [];
      for (const n of e) t.push(c(n).then(e => [n, e]));
      return Promise.all(t);
    }(e)) n.onDidIgnorePatternCreate(t, r);
  }
  e.forceSet(s.CopilotIgnoreManager, n);
  if (vscode.workspace.workspaceFolders) {
    await l();
  }
  if (env.isRunningInTest(e)) {
    n.enabled(!0);
  } else {
    t.push(function (e, t) {
      function n(e, n) {
        t.enabled(!0 === n?.copilotignore_enabled);
      }
      const r = e.get(i.CopilotTokenNotifier);
      r.on("onCopilotToken", n);
      return {
        dispose() {
          r.off("onCopilotToken", n);
        }
      };
    }(e, n));
  }
  t.push(vscode.workspace.onDidChangeWorkspaceFolders(e => {
    for (const t of e.removed) n.onDidWorkspaceRemove(t.uri);
    return l();
  }));
  t.push(vscode.workspace.onDidOpenTextDocument(e => n.onDidOpenTextDocument(e?.uri)), vscode.window.onDidChangeActiveTextEditor(e => n.onDidOpenTextDocument(e?.document?.uri)));
  t.push(vscode.workspace.onDidSaveTextDocument(async e => {
    if (n.isCopilotIgnoreFile(e.uri)) {
      const t = await c(e.uri);
      n.onDidIgnorePatternCreate(e.uri, t);
    }
  }), vscode.workspace.onDidDeleteFiles(e => {
    for (const t of e.files) n.onDidIgnorePatternDelete(t);
  }), vscode.workspace.onDidRenameFiles(async e => {
    for (const t of e.files) if (n.isCopilotIgnoreFile(t.newUri)) {
      const e = await c(t.newUri);
      n.onDidIgnorePatternMove(t.oldUri, t.newUri, e);
    }
  }));
  return vscode.Disposable.from(...t);
};
exports.checkFileOnLoad = async function (e) {
  if (vscode.window?.activeTextEditor) {
    e.get(s.CopilotIgnoreManager).setIgnoredStatus(vscode.window.activeTextEditor.document?.uri);
  }
};