function t(e) {
  return Array.isArray(e) ? e : [e];
}
const n = /^\s+$/;
const r = /(?:[^\\]|^)\\$/;
const i = /^\\!/;
const o = /^\\#/;
const s = /\r?\n/g;
const a = /^\.*\/|^\.+$/;
let c = "node-ignore";
if ("undefined" != typeof Symbol) {
  c = Symbol.for("node-ignore");
}
const l = c;
const u = /([0-z])-([0-z])/g;
const p = () => !1;
const d = [[/\\?\s+$/, e => 0 === e.indexOf("\\") ? " " : ""], [/\\\s/g, () => " "], [/[\\$.|*+(){^]/g, e => `\\${e}`], [/(?!\\)\?/g, () => "[^/]"], [/^\//, () => "^"], [/\//g, () => "\\/"], [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"], [/^(?=[^^])/, function () {
  return /\/(?!$)/.test(this) ? "^" : "(?:^|\\/)";
}], [/\\\/\\\*\\\*(?=\\\/|$)/g, (e, t, n) => t + 6 < n.length ? "(?:\\/[^\\/]+)*" : "\\/.+"], [/(^|[^\\]+)(\\\*)+(?=.+)/g, (e, t, n) => t + n.replace(/\\\*/g, "[^\\/]*")], [/\\\\\\(?=[$.|*+(){^])/g, () => "\\"], [/\\\\/g, () => "\\"], [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (e, t, n, r, i) => "\\" === t ? `\\[${n}${(e => {
  const {
    length: t
  } = e;
  return e.slice(0, t - t % 2);
})(r)}${i}` : "]" === i && r.length % 2 == 0 ? `[${(e => e.replace(u, (e, t, n) => t.charCodeAt(0) <= n.charCodeAt(0) ? e : ""))(n)}${r}]` : "[]"], [/(?:[^*])$/, e => /\/$/.test(e) ? `${e}$` : `${e}(?=$|\\/$)`], [/(\^|\\\/)?\\\*$/, (e, t) => (t ? `${t}[^/]+` : "[^/]*") + "(?=$|\\/$)"]];
const h = Object.create(null);
const f = e => "string" == typeof e;
class m {
  constructor(e, t, n, r) {
    this.origin = e;
    this.pattern = t;
    this.negative = n;
    this.regex = r;
  }
}
const g = (e, t) => {
  throw new t(e);
};
const y = (e, t, n) => f(e) ? e ? !y.isNotRelative(e) || n(`path should be a \`path.relative()\`d string, but got "${t}"`, RangeError) : n("path must not be empty", TypeError) : n(`path must be a string, but got \`${t}\``, TypeError);
const _ = e => a.test(e);
y.isNotRelative = _;
y.convert = e => e;
class v {
  constructor({
    ignorecase: e = !0,
    ignoreCase: t = e,
    allowRelativePaths: n = !1
  } = {}) {
    var r;
    r = l;
    Object.defineProperty(this, r, {
      value: true
    });
    this._rules = [];
    this._ignoreCase = t;
    this._allowRelativePaths = n;
    this._initCache();
  }
  _initCache() {
    this._ignoreCache = Object.create(null);
    this._testCache = Object.create(null);
  }
  _addPattern(e) {
    if (e && e[l]) {
      this._rules = this._rules.concat(e._rules);
      return void (this._added = !0);
    }
    if ((e => e && f(e) && !n.test(e) && !r.test(e) && 0 !== e.indexOf("#"))(e)) {
      const t = ((e, t) => {
        const n = e;
        let r = !1;
        if (0 === e.indexOf("!")) {
          r = !0;
          e = e.substr(1);
        }
        const s = ((e, t) => {
          let n = h[e];
          if (n) {
            n = d.reduce((t, n) => t.replace(n[0], n[1].bind(e)), e);
            h[e] = n;
          }
          return t ? new RegExp(n, "i") : new RegExp(n);
        })(e = e.replace(i, "!").replace(o, "#"), t);
        return new m(n, e, r, s);
      })(e, this._ignoreCase);
      this._added = !0;
      this._rules.push(t);
    }
  }
  add(e) {
    this._added = !1;
    t(f(e) ? (e => e.split(s))(e) : e).forEach(this._addPattern, this);
    if (this._added) {
      this._initCache();
    }
    return this;
  }
  addPattern(e) {
    return this.add(e);
  }
  _testOne(e, t) {
    let n = !1;
    let r = !1;
    this._rules.forEach(i => {
      const {
        negative: o
      } = i;
      if (r === o && n !== r || o && !n && !r && !t) {
        if (i.regex.test(e)) {
          n = !o;
          r = o;
        }
      }
    });
    return {
      ignored: n,
      unignored: r
    };
  }
  _test(e, t, n, r) {
    const i = e && y.convert(e);
    y(i, e, this._allowRelativePaths ? p : g);
    return this._t(i, t, n, r);
  }
  _t(e, t, n, r) {
    if (e in t) return t[e];
    if (r) {
      r = e.split("/");
    }
    r.pop();
    if (!r.length) return t[e] = this._testOne(e, n);
    const i = this._t(r.join("/") + "/", t, n, r);
    return t[e] = i.ignored ? i : this._testOne(e, n);
  }
  ignores(e) {
    return this._test(e, this._ignoreCache, !1).ignored;
  }
  createFilter() {
    return e => !this.ignores(e);
  }
  filter(e) {
    return t(e).filter(this.createFilter());
  }
  test(e) {
    return this._test(e, this._testCache, !0);
  }
}
const b = e => new v(e);
b.isPathValid = e => y(e && y.convert(e), e, p);
b.default = b;
module.exports = b;
if ("undefined" != typeof process && (process.env && process.env.IGNORE_TEST_WIN32 || "win32" === process.platform)) {
  const e = e => /^\\\\\?\\/.test(e) || /["<>|\u0000-\u001F]+/u.test(e) ? e : e.replace(/\\/g, "/");
  y.convert = e;
  const t = /^[a-z]:\//i;
  y.isNotRelative = e => t.test(e) || _(e);
}