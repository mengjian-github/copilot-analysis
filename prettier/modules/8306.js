Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getCallSites = exports.getFunctionPositions = exports.getFirstPrecedingComment = exports.isFunctionDefinition = exports.isFunction = exports.getAncestorWithSiblingFunctions = exports.queryPythonIsDocstring = exports.queryGlobalVars = exports.queryExports = exports.queryImports = exports.queryFunctions = exports.getBlockCloseToken = exports.parsesWithoutError = exports.parseTreeSitter = exports.getLanguage = exports.languageIdToWasmLanguage = exports.isSupportedLanguageId = exports.WASMLanguage = void 0;
const r = require(1017);
const i = require(4087);
const o = require(4087);
var s;
!function (e) {
  e.Python = "python";
  e.JavaScript = "javascript";
  e.TypeScript = "typescript";
  e.TSX = "tsx";
  e.Go = "go";
  e.Ruby = "ruby";
}(s = exports.WASMLanguage || (exports.WASMLanguage = {}));
const a = {
  python: s.Python,
  javascript: s.JavaScript,
  javascriptreact: s.JavaScript,
  jsx: s.JavaScript,
  typescript: s.TypeScript,
  typescriptreact: s.TSX,
  go: s.Go,
  ruby: s.Ruby
};
function languageIdToWasmLanguage(e) {
  if (!(e in a)) throw new Error(`Unrecognized language: ${e}`);
  return a[e];
}
exports.isSupportedLanguageId = function (e) {
  return e in a;
};
exports.languageIdToWasmLanguage = languageIdToWasmLanguage;
const l = "[\n    (function body: (statement_block) @body)\n    (function_declaration body: (statement_block) @body)\n    (generator_function body: (statement_block) @body)\n    (generator_function_declaration body: (statement_block) @body)\n    (method_definition body: (statement_block) @body)\n    (arrow_function body: (statement_block) @body)\n  ] @function";
const u = {
  python: [["(function_definition body: (block\n             (expression_statement (string))? @docstring) @body) @function"], ['(ERROR ("def" (identifier) (parameters))) @function']],
  javascript: [[l]],
  typescript: [[l]],
  tsx: [[l]],
  go: [["[\n            (function_declaration body: (block) @body)\n            (method_declaration body: (block) @body)\n          ] @function"]],
  ruby: [['[\n            (method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n            (singleton_method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n          ] @function']]
};
const p = '(variable_declarator value: (call_expression function: ((identifier) @req (#eq? @req "require"))))';
const d = `\n    (lexical_declaration ${p}+)\n    (variable_declaration ${p}+)\n`;
const h = [[`(program [ ${d} ] @import)`], ["(program [ (import_statement) (import_alias) ] @import)"]];
const f = {
  python: [["(module (future_import_statement) @import)"], ["(module (import_statement) @import)"], ["(module (import_from_statement) @import)"]],
  javascript: [[`(program [ ${d} ] @import)`], ["(program [ (import_statement) ] @import)"]],
  typescript: h,
  tsx: h,
  go: [],
  ruby: []
};
const m = [["(program (export_statement) @export)"]];
const g = {
  python: [],
  javascript: m,
  typescript: m,
  tsx: m,
  go: [],
  ruby: []
};
const y = {
  python: [["(module (global_statement) @globalVar)"], ["(module (expression_statement) @globalVar)"]],
  javascript: [],
  typescript: [],
  tsx: [],
  go: [],
  ruby: []
};
const _ = ["function", "function_declaration", "generator_function", "generator_function_declaration", "method_definition", "arrow_function"];
const v = {
  python: new Set(["function_definition"]),
  javascript: new Set(_),
  typescript: new Set(_),
  tsx: new Set(_),
  go: new Set(["function_declaration", "method_declaration"]),
  ruby: new Set(["method", "singleton_method"])
};
const b = {
  python: e => "module" === e.type || "block" === e.type && "class_definition" === e.parent?.type,
  javascript: e => "program" === e.type || "class_body" === e.type,
  typescript: e => "program" === e.type || "class_body" === e.type,
  tsx: e => "program" === e.type || "class_body" === e.type,
  go: e => "source_file" === e.type,
  ruby: e => "program" === e.type || "class" === e.type
};
const E = new Map();
async function getLanguage(e) {
  const t = languageIdToWasmLanguage(e);
  if (!E.has(t)) {
    const e = await async function (e) {
      await i.init();
      const t = r.resolve(__dirname, "..", "dist", `tree-sitter-${e}.wasm`);
      return o.Language.load(t);
    }(t);
    E.set(t, e);
  }
  return E.get(t);
}
async function parseTreeSitter(e, t) {
  let n = await getLanguage(e);
  const r = new i();
  r.setLanguage(n);
  const o = r.parse(t);
  r.delete();
  return o;
}
function S(e, t) {
  const n = [];
  for (const r of e) {
    if (!r[1]) {
      const e = t.tree.getLanguage();
      r[1] = e.query(r[0]);
    }
    n.push(...r[1].matches(t));
  }
  return n;
}
function queryFunctions(e, t) {
  return S(u[languageIdToWasmLanguage(e)], t);
}
exports.getLanguage = getLanguage;
exports.parseTreeSitter = parseTreeSitter;
exports.parsesWithoutError = async function (e, t) {
  const n = await parseTreeSitter(e, t);
  const r = !n.rootNode.hasError();
  n.delete();
  return r;
};
exports.getBlockCloseToken = function (e) {
  switch (languageIdToWasmLanguage(e)) {
    case s.Python:
      return null;
    case s.JavaScript:
    case s.TypeScript:
    case s.TSX:
    case s.Go:
      return "}";
    case s.Ruby:
      return "end";
  }
};
exports.queryFunctions = queryFunctions;
exports.queryImports = function (e, t) {
  return S(f[languageIdToWasmLanguage(e)], t);
};
exports.queryExports = function (e, t) {
  return S(g[languageIdToWasmLanguage(e)], t);
};
exports.queryGlobalVars = function (e, t) {
  return S(y[languageIdToWasmLanguage(e)], t);
};
const C = ["[\n    (class_definition (block (expression_statement (string))))\n    (function_definition (block (expression_statement (string))))\n]"];
function isFunction(e, t) {
  return v[languageIdToWasmLanguage(e)].has(t.type);
}
exports.queryPythonIsDocstring = function (e) {
  return 1 == S([C], e).length;
};
exports.getAncestorWithSiblingFunctions = function (e, t) {
  const n = b[languageIdToWasmLanguage(e)];
  for (; t.parent;) {
    if (n(t.parent)) return t;
    t = t.parent;
  }
  return t.parent ? t : null;
};
exports.isFunction = isFunction;
exports.isFunctionDefinition = function (e, t) {
  switch (languageIdToWasmLanguage(e)) {
    case s.Python:
    case s.Go:
    case s.Ruby:
      return isFunction(e, t);
    case s.JavaScript:
    case s.TypeScript:
    case s.TSX:
      if ("function_declaration" === t.type || "generator_function_declaration" === t.type || "method_definition" === t.type) return !0;
      if ("lexical_declaration" === t.type || "variable_declaration" === t.type) {
        if (t.namedChildCount > 1) return !1;
        let n = t.namedChild(0);
        if (null == n) return !1;
        let r = n.namedChild(1);
        return null !== r && isFunction(e, r);
      }
      if ("expression_statement" === t.type) {
        let n = t.namedChild(0);
        if ("assignment_expression" === n?.type) {
          let t = n.namedChild(1);
          return null !== t && isFunction(e, t);
        }
      }
      return !1;
  }
};
exports.getFirstPrecedingComment = function (e) {
  let t = e;
  for (; "comment" === t.previousSibling?.type;) {
    let e = t.previousSibling;
    if (e.endPosition.row < t.startPosition.row - 1) break;
    t = e;
  }
  return "comment" === t?.type ? t : null;
};
exports.getFunctionPositions = async function (e, t) {
  const n = await parseTreeSitter(e, t);
  const r = queryFunctions(e, n.rootNode).map(e => {
    const t = e.captures.find(e => "function" === e.name).node;
    return {
      startIndex: t.startIndex,
      endIndex: t.endIndex
    };
  });
  n.delete();
  return r;
};
const A = {
  python: [["(call\n            function:  [\n                (identifier) @caller\n                (attribute attribute:(identifier) @caller)\n            ]\n            arguments: (argument_list) @args\n        )"]],
  javascript: [],
  tsx: [],
  typescript: [],
  go: [],
  ruby: []
};
exports.getCallSites = async function (e) {
  if (!(e.languageId in A)) return [];
  let t = e.offset;
  let n = e.source.substring(0, t);
  const r = Math.max(n.length - 5e3, 0);
  const i = n.substring(0, r).split("\n").length - 1;
  t -= r;
  n = n.substring(r);
  n += ")))))";
  let o = [];
  const s = await parseTreeSitter(e.languageId, n);
  S(A[a[e.languageId]], s.rootNode).forEach((e, r) => {
    let s = "";
    let a = 0;
    let c = 0;
    let l = 0;
    let u = 0;
    e.captures.forEach((e, t) => {
      const r = e.node;
      if ("caller" == e.name) {
        s = n.substring(r.startIndex, r.endIndex);
        a = r.startPosition.row + i;
        c = r.startPosition.column;
      } else {
        if ("args" == e.name) {
          l = r.startIndex;
          u = r.endIndex;
        }
      }
    });
    if (t >= l && t <= u) {
      const e = {
        line: a,
        character: c
      };
      o.push([s, e]);
    }
  });
  s.delete();
  return o.map(([e, t]) => ({
    name: e,
    position: t
  }));
};