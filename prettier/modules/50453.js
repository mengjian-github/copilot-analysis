Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
const r = require(13141);
const i = require(58876);
const o = require(4181);
const s = require(93487);
const a = require(76776);
var c;
function getJSONTypes(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(r.isJSONType)) return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
!function (e) {
  e[e.Correct = 0] = "Correct";
  e[e.Wrong = 1] = "Wrong";
}(c = exports.DataType || (exports.DataType = {}));
exports.getSchemaTypes = function (e) {
  const t = getJSONTypes(e.type);
  if (t.includes("null")) {
    if (!1 === e.nullable) throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && void 0 !== e.nullable) throw new Error('"nullable" cannot be used without "type"');
    if (!0 === e.nullable) {
      t.push("null");
    }
  }
  return t;
};
exports.getJSONTypes = getJSONTypes;
exports.coerceAndCheckDataType = function (e, t) {
  const {
    gen: n,
    data: r,
    opts: o
  } = e;
  const a = function (e, t) {
    return t ? e.filter(e => u.has(e) || "array" === t && "array" === e) : [];
  }(t, o.coerceTypes);
  const l = t.length > 0 && !(0 === a.length && 1 === t.length && i.schemaHasRulesForType(e, t[0]));
  if (l) {
    const i = checkDataTypes(t, r, o.strictNumbers, c.Wrong);
    n.if(i, () => {
      if (a.length) {
        (function (e, t, n) {
          const {
            gen: r,
            data: i,
            opts: o
          } = e;
          const a = r.let("dataType", s._`typeof ${i}`);
          const c = r.let("coerced", s._`undefined`);
          if ("array" === o.coerceTypes) {
            r.if(s._`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => r.assign(i, s._`${i}[0]`).assign(a, s._`typeof ${i}`).if(checkDataTypes(t, i, o.strictNumbers), () => r.assign(c, i)));
          }
          r.if(s._`${c} !== undefined`);
          for (const e of n) if (u.has(e) || "array" === e && "array" === o.coerceTypes) {
            l(e);
          }
          function l(e) {
            switch (e) {
              case "string":
                return void r.elseIf(s._`${a} == "number" || ${a} == "boolean"`).assign(c, s._`"" + ${i}`).elseIf(s._`${i} === null`).assign(c, s._`""`);
              case "number":
                return void r.elseIf(s._`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(c, s._`+${i}`);
              case "integer":
                return void r.elseIf(s._`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(c, s._`+${i}`);
              case "boolean":
                return void r.elseIf(s._`${i} === "false" || ${i} === 0 || ${i} === null`).assign(c, !1).elseIf(s._`${i} === "true" || ${i} === 1`).assign(c, !0);
              case "null":
                r.elseIf(s._`${i} === "" || ${i} === 0 || ${i} === false`);
                return void r.assign(c, null);
              case "array":
                r.elseIf(s._`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(c, s._`[${i}]`);
            }
          }
          r.else();
          reportTypeError(e);
          r.endIf();
          r.if(s._`${c} !== undefined`, () => {
            r.assign(i, c);
            (function ({
              gen: e,
              parentData: t,
              parentDataProperty: n
            }, r) {
              e.if(s._`${t} !== undefined`, () => e.assign(s._`${t}[${n}]`, r));
            })(e, c);
          });
        })(e, t, a);
      } else {
        reportTypeError(e);
      }
    });
  }
  return l;
};
const u = new Set(["string", "number", "integer", "boolean", "null"]);
function checkDataType(e, t, n, r = c.Correct) {
  const i = r === c.Correct ? s.operators.EQ : s.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return s._`${t} ${i} null`;
    case "array":
      o = s._`Array.isArray(${t})`;
      break;
    case "object":
      o = s._`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = a(s._`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = a();
      break;
    default:
      return s._`typeof ${t} ${i} ${e}`;
  }
  return r === c.Correct ? o : s.not(o);
  function a(e = s.nil) {
    return s.and(s._`typeof ${t} == "number"`, e, n ? s._`isFinite(${t})` : s.nil);
  }
}
function checkDataTypes(e, t, n, r) {
  if (1 === e.length) return checkDataType(e[0], t, n, r);
  let i;
  const o = a.toHash(e);
  if (o.array && o.object) {
    const e = s._`typeof ${t} != "object"`;
    i = o.null ? e : s._`!${t} || ${e}`;
    delete o.null;
    delete o.array;
    delete o.object;
  } else i = s.nil;
  if (o.number) {
    delete o.integer;
  }
  for (const e in o) i = s.and(i, checkDataType(e, t, n, r));
  return i;
}
exports.checkDataType = checkDataType;
exports.checkDataTypes = checkDataTypes;
const h = {
  message: ({
    schema: e
  }) => `must be ${e}`,
  params: ({
    schema: e,
    schemaValue: t
  }) => "string" == typeof e ? s._`{type: ${e}}` : s._`{type: ${t}}`
};
function reportTypeError(e) {
  const t = function (e) {
    const {
      gen: t,
      data: n,
      schema: r
    } = e;
    const i = a.schemaRefOrVal(e, r, "type");
    return {
      gen: t,
      keyword: "type",
      data: n,
      schema: r.type,
      schemaCode: i,
      schemaValue: i,
      parentSchema: r,
      params: {},
      it: e
    };
  }(e);
  o.reportError(t, h);
}
exports.reportTypeError = reportTypeError;