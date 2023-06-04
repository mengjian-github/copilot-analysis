Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
const r = require(93487);
const i = require(76776);
const o = require(22141);
const s = require(76776);
function hasPropFunc(e) {
  return e.scopeValue("func", {
    ref: Object.prototype.hasOwnProperty,
    code: r._`Object.prototype.hasOwnProperty`
  });
}
function isOwnProperty(e, t, n) {
  return r._`${hasPropFunc(e)}.call(${t}, ${n})`;
}
function noPropertyInData(e, t, n, i) {
  const o = r._`${t}${r.getProperty(n)} === undefined`;
  return i ? r.or(o, r.not(isOwnProperty(e, t, n))) : o;
}
function allSchemaProperties(e) {
  return e ? Object.keys(e).filter(e => "__proto__" !== e) : [];
}
exports.checkReportMissingProp = function (e, t) {
  const {
    gen: n,
    data: i,
    it: o
  } = e;
  n.if(noPropertyInData(n, i, t, o.opts.ownProperties), () => {
    e.setParams({
      missingProperty: r._`${t}`
    }, !0);
    e.error();
  });
};
exports.checkMissingProp = function ({
  gen: e,
  data: t,
  it: {
    opts: n
  }
}, i, o) {
  return r.or(...i.map(i => r.and(noPropertyInData(e, t, i, n.ownProperties), r._`${o} = ${i}`)));
};
exports.reportMissingProp = function (e, t) {
  e.setParams({
    missingProperty: t
  }, !0);
  e.error();
};
exports.hasPropFunc = hasPropFunc;
exports.isOwnProperty = isOwnProperty;
exports.propertyInData = function (e, t, n, i) {
  const o = r._`${t}${r.getProperty(n)} !== undefined`;
  return i ? r._`${o} && ${isOwnProperty(e, t, n)}` : o;
};
exports.noPropertyInData = noPropertyInData;
exports.allSchemaProperties = allSchemaProperties;
exports.schemaProperties = function (e, t) {
  return allSchemaProperties(t).filter(n => !i.alwaysValidSchema(e, t[n]));
};
exports.callValidateCode = function ({
  schemaCode: e,
  data: t,
  it: {
    gen: n,
    topSchemaRef: i,
    schemaPath: s,
    errorPath: a
  },
  it: c
}, l, u, p) {
  const d = p ? r._`${e}, ${t}, ${i}${s}` : t;
  const h = [[o.default.instancePath, r.strConcat(o.default.instancePath, a)], [o.default.parentData, c.parentData], [o.default.parentDataProperty, c.parentDataProperty], [o.default.rootData, o.default.rootData]];
  if (c.opts.dynamicRef) {
    h.push([o.default.dynamicAnchors, o.default.dynamicAnchors]);
  }
  const f = r._`${d}, ${n.object(...h)}`;
  return u !== r.nil ? r._`${l}.call(${u}, ${f})` : r._`${l}(${f})`;
};
const p = r._`new RegExp`;
exports.usePattern = function ({
  gen: e,
  it: {
    opts: t
  }
}, n) {
  const i = t.unicodeRegExp ? "u" : "";
  const {
    regExp: o
  } = t.code;
  const a = o(n, i);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: r._`${"new RegExp" === o.code ? p : s.useFunc(e, o)}(${n}, ${i})`
  });
};
exports.validateArray = function (e) {
  const {
    gen: t,
    data: n,
    keyword: o,
    it: s
  } = e;
  const a = t.name("valid");
  if (s.allErrors) {
    const e = t.let("valid", !0);
    c(() => t.assign(e, !1));
    return e;
  }
  t.var(a, !0);
  c(() => t.break());
  return a;
  function c(s) {
    const c = t.const("len", r._`${n}.length`);
    t.forRange("i", 0, c, n => {
      e.subschema({
        keyword: o,
        dataProp: n,
        dataPropType: i.Type.Num
      }, a);
      t.if(r.not(a), s);
    });
  }
};
exports.validateUnion = function (e) {
  const {
    gen: t,
    schema: n,
    keyword: o,
    it: s
  } = e;
  if (!Array.isArray(n)) throw new Error("ajv implementation error");
  if (n.some(e => i.alwaysValidSchema(s, e)) && !s.opts.unevaluated) return;
  const a = t.let("valid", !1);
  const c = t.name("_valid");
  t.block(() => n.forEach((n, i) => {
    const s = e.subschema({
      keyword: o,
      schemaProp: i,
      compositeRule: !0
    }, c);
    t.assign(a, r._`${a} || ${c}`);
    if (e.mergeValidEvaluated(s, c)) {
      t.if(r.not(a));
    }
  }));
  e.result(a, () => e.reset(), () => e.error(!0));
};