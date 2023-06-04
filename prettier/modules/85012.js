Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.defaultFileSystem = exports.FileSystem = void 0;
const r = require(57147);
exports.FileSystem = class {};
exports.defaultFileSystem = {
  readFile: e => r.promises.readFile(e),
  mtime: async e => (await r.promises.stat(e)).mtimeMs,
  async stat(e) {
    const t = await r.promises.stat(e);
    return {
      ctime: t.ctimeMs,
      mtime: t.mtimeMs,
      size: t.size
    };
  }
};