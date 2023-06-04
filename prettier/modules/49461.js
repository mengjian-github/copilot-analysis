var t = module.exports = function (e, t, r) {
  if ("function" == typeof t) {
    r = t;
    t = {};
  }
  n(t, "function" == typeof (r = t.cb || r) ? r : r.pre || function () {}, r.post || function () {}, e, "", e);
};
function n(e, r, i, o, s, a, c, l, u, p) {
  if (o && "object" == typeof o && !Array.isArray(o)) {
    for (var d in r(o, s, a, c, l, u, p), o) {
      var h = o[d];
      if (Array.isArray(h)) {
        if (d in t.arrayKeywords) for (var f = 0; f < h.length; f++) n(e, r, i, h[f], s + "/" + d + "/" + f, a, s, d, o, f);
      } else if (d in t.propsKeywords) {
        if (h && "object" == typeof h) for (var m in h) n(e, r, i, h[m], s + "/" + d + "/" + m.replace(/~/g, "~0").replace(/\//g, "~1"), a, s, d, o, m);
      } else if (d in t.keywords || e.allKeys && !(d in t.skipKeywords)) {
        n(e, r, i, h, s + "/" + d, a, s, d, o);
      }
    }
    i(o, s, a, c, l, u, p);
  }
}
t.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
t.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
t.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
t.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};