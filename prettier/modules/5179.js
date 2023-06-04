Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.extractLocalImportContext = exports.getDocComment = void 0;
const r = require(1017);
const i = require(8306);
function o(e, t) {
  let n = t.namedChild(1)?.text.slice(1, -1);
  if (!n || !n.startsWith(".")) return null;
  if ("" === r.extname(n)) n += ".ts";else if (".ts" !== r.extname(n)) return null;
  return r.join(r.dirname(e), n);
}
function s(e) {
  let t = [];
  if ("import_clause" === e.namedChild(0)?.type) {
    let n = e.namedChild(0);
    if ("named_imports" === n?.namedChild(0)?.type) {
      let e = n.namedChild(0);
      for (let n of e?.namedChildren ?? []) if ("import_specifier" === n.type) {
        const e = n.childForFieldName("name")?.text;
        if (e) {
          const r = n.childForFieldName("alias")?.text;
          t.push({
            name: e,
            alias: r
          });
        }
      }
    }
  }
  return t;
}
const a = new Map();
function c(e, t) {
  let n = t?.childForFieldName("name")?.text ?? "";
  switch (t?.type) {
    case "ambient_declaration":
      return c(e, t.namedChild(0));
    case "interface_declaration":
    case "enum_declaration":
    case "type_alias_declaration":
      return {
        name: n,
        decl: t.text
      };
    case "function_declaration":
    case "function_signature":
      return {
        name: n,
        decl: l(e, t)
      };
    case "class_declaration":
      {
        let r = function (e, t) {
          let n = t.childForFieldName("body");
          if (n) return n.namedChildren.map(t => p(e, t)).filter(e => e);
        }(e, t);
        let i = "";
        if (r) {
          let n = t.childForFieldName("body");
          i = `declare ${e.substring(t.startIndex, n.startIndex + 1)}`;
          i += r.map(e => "\n" + e).join("");
          i += "\n}";
        }
        return {
          name: n,
          decl: i
        };
      }
  }
  return {
    name: n,
    decl: ""
  };
}
function l(e, t) {
  const n = t.childForFieldName("return_type")?.endIndex ?? t.childForFieldName("parameters")?.endIndex;
  if (void 0 !== n) {
    let r = e.substring(t.startIndex, n) + ";";
    return "function_declaration" === t.type || "function_signature" === t.type ? "declare " + r : r;
  }
  return "";
}
function getDocComment(e, t) {
  const n = i.getFirstPrecedingComment(t);
  return n ? e.substring(n.startIndex, t.startIndex) : "";
}
function p(e, t) {
  if ("accessibility_modifier" === t?.firstChild?.type && "private" === t.firstChild.text) return "";
  const n = function (e, t) {
    let n = t.startIndex - 1;
    for (; n >= 0 && (" " === e[n] || "\t" === e[n]);) n--;
    if (n < 0 || "\n" === e[n]) return e.substring(n + 1, t.startIndex);
  }(e, i.getFirstPrecedingComment(t) ?? t) ?? "  ";
  const r = getDocComment(e, t);
  switch (t.type) {
    case "ambient_declaration":
      const i = t.namedChild(0);
      return i ? n + r + p(e, i) : "";
    case "method_definition":
    case "method_signature":
      return n + r + l(e, t);
    case "public_field_definition":
      {
        let i = t.childForFieldName("type")?.endIndex ?? t.childForFieldName("name")?.endIndex;
        if (void 0 !== i) return n + r + e.substring(t.startIndex, i) + ";";
      }
  }
  return "";
}
async function d(e, t, n) {
  let r = new Map();
  let o = -1;
  try {
    o = await n.mtime(e);
  } catch {
    return r;
  }
  let s = a.get(e);
  if (s && s.mtime === o) return s.exports;
  if ("typescript" === t) {
    let o = null;
    try {
      let s = (await n.readFile(e)).toString();
      o = await i.parseTreeSitter(t, s);
      for (let e of i.queryExports(t, o.rootNode)) for (let t of e.captures) {
        let e = t.node;
        if ("export_statement" === e.type) {
          let t = e.childForFieldName("declaration");
          if (t?.hasError()) continue;
          let {
            name: n,
            decl: i
          } = c(s, t);
          if (n) {
            i = getDocComment(s, e) + i;
            let t = r.get(n);
            if (t) {
              t = [];
              r.set(n, t);
            }
            t.push(i);
          }
        }
      }
    } catch {} finally {
      if (o) {
        o.delete();
      }
    }
  }
  if (a.size > 2e3) for (let e of a.keys()) {
    a.delete(e);
    if (r.size <= 1e3) break;
  }
  a.set(e, {
    mtime: o,
    exports: r
  });
  return r;
}
exports.getDocComment = getDocComment;
const h = /^\s*import\s*(type|)\s*\{[^}]*\}\s*from\s*['"]\./gm;
exports.extractLocalImportContext = async function (e, t) {
  let {
    source: n,
    uri: r,
    languageId: a
  } = e;
  return t && "typescript" === a ? async function (e, t, n) {
    let r = "typescript";
    let a = [];
    const c = function (e) {
      let t;
      let n = -1;
      h.lastIndex = -1;
      do {
        t = h.exec(e);
        if (t) {
          n = h.lastIndex + t.length;
        }
      } while (t);
      if (-1 === n) return -1;
      const r = e.indexOf("\n", n);
      return -1 !== r ? r : e.length;
    }(e);
    if (-1 === c) return a;
    e = e.substring(0, c);
    let l = await i.parseTreeSitter(r, e);
    try {
      for (let e of function (e) {
        let t = [];
        for (let n of e.namedChildren) if ("import_statement" === n.type) {
          t.push(n);
        }
        return t;
      }(l.rootNode)) {
        let i = o(t, e);
        if (!i) continue;
        let c = s(e);
        if (0 === c.length) continue;
        let l = await d(i, r, n);
        for (let e of c) if (l.has(e.name)) {
          a.push(...l.get(e.name));
        }
      }
    } finally {
      l.delete();
    }
    return a;
  }(n, r, t) : [];
};