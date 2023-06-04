Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
const r = require(93487);
const i = require(76776);
exports.getSubschema = function (e, {
  keyword: t,
  schemaProp: n,
  schema: o,
  schemaPath: s,
  errSchemaPath: a,
  topSchemaRef: c
}) {
  if (void 0 !== t && void 0 !== o) throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (void 0 !== t) {
    const o = e.schema[t];
    return void 0 === n ? {
      schema: o,
      schemaPath: r._`${e.schemaPath}${r.getProperty(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: o[n],
      schemaPath: r._`${e.schemaPath}${r.getProperty(t)}${r.getProperty(n)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${i.escapeFragment(n)}`
    };
  }
  if (void 0 !== o) {
    if (void 0 === s || void 0 === a || void 0 === c) throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: o,
      schemaPath: s,
      topSchemaRef: c,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
};
exports.extendSubschemaData = function (e, t, {
  dataProp: n,
  dataPropType: o,
  data: s,
  dataTypes: a,
  propertyName: c
}) {
  if (void 0 !== s && void 0 !== n) throw new Error('both "data" and "dataProp" passed, only one allowed');
  const {
    gen: l
  } = t;
  if (void 0 !== n) {
    const {
      errorPath: s,
      dataPathArr: a,
      opts: c
    } = t;
    u(l.let("data", r._`${t.data}${r.getProperty(n)}`, !0));
    e.errorPath = r.str`${s}${i.getErrorPath(n, o, c.jsPropertySyntax)}`;
    e.parentDataProperty = r._`${n}`;
    e.dataPathArr = [...a, e.parentDataProperty];
  }
  function u(n) {
    e.data = n;
    e.dataLevel = t.dataLevel + 1;
    e.dataTypes = [];
    t.definedProperties = new Set();
    e.parentData = t.data;
    e.dataNames = [...t.dataNames, n];
  }
  if (void 0 !== s) {
    u(s instanceof r.Name ? s : l.let("data", s, !0));
    if (void 0 !== c) {
      e.propertyName = c;
    }
  }
  if (a) {
    e.dataTypes = a;
  }
};
exports.extendSubschemaMode = function (e, {
  jtdDiscriminator: t,
  jtdMetadata: n,
  compositeRule: r,
  createErrors: i,
  allErrors: o
}) {
  if (void 0 !== r) {
    e.compositeRule = r;
  }
  if (void 0 !== i) {
    e.createErrors = i;
  }
  if (void 0 !== o) {
    e.allErrors = o;
  }
  e.jtdDiscriminator = t;
  e.jtdMetadata = n;
};