function shouldUseGroup(e, t) {
  return t.rules.some(t => shouldUseRule(e, t));
}
function shouldUseRule(e, t) {
  var n;
  return void 0 !== e[t.keyword] || (null === (n = t.definition.implements) || void 0 === n ? void 0 : n.some(t => void 0 !== e[t]));
}
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
exports.schemaHasRulesForType = function ({
  schema: e,
  self: t
}, r) {
  const i = t.RULES.types[r];
  return i && !0 !== i && shouldUseGroup(e, i);
};
exports.shouldUseGroup = shouldUseGroup;
exports.shouldUseRule = shouldUseRule;