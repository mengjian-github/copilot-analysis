Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.assertShape = void 0;
const r = require(38523);
exports.assertShape = (e, t) => {
  if (r.Value.Check(e, t)) return t;
  const n = `Typebox schema validation failed:\n${[...r.Value.Errors(e, t)].map(e => `${e.path} ${e.message}`).join("\n")}`;
  throw new Error(n);
};