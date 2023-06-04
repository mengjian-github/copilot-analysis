Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
const r = require(4181);
const i = require(93487);
const o = require(22141);
const s = {
  message: "boolean schema is false"
};
function a(e, t) {
  const {
    gen: n,
    data: i
  } = e;
  const o = {
    gen: n,
    keyword: "false schema",
    data: i,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  r.reportError(o, s, void 0, t);
}
exports.topBoolOrEmptySchema = function (e) {
  const {
    gen: t,
    schema: n,
    validateName: r
  } = e;
  if (!1 === n) {
    a(e, !1);
  } else {
    if ("object" == typeof n && !0 === n.$async) {
      t.return(o.default.data);
    } else {
      t.assign(i._`${r}.errors`, null);
      t.return(!0);
    }
  }
};
exports.boolOrEmptySchema = function (e, t) {
  const {
    gen: n,
    schema: r
  } = e;
  if (!1 === r) {
    n.var(t, !1);
    a(e);
  } else {
    n.var(t, !0);
  }
};