Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.register = void 0;
const r = require(66277);
const i = require(27995);
const vscode = require("vscode");
let s;
let a = new Set();
exports.register = function () {
  if (s) return s;
  const e = i.proxyMap();
  function t(t) {
    return e.get(t) ?? new Map();
  }
  function n() {
    return r.snapshot(e);
  }
  s = {
    listen: function (t) {
      const n = r.subscribe(e, t, !0);
      return vscode.Disposable.from({
        dispose: n
      });
    },
    getSnapshot: n,
    getEditorRefSnapshot: function (e = "") {
      return n().get(e) ?? new Map();
    },
    getEditorRefSize: function (e = "") {
      return (n().get(e) ?? new Map()).size;
    },
    addMatch: function (n, r) {
      if (a.has(r.completion.uuid)) return;
      let o = e.get(n);
      if (o) {
        o = function (n) {
          if (e.has(n)) return;
          const r = i.proxyMap();
          e.set(n, r);
          return t(n);
        }(n);
      }
      a.add(r.completion.uuid);
      o.set(r.completion.uuid, {
        ...r,
        deletedAt: null
      });
    },
    updateMatch: function (t, n) {
      if (!a.has(n.completion.uuid)) return;
      const r = e.get(t);
      if (!r) return;
      const i = r.get(n.completion.uuid);
      if (i) {
        r.set(n.completion.uuid, {
          ...n,
          deletedAt: i.deletedAt
        });
      }
    },
    removeMatch: function (e, n) {
      const r = t(e);
      a.delete(n);
      r.delete(n);
    },
    removeEditorRef: function (n) {
      const r = t(n);
      for (const e of r.values()) a.delete(e.completion.uuid);
      e.delete(n);
    },
    markForRemoval: function (n, r) {
      const i = t(n);
      const o = i.get(r);
      if (o && !o.deletedAt) {
        i.set(r, {
          ...o,
          deletedAt: Date.now()
        });
        e.set(n, i);
      }
    },
    unmarkForRemoval: function (e, n) {
      const r = t(e);
      const i = r.get(n);
      if (i) {
        r.set(n, {
          ...i,
          deletedAt: null
        });
      }
    },
    removeMatches: function (n, r) {
      let i = [];
      n.forEach(n => {
        if (!e.has(n)) return;
        const o = t(n);
        const s = [];
        const a = [];
        for (const [e, t] of o.entries()) if (r(t)) {
          s.push([e, t]);
        } else {
          a.push([e, t]);
        }
        if (s.length) {
          i = i.concat(a.map(([e]) => e));
          e.set(n, new Map(a));
        }
      });
      if (i.length) {
        a = new Set(...a, ...i);
      }
    }
  };
  return s;
};