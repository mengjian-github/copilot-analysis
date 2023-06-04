Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getRules = exports.isJSONType = void 0;
const n = new Set(["string", "number", "integer", "boolean", "null", "object", "array"]);
exports.isJSONType = function (e) {
  return "string" == typeof e && n.has(e);
};
exports.getRules = function () {
  const e = {
    number: {
      type: "number",
      rules: []
    },
    string: {
      type: "string",
      rules: []
    },
    array: {
      type: "array",
      rules: []
    },
    object: {
      type: "object",
      rules: []
    }
  };
  return {
    types: {
      ...e,
      integer: !0,
      boolean: !0,
      null: !0
    },
    rules: [{
      rules: []
    }, e.number, e.string, e.array, e.object],
    post: {
      rules: []
    },
    all: {},
    keywords: {}
  };
};