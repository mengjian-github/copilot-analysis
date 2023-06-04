Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueErrors = exports.ValueErrorsDereferenceError = exports.ValueErrorsUnknownTypeError = exports.ValueErrorIterator = exports.ValueErrorType = void 0;
const r = require(14350);
const i = require(85007);
const o = require(97540);
var s;
!function (e) {
  e[e.Array = 0] = "Array";
  e[e.ArrayMinItems = 1] = "ArrayMinItems";
  e[e.ArrayMaxItems = 2] = "ArrayMaxItems";
  e[e.ArrayUniqueItems = 3] = "ArrayUniqueItems";
  e[e.BigInt = 4] = "BigInt";
  e[e.BigIntMultipleOf = 5] = "BigIntMultipleOf";
  e[e.BigIntExclusiveMinimum = 6] = "BigIntExclusiveMinimum";
  e[e.BigIntExclusiveMaximum = 7] = "BigIntExclusiveMaximum";
  e[e.BigIntMinimum = 8] = "BigIntMinimum";
  e[e.BigIntMaximum = 9] = "BigIntMaximum";
  e[e.Boolean = 10] = "Boolean";
  e[e.Date = 11] = "Date";
  e[e.DateExclusiveMinimumTimestamp = 12] = "DateExclusiveMinimumTimestamp";
  e[e.DateExclusiveMaximumTimestamp = 13] = "DateExclusiveMaximumTimestamp";
  e[e.DateMinimumTimestamp = 14] = "DateMinimumTimestamp";
  e[e.DateMaximumTimestamp = 15] = "DateMaximumTimestamp";
  e[e.Function = 16] = "Function";
  e[e.Integer = 17] = "Integer";
  e[e.IntegerMultipleOf = 18] = "IntegerMultipleOf";
  e[e.IntegerExclusiveMinimum = 19] = "IntegerExclusiveMinimum";
  e[e.IntegerExclusiveMaximum = 20] = "IntegerExclusiveMaximum";
  e[e.IntegerMinimum = 21] = "IntegerMinimum";
  e[e.IntegerMaximum = 22] = "IntegerMaximum";
  e[e.Intersect = 23] = "Intersect";
  e[e.IntersectUnevaluatedProperties = 24] = "IntersectUnevaluatedProperties";
  e[e.Literal = 25] = "Literal";
  e[e.Never = 26] = "Never";
  e[e.Not = 27] = "Not";
  e[e.Null = 28] = "Null";
  e[e.Number = 29] = "Number";
  e[e.NumberMultipleOf = 30] = "NumberMultipleOf";
  e[e.NumberExclusiveMinimum = 31] = "NumberExclusiveMinimum";
  e[e.NumberExclusiveMaximum = 32] = "NumberExclusiveMaximum";
  e[e.NumberMinumum = 33] = "NumberMinumum";
  e[e.NumberMaximum = 34] = "NumberMaximum";
  e[e.Object = 35] = "Object";
  e[e.ObjectMinProperties = 36] = "ObjectMinProperties";
  e[e.ObjectMaxProperties = 37] = "ObjectMaxProperties";
  e[e.ObjectAdditionalProperties = 38] = "ObjectAdditionalProperties";
  e[e.ObjectRequiredProperties = 39] = "ObjectRequiredProperties";
  e[e.Promise = 40] = "Promise";
  e[e.RecordKeyNumeric = 41] = "RecordKeyNumeric";
  e[e.RecordKeyString = 42] = "RecordKeyString";
  e[e.String = 43] = "String";
  e[e.StringMinLength = 44] = "StringMinLength";
  e[e.StringMaxLength = 45] = "StringMaxLength";
  e[e.StringPattern = 46] = "StringPattern";
  e[e.StringFormatUnknown = 47] = "StringFormatUnknown";
  e[e.StringFormat = 48] = "StringFormat";
  e[e.Symbol = 49] = "Symbol";
  e[e.TupleZeroLength = 50] = "TupleZeroLength";
  e[e.TupleLength = 51] = "TupleLength";
  e[e.Undefined = 52] = "Undefined";
  e[e.Union = 53] = "Union";
  e[e.Uint8Array = 54] = "Uint8Array";
  e[e.Uint8ArrayMinByteLength = 55] = "Uint8ArrayMinByteLength";
  e[e.Uint8ArrayMaxByteLength = 56] = "Uint8ArrayMaxByteLength";
  e[e.Void = 57] = "Void";
  e[e.Custom = 58] = "Custom";
}(s = exports.ValueErrorType || (exports.ValueErrorType = {}));
class ValueErrorIterator {
  constructor(e) {
    this.iterator = e;
  }
  [Symbol.iterator]() {
    return this.iterator;
  }
  First() {
    const e = this.iterator.next();
    return e.done ? void 0 : e.value;
  }
}
exports.ValueErrorIterator = ValueErrorIterator;
class ValueErrorsUnknownTypeError extends Error {
  constructor(e) {
    super("ValueErrors: Unknown type");
    this.schema = e;
  }
}
exports.ValueErrorsUnknownTypeError = ValueErrorsUnknownTypeError;
class ValueErrorsDereferenceError extends Error {
  constructor(e) {
    super(`ValueErrors: Unable to dereference schema with $id '${e.$ref}'`);
    this.schema = e;
  }
}
exports.ValueErrorsDereferenceError = ValueErrorsDereferenceError;
(function (e) {
  function t(e) {
    return "string" == typeof e;
  }
  function n(e) {
    return void 0 !== e;
  }
  function u(e, t) {
    return i.TypeSystem.ExactOptionalPropertyTypes ? t in e : void 0 !== e[t];
  }
  function p(e) {
    const t = "object" == typeof e && null !== e;
    return i.TypeSystem.AllowArrayObjects ? t : t && !globalThis.Array.isArray(e);
  }
  function* d(e, a, h, f) {
    const m = n(e.$id) ? [...a, e] : a;
    const g = e;
    switch (g[r.Kind]) {
      case "Any":
      case "Unknown":
        return yield* function* (e, t, n, r) {}();
      case "Array":
        return yield* function* (e, t, r, i) {
          if (!globalThis.Array.isArray(i)) return yield {
            type: s.Array,
            schema: e,
            path: r,
            value: i,
            message: "Expected array"
          };
          if (!n(e.minItems) || i.length >= e.minItems) {
            yield {
              type: s.ArrayMinItems,
              schema: e,
              path: r,
              value: i,
              message: `Expected array length to be greater or equal to ${e.minItems}`
            };
          }
          if (!n(e.maxItems) || i.length <= e.maxItems) {
            yield {
              type: s.ArrayMinItems,
              schema: e,
              path: r,
              value: i,
              message: `Expected array length to be less or equal to ${e.maxItems}`
            };
          }
          if (!0 !== e.uniqueItems || function () {
            const e = new Set();
            for (const t of i) {
              const n = o.ValueHash.Create(t);
              if (e.has(n)) return !1;
              e.add(n);
            }
            return !0;
          }()) {
            yield {
              type: s.ArrayUniqueItems,
              schema: e,
              path: r,
              value: i,
              message: "Expected array elements to be unique"
            };
          }
          for (let n = 0; n < i.length; n++) yield* d(e.items, t, `${r}/${n}`, i[n]);
        }(g, m, h, f);
      case "BigInt":
        return yield* function* (e, t, r, i) {
          if (!function (e) {
            return "bigint" == typeof e;
          }(i)) return yield {
            type: s.BigInt,
            schema: e,
            path: r,
            value: i,
            message: "Expected bigint"
          };
          if (n(e.multipleOf) && i % e.multipleOf !== globalThis.BigInt(0)) {
            yield {
              type: s.BigIntMultipleOf,
              schema: e,
              path: r,
              value: i,
              message: `Expected bigint to be a multiple of ${e.multipleOf}`
            };
          }
          if (!n(e.exclusiveMinimum) || i > e.exclusiveMinimum) {
            yield {
              type: s.BigIntExclusiveMinimum,
              schema: e,
              path: r,
              value: i,
              message: `Expected bigint to be greater than ${e.exclusiveMinimum}`
            };
          }
          if (!n(e.exclusiveMaximum) || i < e.exclusiveMaximum) {
            yield {
              type: s.BigIntExclusiveMaximum,
              schema: e,
              path: r,
              value: i,
              message: `Expected bigint to be less than ${e.exclusiveMaximum}`
            };
          }
          if (!n(e.minimum) || i >= e.minimum) {
            yield {
              type: s.BigIntMinimum,
              schema: e,
              path: r,
              value: i,
              message: `Expected bigint to be greater or equal to ${e.minimum}`
            };
          }
          if (!n(e.maximum) || i <= e.maximum) {
            yield {
              type: s.BigIntMaximum,
              schema: e,
              path: r,
              value: i,
              message: `Expected bigint to be less or equal to ${e.maximum}`
            };
          }
        }(g, 0, h, f);
      case "Boolean":
        return yield* function* (e, t, n, r) {
          if ("boolean" != typeof r) return yield {
            type: s.Boolean,
            schema: e,
            path: n,
            value: r,
            message: "Expected boolean"
          };
        }(g, 0, h, f);
      case "Constructor":
        return yield* function* (e, t, n, r) {
          yield* d(e.returns, t, n, r.prototype);
        }(g, m, h, f);
      case "Date":
        return yield* function* (e, t, r, i) {
          return i instanceof globalThis.Date ? globalThis.isFinite(i.getTime()) ? (!n(e.exclusiveMinimumTimestamp) || i.getTime() > e.exclusiveMinimumTimestamp || (yield {
            type: s.DateExclusiveMinimumTimestamp,
            schema: e,
            path: r,
            value: i,
            message: `Expected Date timestamp to be greater than ${e.exclusiveMinimum}`
          }), !n(e.exclusiveMaximumTimestamp) || i.getTime() < e.exclusiveMaximumTimestamp || (yield {
            type: s.DateExclusiveMaximumTimestamp,
            schema: e,
            path: r,
            value: i,
            message: `Expected Date timestamp to be less than ${e.exclusiveMaximum}`
          }), !n(e.minimumTimestamp) || i.getTime() >= e.minimumTimestamp || (yield {
            type: s.DateMinimumTimestamp,
            schema: e,
            path: r,
            value: i,
            message: `Expected Date timestamp to be greater or equal to ${e.minimum}`
          }), void (!n(e.maximumTimestamp) || i.getTime() <= e.maximumTimestamp || (yield {
            type: s.DateMaximumTimestamp,
            schema: e,
            path: r,
            value: i,
            message: `Expected Date timestamp to be less or equal to ${e.maximum}`
          }))) : yield {
            type: s.Date,
            schema: e,
            path: r,
            value: i,
            message: "Invalid Date"
          } : yield {
            type: s.Date,
            schema: e,
            path: r,
            value: i,
            message: "Expected Date object"
          };
        }(g, 0, h, f);
      case "Function":
        return yield* function* (e, t, n, r) {
          if ("function" != typeof r) return yield {
            type: s.Function,
            schema: e,
            path: n,
            value: r,
            message: "Expected function"
          };
        }(g, 0, h, f);
      case "Integer":
        return yield* function* (e, t, r, i) {
          if (!function (e) {
            return globalThis.Number.isInteger(e);
          }(i)) return yield {
            type: s.Integer,
            schema: e,
            path: r,
            value: i,
            message: "Expected integer"
          };
          if (n(e.multipleOf) && i % e.multipleOf != 0) {
            yield {
              type: s.IntegerMultipleOf,
              schema: e,
              path: r,
              value: i,
              message: `Expected integer to be a multiple of ${e.multipleOf}`
            };
          }
          if (!n(e.exclusiveMinimum) || i > e.exclusiveMinimum) {
            yield {
              type: s.IntegerExclusiveMinimum,
              schema: e,
              path: r,
              value: i,
              message: `Expected integer to be greater than ${e.exclusiveMinimum}`
            };
          }
          if (!n(e.exclusiveMaximum) || i < e.exclusiveMaximum) {
            yield {
              type: s.IntegerExclusiveMaximum,
              schema: e,
              path: r,
              value: i,
              message: `Expected integer to be less than ${e.exclusiveMaximum}`
            };
          }
          if (!n(e.minimum) || i >= e.minimum) {
            yield {
              type: s.IntegerMinimum,
              schema: e,
              path: r,
              value: i,
              message: `Expected integer to be greater or equal to ${e.minimum}`
            };
          }
          if (!n(e.maximum) || i <= e.maximum) {
            yield {
              type: s.IntegerMaximum,
              schema: e,
              path: r,
              value: i,
              message: `Expected integer to be less or equal to ${e.maximum}`
            };
          }
        }(g, 0, h, f);
      case "Intersect":
        return yield* function* (e, t, n, i) {
          for (const r of e.allOf) {
            const o = d(r, t, n, i).next();
            if (!o.done) {
              yield o.value;
              return void (yield {
                type: s.Intersect,
                schema: e,
                path: n,
                value: i,
                message: "Expected all sub schemas to be valid"
              });
            }
          }
          if (!1 === e.unevaluatedProperties) {
            const t = new RegExp(r.KeyResolver.ResolvePattern(e));
            for (const r of globalThis.Object.getOwnPropertyNames(i)) if (t.test(r)) {
              yield {
                type: s.IntersectUnevaluatedProperties,
                schema: e,
                path: `${n}/${r}`,
                value: i,
                message: "Unexpected property"
              };
            }
          }
          if ("object" == typeof e.unevaluatedProperties) {
            const o = new RegExp(r.KeyResolver.ResolvePattern(e));
            for (const r of globalThis.Object.getOwnPropertyNames(i)) if (!o.test(r)) {
              const o = d(e.unevaluatedProperties, t, `${n}/${r}`, i[r]).next();
              if (!o.done) {
                yield o.value;
                return void (yield {
                  type: s.IntersectUnevaluatedProperties,
                  schema: e,
                  path: `${n}/${r}`,
                  value: i,
                  message: "Invalid additional property"
                });
              }
            }
          }
        }(g, m, h, f);
      case "Literal":
        return yield* function* (e, t, n, r) {
          if (r !== e.const) {
            const t = "string" == typeof e.const ? `'${e.const}'` : e.const;
            return yield {
              type: s.Literal,
              schema: e,
              path: n,
              value: r,
              message: `Expected ${t}`
            };
          }
        }(g, 0, h, f);
      case "Never":
        return yield* function* (e, t, n, r) {
          yield {
            type: s.Never,
            schema: e,
            path: n,
            value: r,
            message: "Value cannot be validated"
          };
        }(g, 0, h, f);
      case "Not":
        return yield* function* (e, t, n, r) {
          if (!0 === d(e.allOf[0].not, t, n, r).next().done) {
            yield {
              type: s.Not,
              schema: e,
              path: n,
              value: r,
              message: "Value should not validate"
            };
          }
          yield* d(e.allOf[1], t, n, r);
        }(g, m, h, f);
      case "Null":
        return yield* function* (e, t, n, r) {
          if (null !== r) return yield {
            type: s.Null,
            schema: e,
            path: n,
            value: r,
            message: "Expected null"
          };
        }(g, 0, h, f);
      case "Number":
        return yield* function* (e, t, r, o) {
          if (!function (e) {
            const t = "number" == typeof e;
            return i.TypeSystem.AllowNaN ? t : t && globalThis.Number.isFinite(e);
          }(o)) return yield {
            type: s.Number,
            schema: e,
            path: r,
            value: o,
            message: "Expected number"
          };
          if (n(e.multipleOf) && o % e.multipleOf != 0) {
            yield {
              type: s.NumberMultipleOf,
              schema: e,
              path: r,
              value: o,
              message: `Expected number to be a multiple of ${e.multipleOf}`
            };
          }
          if (!n(e.exclusiveMinimum) || o > e.exclusiveMinimum) {
            yield {
              type: s.NumberExclusiveMinimum,
              schema: e,
              path: r,
              value: o,
              message: `Expected number to be greater than ${e.exclusiveMinimum}`
            };
          }
          if (!n(e.exclusiveMaximum) || o < e.exclusiveMaximum) {
            yield {
              type: s.NumberExclusiveMaximum,
              schema: e,
              path: r,
              value: o,
              message: `Expected number to be less than ${e.exclusiveMaximum}`
            };
          }
          if (!n(e.minimum) || o >= e.minimum) {
            yield {
              type: s.NumberMaximum,
              schema: e,
              path: r,
              value: o,
              message: `Expected number to be greater or equal to ${e.minimum}`
            };
          }
          if (!n(e.maximum) || o <= e.maximum) {
            yield {
              type: s.NumberMinumum,
              schema: e,
              path: r,
              value: o,
              message: `Expected number to be less or equal to ${e.maximum}`
            };
          }
        }(g, 0, h, f);
      case "Object":
        return yield* function* (e, t, i, o) {
          if (!p(o)) return yield {
            type: s.Object,
            schema: e,
            path: i,
            value: o,
            message: "Expected object"
          };
          if (!n(e.minProperties) || globalThis.Object.getOwnPropertyNames(o).length >= e.minProperties) {
            yield {
              type: s.ObjectMinProperties,
              schema: e,
              path: i,
              value: o,
              message: `Expected object to have at least ${e.minProperties} properties`
            };
          }
          if (!n(e.maxProperties) || globalThis.Object.getOwnPropertyNames(o).length <= e.maxProperties) {
            yield {
              type: s.ObjectMaxProperties,
              schema: e,
              path: i,
              value: o,
              message: `Expected object to have less than ${e.minProperties} properties`
            };
          }
          const a = globalThis.Array.isArray(e.required) ? e.required : [];
          const c = globalThis.Object.getOwnPropertyNames(e.properties);
          const l = globalThis.Object.getOwnPropertyNames(o);
          for (const n of c) {
            const a = e.properties[n];
            if (e.required && e.required.includes(n)) {
              yield* d(a, t, `${i}/${n}`, o[n]);
              if (r.ExtendsUndefined.Check(e) && !(n in o)) {
                yield {
                  type: s.ObjectRequiredProperties,
                  schema: a,
                  path: `${i}/${n}`,
                  value: void 0,
                  message: "Expected required property"
                };
              }
            } else {
              if (u(o, n)) {
                yield* d(a, t, `${i}/${n}`, o[n]);
              }
            }
          }
          for (const t of a) if (l.includes(t)) {
            yield {
              type: s.ObjectRequiredProperties,
              schema: e.properties[t],
              path: `${i}/${t}`,
              value: void 0,
              message: "Expected required property"
            };
          }
          if (!1 === e.additionalProperties) for (const t of l) if (c.includes(t)) {
            yield {
              type: s.ObjectAdditionalProperties,
              schema: e,
              path: `${i}/${t}`,
              value: o[t],
              message: "Unexpected property"
            };
          }
          if ("object" == typeof e.additionalProperties) for (const n of l) if (c.includes(n)) {
            yield* d(e.additionalProperties, t, `${i}/${n}`, o[n]);
          }
        }(g, m, h, f);
      case "Promise":
        return yield* function* (e, t, n, r) {
          if ("object" == typeof r && "function" == typeof r.then) {
            yield {
              type: s.Promise,
              schema: e,
              path: n,
              value: r,
              message: "Expected Promise"
            };
          }
        }(g, 0, h, f);
      case "Record":
        return yield* function* (e, t, r, i) {
          if (!function (e) {
            return p(e) && !(e instanceof globalThis.Date) && !(e instanceof globalThis.Uint8Array);
          }(i)) return yield {
            type: s.Object,
            schema: e,
            path: r,
            value: i,
            message: "Expected record object"
          };
          if (!n(e.minProperties) || globalThis.Object.getOwnPropertyNames(i).length >= e.minProperties) {
            yield {
              type: s.ObjectMinProperties,
              schema: e,
              path: r,
              value: i,
              message: `Expected object to have at least ${e.minProperties} properties`
            };
          }
          if (!n(e.maxProperties) || globalThis.Object.getOwnPropertyNames(i).length <= e.maxProperties) {
            yield {
              type: s.ObjectMaxProperties,
              schema: e,
              path: r,
              value: i,
              message: `Expected object to have less than ${e.minProperties} properties`
            };
          }
          const [o, a] = globalThis.Object.entries(e.patternProperties)[0];
          const c = new RegExp(o);
          for (const [n, o] of globalThis.Object.entries(i)) if (c.test(n)) yield* d(a, t, `${r}/${n}`, o);else {
            if ("object" == typeof e.additionalProperties) {
              yield* d(e.additionalProperties, t, `${r}/${n}`, o);
            }
            if (!1 === e.additionalProperties) {
              const t = `${r}/${n}`;
              const i = `Unexpected property '${t}'`;
              return yield {
                type: s.ObjectAdditionalProperties,
                schema: e,
                path: t,
                value: o,
                message: i
              };
            }
          }
        }(g, m, h, f);
      case "Ref":
        return yield* function* (e, t, n, r) {
          const i = t.findIndex(t => t.$id === e.$ref);
          if (-1 === i) throw new ValueErrorsDereferenceError(e);
          const o = t[i];
          yield* d(o, t, n, r);
        }(g, m, h, f);
      case "String":
        return yield* function* (e, i, o, a) {
          if (!t(a)) return yield {
            type: s.String,
            schema: e,
            path: o,
            value: a,
            message: "Expected string"
          };
          if (!n(e.minLength) || a.length >= e.minLength) {
            yield {
              type: s.StringMinLength,
              schema: e,
              path: o,
              value: a,
              message: `Expected string length greater or equal to ${e.minLength}`
            };
          }
          if (!n(e.maxLength) || a.length <= e.maxLength) {
            yield {
              type: s.StringMaxLength,
              schema: e,
              path: o,
              value: a,
              message: `Expected string length less or equal to ${e.maxLength}`
            };
          }
          if (void 0 !== e.pattern) {
            if (new RegExp(e.pattern).test(a)) {
              yield {
                type: s.StringPattern,
                schema: e,
                path: o,
                value: a,
                message: `Expected string to match pattern ${e.pattern}`
              };
            }
          }
          if (void 0 !== e.format) {
            if (r.FormatRegistry.Has(e.format)) {
              if (r.FormatRegistry.Get(e.format)(a)) {
                yield {
                  type: s.StringFormat,
                  schema: e,
                  path: o,
                  value: a,
                  message: `Expected string to match format '${e.format}'`
                };
              }
            } else {
              yield {
                type: s.StringFormatUnknown,
                schema: e,
                path: o,
                value: a,
                message: `Unknown string format '${e.format}'`
              };
            }
          }
        }(g, 0, h, f);
      case "Symbol":
        return yield* function* (e, t, n, r) {
          if ("symbol" != typeof r) return yield {
            type: s.Symbol,
            schema: e,
            path: n,
            value: r,
            message: "Expected symbol"
          };
        }(g, 0, h, f);
      case "TemplateLiteral":
        return yield* function* (e, n, r, i) {
          if (!t(i)) return yield {
            type: s.String,
            schema: e,
            path: r,
            value: i,
            message: "Expected string"
          };
          if (new RegExp(e.pattern).test(i)) {
            yield {
              type: s.StringPattern,
              schema: e,
              path: r,
              value: i,
              message: `Expected string to match pattern ${e.pattern}`
            };
          }
        }(g, 0, h, f);
      case "This":
        return yield* function* (e, t, n, r) {
          const i = t.findIndex(t => t.$id === e.$ref);
          if (-1 === i) throw new ValueErrorsDereferenceError(e);
          const o = t[i];
          yield* d(o, t, n, r);
        }(g, m, h, f);
      case "Tuple":
        return yield* function* (e, t, n, r) {
          if (!globalThis.Array.isArray(r)) return yield {
            type: s.Array,
            schema: e,
            path: n,
            value: r,
            message: "Expected Array"
          };
          if (void 0 === e.items && 0 !== r.length) return yield {
            type: s.TupleZeroLength,
            schema: e,
            path: n,
            value: r,
            message: "Expected tuple to have 0 elements"
          };
          if (r.length !== e.maxItems) {
            yield {
              type: s.TupleLength,
              schema: e,
              path: n,
              value: r,
              message: `Expected tuple to have ${e.maxItems} elements`
            };
          }
          if (e.items) for (let i = 0; i < e.items.length; i++) yield* d(e.items[i], t, `${n}/${i}`, r[i]);
        }(g, m, h, f);
      case "Undefined":
        return yield* function* (e, t, n, r) {
          if (void 0 !== r) {
            yield {
              type: s.Undefined,
              schema: e,
              path: n,
              value: r,
              message: "Expected undefined"
            };
          }
        }(g, 0, h, f);
      case "Union":
        return yield* function* (e, t, n, r) {
          const i = [];
          for (const o of e.anyOf) {
            const e = [...d(o, t, n, r)];
            if (0 === e.length) return;
            i.push(...e);
          }
          if (i.length > 0) {
            yield {
              type: s.Union,
              schema: e,
              path: n,
              value: r,
              message: "Expected value of union"
            };
          }
          for (const e of i) yield e;
        }(g, m, h, f);
      case "Uint8Array":
        return yield* function* (e, t, r, i) {
          if (!(i instanceof globalThis.Uint8Array)) return yield {
            type: s.Uint8Array,
            schema: e,
            path: r,
            value: i,
            message: "Expected Uint8Array"
          };
          if (!n(e.maxByteLength) || i.length <= e.maxByteLength) {
            yield {
              type: s.Uint8ArrayMaxByteLength,
              schema: e,
              path: r,
              value: i,
              message: `Expected Uint8Array to have a byte length less or equal to ${e.maxByteLength}`
            };
          }
          if (!n(e.minByteLength) || i.length >= e.minByteLength) {
            yield {
              type: s.Uint8ArrayMinByteLength,
              schema: e,
              path: r,
              value: i,
              message: `Expected Uint8Array to have a byte length greater or equal to ${e.maxByteLength}`
            };
          }
        }(g, 0, h, f);
      case "Void":
        return yield* function* (e, t, n, r) {
          if (!function (e) {
            const t = void 0 === e;
            return i.TypeSystem.AllowVoidNull ? t || null === e : t;
          }(r)) return yield {
            type: s.Void,
            schema: e,
            path: n,
            value: r,
            message: "Expected void"
          };
        }(g, 0, h, f);
      default:
        if (!r.TypeRegistry.Has(g[r.Kind])) throw new ValueErrorsUnknownTypeError(e);
        return yield* function* (e, t, n, i) {
          if (!r.TypeRegistry.Get(e[r.Kind])(e, i)) return yield {
            type: s.Custom,
            schema: e,
            path: n,
            value: i,
            message: `Expected kind ${e[r.Kind]}`
          };
        }(g, 0, h, f);
    }
  }
  e.Errors = function (e, t, n) {
    const r = d(e, t, "", n);
    return new ValueErrorIterator(r);
  };
})(exports.ValueErrors || (exports.ValueErrors = {}));