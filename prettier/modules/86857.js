Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.extensionFileSystem = void 0;
const r = require(89496);
exports.extensionFileSystem = {
  readFile: async function (e) {
    return await r.workspace.fs.readFile(r.Uri.file(e));
  },
  mtime: async function (e) {
    return (await r.workspace.fs.stat(r.Uri.file(e))).mtime;
  },
  stat: async function (e) {
    return await r.workspace.fs.stat(r.Uri.file(e));
  }
};