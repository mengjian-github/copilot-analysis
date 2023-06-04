var n;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.Is = void 0;
(n = exports.Is || (exports.Is = {})).Object = function (e) {
  return !(null === e || "object" != typeof e || globalThis.Array.isArray(e) || ArrayBuffer.isView(e) || e instanceof globalThis.Date);
};
n.Date = function (e) {
  return e instanceof globalThis.Date;
};
n.Array = function (e) {
  return globalThis.Array.isArray(e) && !ArrayBuffer.isView(e);
};
n.Value = function (e) {
  return null == e || "function" == typeof e || "symbol" == typeof e || "bigint" == typeof e || "number" == typeof e || "boolean" == typeof e || "string" == typeof e;
};
n.TypedArray = function (e) {
  return ArrayBuffer.isView(e);
};