Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.Value = void 0;
const r = require(48803);
const i = require(97780);
const o = require(97540);
const s = require(77712);
const a = require(30728);
const c = require(95245);
const l = require(39303);
const u = require(8851);
const p = require(4291);
const d = require(92190);
var h;
(h = exports.Value || (exports.Value = {})).Cast = function (...e) {
  const [t, n, r] = 3 === e.length ? [e[0], e[1], e[2]] : [e[0], [], e[1]];
  return a.ValueCast.Cast(t, n, r);
};
h.Create = function (...e) {
  const [t, n] = 2 === e.length ? [e[0], e[1]] : [e[0], []];
  return u.ValueCreate.Create(t, n);
};
h.Check = function (...e) {
  const [t, n, r] = 3 === e.length ? [e[0], e[1], e[2]] : [e[0], [], e[1]];
  return p.ValueCheck.Check(t, n, r);
};
h.Convert = function (...e) {
  const [t, n, r] = 3 === e.length ? [e[0], e[1], e[2]] : [e[0], [], e[1]];
  return l.ValueConvert.Convert(t, n, r);
};
h.Clone = function (e) {
  return c.ValueClone.Clone(e);
};
h.Errors = function (...e) {
  const [t, n, i] = 3 === e.length ? [e[0], e[1], e[2]] : [e[0], [], e[1]];
  return r.ValueErrors.Errors(t, n, i);
};
h.Equal = function (e, t) {
  return s.ValueEqual.Equal(e, t);
};
h.Diff = function (e, t) {
  return d.ValueDelta.Diff(e, t);
};
h.Hash = function (e) {
  return o.ValueHash.Create(e);
};
h.Patch = function (e, t) {
  return d.ValueDelta.Patch(e, t);
};
h.Mutate = function (e, t) {
  i.ValueMutate.Mutate(e, t);
};