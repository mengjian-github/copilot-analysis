Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getPathMarker = exports.getLanguageMarker = exports.commentBlockAsSingles = exports.comment = exports.hasLanguageMarker = exports.languageCommentMarkers = void 0;
exports.languageCommentMarkers = {
  abap: {
    start: '"',
    end: ""
  },
  bat: {
    start: "REM",
    end: ""
  },
  bibtex: {
    start: "%",
    end: ""
  },
  blade: {
    start: "#",
    end: ""
  },
  c: {
    start: "//",
    end: ""
  },
  clojure: {
    start: ";",
    end: ""
  },
  coffeescript: {
    start: "//",
    end: ""
  },
  cpp: {
    start: "//",
    end: ""
  },
  csharp: {
    start: "//",
    end: ""
  },
  css: {
    start: "/*",
    end: "*/"
  },
  dart: {
    start: "//",
    end: ""
  },
  dockerfile: {
    start: "#",
    end: ""
  },
  elixir: {
    start: "#",
    end: ""
  },
  erb: {
    start: "<%#",
    end: "%>"
  },
  erlang: {
    start: "%",
    end: ""
  },
  fsharp: {
    start: "//",
    end: ""
  },
  go: {
    start: "//",
    end: ""
  },
  groovy: {
    start: "//",
    end: ""
  },
  haml: {
    start: "-#",
    end: ""
  },
  handlebars: {
    start: "{{!",
    end: "}}"
  },
  haskell: {
    start: "--",
    end: ""
  },
  html: {
    start: "\x3c!--",
    end: "--\x3e"
  },
  ini: {
    start: ";",
    end: ""
  },
  java: {
    start: "//",
    end: ""
  },
  javascript: {
    start: "//",
    end: ""
  },
  javascriptreact: {
    start: "//",
    end: ""
  },
  jsonc: {
    start: "//",
    end: ""
  },
  jsx: {
    start: "//",
    end: ""
  },
  julia: {
    start: "#",
    end: ""
  },
  kotlin: {
    start: "//",
    end: ""
  },
  latex: {
    start: "%",
    end: ""
  },
  less: {
    start: "//",
    end: ""
  },
  lua: {
    start: "--",
    end: ""
  },
  makefile: {
    start: "#",
    end: ""
  },
  markdown: {
    start: "[]: #",
    end: ""
  },
  "objective-c": {
    start: "//",
    end: ""
  },
  "objective-cpp": {
    start: "//",
    end: ""
  },
  perl: {
    start: "#",
    end: ""
  },
  php: {
    start: "//",
    end: ""
  },
  powershell: {
    start: "#",
    end: ""
  },
  pug: {
    start: "//",
    end: ""
  },
  python: {
    start: "#",
    end: ""
  },
  ql: {
    start: "//",
    end: ""
  },
  r: {
    start: "#",
    end: ""
  },
  razor: {
    start: "\x3c!--",
    end: "--\x3e"
  },
  ruby: {
    start: "#",
    end: ""
  },
  rust: {
    start: "//",
    end: ""
  },
  sass: {
    start: "//",
    end: ""
  },
  scala: {
    start: "//",
    end: ""
  },
  scss: {
    start: "//",
    end: ""
  },
  shellscript: {
    start: "#",
    end: ""
  },
  slim: {
    start: "/",
    end: ""
  },
  solidity: {
    start: "//",
    end: ""
  },
  sql: {
    start: "--",
    end: ""
  },
  stylus: {
    start: "//",
    end: ""
  },
  svelte: {
    start: "\x3c!--",
    end: "--\x3e"
  },
  swift: {
    start: "//",
    end: ""
  },
  terraform: {
    start: "#",
    end: ""
  },
  tex: {
    start: "%",
    end: ""
  },
  typescript: {
    start: "//",
    end: ""
  },
  typescriptreact: {
    start: "//",
    end: ""
  },
  vb: {
    start: "'",
    end: ""
  },
  verilog: {
    start: "//",
    end: ""
  },
  "vue-html": {
    start: "\x3c!--",
    end: "--\x3e"
  },
  vue: {
    start: "//",
    end: ""
  },
  xml: {
    start: "\x3c!--",
    end: "--\x3e"
  },
  xsl: {
    start: "\x3c!--",
    end: "--\x3e"
  },
  yaml: {
    start: "#",
    end: ""
  }
};
const n = ["php", "plaintext"];
const r = {
  html: "<!DOCTYPE html>",
  python: "#!/usr/bin/env python3",
  ruby: "#!/usr/bin/env ruby",
  shellscript: "#!/bin/sh",
  yaml: "# YAML data"
};
function hasLanguageMarker({
  source: e
}) {
  return e.startsWith("#!") || e.startsWith("<!DOCTYPE");
}
function comment(e, n) {
  const r = exports.languageCommentMarkers[n];
  if (r) {
    const t = "" == r.end ? "" : " " + r.end;
    return `${r.start} ${e}${t}`;
  }
  return "";
}
exports.hasLanguageMarker = hasLanguageMarker;
exports.comment = comment;
exports.commentBlockAsSingles = function (e, n) {
  if (!exports.languageCommentMarkers[n] || "" === e) return "";
  const r = e.endsWith("\n");
  const i = (r ? e.slice(0, -1) : e).split("\n").map(e => comment(e, n)).join("\n");
  return r ? i + "\n" : i;
};
exports.getLanguageMarker = function (e) {
  const {
    languageId: t
  } = e;
  return -1 !== n.indexOf(t) || hasLanguageMarker(e) ? "" : t in r ? r[t] : comment(`Language: ${t}`, t);
};
exports.getPathMarker = function (e) {
  return e.relativePath ? comment(`Path: ${e.relativePath}`, e.languageId) : "";
};