Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
const r = require(93487);
const i = require(76776);
const o = require(22141);
function s(e, t) {
  const n = e.const("err", t);
  e.if(r._`${o.default.vErrors} === null`, () => e.assign(o.default.vErrors, r._`[${n}]`), r._`${o.default.vErrors}.push(${n})`);
  e.code(r._`${o.default.errors}++`);
}
function a(e, t) {
  const {
    gen: n,
    validateName: i,
    schemaEnv: o
  } = e;
  if (o.$async) {
    n.throw(r._`new ${e.ValidationError}(${t})`);
  } else {
    n.assign(r._`${i}.errors`, t);
    n.return(!1);
  }
}
exports.keywordError = {
  message: ({
    keyword: e
  }) => r.str`must pass "${e}" keyword validation`
};
exports.keyword$DataError = {
  message: ({
    keyword: e,
    schemaType: t
  }) => t ? r.str`"${e}" keyword must be ${t} ($data)` : r.str`"${e}" keyword is invalid ($data)`
};
exports.reportError = function (e, n = exports.keywordError, i, o) {
  const {
    it: c
  } = e;
  const {
    gen: u,
    compositeRule: p,
    allErrors: d
  } = c;
  const h = l(e, n, i);
  if (null != o ? o : p || d) {
    s(u, h);
  } else {
    a(c, r._`[${h}]`);
  }
};
exports.reportExtraError = function (e, n = exports.keywordError, r) {
  const {
    it: i
  } = e;
  const {
    gen: c,
    compositeRule: u,
    allErrors: p
  } = i;
  s(c, l(e, n, r));
  if (u || p) {
    a(i, o.default.vErrors);
  }
};
exports.resetErrorsCount = function (e, t) {
  e.assign(o.default.errors, t);
  e.if(r._`${o.default.vErrors} !== null`, () => e.if(t, () => e.assign(r._`${o.default.vErrors}.length`, t), () => e.assign(o.default.vErrors, null)));
};
exports.extendErrors = function ({
  gen: e,
  keyword: t,
  schemaValue: n,
  data: i,
  errsCount: s,
  it: a
}) {
  if (void 0 === s) throw new Error("ajv implementation error");
  const c = e.name("err");
  e.forRange("i", s, o.default.errors, s => {
    e.const(c, r._`${o.default.vErrors}[${s}]`);
    e.if(r._`${c}.instancePath === undefined`, () => e.assign(r._`${c}.instancePath`, r.strConcat(o.default.instancePath, a.errorPath)));
    e.assign(r._`${c}.schemaPath`, r.str`${a.errSchemaPath}/${t}`);
    if (a.opts.verbose) {
      e.assign(r._`${c}.schema`, n);
      e.assign(r._`${c}.data`, i);
    }
  });
};
const c = {
  keyword: new r.Name("keyword"),
  schemaPath: new r.Name("schemaPath"),
  params: new r.Name("params"),
  propertyName: new r.Name("propertyName"),
  message: new r.Name("message"),
  schema: new r.Name("schema"),
  parentSchema: new r.Name("parentSchema")
};
function l(e, t, n) {
  const {
    createErrors: i
  } = e.it;
  return !1 === i ? r._`{}` : function (e, t, n = {}) {
    const {
      gen: i,
      it: s
    } = e;
    const a = [u(s, n), p(e, n)];
    (function (e, {
      params: t,
      message: n
    }, i) {
      const {
        keyword: s,
        data: a,
        schemaValue: l,
        it: u
      } = e;
      const {
        opts: p,
        propertyName: d,
        topSchemaRef: h,
        schemaPath: f
      } = u;
      i.push([c.keyword, s], [c.params, "function" == typeof t ? t(e) : t || r._`{}`]);
      if (p.messages) {
        i.push([c.message, "function" == typeof n ? n(e) : n]);
      }
      if (p.verbose) {
        i.push([c.schema, l], [c.parentSchema, r._`${h}${f}`], [o.default.data, a]);
      }
      if (d) {
        i.push([c.propertyName, d]);
      }
    })(e, t, a);
    return i.object(...a);
  }(e, t, n);
}
function u({
  errorPath: e
}, {
  instancePath: t
}) {
  const n = t ? r.str`${e}${i.getErrorPath(t, i.Type.Str)}` : e;
  return [o.default.instancePath, r.strConcat(o.default.instancePath, n)];
}
function p({
  keyword: e,
  it: {
    errSchemaPath: t
  }
}, {
  schemaPath: n,
  parentSchema: o
}) {
  let s = o ? t : r.str`${t}/${e}`;
  if (n) {
    s = r.str`${s}${i.getErrorPath(n, i.Type.Str)}`;
  }
  return [c.schemaPath, s];
}