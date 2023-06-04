Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.TypeSystem = exports.TypeSystemDuplicateFormat = exports.TypeSystemDuplicateTypeKind = void 0;
const r = require(14350);
class TypeSystemDuplicateTypeKind extends Error {
  constructor(e) {
    super(`Duplicate type kind '${e}' detected`);
  }
}
exports.TypeSystemDuplicateTypeKind = TypeSystemDuplicateTypeKind;
class TypeSystemDuplicateFormat extends Error {
  constructor(e) {
    super(`Duplicate string format '${e}' detected`);
  }
}
var s;
exports.TypeSystemDuplicateFormat = TypeSystemDuplicateFormat;
(s = exports.TypeSystem || (exports.TypeSystem = {})).ExactOptionalPropertyTypes = !1;
s.AllowArrayObjects = !1;
s.AllowNaN = !1;
s.AllowVoidNull = !1;
s.Type = function (e, t) {
  if (r.TypeRegistry.Has(e)) throw new TypeSystemDuplicateTypeKind(e);
  r.TypeRegistry.Set(e, t);
  return (t = {}) => r.Type.Unsafe({
    ...t,
    [r.Kind]: e
  });
};
s.Format = function (e, t) {
  if (r.FormatRegistry.Has(e)) throw new TypeSystemDuplicateFormat(e);
  r.FormatRegistry.Set(e, t);
  return e;
};