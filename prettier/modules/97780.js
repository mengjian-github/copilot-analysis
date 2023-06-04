Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ValueMutate = exports.ValueMutateInvalidRootMutationError = exports.ValueMutateTypeMismatchError = void 0;
const r = require(5151);
const i = require(28019);
const o = require(95245);
class ValueMutateTypeMismatchError extends Error {
  constructor() {
    super("ValueMutate: Cannot assign due type mismatch of assignable values");
  }
}
exports.ValueMutateTypeMismatchError = ValueMutateTypeMismatchError;
class ValueMutateInvalidRootMutationError extends Error {
  constructor() {
    super("ValueMutate: Only object and array types can be mutated at the root level");
  }
}
exports.ValueMutateInvalidRootMutationError = ValueMutateInvalidRootMutationError;
(function (e) {
  function t(e, n, s, a) {
    return r.Is.Array(a) ? function (e, n, s, a) {
      if (r.Is.Array(s)) {
        for (let r = 0; r < a.length; r++) t(e, `${n}/${r}`, s[r], a[r]);
        s.splice(a.length);
      } else i.ValuePointer.Set(e, n, o.ValueClone.Clone(a));
    }(e, n, s, a) : r.Is.TypedArray(a) ? function (e, t, n, s) {
      if (r.Is.TypedArray(n) && n.length === s.length) for (let e = 0; e < n.length; e++) n[e] = s[e];else i.ValuePointer.Set(e, t, o.ValueClone.Clone(s));
    }(e, n, s, a) : r.Is.Object(a) ? function (e, n, s, a) {
      if (r.Is.Object(s)) {
        const r = globalThis.Object.keys(s);
        const i = globalThis.Object.keys(a);
        for (const e of r) if (i.includes(e)) {
          delete s[e];
        }
        for (const e of i) if (r.includes(e)) {
          s[e] = null;
        }
        for (const r of i) t(e, `${n}/${r}`, s[r], a[r]);
      } else i.ValuePointer.Set(e, n, o.ValueClone.Clone(a));
    }(e, n, s, a) : r.Is.Value(a) ? function (e, t, n, r) {
      if (n !== r) {
        i.ValuePointer.Set(e, t, r);
      }
    }(e, n, s, a) : void 0;
  }
  e.Mutate = function (e, n) {
    if (r.Is.TypedArray(e) || r.Is.Value(e) || r.Is.TypedArray(n) || r.Is.Value(n)) throw new ValueMutateInvalidRootMutationError();
    if (r.Is.Object(e) && r.Is.Array(n) || r.Is.Array(e) && r.Is.Object(n)) throw new ValueMutateTypeMismatchError();
    t(e, "", e, n);
  };
})(exports.ValueMutate || (exports.ValueMutate = {}));