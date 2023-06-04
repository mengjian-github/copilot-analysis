(() => {
  var __webpack_modules__ = {
      696: (e, t) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.convertChangesToDMP = function (e) {
            for (var t, n, r = [], i = 0; i < e.length; i++)
              (n = (t = e[i]).added ? 1 : t.removed ? -1 : 0),
                r.push([n, t.value]);
            return r;
          });
      },
      5826: (e, t) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.convertChangesToXML = function (e) {
            for (var t = [], n = 0; n < e.length; n++) {
              var r = e[n];
              r.added ? t.push("<ins>") : r.removed && t.push("<del>"),
                t.push(
                  r.value
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                ),
                r.added ? t.push("</ins>") : r.removed && t.push("</del>");
            }
            return t.join("");
          });
      },
      6976: (e, t, n) => {
        "use strict";

        var r;
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.diffArrays = function (e, t, n) {
            return i.diff(e, t, n);
          }),
          (t.arrayDiff = void 0);
        var i = new (
          (r = n(5913)) && r.__esModule
            ? r
            : {
                default: r,
              }
        ).default();
        (t.arrayDiff = i),
          (i.tokenize = function (e) {
            return e.slice();
          }),
          (i.join = i.removeEmpty =
            function (e) {
              return e;
            });
      },
      5913: (e, t) => {
        "use strict";

        function n() {}
        function r(e, t, n, r, i) {
          for (var o = 0, s = t.length, a = 0, c = 0; o < s; o++) {
            var l = t[o];
            if (l.removed) {
              if (
                ((l.value = e.join(r.slice(c, c + l.count))),
                (c += l.count),
                o && t[o - 1].added)
              ) {
                var u = t[o - 1];
                (t[o - 1] = t[o]), (t[o] = u);
              }
            } else {
              if (!l.added && i) {
                var p = n.slice(a, a + l.count);
                (p = p.map(function (e, t) {
                  var n = r[c + t];
                  return n.length > e.length ? n : e;
                })),
                  (l.value = e.join(p));
              } else l.value = e.join(n.slice(a, a + l.count));
              (a += l.count), l.added || (c += l.count);
            }
          }
          var d = t[s - 1];
          return (
            s > 1 &&
              "string" == typeof d.value &&
              (d.added || d.removed) &&
              e.equals("", d.value) &&
              ((t[s - 2].value += d.value), t.pop()),
            t
          );
        }
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = n),
          (n.prototype = {
            diff: function (e, t) {
              var n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : {},
                i = n.callback;
              "function" == typeof n && ((i = n), (n = {})), (this.options = n);
              var o = this;
              function s(e) {
                return i
                  ? (setTimeout(function () {
                      i(void 0, e);
                    }, 0),
                    !0)
                  : e;
              }
              (e = this.castInput(e)),
                (t = this.castInput(t)),
                (e = this.removeEmpty(this.tokenize(e)));
              var a = (t = this.removeEmpty(this.tokenize(t))).length,
                c = e.length,
                l = 1,
                u = a + c;
              n.maxEditLength && (u = Math.min(u, n.maxEditLength));
              var p = [
                  {
                    newPos: -1,
                    components: [],
                  },
                ],
                d = this.extractCommon(p[0], t, e, 0);
              if (p[0].newPos + 1 >= a && d + 1 >= c)
                return s([
                  {
                    value: this.join(t),
                    count: t.length,
                  },
                ]);
              function h() {
                for (var n = -1 * l; n <= l; n += 2) {
                  var i = void 0,
                    u = p[n - 1],
                    d = p[n + 1],
                    h = (d ? d.newPos : 0) - n;
                  u && (p[n - 1] = void 0);
                  var f = u && u.newPos + 1 < a,
                    m = d && 0 <= h && h < c;
                  if (f || m) {
                    if (
                      (!f || (m && u.newPos < d.newPos)
                        ? ((i = {
                            newPos: (g = d).newPos,
                            components: g.components.slice(0),
                          }),
                          o.pushComponent(i.components, void 0, !0))
                        : ((i = u).newPos++,
                          o.pushComponent(i.components, !0, void 0)),
                      (h = o.extractCommon(i, t, e, n)),
                      i.newPos + 1 >= a && h + 1 >= c)
                    )
                      return s(r(o, i.components, t, e, o.useLongestToken));
                    p[n] = i;
                  } else p[n] = void 0;
                }
                var g;
                l++;
              }
              if (i)
                !(function e() {
                  setTimeout(function () {
                    if (l > u) return i();
                    h() || e();
                  }, 0);
                })();
              else
                for (; l <= u; ) {
                  var f = h();
                  if (f) return f;
                }
            },
            pushComponent: function (e, t, n) {
              var r = e[e.length - 1];
              r && r.added === t && r.removed === n
                ? (e[e.length - 1] = {
                    count: r.count + 1,
                    added: t,
                    removed: n,
                  })
                : e.push({
                    count: 1,
                    added: t,
                    removed: n,
                  });
            },
            extractCommon: function (e, t, n, r) {
              for (
                var i = t.length, o = n.length, s = e.newPos, a = s - r, c = 0;
                s + 1 < i && a + 1 < o && this.equals(t[s + 1], n[a + 1]);

              )
                s++, a++, c++;
              return (
                c &&
                  e.components.push({
                    count: c,
                  }),
                (e.newPos = s),
                a
              );
            },
            equals: function (e, t) {
              return this.options.comparator
                ? this.options.comparator(e, t)
                : e === t ||
                    (this.options.ignoreCase &&
                      e.toLowerCase() === t.toLowerCase());
            },
            removeEmpty: function (e) {
              for (var t = [], n = 0; n < e.length; n++) e[n] && t.push(e[n]);
              return t;
            },
            castInput: function (e) {
              return e;
            },
            tokenize: function (e) {
              return e.split("");
            },
            join: function (e) {
              return e.join("");
            },
          });
      },
      7630: (e, t, n) => {
        "use strict";

        var r;
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.diffChars = function (e, t, n) {
            return i.diff(e, t, n);
          }),
          (t.characterDiff = void 0);
        var i = new (
          (r = n(5913)) && r.__esModule
            ? r
            : {
                default: r,
              }
        ).default();
        t.characterDiff = i;
      },
      4852: (e, t, n) => {
        "use strict";

        var r;
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.diffCss = function (e, t, n) {
            return i.diff(e, t, n);
          }),
          (t.cssDiff = void 0);
        var i = new (
          (r = n(5913)) && r.__esModule
            ? r
            : {
                default: r,
              }
        ).default();
        (t.cssDiff = i),
          (i.tokenize = function (e) {
            return e.split(/([{}:;,]|\s+)/);
          });
      },
      4276: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.diffJson = function (e, t, n) {
            return c.diff(e, t, n);
          }),
          (t.canonicalize = l),
          (t.jsonDiff = void 0);
        var r,
          i =
            (r = n(5913)) && r.__esModule
              ? r
              : {
                  default: r,
                },
          o = n(8187);
        function s(e) {
          return (
            (s =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  }),
            s(e)
          );
        }
        var a = Object.prototype.toString,
          c = new i.default();
        function l(e, t, n, r, i) {
          var o, c;
          for (
            t = t || [], n = n || [], r && (e = r(i, e)), o = 0;
            o < t.length;
            o += 1
          )
            if (t[o] === e) return n[o];
          if ("[object Array]" === a.call(e)) {
            for (
              t.push(e), c = new Array(e.length), n.push(c), o = 0;
              o < e.length;
              o += 1
            )
              c[o] = l(e[o], t, n, r, i);
            return t.pop(), n.pop(), c;
          }
          if (
            (e && e.toJSON && (e = e.toJSON()), "object" === s(e) && null !== e)
          ) {
            t.push(e), (c = {}), n.push(c);
            var u,
              p = [];
            for (u in e) e.hasOwnProperty(u) && p.push(u);
            for (p.sort(), o = 0; o < p.length; o += 1)
              c[(u = p[o])] = l(e[u], t, n, r, u);
            t.pop(), n.pop();
          } else c = e;
          return c;
        }
        (t.jsonDiff = c),
          (c.useLongestToken = !0),
          (c.tokenize = o.lineDiff.tokenize),
          (c.castInput = function (e) {
            var t = this.options,
              n = t.undefinedReplacement,
              r = t.stringifyReplacer,
              i =
                void 0 === r
                  ? function (e, t) {
                      return void 0 === t ? n : t;
                    }
                  : r;
            return "string" == typeof e
              ? e
              : JSON.stringify(l(e, null, null, i), i, "  ");
          }),
          (c.equals = function (e, t) {
            return i.default.prototype.equals.call(
              c,
              e.replace(/,([\r\n])/g, "$1"),
              t.replace(/,([\r\n])/g, "$1")
            );
          });
      },
      8187: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.diffLines = function (e, t, n) {
            return s.diff(e, t, n);
          }),
          (t.diffTrimmedLines = function (e, t, n) {
            var r = (0, o.generateOptions)(n, {
              ignoreWhitespace: !0,
            });
            return s.diff(e, t, r);
          }),
          (t.lineDiff = void 0);
        var r,
          i =
            (r = n(5913)) && r.__esModule
              ? r
              : {
                  default: r,
                },
          o = n(8009),
          s = new i.default();
        (t.lineDiff = s),
          (s.tokenize = function (e) {
            var t = [],
              n = e.split(/(\n|\r\n)/);
            n[n.length - 1] || n.pop();
            for (var r = 0; r < n.length; r++) {
              var i = n[r];
              r % 2 && !this.options.newlineIsToken
                ? (t[t.length - 1] += i)
                : (this.options.ignoreWhitespace && (i = i.trim()), t.push(i));
            }
            return t;
          });
      },
      4146: (e, t, n) => {
        "use strict";

        var r;
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.diffSentences = function (e, t, n) {
            return i.diff(e, t, n);
          }),
          (t.sentenceDiff = void 0);
        var i = new (
          (r = n(5913)) && r.__esModule
            ? r
            : {
                default: r,
              }
        ).default();
        (t.sentenceDiff = i),
          (i.tokenize = function (e) {
            return e.split(/(\S.+?[.!?])(?=\s+|$)/);
          });
      },
      5303: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.diffWords = function (e, t, n) {
            return (
              (n = (0, o.generateOptions)(n, {
                ignoreWhitespace: !0,
              })),
              c.diff(e, t, n)
            );
          }),
          (t.diffWordsWithSpace = function (e, t, n) {
            return c.diff(e, t, n);
          }),
          (t.wordDiff = void 0);
        var r,
          i =
            (r = n(5913)) && r.__esModule
              ? r
              : {
                  default: r,
                },
          o = n(8009),
          s = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,
          a = /\S/,
          c = new i.default();
        (t.wordDiff = c),
          (c.equals = function (e, t) {
            return (
              this.options.ignoreCase &&
                ((e = e.toLowerCase()), (t = t.toLowerCase())),
              e === t ||
                (this.options.ignoreWhitespace && !a.test(e) && !a.test(t))
            );
          }),
          (c.tokenize = function (e) {
            for (
              var t = e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/), n = 0;
              n < t.length - 1;
              n++
            )
              !t[n + 1] &&
                t[n + 2] &&
                s.test(t[n]) &&
                s.test(t[n + 2]) &&
                ((t[n] += t[n + 2]), t.splice(n + 1, 2), n--);
            return t;
          });
      },
      9479: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          Object.defineProperty(t, "Diff", {
            enumerable: !0,
            get: function () {
              return i.default;
            },
          }),
          Object.defineProperty(t, "diffChars", {
            enumerable: !0,
            get: function () {
              return o.diffChars;
            },
          }),
          Object.defineProperty(t, "diffWords", {
            enumerable: !0,
            get: function () {
              return s.diffWords;
            },
          }),
          Object.defineProperty(t, "diffWordsWithSpace", {
            enumerable: !0,
            get: function () {
              return s.diffWordsWithSpace;
            },
          }),
          Object.defineProperty(t, "diffLines", {
            enumerable: !0,
            get: function () {
              return a.diffLines;
            },
          }),
          Object.defineProperty(t, "diffTrimmedLines", {
            enumerable: !0,
            get: function () {
              return a.diffTrimmedLines;
            },
          }),
          Object.defineProperty(t, "diffSentences", {
            enumerable: !0,
            get: function () {
              return c.diffSentences;
            },
          }),
          Object.defineProperty(t, "diffCss", {
            enumerable: !0,
            get: function () {
              return l.diffCss;
            },
          }),
          Object.defineProperty(t, "diffJson", {
            enumerable: !0,
            get: function () {
              return u.diffJson;
            },
          }),
          Object.defineProperty(t, "canonicalize", {
            enumerable: !0,
            get: function () {
              return u.canonicalize;
            },
          }),
          Object.defineProperty(t, "diffArrays", {
            enumerable: !0,
            get: function () {
              return p.diffArrays;
            },
          }),
          Object.defineProperty(t, "applyPatch", {
            enumerable: !0,
            get: function () {
              return d.applyPatch;
            },
          }),
          Object.defineProperty(t, "applyPatches", {
            enumerable: !0,
            get: function () {
              return d.applyPatches;
            },
          }),
          Object.defineProperty(t, "parsePatch", {
            enumerable: !0,
            get: function () {
              return h.parsePatch;
            },
          }),
          Object.defineProperty(t, "merge", {
            enumerable: !0,
            get: function () {
              return f.merge;
            },
          }),
          Object.defineProperty(t, "structuredPatch", {
            enumerable: !0,
            get: function () {
              return m.structuredPatch;
            },
          }),
          Object.defineProperty(t, "createTwoFilesPatch", {
            enumerable: !0,
            get: function () {
              return m.createTwoFilesPatch;
            },
          }),
          Object.defineProperty(t, "createPatch", {
            enumerable: !0,
            get: function () {
              return m.createPatch;
            },
          }),
          Object.defineProperty(t, "convertChangesToDMP", {
            enumerable: !0,
            get: function () {
              return g.convertChangesToDMP;
            },
          }),
          Object.defineProperty(t, "convertChangesToXML", {
            enumerable: !0,
            get: function () {
              return y.convertChangesToXML;
            },
          });
        var r,
          i =
            (r = n(5913)) && r.__esModule
              ? r
              : {
                  default: r,
                },
          o = n(7630),
          s = n(5303),
          a = n(8187),
          c = n(4146),
          l = n(4852),
          u = n(4276),
          p = n(6976),
          d = n(3690),
          h = n(3719),
          f = n(3051),
          m = n(1286),
          g = n(696),
          y = n(5826);
      },
      3690: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.applyPatch = s),
          (t.applyPatches = function (e, t) {
            "string" == typeof e && (e = (0, i.parsePatch)(e));
            var n = 0;
            !(function r() {
              var i = e[n++];
              if (!i) return t.complete();
              t.loadFile(i, function (e, n) {
                if (e) return t.complete(e);
                var o = s(n, i, t);
                t.patched(i, o, function (e) {
                  if (e) return t.complete(e);
                  r();
                });
              });
            })();
          });
        var r,
          i = n(3719),
          o =
            (r = n(8169)) && r.__esModule
              ? r
              : {
                  default: r,
                };
        function s(e, t) {
          var n =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          if (
            ("string" == typeof t && (t = (0, i.parsePatch)(t)),
            Array.isArray(t))
          ) {
            if (t.length > 1)
              throw new Error("applyPatch only works with a single input.");
            t = t[0];
          }
          var r,
            s,
            a = e.split(/\r\n|[\n\v\f\r\x85]/),
            c = e.match(/\r\n|[\n\v\f\r\x85]/g) || [],
            l = t.hunks,
            u =
              n.compareLine ||
              function (e, t, n, r) {
                return t === r;
              },
            p = 0,
            d = n.fuzzFactor || 0,
            h = 0,
            f = 0;
          function m(e, t) {
            for (var n = 0; n < e.lines.length; n++) {
              var r = e.lines[n],
                i = r.length > 0 ? r[0] : " ",
                o = r.length > 0 ? r.substr(1) : r;
              if (" " === i || "-" === i) {
                if (!u(t + 1, a[t], i, o) && ++p > d) return !1;
                t++;
              }
            }
            return !0;
          }
          for (var g = 0; g < l.length; g++) {
            for (
              var y = l[g],
                _ = a.length - y.oldLines,
                v = 0,
                b = f + y.oldStart - 1,
                E = (0, o.default)(b, h, _);
              void 0 !== v;
              v = E()
            )
              if (m(y, b + v)) {
                y.offset = f += v;
                break;
              }
            if (void 0 === v) return !1;
            h = y.offset + y.oldStart + y.oldLines;
          }
          for (var w = 0, T = 0; T < l.length; T++) {
            var S = l[T],
              x = S.oldStart + S.offset + w - 1;
            w += S.newLines - S.oldLines;
            for (var C = 0; C < S.lines.length; C++) {
              var I = S.lines[C],
                A = I.length > 0 ? I[0] : " ",
                k = I.length > 0 ? I.substr(1) : I,
                P = S.linedelimiters[C];
              if (" " === A) x++;
              else if ("-" === A) a.splice(x, 1), c.splice(x, 1);
              else if ("+" === A) a.splice(x, 0, k), c.splice(x, 0, P), x++;
              else if ("\\" === A) {
                var N = S.lines[C - 1] ? S.lines[C - 1][0] : null;
                "+" === N ? (r = !0) : "-" === N && (s = !0);
              }
            }
          }
          if (r) for (; !a[a.length - 1]; ) a.pop(), c.pop();
          else s && (a.push(""), c.push("\n"));
          for (var O = 0; O < a.length - 1; O++) a[O] = a[O] + c[O];
          return a.join("");
        }
      },
      1286: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.structuredPatch = s),
          (t.formatPatch = a),
          (t.createTwoFilesPatch = c),
          (t.createPatch = function (e, t, n, r, i, o) {
            return c(e, e, t, n, r, i, o);
          });
        var r = n(8187);
        function i(e) {
          return (
            (function (e) {
              if (Array.isArray(e)) return o(e);
            })(e) ||
            (function (e) {
              if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                return Array.from(e);
            })(e) ||
            (function (e, t) {
              if (e) {
                if ("string" == typeof e) return o(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return (
                  "Object" === n && e.constructor && (n = e.constructor.name),
                  "Map" === n || "Set" === n
                    ? Array.from(e)
                    : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? o(e, t)
                    : void 0
                );
              }
            })(e) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
              );
            })()
          );
        }
        function o(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
          return r;
        }
        function s(e, t, n, o, s, a, c) {
          c || (c = {}), void 0 === c.context && (c.context = 4);
          var l = (0, r.diffLines)(n, o, c);
          if (l) {
            l.push({
              value: "",
              lines: [],
            });
            for (
              var u = [],
                p = 0,
                d = 0,
                h = [],
                f = 1,
                m = 1,
                g = function (e) {
                  var t = l[e],
                    r = t.lines || t.value.replace(/\n$/, "").split("\n");
                  if (((t.lines = r), t.added || t.removed)) {
                    var s;
                    if (!p) {
                      var a = l[e - 1];
                      (p = f),
                        (d = m),
                        a &&
                          ((h =
                            c.context > 0 ? _(a.lines.slice(-c.context)) : []),
                          (p -= h.length),
                          (d -= h.length));
                    }
                    (s = h).push.apply(
                      s,
                      i(
                        r.map(function (e) {
                          return (t.added ? "+" : "-") + e;
                        })
                      )
                    ),
                      t.added ? (m += r.length) : (f += r.length);
                  } else {
                    if (p)
                      if (r.length <= 2 * c.context && e < l.length - 2) {
                        var g;
                        (g = h).push.apply(g, i(_(r)));
                      } else {
                        var y,
                          v = Math.min(r.length, c.context);
                        (y = h).push.apply(y, i(_(r.slice(0, v))));
                        var b = {
                          oldStart: p,
                          oldLines: f - p + v,
                          newStart: d,
                          newLines: m - d + v,
                          lines: h,
                        };
                        if (e >= l.length - 2 && r.length <= c.context) {
                          var E = /\n$/.test(n),
                            w = /\n$/.test(o),
                            T = 0 == r.length && h.length > b.oldLines;
                          !E &&
                            T &&
                            n.length > 0 &&
                            h.splice(
                              b.oldLines,
                              0,
                              "\\ No newline at end of file"
                            ),
                            ((E || T) && w) ||
                              h.push("\\ No newline at end of file");
                        }
                        u.push(b), (p = 0), (d = 0), (h = []);
                      }
                    (f += r.length), (m += r.length);
                  }
                },
                y = 0;
              y < l.length;
              y++
            )
              g(y);
            return {
              oldFileName: e,
              newFileName: t,
              oldHeader: s,
              newHeader: a,
              hunks: u,
            };
          }
          function _(e) {
            return e.map(function (e) {
              return " " + e;
            });
          }
        }
        function a(e) {
          var t = [];
          e.oldFileName == e.newFileName && t.push("Index: " + e.oldFileName),
            t.push(
              "==================================================================="
            ),
            t.push(
              "--- " +
                e.oldFileName +
                (void 0 === e.oldHeader ? "" : "\t" + e.oldHeader)
            ),
            t.push(
              "+++ " +
                e.newFileName +
                (void 0 === e.newHeader ? "" : "\t" + e.newHeader)
            );
          for (var n = 0; n < e.hunks.length; n++) {
            var r = e.hunks[n];
            0 === r.oldLines && (r.oldStart -= 1),
              0 === r.newLines && (r.newStart -= 1),
              t.push(
                "@@ -" +
                  r.oldStart +
                  "," +
                  r.oldLines +
                  " +" +
                  r.newStart +
                  "," +
                  r.newLines +
                  " @@"
              ),
              t.push.apply(t, r.lines);
          }
          return t.join("\n") + "\n";
        }
        function c(e, t, n, r, i, o, c) {
          return a(s(e, t, n, r, i, o, c));
        }
      },
      3051: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.calcLineCount = c),
          (t.merge = function (e, t, n) {
            (e = l(e, n)), (t = l(t, n));
            var r = {};
            (e.index || t.index) && (r.index = e.index || t.index),
              (e.newFileName || t.newFileName) &&
                (u(e)
                  ? u(t)
                    ? ((r.oldFileName = p(r, e.oldFileName, t.oldFileName)),
                      (r.newFileName = p(r, e.newFileName, t.newFileName)),
                      (r.oldHeader = p(r, e.oldHeader, t.oldHeader)),
                      (r.newHeader = p(r, e.newHeader, t.newHeader)))
                    : ((r.oldFileName = e.oldFileName),
                      (r.newFileName = e.newFileName),
                      (r.oldHeader = e.oldHeader),
                      (r.newHeader = e.newHeader))
                  : ((r.oldFileName = t.oldFileName || e.oldFileName),
                    (r.newFileName = t.newFileName || e.newFileName),
                    (r.oldHeader = t.oldHeader || e.oldHeader),
                    (r.newHeader = t.newHeader || e.newHeader))),
              (r.hunks = []);
            for (
              var i = 0, o = 0, s = 0, a = 0;
              i < e.hunks.length || o < t.hunks.length;

            ) {
              var c = e.hunks[i] || {
                  oldStart: 1 / 0,
                },
                m = t.hunks[o] || {
                  oldStart: 1 / 0,
                };
              if (d(c, m))
                r.hunks.push(h(c, s)), i++, (a += c.newLines - c.oldLines);
              else if (d(m, c))
                r.hunks.push(h(m, a)), o++, (s += m.newLines - m.oldLines);
              else {
                var g = {
                  oldStart: Math.min(c.oldStart, m.oldStart),
                  oldLines: 0,
                  newStart: Math.min(c.newStart + s, m.oldStart + a),
                  newLines: 0,
                  lines: [],
                };
                f(g, c.oldStart, c.lines, m.oldStart, m.lines),
                  o++,
                  i++,
                  r.hunks.push(g);
              }
            }
            return r;
          });
        var r = n(1286),
          i = n(3719),
          o = n(7780);
        function s(e) {
          return (
            (function (e) {
              if (Array.isArray(e)) return a(e);
            })(e) ||
            (function (e) {
              if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                return Array.from(e);
            })(e) ||
            (function (e, t) {
              if (e) {
                if ("string" == typeof e) return a(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return (
                  "Object" === n && e.constructor && (n = e.constructor.name),
                  "Map" === n || "Set" === n
                    ? Array.from(e)
                    : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? a(e, t)
                    : void 0
                );
              }
            })(e) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
              );
            })()
          );
        }
        function a(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
          return r;
        }
        function c(e) {
          var t = T(e.lines),
            n = t.oldLines,
            r = t.newLines;
          void 0 !== n ? (e.oldLines = n) : delete e.oldLines,
            void 0 !== r ? (e.newLines = r) : delete e.newLines;
        }
        function l(e, t) {
          if ("string" == typeof e) {
            if (/^@@/m.test(e) || /^Index:/m.test(e))
              return (0, i.parsePatch)(e)[0];
            if (!t)
              throw new Error(
                "Must provide a base reference or pass in a patch"
              );
            return (0, r.structuredPatch)(void 0, void 0, t, e);
          }
          return e;
        }
        function u(e) {
          return e.newFileName && e.newFileName !== e.oldFileName;
        }
        function p(e, t, n) {
          return t === n
            ? t
            : ((e.conflict = !0),
              {
                mine: t,
                theirs: n,
              });
        }
        function d(e, t) {
          return (
            e.oldStart < t.oldStart && e.oldStart + e.oldLines < t.oldStart
          );
        }
        function h(e, t) {
          return {
            oldStart: e.oldStart,
            oldLines: e.oldLines,
            newStart: e.newStart + t,
            newLines: e.newLines,
            lines: e.lines,
          };
        }
        function f(e, t, n, r, i) {
          var o = {
              offset: t,
              lines: n,
              index: 0,
            },
            a = {
              offset: r,
              lines: i,
              index: 0,
            };
          for (
            _(e, o, a), _(e, a, o);
            o.index < o.lines.length && a.index < a.lines.length;

          ) {
            var l = o.lines[o.index],
              u = a.lines[a.index];
            if (
              ("-" !== l[0] && "+" !== l[0]) ||
              ("-" !== u[0] && "+" !== u[0])
            ) {
              if ("+" === l[0] && " " === u[0]) {
                var p;
                (p = e.lines).push.apply(p, s(b(o)));
              } else if ("+" === u[0] && " " === l[0]) {
                var d;
                (d = e.lines).push.apply(d, s(b(a)));
              } else
                "-" === l[0] && " " === u[0]
                  ? g(e, o, a)
                  : "-" === u[0] && " " === l[0]
                  ? g(e, a, o, !0)
                  : l === u
                  ? (e.lines.push(l), o.index++, a.index++)
                  : y(e, b(o), b(a));
            } else m(e, o, a);
          }
          v(e, o), v(e, a), c(e);
        }
        function m(e, t, n) {
          var r = b(t),
            i = b(n);
          if (E(r) && E(i)) {
            var a, c;
            if ((0, o.arrayStartsWith)(r, i) && w(n, r, r.length - i.length))
              return void (a = e.lines).push.apply(a, s(r));
            if ((0, o.arrayStartsWith)(i, r) && w(t, i, i.length - r.length))
              return void (c = e.lines).push.apply(c, s(i));
          } else if ((0, o.arrayEqual)(r, i)) {
            var l;
            return void (l = e.lines).push.apply(l, s(r));
          }
          y(e, r, i);
        }
        function g(e, t, n, r) {
          var i,
            o = b(t),
            a = (function (e, t) {
              for (
                var n = [], r = [], i = 0, o = !1, s = !1;
                i < t.length && e.index < e.lines.length;

              ) {
                var a = e.lines[e.index],
                  c = t[i];
                if ("+" === c[0]) break;
                if (((o = o || " " !== a[0]), r.push(c), i++, "+" === a[0]))
                  for (s = !0; "+" === a[0]; )
                    n.push(a), (a = e.lines[++e.index]);
                c.substr(1) === a.substr(1) ? (n.push(a), e.index++) : (s = !0);
              }
              if (("+" === (t[i] || "")[0] && o && (s = !0), s)) return n;
              for (; i < t.length; ) r.push(t[i++]);
              return {
                merged: r,
                changes: n,
              };
            })(n, o);
          a.merged
            ? (i = e.lines).push.apply(i, s(a.merged))
            : y(e, r ? a : o, r ? o : a);
        }
        function y(e, t, n) {
          (e.conflict = !0),
            e.lines.push({
              conflict: !0,
              mine: t,
              theirs: n,
            });
        }
        function _(e, t, n) {
          for (; t.offset < n.offset && t.index < t.lines.length; ) {
            var r = t.lines[t.index++];
            e.lines.push(r), t.offset++;
          }
        }
        function v(e, t) {
          for (; t.index < t.lines.length; ) {
            var n = t.lines[t.index++];
            e.lines.push(n);
          }
        }
        function b(e) {
          for (
            var t = [], n = e.lines[e.index][0];
            e.index < e.lines.length;

          ) {
            var r = e.lines[e.index];
            if (("-" === n && "+" === r[0] && (n = "+"), n !== r[0])) break;
            t.push(r), e.index++;
          }
          return t;
        }
        function E(e) {
          return e.reduce(function (e, t) {
            return e && "-" === t[0];
          }, !0);
        }
        function w(e, t, n) {
          for (var r = 0; r < n; r++) {
            var i = t[t.length - n + r].substr(1);
            if (e.lines[e.index + r] !== " " + i) return !1;
          }
          return (e.index += n), !0;
        }
        function T(e) {
          var t = 0,
            n = 0;
          return (
            e.forEach(function (e) {
              if ("string" != typeof e) {
                var r = T(e.mine),
                  i = T(e.theirs);
                void 0 !== t &&
                  (r.oldLines === i.oldLines
                    ? (t += r.oldLines)
                    : (t = void 0)),
                  void 0 !== n &&
                    (r.newLines === i.newLines
                      ? (n += r.newLines)
                      : (n = void 0));
              } else void 0 === n || ("+" !== e[0] && " " !== e[0]) || n++, void 0 === t || ("-" !== e[0] && " " !== e[0]) || t++;
            }),
            {
              oldLines: t,
              newLines: n,
            }
          );
        }
      },
      3719: (e, t) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.parsePatch = function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              n = e.split(/\r\n|[\n\v\f\r\x85]/),
              r = e.match(/\r\n|[\n\v\f\r\x85]/g) || [],
              i = [],
              o = 0;
            function s() {
              var e = {};
              for (i.push(e); o < n.length; ) {
                var r = n[o];
                if (/^(\-\-\-|\+\+\+|@@)\s/.test(r)) break;
                var s = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(r);
                s && (e.index = s[1]), o++;
              }
              for (a(e), a(e), e.hunks = []; o < n.length; ) {
                var l = n[o];
                if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(l)) break;
                if (/^@@/.test(l)) e.hunks.push(c());
                else {
                  if (l && t.strict)
                    throw new Error(
                      "Unknown line " + (o + 1) + " " + JSON.stringify(l)
                    );
                  o++;
                }
              }
            }
            function a(e) {
              var t = /^(---|\+\+\+)\s+(.*)$/.exec(n[o]);
              if (t) {
                var r = "---" === t[1] ? "old" : "new",
                  i = t[2].split("\t", 2),
                  s = i[0].replace(/\\\\/g, "\\");
                /^".*"$/.test(s) && (s = s.substr(1, s.length - 2)),
                  (e[r + "FileName"] = s),
                  (e[r + "Header"] = (i[1] || "").trim()),
                  o++;
              }
            }
            function c() {
              var e = o,
                i = n[o++].split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/),
                s = {
                  oldStart: +i[1],
                  oldLines: void 0 === i[2] ? 1 : +i[2],
                  newStart: +i[3],
                  newLines: void 0 === i[4] ? 1 : +i[4],
                  lines: [],
                  linedelimiters: [],
                };
              0 === s.oldLines && (s.oldStart += 1),
                0 === s.newLines && (s.newStart += 1);
              for (
                var a = 0, c = 0;
                o < n.length &&
                !(
                  0 === n[o].indexOf("--- ") &&
                  o + 2 < n.length &&
                  0 === n[o + 1].indexOf("+++ ") &&
                  0 === n[o + 2].indexOf("@@")
                );
                o++
              ) {
                var l = 0 == n[o].length && o != n.length - 1 ? " " : n[o][0];
                if ("+" !== l && "-" !== l && " " !== l && "\\" !== l) break;
                s.lines.push(n[o]),
                  s.linedelimiters.push(r[o] || "\n"),
                  "+" === l ? a++ : "-" === l ? c++ : " " === l && (a++, c++);
              }
              if (
                (a || 1 !== s.newLines || (s.newLines = 0),
                c || 1 !== s.oldLines || (s.oldLines = 0),
                t.strict)
              ) {
                if (a !== s.newLines)
                  throw new Error(
                    "Added line count did not match for hunk at line " + (e + 1)
                  );
                if (c !== s.oldLines)
                  throw new Error(
                    "Removed line count did not match for hunk at line " +
                      (e + 1)
                  );
              }
              return s;
            }
            for (; o < n.length; ) s();
            return i;
          });
      },
      7780: (e, t) => {
        "use strict";

        function n(e, t) {
          if (t.length > e.length) return !1;
          for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;
          return !0;
        }
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.arrayEqual = function (e, t) {
            return e.length === t.length && n(e, t);
          }),
          (t.arrayStartsWith = n);
      },
      8169: (e, t) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.default = function (e, t, n) {
            var r = !0,
              i = !1,
              o = !1,
              s = 1;
            return function a() {
              if (r && !o) {
                if ((i ? s++ : (r = !1), e + s <= n)) return s;
                o = !0;
              }
              if (!i) return o || (r = !0), t <= e - s ? -s++ : ((i = !0), a());
            };
          });
      },
      8009: (e, t) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.generateOptions = function (e, t) {
            if ("function" == typeof e) t.callback = e;
            else if (e) for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            return t;
          });
      },
      4288: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.ElidableText = void 0);
        const r = n(1145),
          i = n(3407),
          o = n(4121);
        class s {
          constructor(...e) {
            this.lines = [];
            const t = [];
            for (const n of e) {
              const e = Array.isArray(n) ? n[1] : 1,
                r = Array.isArray(n) ? n[0] : n;
              "string" == typeof r
                ? r
                    .split("\n")
                    .forEach((n) => t.push(new o.LineWithValueAndCost(n, e)))
                : r instanceof s
                ? t.push(...r.lines.map((t) => t.copy().adjustValue(e)))
                : "source" in r &&
                  "languageId" in r &&
                  t.push(
                    ...(0, i.elidableTextForSourceCode)(r).lines.map((t) =>
                      t.copy().adjustValue(e)
                    )
                  );
            }
            this.lines = t;
          }
          adjust(e) {
            this.lines.forEach((t) => t.adjustValue(e));
          }
          recost(e = (e) => (0, r.getTokenizer)().tokenLength(e + "\n")) {
            this.lines.forEach((t) => t.recost(e));
          }
          makePrompt(
            e,
            t = "[...]",
            n = !0,
            i = "removeLeastDesirable",
            s = (0, r.getTokenizer)()
          ) {
            return (function (e, t, n, r, i, s) {
              if (s.tokenLength(n + "\n") > t)
                throw new Error(
                  "maxTokens must be larger than the ellipsis length"
                );
              "removeLeastBangForBuck" === i &&
                e.forEach((e) => e.adjustValue(1 / e.cost));
              const a = e.reduce((e, t) => Math.max(e, t.value), 0) + 1,
                c = e.reduce((e, t) => Math.max(e, t.text.length), 0) + 1,
                l = n.trim();
              let u = e.reduce((e, t) => e + t.cost, 0),
                p = e.length + 1;
              for (; u > t && p-- >= -1; ) {
                const t = e.reduce((e, t) => (t.value < e.value ? t : e)),
                  i = e.indexOf(t),
                  p = e
                    .slice(0, i + 1)
                    .reverse()
                    .find((e) => "" !== e.text.trim()) ?? {
                    text: "",
                  },
                  d = r
                    ? Math.min(
                        p.text.match(/^\s*/)?.[0].length ?? 0,
                        e[i - 1]?.text.trim() === l
                          ? e[i - 1]?.text.match(/^\s*/)?.[0].length ?? 0
                          : c,
                        e[i + 1]?.text.trim() === l
                          ? e[i + 1]?.text.match(/^\s*/)?.[0].length ?? 0
                          : c
                      )
                    : 0,
                  h = " ".repeat(d) + n,
                  f = new o.LineWithValueAndCost(
                    h,
                    a,
                    s.tokenLength(h + "\n"),
                    "loose"
                  );
                e.splice(i, 1, f),
                  e[i + 1]?.text.trim() === l && e.splice(i + 1, 1),
                  e[i - 1]?.text.trim() === l && e.splice(i - 1, 1);
                const m = e.reduce((e, t) => e + t.cost, 0);
                m >= u && e.every((e) => e.value === a) && (r = !1), (u = m);
              }
              if (p < 0)
                throw new Error(
                  `Infinite loop in ElidableText.makePrompt: Defensive counter < 0 in ElidableText.makePrompt with end text:\n ${e
                    .map((e) => e.text)
                    .join("\n")}`
                );
              return e.map((e) => e.text).join("\n");
            })(
              this.lines.map((e) => e.copy()),
              e,
              t,
              n,
              i,
              s
            );
          }
        }
        t.ElidableText = s;
      },
      8975: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.elidableTextForDiff = void 0);
        const r = n(9479),
          i = n(2180),
          o = n(5533);
        t.elidableTextForDiff = function (e, t) {
          const n =
            "string" == typeof e
              ? "string" == typeof t
                ? void 0
                : t.languageId
              : "string" == typeof t || e.languageId === t.languageId
              ? e.languageId
              : void 0;
          (e = "string" == typeof e ? e : e.source),
            (t = "string" == typeof t ? t : t.source);
          const s = r.structuredPatch("", "", e, t),
            a = new Set(),
            c = new Set();
          for (const e of s.hunks) {
            for (let t = e.oldStart; t < e.oldStart + e.oldLines; t++) a.add(t);
            for (let t = e.newStart; t < e.newStart + e.newLines; t++) c.add(t);
          }
          const l = (0, i.mapLabels)(
              (0, i.flattenVirtual)((0, i.parseTree)(e, n)),
              () => !1
            ),
            u = (0, i.mapLabels)(
              (0, i.flattenVirtual)((0, i.parseTree)(t, n)),
              () => !1
            );
          return (
            (0, i.visitTree)(
              l,
              (e) => {
                ("line" !== e.type && "blank" !== e.type) ||
                  (a.has(e.lineNumber) && (e.label = !0));
              },
              "topDown"
            ),
            (0, i.visitTree)(
              u,
              (e) => {
                ("line" !== e.type && "blank" !== e.type) ||
                  (c.has(e.lineNumber) && (e.label = !0));
              },
              "topDown"
            ),
            [
              (0, o.fromTreeWithFocussedLines)(l),
              (0, o.fromTreeWithFocussedLines)(u),
            ]
          );
        };
      },
      5533: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.fromTreeWithValuedLines =
            t.fromTreeWithFocussedLines =
            t.DEFAULT_TREE_TRAVERSAL_CONFIG =
              void 0);
        const r = n(2180),
          i = n(4288);
        function o(e) {
          const t = (0, r.foldTree)(
            e,
            [],
            (e, t) => (
              ("line" !== e.type && "blank" !== e.type) ||
                t.push(
                  "line" === e.type
                    ? [(0, r.deparseLine)(e).trimEnd(), e.label ?? 0]
                    : ["", e.label ?? 0]
                ),
              t
            ),
            "topDown"
          );
          return new i.ElidableText(...t);
        }
        (t.DEFAULT_TREE_TRAVERSAL_CONFIG = {
          worthUp: 0.9,
          worthSibling: 0.88,
          worthDown: 0.8,
        }),
          (t.fromTreeWithFocussedLines = function (
            e,
            n = t.DEFAULT_TREE_TRAVERSAL_CONFIG
          ) {
            const i = (0, r.mapLabels)(e, (e) => (e ? 1 : void 0));
            return (
              (0, r.visitTree)(
                i,
                (e) => {
                  if ((0, r.isBlank)(e)) return;
                  const t = Math.max(...e.subs.map((e) => e.label ?? 0));
                  e.label = Math.max(e.label ?? 0, t * n.worthUp);
                },
                "bottomUp"
              ),
              (0, r.visitTree)(
                i,
                (e) => {
                  if ((0, r.isBlank)(e)) return;
                  const t = e.subs.map((e) => e.label ?? 0);
                  let i = [...t];
                  for (let e = 0; e < t.length; e++)
                    0 !== t[e] &&
                      (i = i.map((r, i) =>
                        Math.max(
                          r,
                          Math.pow(n.worthSibling, Math.abs(e - i)) * t[e]
                        )
                      ));
                  const o = e.label;
                  void 0 !== o &&
                    (i = i.map((e) => Math.max(e, n.worthDown * o))),
                    e.subs.forEach((e, t) => (e.label = i[t]));
                },
                "topDown"
              ),
              o(i)
            );
          }),
          (t.fromTreeWithValuedLines = o);
      },
      3407: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.elidableTextForSourceCode = void 0);
        const r = n(2180),
          i = n(5533);
        t.elidableTextForSourceCode = function (e, t = !0, n = !0) {
          const o =
            "string" == typeof e
              ? (0, r.parseTree)(e)
              : (0, r.parseTree)(e.source, e.languageId);
          (0, r.flattenVirtual)(o);
          const s = (0, r.mapLabels)(o, (e) => t && "closer" !== e);
          return (
            (0, r.visitTree)(
              s,
              (e) => {
                void 0 === e.label && (e.label = t && !1 !== e.label);
              },
              "topDown"
            ),
            t &&
              (0, r.visitTree)(
                s,
                (e) => {
                  if (e.label) {
                    let t = !1;
                    for (const n of [...e.subs].reverse())
                      n.label && !t ? (t = !0) : (n.label = !1);
                  } else for (const t of e.subs) t.label = !1;
                  e.subs.length > 0 && (e.label = !1);
                },
                "topDown"
              ),
            n &&
              (0, r.visitTree)(
                s,
                (e) => {
                  e.label ||
                    (e.label =
                      ((0, r.isLine)(e) || (0, r.isBlank)(e)) &&
                      0 == e.lineNumber);
                },
                "topDown"
              ),
            (0, i.fromTreeWithFocussedLines)(s)
          );
        };
      },
      3346: function (e, t, n) {
        "use strict";

        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i &&
                    !("get" in i
                      ? !t.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                "default" === n ||
                  Object.prototype.hasOwnProperty.call(t, n) ||
                  r(t, e, n);
            };
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          i(n(4288), t),
          i(n(8975), t),
          i(n(5533), t),
          i(n(3407), t),
          i(n(4121), t);
      },
      4121: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.LineWithValueAndCost = void 0);
        const r = n(1145);
        class i {
          constructor(
            e,
            t,
            n = (0, r.getTokenizer)().tokenLength(e + "\n"),
            i = "strict"
          ) {
            if (
              ((this.text = e),
              (this._value = t),
              (this._cost = n),
              e.includes("\n") && "none" !== i)
            )
              throw new Error("LineWithValueAndCost: text contains newline");
            if (t < 0 && "none" !== i)
              throw new Error("LineWithValueAndCost: value is negative");
            if (n < 0 && "none" !== i)
              throw new Error("LineWithValueAndCost: cost is negative");
            if ("strict" == i && t > 1)
              throw new Error(
                "Value should normally be between 0 and 1 -- set validation to `loose` to ignore this error"
              );
          }
          get value() {
            return this._value;
          }
          get cost() {
            return this._cost;
          }
          adjustValue(e) {
            return (this._value *= e), this;
          }
          recost(e = (e) => (0, r.getTokenizer)().tokenLength(e + "\n")) {
            return (this._cost = e(this.text)), this;
          }
          copy() {
            return new i(this.text, this.value, this.cost, "none");
          }
        }
        t.LineWithValueAndCost = i;
      },
      2271: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.defaultFileSystem = t.FileSystem = void 0);
        const r = n(7147);
        (t.FileSystem = class {}),
          (t.defaultFileSystem = {
            readFile: (e) => r.promises.readFile(e),
            mtime: async (e) => (await r.promises.stat(e)).mtimeMs,
            async stat(e) {
              const t = await r.promises.stat(e);
              return {
                ctime: t.ctimeMs,
                mtime: t.mtimeMs,
                size: t.size,
              };
            },
          });
      },
      4876: (e, t) => {
        "use strict";

        function n(e) {
          return "virtual" === e.type;
        }
        function r(e) {
          return "top" === e.type;
        }
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.duplicateTree =
            t.cutTreeAfterLine =
            t.isTop =
            t.isVirtual =
            t.isLine =
            t.isBlank =
            t.topNode =
            t.blankNode =
            t.lineNode =
            t.virtualNode =
              void 0),
          (t.virtualNode = function (e, t, n) {
            return {
              type: "virtual",
              indentation: e,
              subs: t,
              label: n,
            };
          }),
          (t.lineNode = function (e, t, n, r, i) {
            if ("" === n)
              throw new Error(
                "Cannot create a line node with an empty source line"
              );
            return {
              type: "line",
              indentation: e,
              lineNumber: t,
              sourceLine: n,
              subs: r,
              label: i,
            };
          }),
          (t.blankNode = function (e) {
            return {
              type: "blank",
              lineNumber: e,
              subs: [],
            };
          }),
          (t.topNode = function (e) {
            return {
              type: "top",
              indentation: -1,
              subs: e ?? [],
            };
          }),
          (t.isBlank = function (e) {
            return "blank" === e.type;
          }),
          (t.isLine = function (e) {
            return "line" === e.type;
          }),
          (t.isVirtual = n),
          (t.isTop = r),
          (t.cutTreeAfterLine = function (e, t) {
            !(function e(i) {
              if (!n(i) && !r(i) && i.lineNumber === t)
                return (i.subs = []), !0;
              for (let t = 0; t < i.subs.length; t++)
                if (e(i.subs[t])) return (i.subs = i.subs.slice(0, t + 1)), !0;
              return !1;
            })(e);
          }),
          (t.duplicateTree = function (e) {
            return JSON.parse(JSON.stringify(e));
          });
      },
      3059: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.lastLineOf =
            t.firstLineOf =
            t.encodeTree =
            t.describeTree =
            t.deparseAndCutTree =
            t.deparseTree =
            t.deparseLine =
              void 0);
        const r = n(4876),
          i = n(8617);
        function o(e) {
          return " ".repeat(e.indentation) + e.sourceLine + "\n";
        }
        function s(e) {
          return (0, i.foldTree)(
            e,
            "",
            function (e, t) {
              let n = "";
              return (
                (0, r.isLine)(e) ? (n = o(e)) : (0, r.isBlank)(e) && (n = "\n"),
                t + n
              );
            },
            "topDown"
          );
        }
        (t.deparseLine = o),
          (t.deparseTree = s),
          (t.deparseAndCutTree = function (e, t) {
            const n = new Set(t),
              i = [];
            let a = "";
            return (
              (function e(t) {
                void 0 !== t.label && n.has(t.label)
                  ? ("" !== a &&
                      i.push({
                        label: void 0,
                        source: a,
                      }),
                    i.push({
                      label: t.label,
                      source: s(t),
                    }),
                    (a = ""))
                  : ((0, r.isLine)(t) && (a += o(t)), t.subs.forEach(e));
              })(e),
              "" !== a &&
                i.push({
                  label: void 0,
                  source: a,
                }),
              i
            );
          }),
          (t.describeTree = function e(t, n = 0) {
            const i = " ".repeat(n);
            if (void 0 === t) return "UNDEFINED NODE";
            let o;
            (o =
              void 0 === t.subs
                ? "UNDEFINED SUBS"
                : t.subs.map((t) => e(t, n + 2)).join(",\n")),
              (o = "" === o ? "[]" : `[\n${o}\n      ${i}]`);
            const s =
                ((0, r.isVirtual)(t) || (0, r.isTop)(t)
                  ? "   "
                  : String(t.lineNumber).padStart(3, " ")) + `:  ${i}`,
              a = void 0 === t.label ? "" : JSON.stringify(t.label);
            return (0, r.isVirtual)(t) || (0, r.isTop)(t)
              ? `${s}vnode(${t.indentation}, ${a}, ${o})`
              : (0, r.isBlank)(t)
              ? `${s}blank(${a ?? ""})`
              : `${s}lnode(${t.indentation}, ${a}, ${JSON.stringify(
                  t.sourceLine
                )}, ${o})`;
          }),
          (t.encodeTree = function e(t, n = "") {
            const i = void 0 === t.label ? "" : `, ${JSON.stringify(t.label)}`,
              o =
                !(0, r.isBlank)(t) && t.subs.length > 0
                  ? `[\n${t.subs
                      .map((t) => e(t, n + "  "))
                      .join(", \n")}\n${n}]`
                  : "[]";
            switch (t.type) {
              case "blank":
                return `${n}blankNode(${t.lineNumber}${i})`;
              case "top":
                return `topNode(${o}${i})`;
              case "virtual":
                return `${n}virtualNode(${t.indentation}, ${o}${i})`;
              case "line":
                return `${n}lineNode(${t.indentation}, ${t.lineNumber}, "${t.sourceLine}", ${o}${i})`;
            }
          }),
          (t.firstLineOf = function e(t) {
            if ((0, r.isLine)(t) || (0, r.isBlank)(t)) return t.lineNumber;
            for (const n of t.subs) {
              const t = e(n);
              if (void 0 !== t) return t;
            }
          }),
          (t.lastLineOf = function e(t) {
            let n,
              i = t.subs.length - 1;
            for (; i >= 0 && void 0 === n; ) (n = e(t.subs[i])), i--;
            return void 0 !== n || (0, r.isVirtual)(t) || (0, r.isTop)(t)
              ? n
              : t.lineNumber;
          });
      },
      2180: function (e, t, n) {
        "use strict";

        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i &&
                    !("get" in i
                      ? !t.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                "default" === n ||
                  Object.prototype.hasOwnProperty.call(t, n) ||
                  r(t, e, n);
            };
        Object.defineProperty(t, "__esModule", {
          value: !0,
        });
        const o = n(6647),
          s = n(1152),
          a = n(3469);
        (0, a.registerLanguageSpecificParser)("markdown", s.processMarkdown),
          (0, a.registerLanguageSpecificParser)("java", o.processJava),
          i(n(4876), t),
          i(n(3059), t),
          i(n(8617), t),
          i(n(3469), t);
      },
      6647: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.processJava = void 0);
        const r = n(4876),
          i = n(8617),
          o = n(3469),
          s = (0, o.buildLabelRules)({
            package: /^package /,
            import: /^import /,
            class: /\bclass /,
            interface: /\binterface /,
            javadoc: /^\/\*\*/,
            comment_multi: /^\/\*[^*]/,
            comment_single: /^\/\//,
            annotation: /^@/,
            opener: /^[\[({]/,
            closer: /^[\])}]/,
          });
        t.processJava = function (e) {
          let t = e;
          return (
            (0, o.labelLines)(t, s),
            (t = (0, o.combineClosersAndOpeners)(t)),
            (t = (0, o.flattenVirtual)(t)),
            (0, o.labelVirtualInherited)(t),
            (0, i.visitTree)(
              t,
              (e) => {
                if ("class" === e.label || "interface" === e.label)
                  for (const t of e.subs)
                    (0, r.isBlank)(t) ||
                      (void 0 !== t.label && "annotation" !== t.label) ||
                      (t.label = "member");
              },
              "bottomUp"
            ),
            t
          );
        };
      },
      8617: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.rebuildTree =
            t.foldTree =
            t.visitTreeConditionally =
            t.visitTree =
            t.resetLineNumbers =
            t.mapLabels =
            t.clearLabelsIf =
            t.clearLabels =
              void 0);
        const r = n(4876);
        function i(e, t, n) {
          !(function e(r) {
            "topDown" === n && t(r),
              r.subs.forEach((t) => {
                e(t);
              }),
              "bottomUp" === n && t(r);
          })(e);
        }
        (t.clearLabels = function (e) {
          return (
            i(
              e,
              (e) => {
                e.label = void 0;
              },
              "bottomUp"
            ),
            e
          );
        }),
          (t.clearLabelsIf = function (e, t) {
            return (
              i(
                e,
                (e) => {
                  e.label = e.label ? (t(e.label) ? void 0 : e.label) : void 0;
                },
                "bottomUp"
              ),
              e
            );
          }),
          (t.mapLabels = function e(t, n) {
            switch (t.type) {
              case "line":
              case "virtual":
                const r = t.subs.map((t) => e(t, n));
                return {
                  ...t,
                  subs: r,
                  label: t.label ? n(t.label) : void 0,
                };
              case "blank":
                return {
                  ...t,
                  label: t.label ? n(t.label) : void 0,
                };
              case "top":
                return {
                  ...t,
                  subs: t.subs.map((t) => e(t, n)),
                  label: t.label ? n(t.label) : void 0,
                };
            }
          }),
          (t.resetLineNumbers = function (e) {
            let t = 0;
            i(
              e,
              function (e) {
                (0, r.isVirtual)(e) ||
                  (0, r.isTop)(e) ||
                  ((e.lineNumber = t), t++);
              },
              "topDown"
            );
          }),
          (t.visitTree = i),
          (t.visitTreeConditionally = function (e, t, n) {
            !(function e(r) {
              if ("topDown" === n && !t(r)) return !1;
              let i = !0;
              return (
                r.subs.forEach((t) => {
                  i = i && e(t);
                }),
                "bottomUp" === n && (i = i && t(r)),
                i
              );
            })(e);
          }),
          (t.foldTree = function (e, t, n, r) {
            let o = t;
            return (
              i(
                e,
                function (e) {
                  o = n(e, o);
                },
                r
              ),
              o
            );
          }),
          (t.rebuildTree = function (e, t, n) {
            const i = (e) => {
                if (void 0 !== n && n(e)) return e;
                {
                  const n = e.subs.map(i).filter((e) => void 0 !== e);
                  return (e.subs = n), t(e);
                }
              },
              o = i(e);
            return void 0 !== o ? o : (0, r.topNode)();
          });
      },
      1152: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.processMarkdown = void 0);
        const r = n(4876),
          i = n(3469),
          o = (0, i.buildLabelRules)({
            heading: /^# /,
            subheading: /^## /,
            subsubheading: /### /,
          });
        t.processMarkdown = function (e) {
          let t = e;
          if (((0, i.labelLines)(t, o), (0, r.isBlank)(t))) return t;
          function n(e) {
            return "heading" === e.label
              ? 1
              : "subheading" === e.label
              ? 2
              : "subsubheading" === e.label
              ? 3
              : void 0;
          }
          let s = [t],
            a = [...t.subs];
          t.subs = [];
          for (const e of a) {
            const t = n(e);
            if (void 0 === t || (0, r.isBlank)(e)) s[s.length - 1].subs.push(e);
            else {
              for (; s.length < t; ) s.push(s[s.length - 1]);
              for (s[t - 1].subs.push(e), s[t] = e; s.length > t + 1; ) s.pop();
            }
          }
          return (
            (t = (0, i.groupBlocks)(t)),
            (t = (0, i.flattenVirtual)(t)),
            (0, i.labelVirtualInherited)(t),
            t
          );
        };
      },
      3469: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.parseTree =
            t.registerLanguageSpecificParser =
            t.flattenVirtual =
            t.groupBlocks =
            t.combineClosersAndOpeners =
            t.buildLabelRules =
            t.labelVirtualInherited =
            t.labelLines =
            t.parseRaw =
              void 0);
        const r = n(4876),
          i = n(8617);
        function o(e) {
          const t = e.split("\n"),
            n = t.map((e) => e.match(/^\s*/)[0].length),
            i = t.map((e) => e.trimLeft());
          function o(e) {
            const [t, o] = s(e + 1, n[e]);
            return [(0, r.lineNode)(n[e], e, i[e], t), o];
          }
          function s(e, t) {
            let s;
            const a = [];
            let c,
              l = e;
            for (; l < i.length && ("" === i[l] || n[l] > t); )
              if ("" === i[l]) void 0 === c && (c = l), (l += 1);
              else {
                if (void 0 !== c) {
                  for (let e = c; e < l; e++) a.push((0, r.blankNode)(e));
                  c = void 0;
                }
                ([s, l] = o(l)), a.push(s);
              }
            return void 0 !== c && (l = c), [a, l];
          }
          const [a, c] = s(0, -1);
          let l = c;
          for (; l < i.length && "" === i[l]; )
            a.push((0, r.blankNode)(l)), (l += 1);
          if (l < i.length)
            throw new Error(
              `Parsing did not go to end of file. Ended at ${l} out of ${i.length}`
            );
          return (0, r.topNode)(a);
        }
        function s(e, t) {
          (0, i.visitTree)(
            e,
            function (e) {
              if ((0, r.isLine)(e)) {
                const n = t.find((t) => t.matches(e.sourceLine));
                n && (e.label = n.label);
              }
            },
            "bottomUp"
          );
        }
        function a(e) {
          return Object.keys(e).map((t) => {
            let n;
            return (
              (n = e[t].test ? (n) => e[t].test(n) : e[t]),
              {
                matches: n,
                label: t,
              }
            );
          });
        }
        function c(e) {
          const t = (0, i.rebuildTree)(e, function (e) {
            if (
              0 === e.subs.length ||
              -1 ===
                e.subs.findIndex(
                  (e) => "closer" === e.label || "opener" === e.label
                )
            )
              return e;
            const t = [];
            let n;
            for (let i = 0; i < e.subs.length; i++) {
              const o = e.subs[i],
                s = e.subs[i - 1];
              if ("opener" === o.label && void 0 !== s && (0, r.isLine)(s))
                s.subs.push(o),
                  o.subs.forEach((e) => s.subs.push(e)),
                  (o.subs = []);
              else if (
                "closer" === o.label &&
                void 0 !== n &&
                ((0, r.isLine)(o) || (0, r.isVirtual)(o)) &&
                o.indentation >= n.indentation
              ) {
                let e = t.length - 1;
                for (; e > 0 && (0, r.isBlank)(t[e]); ) e -= 1;
                if ((n.subs.push(...t.splice(e + 1)), o.subs.length > 0)) {
                  const e = n.subs.findIndex((e) => "newVirtual" !== e.label),
                    t = n.subs.slice(0, e),
                    i = n.subs.slice(e),
                    s =
                      i.length > 0
                        ? [(0, r.virtualNode)(o.indentation, i, "newVirtual")]
                        : [];
                  n.subs = [...t, ...s, o];
                } else n.subs.push(o);
              } else t.push(o), (0, r.isBlank)(o) || (n = o);
            }
            return (e.subs = t), e;
          });
          return (0, i.clearLabelsIf)(e, (e) => "newVirtual" === e), t;
        }
        (t.parseRaw = o),
          (t.labelLines = s),
          (t.labelVirtualInherited = function (e) {
            (0, i.visitTree)(
              e,
              function (e) {
                if ((0, r.isVirtual)(e) && void 0 === e.label) {
                  const t = e.subs.filter((e) => !(0, r.isBlank)(e));
                  1 === t.length && (e.label = t[0].label);
                }
              },
              "bottomUp"
            );
          }),
          (t.buildLabelRules = a),
          (t.combineClosersAndOpeners = c),
          (t.groupBlocks = function (e, t = r.isBlank, n) {
            return (0, i.rebuildTree)(e, function (e) {
              if (e.subs.length <= 1) return e;
              const i = [];
              let o,
                s = [],
                a = !1;
              function c(e = !1) {
                if (void 0 !== o && (i.length > 0 || !e)) {
                  const e = (0, r.virtualNode)(o, s, n);
                  i.push(e);
                } else s.forEach((e) => i.push(e));
              }
              for (let n = 0; n < e.subs.length; n++) {
                const i = e.subs[n],
                  l = t(i);
                !l && a && (c(), (s = [])),
                  (a = l),
                  s.push(i),
                  (0, r.isBlank)(i) || (o = o ?? i.indentation);
              }
              return c(!0), (e.subs = i), e;
            });
          }),
          (t.flattenVirtual = function (e) {
            return (0, i.rebuildTree)(e, function (e) {
              return (0, r.isVirtual)(e) &&
                void 0 === e.label &&
                e.subs.length <= 1
                ? 0 === e.subs.length
                  ? void 0
                  : e.subs[0]
                : (1 === e.subs.length &&
                    (0, r.isVirtual)(e.subs[0]) &&
                    void 0 === e.subs[0].label &&
                    (e.subs = e.subs[0].subs),
                  e);
            });
          });
        const l = a({
            opener: /^[\[({]/,
            closer: /^[\])}]/,
          }),
          u = {};
        (t.registerLanguageSpecificParser = function (e, t) {
          u[e] = t;
        }),
          (t.parseTree = function (e, t) {
            const n = o(e),
              r = u[t ?? ""];
            return r ? r(n) : (s(n, l), c(n));
          });
      },
      2417: (e, t) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getPathMarker =
            t.getLanguageMarker =
            t.commentBlockAsSingles =
            t.comment =
            t.hasLanguageMarker =
            t.languageCommentMarkers =
              void 0),
          (t.languageCommentMarkers = {
            abap: {
              start: '"',
              end: "",
            },
            bat: {
              start: "REM",
              end: "",
            },
            bibtex: {
              start: "%",
              end: "",
            },
            blade: {
              start: "#",
              end: "",
            },
            c: {
              start: "//",
              end: "",
            },
            clojure: {
              start: ";",
              end: "",
            },
            coffeescript: {
              start: "//",
              end: "",
            },
            cpp: {
              start: "//",
              end: "",
            },
            csharp: {
              start: "//",
              end: "",
            },
            css: {
              start: "/*",
              end: "*/",
            },
            dart: {
              start: "//",
              end: "",
            },
            dockerfile: {
              start: "#",
              end: "",
            },
            elixir: {
              start: "#",
              end: "",
            },
            erb: {
              start: "<%#",
              end: "%>",
            },
            erlang: {
              start: "%",
              end: "",
            },
            fsharp: {
              start: "//",
              end: "",
            },
            go: {
              start: "//",
              end: "",
            },
            groovy: {
              start: "//",
              end: "",
            },
            haml: {
              start: "-#",
              end: "",
            },
            handlebars: {
              start: "{{!",
              end: "}}",
            },
            haskell: {
              start: "--",
              end: "",
            },
            html: {
              start: "\x3c!--",
              end: "--\x3e",
            },
            ini: {
              start: ";",
              end: "",
            },
            java: {
              start: "//",
              end: "",
            },
            javascript: {
              start: "//",
              end: "",
            },
            javascriptreact: {
              start: "//",
              end: "",
            },
            jsonc: {
              start: "//",
              end: "",
            },
            jsx: {
              start: "//",
              end: "",
            },
            julia: {
              start: "#",
              end: "",
            },
            kotlin: {
              start: "//",
              end: "",
            },
            latex: {
              start: "%",
              end: "",
            },
            less: {
              start: "//",
              end: "",
            },
            lua: {
              start: "--",
              end: "",
            },
            makefile: {
              start: "#",
              end: "",
            },
            markdown: {
              start: "[]: #",
              end: "",
            },
            "objective-c": {
              start: "//",
              end: "",
            },
            "objective-cpp": {
              start: "//",
              end: "",
            },
            perl: {
              start: "#",
              end: "",
            },
            php: {
              start: "//",
              end: "",
            },
            powershell: {
              start: "#",
              end: "",
            },
            pug: {
              start: "//",
              end: "",
            },
            python: {
              start: "#",
              end: "",
            },
            ql: {
              start: "//",
              end: "",
            },
            r: {
              start: "#",
              end: "",
            },
            razor: {
              start: "\x3c!--",
              end: "--\x3e",
            },
            ruby: {
              start: "#",
              end: "",
            },
            rust: {
              start: "//",
              end: "",
            },
            sass: {
              start: "//",
              end: "",
            },
            scala: {
              start: "//",
              end: "",
            },
            scss: {
              start: "//",
              end: "",
            },
            shellscript: {
              start: "#",
              end: "",
            },
            slim: {
              start: "/",
              end: "",
            },
            solidity: {
              start: "//",
              end: "",
            },
            sql: {
              start: "--",
              end: "",
            },
            stylus: {
              start: "//",
              end: "",
            },
            svelte: {
              start: "\x3c!--",
              end: "--\x3e",
            },
            swift: {
              start: "//",
              end: "",
            },
            terraform: {
              start: "#",
              end: "",
            },
            tex: {
              start: "%",
              end: "",
            },
            typescript: {
              start: "//",
              end: "",
            },
            typescriptreact: {
              start: "//",
              end: "",
            },
            vb: {
              start: "'",
              end: "",
            },
            verilog: {
              start: "//",
              end: "",
            },
            "vue-html": {
              start: "\x3c!--",
              end: "--\x3e",
            },
            vue: {
              start: "//",
              end: "",
            },
            xml: {
              start: "\x3c!--",
              end: "--\x3e",
            },
            xsl: {
              start: "\x3c!--",
              end: "--\x3e",
            },
            yaml: {
              start: "#",
              end: "",
            },
          });
        const n = ["php", "plaintext"],
          r = {
            html: "<!DOCTYPE html>",
            python: "#!/usr/bin/env python3",
            ruby: "#!/usr/bin/env ruby",
            shellscript: "#!/bin/sh",
            yaml: "# YAML data",
          };
        function i({ source: e }) {
          return e.startsWith("#!") || e.startsWith("<!DOCTYPE");
        }
        function o(e, n) {
          const r = t.languageCommentMarkers[n];
          if (r) {
            const t = "" == r.end ? "" : " " + r.end;
            return `${r.start} ${e}${t}`;
          }
          return "";
        }
        (t.hasLanguageMarker = i),
          (t.comment = o),
          (t.commentBlockAsSingles = function (e, n) {
            if (!t.languageCommentMarkers[n] || "" === e) return "";
            const r = e.endsWith("\n"),
              i = (r ? e.slice(0, -1) : e)
                .split("\n")
                .map((e) => o(e, n))
                .join("\n");
            return r ? i + "\n" : i;
          }),
          (t.getLanguageMarker = function (e) {
            const { languageId: t } = e;
            return -1 !== n.indexOf(t) || i(e)
              ? ""
              : t in r
              ? r[t]
              : o(`Language: ${t}`, t);
          }),
          (t.getPathMarker = function (e) {
            return e.relativePath
              ? o(`Path: ${e.relativePath}`, e.languageId)
              : "";
          });
      },
      5563: function (e, t, n) {
        "use strict";

        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i &&
                    !("get" in i
                      ? !t.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                "default" === n ||
                  Object.prototype.hasOwnProperty.call(t, n) ||
                  r(t, e, n);
            };
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.createWorker =
            t.SnippetSemantics =
            t.SnippetProvider =
            t.NeighboringTabsOption =
            t.NeighboringSnippetType =
            t.getCursorContext =
            t.languageCommentMarkers =
            t.commentBlockAsSingles =
            t.comment =
            t.FileSystem =
              void 0);
        const o = n(1017),
          s = n(1267);
        i(n(3346), t);
        var a = n(2271);
        Object.defineProperty(t, "FileSystem", {
          enumerable: !0,
          get: function () {
            return a.FileSystem;
          },
        }),
          i(n(2180), t);
        var c = n(2417);
        Object.defineProperty(t, "comment", {
          enumerable: !0,
          get: function () {
            return c.comment;
          },
        }),
          Object.defineProperty(t, "commentBlockAsSingles", {
            enumerable: !0,
            get: function () {
              return c.commentBlockAsSingles;
            },
          }),
          Object.defineProperty(t, "languageCommentMarkers", {
            enumerable: !0,
            get: function () {
              return c.languageCommentMarkers;
            },
          }),
          i(n(8306), t),
          i(n(9610), t),
          i(n(8312), t);
        var l = n(648);
        Object.defineProperty(t, "getCursorContext", {
          enumerable: !0,
          get: function () {
            return l.getCursorContext;
          },
        }),
          i(n(6845), t);
        var u = n(9125);
        Object.defineProperty(t, "NeighboringSnippetType", {
          enumerable: !0,
          get: function () {
            return u.NeighboringSnippetType;
          },
        }),
          Object.defineProperty(t, "NeighboringTabsOption", {
            enumerable: !0,
            get: function () {
              return u.NeighboringTabsOption;
            },
          });
        var p = n(4830);
        Object.defineProperty(t, "SnippetProvider", {
          enumerable: !0,
          get: function () {
            return p.SnippetProvider;
          },
        }),
          Object.defineProperty(t, "SnippetSemantics", {
            enumerable: !0,
            get: function () {
              return p.SnippetSemantics;
            },
          }),
          i(n(1145), t),
          (t.createWorker = function () {
            return new s.Worker(
              (0, o.resolve)(__dirname, "..", "dist", "worker.js")
            );
          });
      },
      5179: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.extractLocalImportContext = t.getDocComment = void 0);
        const r = n(1017),
          i = n(8306);
        function o(e, t) {
          let n = t.namedChild(1)?.text.slice(1, -1);
          if (!n || !n.startsWith(".")) return null;
          if ("" === (0, r.extname)(n)) n += ".ts";
          else if (".ts" !== (0, r.extname)(n)) return null;
          return (0, r.join)((0, r.dirname)(e), n);
        }
        function s(e) {
          let t = [];
          if ("import_clause" === e.namedChild(0)?.type) {
            let n = e.namedChild(0);
            if ("named_imports" === n?.namedChild(0)?.type) {
              let e = n.namedChild(0);
              for (let n of e?.namedChildren ?? [])
                if ("import_specifier" === n.type) {
                  const e = n.childForFieldName("name")?.text;
                  if (e) {
                    const r = n.childForFieldName("alias")?.text;
                    t.push({
                      name: e,
                      alias: r,
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
                decl: t.text,
              };
            case "function_declaration":
            case "function_signature":
              return {
                name: n,
                decl: l(e, t),
              };
            case "class_declaration": {
              let r = (function (e, t) {
                  let n = t.childForFieldName("body");
                  if (n)
                    return n.namedChildren.map((t) => p(e, t)).filter((e) => e);
                })(e, t),
                i = "";
              if (r) {
                let n = t.childForFieldName("body");
                (i = `declare ${e.substring(t.startIndex, n.startIndex + 1)}`),
                  (i += r.map((e) => "\n" + e).join("")),
                  (i += "\n}");
              }
              return {
                name: n,
                decl: i,
              };
            }
          }
          return {
            name: n,
            decl: "",
          };
        }
        function l(e, t) {
          const n =
            t.childForFieldName("return_type")?.endIndex ??
            t.childForFieldName("parameters")?.endIndex;
          if (void 0 !== n) {
            let r = e.substring(t.startIndex, n) + ";";
            return "function_declaration" === t.type ||
              "function_signature" === t.type
              ? "declare " + r
              : r;
          }
          return "";
        }
        function u(e, t) {
          const n = (0, i.getFirstPrecedingComment)(t);
          return n ? e.substring(n.startIndex, t.startIndex) : "";
        }
        function p(e, t) {
          if (
            "accessibility_modifier" === t?.firstChild?.type &&
            "private" === t.firstChild.text
          )
            return "";
          const n =
              (function (e, t) {
                let n = t.startIndex - 1;
                for (; n >= 0 && (" " === e[n] || "\t" === e[n]); ) n--;
                if (n < 0 || "\n" === e[n])
                  return e.substring(n + 1, t.startIndex);
              })(e, (0, i.getFirstPrecedingComment)(t) ?? t) ?? "  ",
            r = u(e, t);
          switch (t.type) {
            case "ambient_declaration":
              const i = t.namedChild(0);
              return i ? n + r + p(e, i) : "";
            case "method_definition":
            case "method_signature":
              return n + r + l(e, t);
            case "public_field_definition": {
              let i =
                t.childForFieldName("type")?.endIndex ??
                t.childForFieldName("name")?.endIndex;
              if (void 0 !== i)
                return n + r + e.substring(t.startIndex, i) + ";";
            }
          }
          return "";
        }
        async function d(e, t, n) {
          let r = new Map(),
            o = -1;
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
              o = await (0, i.parseTreeSitter)(t, s);
              for (let e of (0, i.queryExports)(t, o.rootNode))
                for (let t of e.captures) {
                  let e = t.node;
                  if ("export_statement" === e.type) {
                    let t = e.childForFieldName("declaration");
                    if (t?.hasError()) continue;
                    let { name: n, decl: i } = c(s, t);
                    if (n) {
                      i = u(s, e) + i;
                      let t = r.get(n);
                      t || ((t = []), r.set(n, t)), t.push(i);
                    }
                  }
                }
            } catch {
            } finally {
              o && o.delete();
            }
          }
          if (a.size > 2e3)
            for (let e of a.keys()) if ((a.delete(e), r.size <= 1e3)) break;
          return (
            a.set(e, {
              mtime: o,
              exports: r,
            }),
            r
          );
        }
        t.getDocComment = u;
        const h = /^\s*import\s*(type|)\s*\{[^}]*\}\s*from\s*['"]\./gm;
        t.extractLocalImportContext = async function (e, t) {
          let { source: n, uri: r, languageId: a } = e;
          return t && "typescript" === a
            ? (async function (e, t, n) {
                let r = "typescript",
                  a = [];
                const c = (function (e) {
                  let t,
                    n = -1;
                  h.lastIndex = -1;
                  do {
                    (t = h.exec(e)), t && (n = h.lastIndex + t.length);
                  } while (t);
                  if (-1 === n) return -1;
                  const r = e.indexOf("\n", n);
                  return -1 !== r ? r : e.length;
                })(e);
                if (-1 === c) return a;
                e = e.substring(0, c);
                let l = await (0, i.parseTreeSitter)(r, e);
                try {
                  for (let e of (function (e) {
                    let t = [];
                    for (let n of e.namedChildren)
                      "import_statement" === n.type && t.push(n);
                    return t;
                  })(l.rootNode)) {
                    let i = o(t, e);
                    if (!i) continue;
                    let c = s(e);
                    if (0 === c.length) continue;
                    let l = await d(i, r, n);
                    for (let e of c) l.has(e.name) && a.push(...l.get(e.name));
                  }
                } finally {
                  l.delete();
                }
                return a;
              })(n, r, t)
            : [];
        };
      },
      8306: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getCallSites =
            t.getFunctionPositions =
            t.getFirstPrecedingComment =
            t.isFunctionDefinition =
            t.isFunction =
            t.getAncestorWithSiblingFunctions =
            t.queryPythonIsDocstring =
            t.queryGlobalVars =
            t.queryExports =
            t.queryImports =
            t.queryFunctions =
            t.getBlockCloseToken =
            t.parsesWithoutError =
            t.parseTreeSitter =
            t.getLanguage =
            t.languageIdToWasmLanguage =
            t.isSupportedLanguageId =
            t.WASMLanguage =
              void 0);
        const r = n(1017),
          i = n(4087),
          o = n(4087);
        var s;
        !(function (e) {
          (e.Python = "python"),
            (e.JavaScript = "javascript"),
            (e.TypeScript = "typescript"),
            (e.TSX = "tsx"),
            (e.Go = "go"),
            (e.Ruby = "ruby");
        })((s = t.WASMLanguage || (t.WASMLanguage = {})));
        const a = {
          python: s.Python,
          javascript: s.JavaScript,
          javascriptreact: s.JavaScript,
          jsx: s.JavaScript,
          typescript: s.TypeScript,
          typescriptreact: s.TSX,
          go: s.Go,
          ruby: s.Ruby,
        };
        function c(e) {
          if (!(e in a)) throw new Error(`Unrecognized language: ${e}`);
          return a[e];
        }
        (t.isSupportedLanguageId = function (e) {
          return e in a;
        }),
          (t.languageIdToWasmLanguage = c);
        const l =
            "[\n    (function body: (statement_block) @body)\n    (function_declaration body: (statement_block) @body)\n    (generator_function body: (statement_block) @body)\n    (generator_function_declaration body: (statement_block) @body)\n    (method_definition body: (statement_block) @body)\n    (arrow_function body: (statement_block) @body)\n  ] @function",
          u = {
            python: [
              [
                "(function_definition body: (block\n             (expression_statement (string))? @docstring) @body) @function",
              ],
              ['(ERROR ("def" (identifier) (parameters))) @function'],
            ],
            javascript: [[l]],
            typescript: [[l]],
            tsx: [[l]],
            go: [
              [
                "[\n            (function_declaration body: (block) @body)\n            (method_declaration body: (block) @body)\n          ] @function",
              ],
            ],
            ruby: [
              [
                '[\n            (method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n            (singleton_method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n          ] @function',
              ],
            ],
          },
          p =
            '(variable_declarator value: (call_expression function: ((identifier) @req (#eq? @req "require"))))',
          d = `\n    (lexical_declaration ${p}+)\n    (variable_declaration ${p}+)\n`,
          h = [
            [`(program [ ${d} ] @import)`],
            ["(program [ (import_statement) (import_alias) ] @import)"],
          ],
          f = {
            python: [
              ["(module (future_import_statement) @import)"],
              ["(module (import_statement) @import)"],
              ["(module (import_from_statement) @import)"],
            ],
            javascript: [
              [`(program [ ${d} ] @import)`],
              ["(program [ (import_statement) ] @import)"],
            ],
            typescript: h,
            tsx: h,
            go: [],
            ruby: [],
          },
          m = [["(program (export_statement) @export)"]],
          g = {
            python: [],
            javascript: m,
            typescript: m,
            tsx: m,
            go: [],
            ruby: [],
          },
          y = {
            python: [
              ["(module (global_statement) @globalVar)"],
              ["(module (expression_statement) @globalVar)"],
            ],
            javascript: [],
            typescript: [],
            tsx: [],
            go: [],
            ruby: [],
          },
          _ = [
            "function",
            "function_declaration",
            "generator_function",
            "generator_function_declaration",
            "method_definition",
            "arrow_function",
          ],
          v = {
            python: new Set(["function_definition"]),
            javascript: new Set(_),
            typescript: new Set(_),
            tsx: new Set(_),
            go: new Set(["function_declaration", "method_declaration"]),
            ruby: new Set(["method", "singleton_method"]),
          },
          b = {
            python: (e) =>
              "module" === e.type ||
              ("block" === e.type && "class_definition" === e.parent?.type),
            javascript: (e) => "program" === e.type || "class_body" === e.type,
            typescript: (e) => "program" === e.type || "class_body" === e.type,
            tsx: (e) => "program" === e.type || "class_body" === e.type,
            go: (e) => "source_file" === e.type,
            ruby: (e) => "program" === e.type || "class" === e.type,
          },
          E = new Map();
        async function w(e) {
          const t = c(e);
          if (!E.has(t)) {
            const e = await (async function (e) {
              await i.init();
              const t = (0, r.resolve)(
                __dirname,
                "..",
                "dist",
                `tree-sitter-${e}.wasm`
              );
              return o.Language.load(t);
            })(t);
            E.set(t, e);
          }
          return E.get(t);
        }
        async function T(e, t) {
          let n = await w(e);
          const r = new i();
          r.setLanguage(n);
          const o = r.parse(t);
          return r.delete(), o;
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
        function x(e, t) {
          return S(u[c(e)], t);
        }
        (t.getLanguage = w),
          (t.parseTreeSitter = T),
          (t.parsesWithoutError = async function (e, t) {
            const n = await T(e, t),
              r = !n.rootNode.hasError();
            return n.delete(), r;
          }),
          (t.getBlockCloseToken = function (e) {
            switch (c(e)) {
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
          }),
          (t.queryFunctions = x),
          (t.queryImports = function (e, t) {
            return S(f[c(e)], t);
          }),
          (t.queryExports = function (e, t) {
            return S(g[c(e)], t);
          }),
          (t.queryGlobalVars = function (e, t) {
            return S(y[c(e)], t);
          });
        const C = [
          "[\n    (class_definition (block (expression_statement (string))))\n    (function_definition (block (expression_statement (string))))\n]",
        ];
        function I(e, t) {
          return v[c(e)].has(t.type);
        }
        (t.queryPythonIsDocstring = function (e) {
          return 1 == S([C], e).length;
        }),
          (t.getAncestorWithSiblingFunctions = function (e, t) {
            const n = b[c(e)];
            for (; t.parent; ) {
              if (n(t.parent)) return t;
              t = t.parent;
            }
            return t.parent ? t : null;
          }),
          (t.isFunction = I),
          (t.isFunctionDefinition = function (e, t) {
            switch (c(e)) {
              case s.Python:
              case s.Go:
              case s.Ruby:
                return I(e, t);
              case s.JavaScript:
              case s.TypeScript:
              case s.TSX:
                if (
                  "function_declaration" === t.type ||
                  "generator_function_declaration" === t.type ||
                  "method_definition" === t.type
                )
                  return !0;
                if (
                  "lexical_declaration" === t.type ||
                  "variable_declaration" === t.type
                ) {
                  if (t.namedChildCount > 1) return !1;
                  let n = t.namedChild(0);
                  if (null == n) return !1;
                  let r = n.namedChild(1);
                  return null !== r && I(e, r);
                }
                if ("expression_statement" === t.type) {
                  let n = t.namedChild(0);
                  if ("assignment_expression" === n?.type) {
                    let t = n.namedChild(1);
                    return null !== t && I(e, t);
                  }
                }
                return !1;
            }
          }),
          (t.getFirstPrecedingComment = function (e) {
            let t = e;
            for (; "comment" === t.previousSibling?.type; ) {
              let e = t.previousSibling;
              if (e.endPosition.row < t.startPosition.row - 1) break;
              t = e;
            }
            return "comment" === t?.type ? t : null;
          }),
          (t.getFunctionPositions = async function (e, t) {
            const n = await T(e, t),
              r = x(e, n.rootNode).map((e) => {
                const t = e.captures.find((e) => "function" === e.name).node;
                return {
                  startIndex: t.startIndex,
                  endIndex: t.endIndex,
                };
              });
            return n.delete(), r;
          });
        const A = {
          python: [
            [
              "(call\n            function:  [\n                (identifier) @caller\n                (attribute attribute:(identifier) @caller)\n            ]\n            arguments: (argument_list) @args\n        )",
            ],
          ],
          javascript: [],
          tsx: [],
          typescript: [],
          go: [],
          ruby: [],
        };
        t.getCallSites = async function (e) {
          if (!(e.languageId in A)) return [];
          let t = e.offset,
            n = e.source.substring(0, t);
          const r = Math.max(n.length - 5e3, 0),
            i = n.substring(0, r).split("\n").length - 1;
          (t -= r), (n = n.substring(r)), (n += ")))))");
          let o = [];
          const s = await T(e.languageId, n);
          return (
            S(A[a[e.languageId]], s.rootNode).forEach((e, r) => {
              let s = "",
                a = 0,
                c = 0,
                l = 0,
                u = 0;
              if (
                (e.captures.forEach((e, t) => {
                  const r = e.node;
                  "caller" == e.name
                    ? ((s = n.substring(r.startIndex, r.endIndex)),
                      (a = r.startPosition.row + i),
                      (c = r.startPosition.column))
                    : "args" == e.name &&
                      ((l = r.startIndex), (u = r.endIndex));
                }),
                t >= l && t <= u)
              ) {
                const e = {
                  line: a,
                  character: c,
                };
                o.push([s, e]);
              }
            }),
            s.delete(),
            o.map(([e, t]) => ({
              name: e,
              position: t,
            }))
          );
        };
      },
      9610: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getNodeStart =
            t.isBlockBodyFinished =
            t.isEmptyBlockStart =
            t.getBlockParser =
              void 0);
        const r = n(8306);
        class i {
          constructor(e, t, n) {
            (this.languageId = e),
              (this.nodeMatch = t),
              (this.nodeTypesWithBlockOrStmtChild = n);
          }
          async getNodeMatchAtPosition(e, t, n) {
            const i = await (0, r.parseTreeSitter)(this.languageId, e);
            try {
              let e = i.rootNode.descendantForIndex(t);
              for (; e; ) {
                const t = this.nodeMatch[e.type];
                if (t) {
                  if (!this.nodeTypesWithBlockOrStmtChild.has(e.type)) break;
                  const n = this.nodeTypesWithBlockOrStmtChild.get(e.type);
                  if (
                    ("" == n ? e.namedChildren[0] : e.childForFieldName(n))
                      ?.type == t
                  )
                    break;
                }
                e = e.parent;
              }
              if (!e) return;
              return n(e);
            } finally {
              i.delete();
            }
          }
          getNextBlockAtPosition(e, t, n) {
            return this.getNodeMatchAtPosition(e, t, (e) => {
              let t = e.children
                .reverse()
                .find((t) => t.type == this.nodeMatch[e.type]);
              if (t) {
                if ("python" == this.languageId && t.parent) {
                  const e = ":" == t.parent.type ? t.parent.parent : t.parent;
                  let n = e?.nextSibling;
                  for (; n && "comment" == n.type; ) {
                    const r =
                        n.startPosition.row == t.endPosition.row &&
                        n.startPosition.column >= t.endPosition.column,
                      i =
                        n.startPosition.row > e.endPosition.row &&
                        n.startPosition.column > e.startPosition.column;
                    if (!r && !i) break;
                    (t = n), (n = n.nextSibling);
                  }
                }
                if (
                  !(
                    t.endIndex >= t.tree.rootNode.endIndex - 1 &&
                    (t.hasError() || t.parent.hasError())
                  )
                )
                  return n(t);
              }
            });
          }
          async isBlockBodyFinished(e, t, n) {
            const r = (e + t).trimEnd(),
              i = await this.getNextBlockAtPosition(r, n, (e) => e.endIndex);
            if (void 0 !== i && i < r.length) {
              const t = i - e.length;
              return t > 0 ? t : void 0;
            }
          }
          getNodeStart(e, t) {
            const n = e.trimEnd();
            return this.getNodeMatchAtPosition(n, t, (e) => e.startIndex);
          }
        }
        class o extends i {
          constructor(e, t, n, r, i) {
            super(e, r, i), (this.blockEmptyMatch = t), (this.lineMatch = n);
          }
          isBlockStart(e) {
            return this.lineMatch.test(e.trimStart());
          }
          async isBlockBodyEmpty(e, t) {
            const n = await this.getNextBlockAtPosition(e, t, (n) => {
              n.startIndex < t && (t = n.startIndex);
              let r = e.substring(t, n.endIndex).trim();
              return "" == r || r.replace(/\s/g, "") == this.blockEmptyMatch;
            });
            return void 0 === n || n;
          }
          async isEmptyBlockStart(e, t) {
            return (
              (t = s(e, t)),
              this.isBlockStart(
                (function (e, t) {
                  const n = e.lastIndexOf("\n", t - 1);
                  let r = e.indexOf("\n", t);
                  return r < 0 && (r = e.length), e.slice(n + 1, r);
                })(e, t)
              ) && this.isBlockBodyEmpty(e, t)
            );
          }
        }
        function s(e, t) {
          let n = t;
          for (; n > 0 && /\s/.test(e.charAt(n - 1)); ) n--;
          return n;
        }
        function a(e, t) {
          const n = e.startIndex,
            r = e.startIndex - e.startPosition.column,
            i = t.substring(r, n);
          if (/^\s*$/.test(i)) return i;
        }
        function c(e, t, n) {
          if (t.startPosition.row <= e.startPosition.row) return !1;
          const r = a(e, n),
            i = a(t, n);
          return void 0 !== r && void 0 !== i && r.startsWith(i);
        }
        class l extends i {
          constructor(e, t, n, r, i, o, s) {
            super(e, t, n),
              (this.startKeywords = r),
              (this.blockNodeType = i),
              (this.emptyStatementType = o),
              (this.curlyBraceLanguage = s);
          }
          isBlockEmpty(e, t) {
            let n = e.text.trim();
            return (
              this.curlyBraceLanguage &&
                (n.startsWith("{") && (n = n.slice(1)),
                n.endsWith("}") && (n = n.slice(0, -1)),
                (n = n.trim())),
              0 == n.length ||
                !(
                  "python" != this.languageId ||
                  ("class_definition" != e.parent?.type &&
                    "function_definition" != e.parent?.type) ||
                  1 != e.children.length ||
                  !(0, r.queryPythonIsDocstring)(e.parent)
                )
            );
          }
          async isEmptyBlockStart(e, t) {
            if (t > e.length) throw new RangeError("Invalid offset");
            for (let n = t; n < e.length && "\n" != e.charAt(n); n++)
              if (/\S/.test(e.charAt(n))) return !1;
            t = s(e, t);
            const n = await (0, r.parseTreeSitter)(this.languageId, e);
            try {
              const r = n.rootNode.descendantForIndex(t - 1);
              if (null == r) return !1;
              if (this.curlyBraceLanguage && "}" == r.type) return !1;
              if (
                ("javascript" == this.languageId ||
                  "typescript" == this.languageId) &&
                r.parent &&
                "object" == r.parent.type &&
                "{" == r.parent.text.trim()
              )
                return !0;
              if ("typescript" == this.languageId) {
                let n = r;
                for (; n.parent; ) {
                  if (
                    "function_signature" == n.type ||
                    "method_signature" == n.type
                  ) {
                    const i = r.nextSibling;
                    return (
                      !!(i && n.hasError() && c(n, i, e)) ||
                      (!n.children.find((e) => ";" == e.type) &&
                        n.endIndex <= t)
                    );
                  }
                  n = n.parent;
                }
              }
              let i = null,
                o = null,
                s = null,
                a = r;
              for (; null != a; ) {
                if (a.type == this.blockNodeType) {
                  o = a;
                  break;
                }
                if (this.nodeMatch[a.type]) {
                  s = a;
                  break;
                }
                if ("ERROR" == a.type && ((i = a), "python" != this.languageId))
                  break;
                a = a.parent;
              }
              if (null != o) {
                if (!o.parent || !this.nodeMatch[o.parent.type]) return !1;
                if ("python" == this.languageId) {
                  const e = o.previousSibling;
                  if (
                    null != e &&
                    e.hasError() &&
                    (e.text.startsWith('"""') || e.text.startsWith("'''"))
                  )
                    return !0;
                }
                return this.isBlockEmpty(o, t);
              }
              if (null != i) {
                if (
                  "module" == i.previousSibling?.type ||
                  "internal_module" == i.previousSibling?.type ||
                  "def" == i.previousSibling?.type
                )
                  return !0;
                const e = [...i.children].reverse(),
                  n = e.find((e) => this.startKeywords.includes(e.type));
                let o = e.find((e) => e.type == this.blockNodeType);
                if (n) {
                  switch (this.languageId) {
                    case "python": {
                      "try" == n.type &&
                        "identifier" == r.type &&
                        r.text.length > 4 &&
                        (o = e
                          .find((e) => e.hasError())
                          ?.children.find((e) => "block" == e.type));
                      const t = e.find((e) => ":" == e.type);
                      if (t && n.endIndex <= t.startIndex && t.nextSibling) {
                        if ("def" == n.type) {
                          const e = t.nextSibling;
                          if (
                            "ERROR" == e.type &&
                            ('"""' == e.text || "'''" == e.text)
                          )
                            return !0;
                        }
                        return !1;
                      }
                      break;
                    }
                    case "javascript": {
                      const t = e.find((e) => "formal_parameters" == e.type);
                      if ("class" == n.type && t) return !0;
                      const r = e.find((e) => "{" == e.type);
                      if (
                        r &&
                        r.startIndex > n.endIndex &&
                        null != r.nextSibling
                      )
                        return !1;
                      if (e.find((e) => "do" == e.type) && "while" == n.type)
                        return !1;
                      if (
                        "=>" == n.type &&
                        n.nextSibling &&
                        "{" != n.nextSibling.type
                      )
                        return !1;
                      break;
                    }
                    case "typescript": {
                      const t = e.find((e) => "{" == e.type);
                      if (
                        t &&
                        t.startIndex > n.endIndex &&
                        null != t.nextSibling
                      )
                        return !1;
                      if (e.find((e) => "do" == e.type) && "while" == n.type)
                        return !1;
                      if (
                        "=>" == n.type &&
                        n.nextSibling &&
                        "{" != n.nextSibling.type
                      )
                        return !1;
                      break;
                    }
                  }
                  return (
                    !(o && o.startIndex > n.endIndex) || this.isBlockEmpty(o, t)
                  );
                }
              }
              if (null != s) {
                const e = this.nodeMatch[s.type],
                  n = s.children
                    .slice()
                    .reverse()
                    .find((t) => t.type == e);
                if (n) return this.isBlockEmpty(n, t);
                if (this.nodeTypesWithBlockOrStmtChild.has(s.type)) {
                  const e = this.nodeTypesWithBlockOrStmtChild.get(s.type),
                    t = "" == e ? s.children[0] : s.childForFieldName(e);
                  if (
                    t &&
                    t.type != this.blockNodeType &&
                    t.type != this.emptyStatementType
                  )
                    return !1;
                }
                return !0;
              }
              return !1;
            } finally {
              n.delete();
            }
          }
        }
        const u = {
          python: new l(
            "python",
            {
              class_definition: "block",
              elif_clause: "block",
              else_clause: "block",
              except_clause: "block",
              finally_clause: "block",
              for_statement: "block",
              function_definition: "block",
              if_statement: "block",
              try_statement: "block",
              while_statement: "block",
              with_statement: "block",
            },
            new Map(),
            [
              "def",
              "class",
              "if",
              "elif",
              "else",
              "for",
              "while",
              "try",
              "except",
              "finally",
              "with",
            ],
            "block",
            null,
            !1
          ),
          javascript: new l(
            "javascript",
            {
              arrow_function: "statement_block",
              catch_clause: "statement_block",
              do_statement: "statement_block",
              else_clause: "statement_block",
              finally_clause: "statement_block",
              for_in_statement: "statement_block",
              for_statement: "statement_block",
              function: "statement_block",
              function_declaration: "statement_block",
              generator_function: "statement_block",
              generator_function_declaration: "statement_block",
              if_statement: "statement_block",
              method_definition: "statement_block",
              try_statement: "statement_block",
              while_statement: "statement_block",
              with_statement: "statement_block",
              class: "class_body",
              class_declaration: "class_body",
            },
            new Map([
              ["arrow_function", "body"],
              ["do_statement", "body"],
              ["else_clause", ""],
              ["for_in_statement", "body"],
              ["for_statement", "body"],
              ["if_statement", "consequence"],
              ["while_statement", "body"],
              ["with_statement", "body"],
            ]),
            [
              "=>",
              "try",
              "catch",
              "finally",
              "do",
              "for",
              "if",
              "else",
              "while",
              "with",
              "function",
              "function*",
              "class",
            ],
            "statement_block",
            "empty_statement",
            !0
          ),
          typescript: new l(
            "typescript",
            {
              ambient_declaration: "statement_block",
              arrow_function: "statement_block",
              catch_clause: "statement_block",
              do_statement: "statement_block",
              else_clause: "statement_block",
              finally_clause: "statement_block",
              for_in_statement: "statement_block",
              for_statement: "statement_block",
              function: "statement_block",
              function_declaration: "statement_block",
              generator_function: "statement_block",
              generator_function_declaration: "statement_block",
              if_statement: "statement_block",
              internal_module: "statement_block",
              method_definition: "statement_block",
              module: "statement_block",
              try_statement: "statement_block",
              while_statement: "statement_block",
              abstract_class_declaration: "class_body",
              class: "class_body",
              class_declaration: "class_body",
            },
            new Map([
              ["arrow_function", "body"],
              ["do_statement", "body"],
              ["else_clause", ""],
              ["for_in_statement", "body"],
              ["for_statement", "body"],
              ["if_statement", "consequence"],
              ["while_statement", "body"],
              ["with_statement", "body"],
            ]),
            [
              "declare",
              "=>",
              "try",
              "catch",
              "finally",
              "do",
              "for",
              "if",
              "else",
              "while",
              "with",
              "function",
              "function*",
              "class",
            ],
            "statement_block",
            "empty_statement",
            !0
          ),
          tsx: new l(
            "typescriptreact",
            {
              ambient_declaration: "statement_block",
              arrow_function: "statement_block",
              catch_clause: "statement_block",
              do_statement: "statement_block",
              else_clause: "statement_block",
              finally_clause: "statement_block",
              for_in_statement: "statement_block",
              for_statement: "statement_block",
              function: "statement_block",
              function_declaration: "statement_block",
              generator_function: "statement_block",
              generator_function_declaration: "statement_block",
              if_statement: "statement_block",
              internal_module: "statement_block",
              method_definition: "statement_block",
              module: "statement_block",
              try_statement: "statement_block",
              while_statement: "statement_block",
              abstract_class_declaration: "class_body",
              class: "class_body",
              class_declaration: "class_body",
            },
            new Map([
              ["arrow_function", "body"],
              ["do_statement", "body"],
              ["else_clause", ""],
              ["for_in_statement", "body"],
              ["for_statement", "body"],
              ["if_statement", "consequence"],
              ["while_statement", "body"],
              ["with_statement", "body"],
            ]),
            [
              "declare",
              "=>",
              "try",
              "catch",
              "finally",
              "do",
              "for",
              "if",
              "else",
              "while",
              "with",
              "function",
              "function*",
              "class",
            ],
            "statement_block",
            "empty_statement",
            !0
          ),
          go: new o(
            "go",
            "{}",
            /\b(func|if|else|for)\b/,
            {
              communication_case: "block",
              default_case: "block",
              expression_case: "block",
              for_statement: "block",
              func_literal: "block",
              function_declaration: "block",
              if_statement: "block",
              labeled_statement: "block",
              method_declaration: "block",
              type_case: "block",
            },
            new Map()
          ),
          ruby: new o(
            "ruby",
            "end",
            /\b(BEGIN|END|case|class|def|do|else|elsif|for|if|module|unless|until|while)\b|->/,
            {
              begin_block: "}",
              block: "}",
              end_block: "}",
              lambda: "block",
              for: "do",
              until: "do",
              while: "do",
              case: "end",
              do: "end",
              if: "end",
              method: "end",
              module: "end",
              unless: "end",
              do_block: "end",
            },
            new Map()
          ),
        };
        function p(e) {
          return u[(0, r.languageIdToWasmLanguage)(e)];
        }
        (t.getBlockParser = p),
          (t.isEmptyBlockStart = async function (e, t, n) {
            return (
              !!(0, r.isSupportedLanguageId)(e) && p(e).isEmptyBlockStart(t, n)
            );
          }),
          (t.isBlockBodyFinished = async function (e, t, n, i) {
            if ((0, r.isSupportedLanguageId)(e))
              return p(e).isBlockBodyFinished(t, n, i);
          }),
          (t.getNodeStart = async function (e, t, n) {
            if ((0, r.isSupportedLanguageId)(e)) return p(e).getNodeStart(t, n);
          });
      },
      8312: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getPrompt =
            t.newLineEnded =
            t.normalizeLanguageId =
            t.PromptOptions =
            t.SuffixStartMode =
            t.SuffixMatchOption =
            t.SuffixOption =
            t.LineEndingOptions =
            t.LocalImportContextOption =
            t.SnippetSelectionOption =
            t.SnippetPositionOption =
            t.PathMarkerOption =
            t.LanguageMarkerOption =
            t.DEFAULT_NUM_OF_SNIPPETS =
            t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING =
            t.MAX_EDIT_DISTANCE_LENGTH =
            t.MAX_PROMPT_LENGTH =
              void 0);
        const r = n(2417),
          i = n(5179),
          o = n(7670),
          s = n(6845),
          a = n(9125),
          c = n(4830),
          l = n(2395),
          u = n(1145),
          p = n(4456);
        let d = {
          text: "",
          tokens: [],
        };
        var h, f, m, g, y, _, v, b, E;
        (t.MAX_PROMPT_LENGTH = 1500),
          (t.MAX_EDIT_DISTANCE_LENGTH = 50),
          (t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = 5),
          (t.DEFAULT_NUM_OF_SNIPPETS = 4),
          (function (e) {
            (e.NoMarker = "nomarker"), (e.Top = "top"), (e.Always = "always");
          })((h = t.LanguageMarkerOption || (t.LanguageMarkerOption = {}))),
          (function (e) {
            (e.NoMarker = "nomarker"), (e.Top = "top"), (e.Always = "always");
          })((f = t.PathMarkerOption || (t.PathMarkerOption = {}))),
          (function (e) {
            (e.TopOfText = "top"),
              (e.DirectlyAboveCursor = "aboveCursor"),
              (e.AfterSiblings = "afterSiblings");
          })((m = t.SnippetPositionOption || (t.SnippetPositionOption = {}))),
          (function (e) {
            (e.BestMatch = "bestMatch"), (e.TopK = "topK");
          })((g = t.SnippetSelectionOption || (t.SnippetSelectionOption = {}))),
          (function (e) {
            (e.NoContext = "nocontext"), (e.Declarations = "declarations");
          })(
            (y =
              t.LocalImportContextOption || (t.LocalImportContextOption = {}))
          ),
          (function (e) {
            (e.ConvertToUnix = "unix"), (e.KeepOriginal = "keep");
          })((_ = t.LineEndingOptions || (t.LineEndingOptions = {}))),
          ((E = t.SuffixOption || (t.SuffixOption = {})).None = "none"),
          (E.FifteenPercent = "fifteenPercent"),
          (function (e) {
            (e.Equal = "equal"), (e.Levenshtein = "levenshteineditdistance");
          })((v = t.SuffixMatchOption || (t.SuffixMatchOption = {}))),
          (function (e) {
            (e.Cursor = "cursor"),
              (e.CursorTrimStart = "cursortrimstart"),
              (e.SiblingBlock = "siblingblock"),
              (e.SiblingBlockTrimStart = "siblingblocktrimstart");
          })((b = t.SuffixStartMode || (t.SuffixStartMode = {})));
        class w {
          constructor(e, n) {
            if (
              ((this.fs = e),
              (this.maxPromptLength = t.MAX_PROMPT_LENGTH),
              (this.languageMarker = h.Top),
              (this.pathMarker = f.Top),
              (this.localImportContext = y.Declarations),
              (this.snippetPosition = m.TopOfText),
              (this.numberOfSnippets = t.DEFAULT_NUM_OF_SNIPPETS),
              (this.snippetProviderOptions = {
                "neighboring-tabs": {
                  normalizationFunction: "affine",
                  normalizationParams: [1, 0],
                },
                retrieval: {
                  normalizationFunction: "affine",
                  normalizationParams: [-1, 0],
                },
                "symbol-def": {
                  normalizationFunction: "affine",
                  normalizationParams: [1, 0],
                  reservedSnippetCount: 2,
                },
              }),
              (this.neighboringTabs = a.NeighboringTabsOption.Eager),
              (this.neighboringSnippetTypes =
                a.NeighboringSnippetType.NeighboringSnippets),
              (this.lineEnding = _.ConvertToUnix),
              (this.suffixPercent = 0),
              (this.snippetPercent = 0),
              (this.suffixStartMode = b.Cursor),
              (this.tokenizerName = u.TokenizerName.cushman001),
              (this.suffixMatchThreshold = 0),
              (this.suffixMatchCriteria = v.Levenshtein),
              (this.fimSuffixLengthThreshold = 0),
              (this.cursorContextFix = !1),
              (this.cursorSnippetsPickingStrategy =
                s.CursorSnippetsPickingStrategy.CursorJaccard),
              n)
            ) {
              const e = n?.snippetSelection;
              if (e && !Object.values(g).includes(e))
                throw new Error(`Invalid value for snippetSelection: ${e}`);
              for (const e in n)
                if ("snippetProviderOptions" !== e) this[e] = n[e];
                else {
                  const e = n.snippetProviderOptions || {};
                  let t;
                  for (t in e) {
                    const n = e[t];
                    n &&
                      (this.snippetProviderOptions[t] = {
                        ...this.snippetProviderOptions[t],
                        ...n,
                      });
                  }
                }
            }
            if (this.suffixPercent < 0 || this.suffixPercent > 100)
              throw new Error(
                `suffixPercent must be between 0 and 100, but was ${this.suffixPercent}`
              );
            if (this.snippetPercent < 0 || this.snippetPercent > 100)
              throw new Error(
                `snippetPercent must be between 0 and 100, but was ${this.snippetPercent}`
              );
            if (
              this.suffixMatchThreshold < 0 ||
              this.suffixMatchThreshold > 100
            )
              throw new Error(
                `suffixMatchThreshold must be at between 0 and 100, but was ${this.suffixMatchThreshold}`
              );
            if (this.fimSuffixLengthThreshold < -1)
              throw new Error(
                `fimSuffixLengthThreshold must be at least -1, but was ${this.fimSuffixLengthThreshold}`
              );
            if (
              void 0 !== this.indentationMinLength &&
              void 0 !== this.indentationMaxLength
            ) {
              if (this.indentationMinLength > this.indentationMaxLength)
                throw new Error(
                  `indentationMinLength must be less than or equal to indentationMaxLength, but was ${this.indentationMinLength} and ${this.indentationMaxLength}`
                );
              if (this.indentationMinLength < 0)
                throw new Error(
                  `indentationMinLength must be greater than or equal to zero but was ${this.indentationMinLength}`
                );
            }
            if (
              this.snippetSelection === g.TopK &&
              void 0 === this.snippetSelectionK
            )
              throw new Error("snippetSelectionK must be defined.");
            if (
              this.snippetSelection === g.TopK &&
              this.snippetSelectionK &&
              this.snippetSelectionK <= 0
            )
              throw new Error(
                `snippetSelectionK must be greater than 0, but was ${this.snippetSelectionK}`
              );
          }
        }
        t.PromptOptions = w;
        const T = {
          javascriptreact: "javascript",
          jsx: "javascript",
          typescriptreact: "typescript",
          jade: "pug",
          cshtml: "razor",
        };
        function S(e) {
          return (e = e.toLowerCase()), T[e] ?? e;
        }
        function x(e) {
          return "" === e || e.endsWith("\n") ? e : e + "\n";
        }
        (t.normalizeLanguageId = S),
          (t.newLineEnded = x),
          (t.getPrompt = async function (e, n, s = {}, g = [], _ = [], E) {
            const T = new w(e, s),
              C = (0, u.getTokenizer)(T.tokenizerName);
            let I = !1;
            const { source: A, offset: k } = n;
            if (k < 0 || k > A.length)
              throw new Error(`Offset ${k} is out of range.`);
            n.languageId = S(n.languageId);
            const P = new p.Priorities(),
              N = P.justBelow(p.Priorities.TOP),
              O =
                T.languageMarker === h.Always
                  ? P.justBelow(p.Priorities.TOP)
                  : P.justBelow(N),
              R =
                T.pathMarker === f.Always
                  ? P.justBelow(p.Priorities.TOP)
                  : P.justBelow(N),
              M = P.justBelow(N),
              L = P.justBelow(M),
              D = P.justAbove(N),
              B = new p.PromptWishlist(C, T.lineEnding);
            let F, j;
            if (T.languageMarker !== h.NoMarker) {
              const e = x((0, r.getLanguageMarker)(n));
              F = B.append(e, p.PromptElementKind.LanguageMarker, O);
            }
            if (T.pathMarker !== f.NoMarker) {
              const e = x((0, r.getPathMarker)(n));
              e.length > 0 &&
                (j = B.append(e, p.PromptElementKind.PathMarker, R));
            }
            if (T.localImportContext !== y.NoContext)
              for (const e of await (0, i.extractLocalImportContext)(n, T.fs))
                B.append(x(e), p.PromptElementKind.ImportedFile, M);
            const U = [
              ..._,
              ...(T.neighboringTabs === a.NeighboringTabsOption.None ||
              0 === g.length
                ? []
                : await (0, a.getNeighborSnippets)(
                    n,
                    g,
                    T.neighboringSnippetTypes,
                    T.neighboringTabs,
                    T.cursorContextFix,
                    T.indentationMinLength,
                    T.indentationMaxLength,
                    T.snippetSelection,
                    T.snippetSelectionK,
                    E,
                    T.cursorSnippetsPickingStrategy
                  )),
            ];
            function $() {
              const e = Math.round(
                (T.snippetPercent / 100) * T.maxPromptLength
              );
              (0, c.processSnippetsForWishlist)(
                U,
                n.languageId,
                C,
                T.snippetProviderOptions,
                {
                  priorities: P,
                  low: L,
                  high: D,
                },
                T.numberOfSnippets,
                e
              ).forEach((e) => {
                let t = p.PromptElementKind.SimilarFile;
                e.provider === c.SnippetProvider.Retrieval
                  ? (t = p.PromptElementKind.RetrievalSnippet)
                  : e.provider == c.SnippetProvider.SymbolDef &&
                    (t = p.PromptElementKind.SymbolDefinition),
                  B.append(
                    e.announcedSnippet,
                    t,
                    e.priority,
                    e.tokens,
                    e.normalizedScore
                  );
              });
            }
            T.snippetPosition === m.TopOfText && $();
            const V = [];
            let H;
            if (
              ((H = A.substring(0, k)),
              T.snippetPosition === m.DirectlyAboveCursor)
            ) {
              const e = H.lastIndexOf("\n") + 1,
                t = H.substring(0, e),
                n = H.substring(e);
              B.appendLineForLine(
                t,
                p.PromptElementKind.BeforeCursor,
                N
              ).forEach((e) => V.push(e)),
                $(),
                n.length > 0 &&
                  (V.push(B.append(n, p.PromptElementKind.AfterCursor, N)),
                  V.length > 1 && B.require(V[V.length - 2], V[V.length - 1]));
            } else
              B.appendLineForLine(
                H,
                p.PromptElementKind.BeforeCursor,
                N
              ).forEach((e) => V.push(e));
            h.Top === T.languageMarker &&
              V.length > 0 &&
              void 0 !== F &&
              B.require(F, V[0]),
              f.Top === T.pathMarker &&
                V.length > 0 &&
                void 0 !== j &&
                (F ? B.require(j, F) : B.require(j, V[0])),
              void 0 !== F && void 0 !== j && B.exclude(j, F);
            let q = A.slice(k);
            if (0 === T.suffixPercent || q.length <= T.fimSuffixLengthThreshold)
              return B.fulfill(T.maxPromptLength);
            {
              let e = n.offset;
              T.suffixStartMode !== b.Cursor &&
                T.suffixStartMode !== b.CursorTrimStart &&
                (e = await (0, o.getSiblingFunctionStart)(n));
              const r =
                T.maxPromptLength - t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING;
              let i = Math.floor((r * (100 - T.suffixPercent)) / 100),
                s = B.fulfill(i);
              const a = r - s.prefixLength;
              let c = A.slice(e);
              (T.suffixStartMode !== b.SiblingBlockTrimStart &&
                T.suffixStartMode !== b.CursorTrimStart) ||
                (c = c.trimStart());
              const u = C.takeFirstTokens(c, a);
              if (
                (u.tokens.length <= a - 3 &&
                  ((i = r - u.tokens.length), (s = B.fulfill(i))),
                T.suffixMatchCriteria === v.Equal)
              )
                u.tokens.length === d.tokens.length &&
                  u.tokens.every((e, t) => e === d.tokens[t]) &&
                  (I = !0);
              else if (
                T.suffixMatchCriteria === v.Levenshtein &&
                u.tokens.length > 0 &&
                T.suffixMatchThreshold > 0
              ) {
                const e = (0, l.findEditDistanceScore)(
                  u.tokens.slice(0, t.MAX_EDIT_DISTANCE_LENGTH),
                  d.tokens.slice(0, t.MAX_EDIT_DISTANCE_LENGTH)
                )?.score;
                100 * e <
                  T.suffixMatchThreshold *
                    Math.min(t.MAX_EDIT_DISTANCE_LENGTH, u.tokens.length) &&
                  (I = !0);
              }
              return (
                !0 === I && d.tokens.length <= a
                  ? (d.tokens.length <= a - 3 &&
                      ((i = r - d.tokens.length), (s = B.fulfill(i))),
                    (s.suffix = d.text),
                    (s.suffixLength = d.tokens.length))
                  : ((s.suffix = u.text),
                    (s.suffixLength = u.tokens.length),
                    (d = u)),
                s
              );
            }
          });
      },
      7670: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getSiblingFunctionStart = void 0);
        const r = n(8306);
        t.getSiblingFunctionStart = async function ({
          source: e,
          offset: t,
          languageId: n,
        }) {
          if ((0, r.isSupportedLanguageId)(n)) {
            const i = await (0, r.parseTreeSitter)(n, e);
            try {
              let o = t;
              for (; o >= 0 && /\s/.test(e[o]); ) o--;
              const s = i.rootNode.descendantForIndex(o),
                a = (0, r.getAncestorWithSiblingFunctions)(n, s);
              if (a) {
                for (let e = a.nextSibling; e; e = e.nextSibling)
                  if ((0, r.isFunctionDefinition)(n, e)) {
                    const n =
                      (0, r.getFirstPrecedingComment)(e)?.startIndex ??
                      e.startIndex;
                    if (n < t) continue;
                    return n;
                  }
                if (a.endIndex >= t) return a.endIndex;
              }
            } finally {
              i.delete();
            }
          }
          return t;
        };
      },
      648: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getCursorContext = void 0);
        const r = n(1145),
          i = {
            tokenizerName: r.TokenizerName.cushman002,
          };
        t.getCursorContext = function e(t, n = {}) {
          const o = (function (e) {
              return {
                ...i,
                ...e,
              };
            })(n),
            s = (0, r.getTokenizer)(o.tokenizerName);
          if (o.cursorContextFix) {
            if (void 0 !== o.maxLineCount && o.maxLineCount < 0)
              throw new Error("maxLineCount must be non-negative if defined");
            if (void 0 !== o.maxTokenLength && o.maxTokenLength < 0)
              throw new Error("maxTokenLength must be non-negative if defined");
            if (0 === o.maxLineCount || 0 === o.maxTokenLength)
              return {
                context: "",
                lineCount: 0,
                tokenLength: 0,
                tokenizerName: o.tokenizerName,
              };
            let e = t.source.slice(0, t.offset);
            return (
              void 0 !== o.maxLineCount &&
                (e = e.split("\n").slice(-o.maxLineCount).join("\n")),
              void 0 !== o.maxTokenLength &&
                (e = s.takeLastLinesTokens(e, o.maxTokenLength)),
              {
                context: e,
                lineCount: e.split("\n").length,
                tokenLength: s.tokenLength(e),
                tokenizerName: o.tokenizerName,
              }
            );
          }
          if (void 0 === o.maxTokenLength && void 0 !== o.maxLineCount) {
            const e = t.source
                .slice(0, t.offset)
                .split("\n")
                .slice(-o.maxLineCount),
              n = e.join("\n");
            return {
              context: n,
              lineCount: e.length,
              tokenLength: s.tokenLength(n),
              tokenizerName: o.tokenizerName,
            };
          }
          if (void 0 !== o.maxTokenLength && void 0 === o.maxLineCount) {
            const e = s.takeLastLinesTokens(
              t.source.slice(0, t.offset),
              o.maxTokenLength
            );
            return {
              context: e,
              lineCount: e.split("\n").length,
              tokenLength: s.tokenLength(e),
              tokenizerName: o.tokenizerName,
            };
          }
          if (void 0 !== o.maxTokenLength && void 0 !== o.maxLineCount) {
            const r = e(t, {
              ...n,
              maxTokenLength: void 0,
            });
            return r.tokenLength > o.maxTokenLength
              ? e(t, {
                  ...n,
                  maxLineCount: void 0,
                })
              : r;
          }
          throw new Error(
            "Either maxTokenLength or maxLineCount must be defined"
          );
        };
      },
      6845: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.CursorHistoryMatcher = t.CursorSnippetsPickingStrategy = void 0);
        const r = n(8312),
          i = n(648),
          o = n(9404),
          s = n(1467),
          a = n(4830),
          c = n(5380);
        var l;
        !(function (e) {
          (e.CursorOnly = "cursoronly"),
            (e.CursorJaccard = "cursorjaccard"),
            (e.JaccardCursor = "jaccardcursor");
        })(
          (l =
            t.CursorSnippetsPickingStrategy ||
            (t.CursorSnippetsPickingStrategy = {}))
        );
        const u = new (class {
          constructor(e) {
            (this.keys = []), (this.cache = {}), (this.size = e);
          }
          put(e, t) {
            if (((this.cache[e] = t), this.keys.length > this.size)) {
              this.keys.push(e);
              const t = this.keys.shift() ?? "";
              delete this.cache[t];
            }
          }
          get(e) {
            return this.cache[e];
          }
        })(20);
        class p extends s.WindowedMatcher {
          constructor(e, t, n) {
            super(e, n), (this.windowLength = t), (this.cursorContextFix = n);
          }
          id() {
            return (
              "CustomizedFixedWindowSizeJaccardMatcher:" + this.windowLength
            );
          }
          getWindowsDelineations(e) {
            return (0, c.getBasicWindowDelineations)(this.windowLength, e);
          }
          trimDocument(e) {
            return e.source
              .slice(0, e.offset)
              .split("\n")
              .slice(-this.windowLength)
              .join("\n");
          }
          _getCursorContextInfo(e) {
            return (0, i.getCursorContext)(e, {
              maxLineCount: this.windowLength,
              cursorContextFix: this.cursorContextFix,
            });
          }
          similarityScore(e, t) {
            return (0, o.computeScore)(e, t);
          }
          retrieveAllSnippets(e, t = s.SortOptions.Descending, n) {
            const r = [];
            if (0 === e.source.length || 0 === this.referenceTokens.size)
              return r;
            const i = e.source.split("\n"),
              o = this.id() + ":" + e.source,
              a = u.get(o) ?? [],
              c = 0 == a.length,
              l = c ? i.map(this.tokenizer.tokenize, this.tokenizer) : [];
            for (const [e, [t, o]] of this.getWindowsDelineations(
              i
            ).entries()) {
              if (c) {
                const e = new Set();
                l.slice(t, o).forEach((t) => t.forEach(e.add, e)), a.push(e);
              }
              if (void 0 !== n && n.get(t) !== o) continue;
              const i = a[e],
                s = this.similarityScore(i, this.referenceTokens);
              r.push({
                score: s,
                startLine: t,
                endLine: o,
              });
            }
            return c && u.put(o, a), this.sortScoredSnippets(r, t);
          }
        }
        class d {
          constructor(e, t, n, r, i) {
            (this.windowLength = t),
              (this.lineCursorHistory = n),
              (this.jaccardMatcher = new p(e, t, i)),
              (this.strategy = r);
          }
          sortScoredSnippets(e, t = s.SortOptions.Descending) {
            return t == s.SortOptions.Ascending
              ? e.sort((e, t) => (e.score > t.score ? 1 : -1))
              : t == s.SortOptions.Descending
              ? e.sort((e, t) => (e.score > t.score ? -1 : 1))
              : e;
          }
          markerToSnippet(e, t) {
            return e.map((e) => ({
              snippet: t.slice(e.startLine, e.endLine).join("\n"),
              provider: a.SnippetProvider.NeighboringTabs,
              semantics: a.SnippetSemantics.Snippet,
              ...e,
            }));
          }
          async findMatches(e, t = r.SnippetSelectionOption.BestMatch, n) {
            if (t == r.SnippetSelectionOption.BestMatch) {
              const t = await this.findBestMatch(e);
              return void 0 === t ? [] : [t];
            }
            return (
              (t == r.SnippetSelectionOption.TopK &&
                (await this.findTopKMatches(e, n))) ||
              []
            );
          }
          async findBestMatch(e) {
            if (0 !== e.source.length) {
              if (this.strategy === l.CursorOnly) {
                let t = this.retrieveCursorSnippets(e);
                if (
                  ((t = this.sortScoredSnippets(t, s.SortOptions.Descending)),
                  0 === t.length)
                )
                  return;
                const n = Math.max(...t.map((e) => e.score)),
                  r = t.filter((e) => e.score === n),
                  i = r.sort((e, t) => e.startLine - t.startLine)[
                    Math.floor(r.length / 2)
                  ];
                return {
                  snippet: e.source
                    .split("\n")
                    .slice(i.startLine, i.endLine)
                    .join("\n"),
                  provider: a.SnippetProvider.NeighboringTabs,
                  semantics: a.SnippetSemantics.Snippet,
                  ...i,
                };
              }
              if (this.strategy === l.CursorJaccard) {
                let t = this.retrieveCursorSnippets(e);
                if (
                  ((t = this.sortScoredSnippets(t, s.SortOptions.Descending)),
                  0 === t.length)
                )
                  return;
                const n = Math.max(...t.map((e) => e.score)),
                  r = [],
                  i = new Map();
                for (const e of t)
                  e.score === n && (r.push(e), i.set(e.startLine, e.endLine));
                const o = this.jaccardMatcher.retrieveAllSnippets(
                  e,
                  s.SortOptions.Descending,
                  i
                );
                if (0 === o.length) return;
                const c = o[0];
                for (const e of t)
                  if (e.startLine === c.startLine && e.endLine === c.endLine) {
                    c.score += e.score;
                    break;
                  }
                return {
                  snippet: e.source
                    .split("\n")
                    .slice(c.startLine, c.endLine)
                    .join("\n"),
                  provider: a.SnippetProvider.NeighboringTabs,
                  semantics: a.SnippetSemantics.Snippet,
                  ...c,
                };
              }
              if (this.strategy === l.JaccardCursor) {
                const t = await this.jaccardMatcher.findBestMatch(e);
                if (void 0 === t) return;
                let n = this.retrieveCursorSnippets(e);
                if (
                  ((n = this.sortScoredSnippets(n, s.SortOptions.Descending)),
                  0 === n.length)
                )
                  return;
                for (const e of n)
                  if (e.startLine === t.startLine && e.endLine === t.endLine) {
                    t.score += e.score;
                    break;
                  }
                return t;
              }
            }
          }
          async findTopKMatches(e, t = 1) {
            if (0 === e.source.length || t < 1) return;
            const n = e.source.split("\n");
            let r = this.retrieveCursorSnippets(e);
            if (0 !== r.length) {
              if (this.strategy === l.CursorOnly) {
                r = this.sortScoredSnippets(r, s.SortOptions.Descending);
                let e = this.gatherNonOverlappingSnippets(r, t);
                return this.markerToSnippet(e, n);
              }
              if (this.strategy === l.CursorJaccard) {
                r = this.sortScoredSnippets(r, s.SortOptions.Descending);
                const i = new Map(r.map((e) => [e.startLine, e.endLine])),
                  o = this.jaccardMatcher
                    .retrieveAllSnippets(e, s.SortOptions.Descending, i)
                    .reduce(
                      (e, t) =>
                        e.set([t.startLine, t.endLine].join(","), t.score),
                      new Map()
                    );
                r.forEach(
                  (e) =>
                    (e.score += o.get([e.startLine, e.endLine].join(",")) ?? 0)
                ),
                  (r = this.sortScoredSnippets(r, s.SortOptions.Descending));
                let a = this.gatherNonOverlappingSnippets(r, t);
                return this.markerToSnippet(a, n);
              }
              if (this.strategy === l.JaccardCursor) {
                const i = await this.jaccardMatcher.findTopKMatches(e, t);
                if (void 0 === i) return;
                const o = r.reduce(
                  (e, t) => e.set([t.startLine, t.endLine].join(","), t.score),
                  new Map()
                );
                i.forEach(
                  (e) =>
                    (e.score += o.get([e.startLine, e.endLine].join(",")) ?? 0)
                );
                const a = this.sortScoredSnippets(i, s.SortOptions.Descending);
                return this.markerToSnippet(a, n);
              }
            }
          }
          gatherNonOverlappingSnippets(e, t) {
            let n = [e[0]];
            for (let r = 1; r < e.length && n.length < t; r++)
              -1 ==
                n.findIndex(
                  (t) =>
                    e[r].startLine < t.endLine && e[r].endLine > t.startLine
                ) && n.push(e[r]);
            return n;
          }
          retrieveCursorSnippets(e) {
            const t = [];
            if (0 === e.source.length) return t;
            const n = this.lineCursorHistory.get(e.uri);
            if (void 0 === n) return t;
            const r = e.source.split("\n");
            let i;
            !(function (e) {
              (e[(e.leftBoundary = 0)] = "leftBoundary"),
                (e[(e.rightBoundary = 1)] = "rightBoundary");
            })(i || (i = {}));
            let o = [];
            for (const [e, t] of n.entries())
              e >= r.length ||
                (o.push([
                  Math.max(0, e - this.windowLength + 1),
                  i.leftBoundary,
                  t,
                ]),
                o.push([e + 1, i.rightBoundary, t]));
            o.push([r.length, i.leftBoundary, 0]),
              (o = o.sort((e, t) => e[0] - t[0]));
            let s = 0,
              a = 0;
            for (const [e, n, c] of o) {
              if (s > 0)
                for (
                  let n = a;
                  n < e && (0 == n || n + this.windowLength <= r.length);
                  n++
                )
                  t.push({
                    score: s,
                    startLine: n,
                    endLine: Math.min(r.length, n + this.windowLength),
                  });
              n === i.leftBoundary ? (s += c) : (s -= c), (a = e);
            }
            return t;
          }
        }
        (t.CursorHistoryMatcher = d),
          (d.FACTORY = (e, t, n, r) => ({
            to: (i) => new d(i, e, t, n, r),
          }));
      },
      9404: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.computeScore =
            t.FunctionJaccardMatcher =
            t.IndentationBasedJaccardMatcher =
            t.FixedWindowSizeJaccardMatcher =
              void 0);
        const r = n(648),
          i = n(1467),
          o = n(5380);
        class s extends i.WindowedMatcher {
          constructor(e, t, n) {
            super(e, n), (this.windowLength = t), (this.cursorContextFix = n);
          }
          id() {
            return "fixed:" + this.windowLength;
          }
          getWindowsDelineations(e) {
            return (0, o.getBasicWindowDelineations)(this.windowLength, e);
          }
          trimDocument(e) {
            return e.source
              .slice(0, e.offset)
              .split("\n")
              .slice(-this.windowLength)
              .join("\n");
          }
          _getCursorContextInfo(e) {
            return (0, r.getCursorContext)(e, {
              maxLineCount: this.windowLength,
              cursorContextFix: this.cursorContextFix,
            });
          }
          similarityScore(e, t) {
            return l(e, t);
          }
        }
        (t.FixedWindowSizeJaccardMatcher = s),
          (s.FACTORY = (e, t) => ({
            to: (n) => new s(n, e, t),
          }));
        class a extends i.WindowedMatcher {
          constructor(e, t, n, r) {
            super(e, r),
              (this.indentationMinLength = t),
              (this.indentationMaxLength = n),
              (this.languageId = e.languageId),
              (this.cursorContextFix = r);
          }
          id() {
            return `indent:${this.indentationMinLength}:${this.indentationMaxLength}:${this.languageId}`;
          }
          getWindowsDelineations(e) {
            const t = (0, o.getIndentationWindowsDelineations)(
              e,
              this.languageId,
              this.indentationMinLength,
              this.indentationMaxLength
            );
            return t.length > 0
              ? t
              : e.length < this.indentationMinLength
              ? [[0, e.length]]
              : [];
          }
          trimDocument(e) {
            return e.source
              .slice(0, e.offset)
              .split("\n")
              .slice(-this.indentationMaxLength)
              .join("\n");
          }
          _getCursorContextInfo(e) {
            return (0, r.getCursorContext)(e, {
              maxLineCount: this.indentationMaxLength,
              cursorContextFix: this.cursorContextFix,
            });
          }
          similarityScore(e, t) {
            return l(e, t);
          }
        }
        (t.IndentationBasedJaccardMatcher = a),
          (a.FACTORY = (e, t, n) => ({
            to: (r) => new a(r, e, t, n),
          }));
        class c extends i.FunctionalMatcher {
          id() {
            return "function:" + this.windowLength;
          }
          getWindowsDelineations(e) {
            return void 0 !== this.indentationMaxLength &&
              void 0 !== this.indentationMinLength
              ? (0, o.getIndentationWindowsDelineations)(
                  e,
                  this.languageId,
                  this.indentationMinLength,
                  this.indentationMaxLength
                )
              : (0, o.getBasicWindowDelineations)(this.windowLength, e);
          }
          constructor(e, t, n, r, i) {
            super(e, n),
              (this.windowLength = t),
              (this.indentationMinLength = r),
              (this.indentationMaxLength = i),
              (this.languageId = e.languageId),
              (this.cursorContextFix = n);
          }
          trimDocument(e) {
            return e.source
              .slice(0, e.offset)
              .split("\n")
              .slice(-this.windowLength)
              .join("\n");
          }
          _getCursorContextInfo(e) {
            return (0, r.getCursorContext)(e, {
              maxLineCount: this.windowLength,
              cursorContextFix: this.cursorContextFix,
            });
          }
          similarityScore(e, t) {
            return l(e, t);
          }
        }
        function l(e, t) {
          const n = new Set();
          return (
            e.forEach((e) => {
              t.has(e) && n.add(e);
            }),
            n.size / (e.size + t.size - n.size)
          );
        }
        (t.FunctionJaccardMatcher = c),
          (c.FACTORY = (e, t, n, r) => ({
            to: (i) => new c(i, e, t, n, r),
          })),
          (t.computeScore = l);
      },
      9125: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getNeighborSnippets =
            t.neighborOptionToSelection =
            t.NeighboringSnippetType =
            t.NeighboringTabsOption =
              void 0);
        const r = n(9491),
          i = n(6845),
          o = n(9404);
        var s, a;
        ((a = t.NeighboringTabsOption || (t.NeighboringTabsOption = {})).None =
          "none"),
          (a.Conservative = "conservative"),
          (a.Medium = "medium"),
          (a.Eager = "eager"),
          (a.EagerButLittle = "eagerButLittle"),
          (a.EagerButMedium = "eagerButMedium"),
          (a.EagerButMuch = "eagerButMuch"),
          (a.RetrievalComparable = "retrievalComparable"),
          (function (e) {
            (e.NeighboringFunctions = "neighboringFunction"),
              (e.NeighboringSnippets = "neighboringSnippet"),
              (e.CursorHistoryMatcher = "cursorhistorymatcher");
          })((s = t.NeighboringSnippetType || (t.NeighboringSnippetType = {}))),
          (t.neighborOptionToSelection = {
            none: {
              snippetLength: 1,
              threshold: -1,
              numberOfSnippets: 0,
            },
            conservative: {
              snippetLength: 10,
              threshold: 0.3,
              numberOfSnippets: 1,
            },
            medium: {
              snippetLength: 20,
              threshold: 0.1,
              numberOfSnippets: 2,
            },
            eager: {
              snippetLength: 60,
              threshold: 0,
              numberOfSnippets: 4,
            },
            eagerButLittle: {
              snippetLength: 10,
              threshold: 0,
              numberOfSnippets: 1,
            },
            eagerButMedium: {
              snippetLength: 20,
              threshold: 0,
              numberOfSnippets: 4,
            },
            eagerButMuch: {
              snippetLength: 60,
              threshold: 0,
              numberOfSnippets: 6,
            },
            retrievalComparable: {
              snippetLength: 30,
              threshold: 0,
              numberOfSnippets: 4,
            },
          }),
          (t.getNeighborSnippets = async function (
            e,
            n,
            a,
            c,
            l,
            u,
            p,
            d,
            h,
            f,
            m
          ) {
            const g = {
                ...t.neighborOptionToSelection[c],
              },
              y = (function (
                e,
                t,
                n,
                a,
                c,
                l,
                u,
                p = i.CursorSnippetsPickingStrategy.CursorJaccard
              ) {
                let d;
                return (
                  t === s.NeighboringSnippets
                    ? (d =
                        void 0 !== c && void 0 !== l
                          ? o.IndentationBasedJaccardMatcher.FACTORY(c, l, a)
                          : o.FixedWindowSizeJaccardMatcher.FACTORY(
                              n.snippetLength,
                              a
                            ))
                    : t === s.NeighboringFunctions
                    ? (d = o.FunctionJaccardMatcher.FACTORY(
                        n.snippetLength,
                        a,
                        c,
                        l
                      ))
                    : ((0, r.ok)(
                        void 0 !== u,
                        "lineCursorHistory should not be undefined"
                      ),
                      (d = i.CursorHistoryMatcher.FACTORY(
                        n.snippetLength,
                        u,
                        p,
                        a
                      ))),
                  d.to(e)
                );
              })(e, a, g, l, u, p, f, m);
            return 0 === g.numberOfSnippets
              ? []
              : (
                  await n
                    .filter((e) => e.source.length < 1e4 && e.source.length > 0)
                    .slice(0, 20)
                    .reduce(
                      async (e, t) =>
                        (
                          await e
                        ).concat(
                          (
                            await y.findMatches(t, d, h)
                          ).map((e) => ({
                            relativePath: t.relativePath,
                            ...e,
                          }))
                        ),
                      Promise.resolve([])
                    )
                )
                  .filter((e) => e.score && e.snippet && e.score > g.threshold)
                  .sort((e, t) => e.score - t.score)
                  .slice(-g.numberOfSnippets);
          });
      },
      1467: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.splitIntoWords =
            t.FunctionalMatcher =
            t.WindowedMatcher =
            t.SortOptions =
              void 0);
        const r = n(8306),
          i = n(8312),
          o = n(4830);
        var s;
        !(function (e) {
          (e.Ascending = "ascending"),
            (e.Descending = "descending"),
            (e.None = "none");
        })((s = t.SortOptions || (t.SortOptions = {})));
        class a {
          constructor(e) {
            this.stopsForLanguage = h.get(e.languageId) ?? d;
          }
          tokenize(e) {
            return new Set(u(e).filter((e) => !this.stopsForLanguage.has(e)));
          }
        }
        const c = new (class {
          constructor(e) {
            (this.keys = []), (this.cache = {}), (this.size = e);
          }
          put(e, t) {
            if (((this.cache[e] = t), this.keys.length > this.size)) {
              this.keys.push(e);
              const t = this.keys.shift() ?? "";
              delete this.cache[t];
            }
          }
          get(e) {
            return this.cache[e];
          }
        })(20);
        class l {
          constructor(e, t) {
            (this.referenceDoc = e),
              (this.tokenizer = new a(e)),
              t ||
                (this._referenceTokens = this.tokenizer.tokenize(
                  this.trimDocument(e)
                ));
          }
          get referenceTokens() {
            return (
              void 0 === this._referenceTokens &&
                (this._referenceTokens = this.tokenizer.tokenize(
                  this._getCursorContextInfo(this.referenceDoc).context
                )),
              this._referenceTokens
            );
          }
          sortScoredSnippets(e, t = s.Descending) {
            return t == s.Ascending
              ? e.sort((e, t) => (e.score > t.score ? 1 : -1))
              : t == s.Descending
              ? e.sort((e, t) => (e.score > t.score ? -1 : 1))
              : e;
          }
          retrieveAllSnippets(e, t = s.Descending) {
            const n = [];
            if (0 === e.source.length || 0 === this.referenceTokens.size)
              return n;
            const r = e.source.split("\n"),
              i = this.id() + ":" + e.source,
              o = c.get(i) ?? [],
              a = 0 == o.length,
              l = a ? r.map(this.tokenizer.tokenize, this.tokenizer) : [];
            for (const [e, [t, i]] of this.getWindowsDelineations(
              r
            ).entries()) {
              if (a) {
                const e = new Set();
                l.slice(t, i).forEach((t) => t.forEach(e.add, e)), o.push(e);
              }
              const r = o[e],
                s = this.similarityScore(r, this.referenceTokens);
              n.push({
                score: s,
                startLine: t,
                endLine: i,
              });
            }
            return a && c.put(i, o), this.sortScoredSnippets(n, t);
          }
          async findMatches(e, t = i.SnippetSelectionOption.BestMatch, n) {
            if (t == i.SnippetSelectionOption.BestMatch) {
              const t = await this.findBestMatch(e);
              return t ? [t] : [];
            }
            return (
              (t == i.SnippetSelectionOption.TopK &&
                (await this.findTopKMatches(e, n))) ||
              []
            );
          }
          async findBestMatch(e) {
            if (0 === e.source.length || 0 === this.referenceTokens.size)
              return;
            const t = e.source.split("\n"),
              n = this.retrieveAllSnippets(e, s.Descending);
            return 0 !== n.length && 0 !== n[0].score
              ? {
                  snippet: t.slice(n[0].startLine, n[0].endLine).join("\n"),
                  semantics: o.SnippetSemantics.Snippet,
                  provider: o.SnippetProvider.NeighboringTabs,
                  ...n[0],
                }
              : void 0;
          }
          async findTopKMatches(e, t = 1) {
            if (
              0 === e.source.length ||
              0 === this.referenceTokens.size ||
              t < 1
            )
              return;
            const n = e.source.split("\n"),
              r = this.retrieveAllSnippets(e, s.Descending);
            if (0 === r.length || 0 === r[0].score) return;
            const i = [r[0]];
            for (let e = 1; e < r.length && i.length < t; e++)
              -1 ==
                i.findIndex(
                  (t) =>
                    r[e].startLine < t.endLine && r[e].endLine > t.startLine
                ) && i.push(r[e]);
            return i.map((e) => ({
              snippet: n.slice(e.startLine, e.endLine).join("\n"),
              semantics: o.SnippetSemantics.Snippet,
              provider: o.SnippetProvider.NeighboringTabs,
              ...e,
            }));
          }
        }
        function u(e) {
          return e.split(/[^a-zA-Z0-9]/).filter((e) => e.length > 0);
        }
        (t.WindowedMatcher = l),
          (t.FunctionalMatcher = class extends l {
            constructor(e, t) {
              super(e, t);
            }
            getMatchingScore(e) {
              const t = this.tokenizer.tokenize(e.source),
                n = this.similarityScore(t, this.referenceTokens);
              return {
                snippet: e.source,
                score: n,
                startLine: 0,
                endLine: 0,
              };
            }
            async findBestMatch(e) {
              const t = await this.findMatches(e);
              if (0 !== t.length && 0 !== t[0].score) return t[0];
            }
            async findMatches(e, t, n) {
              if (0 === e.source.length || 0 === this.referenceTokens.size)
                return [];
              const i = await (async function (e) {
                let t = [];
                if ((0, r.isSupportedLanguageId)(e.languageId)) {
                  const n = await (0, r.getFunctionPositions)(
                    e.languageId,
                    e.source
                  );
                  for (let r = 0; r < n.length; r++) {
                    let { startIndex: i, endIndex: o } = n[r],
                      s = e.source.substring(i, o);
                    t.push({
                      source: s,
                      relativePath: e.relativePath,
                      languageId: e.languageId,
                      uri: e.uri,
                    });
                  }
                }
                return t;
              })(e);
              if (0 == i.length) {
                const t = e.source.split("\n"),
                  n = this.retrieveAllSnippets(e, s.Descending);
                return 0 === n.length || 0 === n[0].score
                  ? []
                  : [
                      {
                        snippet: t
                          .slice(n[0].startLine, n[0].endLine)
                          .join("\n"),
                        semantics: o.SnippetSemantics.Snippet,
                        provider: o.SnippetProvider.NeighboringTabs,
                        ...n[0],
                      },
                    ];
              }
              const a = [];
              for (let e of i) {
                const t = this.getMatchingScore(e);
                a.push({
                  semantics: o.SnippetSemantics.Function,
                  provider: o.SnippetProvider.NeighboringTabs,
                  ...t,
                });
              }
              return a;
            }
          }),
          (t.splitIntoWords = u);
        const p = new Set([
            "we",
            "our",
            "you",
            "it",
            "its",
            "they",
            "them",
            "their",
            "this",
            "that",
            "these",
            "those",
            "is",
            "are",
            "was",
            "were",
            "be",
            "been",
            "being",
            "have",
            "has",
            "had",
            "having",
            "do",
            "does",
            "did",
            "doing",
            "can",
            "don",
            "t",
            "s",
            "will",
            "would",
            "should",
            "what",
            "which",
            "who",
            "when",
            "where",
            "why",
            "how",
            "a",
            "an",
            "the",
            "and",
            "or",
            "not",
            "no",
            "but",
            "because",
            "as",
            "until",
            "again",
            "further",
            "then",
            "once",
            "here",
            "there",
            "all",
            "any",
            "both",
            "each",
            "few",
            "more",
            "most",
            "other",
            "some",
            "such",
            "above",
            "below",
            "to",
            "during",
            "before",
            "after",
            "of",
            "at",
            "by",
            "about",
            "between",
            "into",
            "through",
            "from",
            "up",
            "down",
            "in",
            "out",
            "on",
            "off",
            "over",
            "under",
            "only",
            "own",
            "same",
            "so",
            "than",
            "too",
            "very",
            "just",
            "now",
          ]),
          d = new Set([
            "if",
            "then",
            "else",
            "for",
            "while",
            "with",
            "def",
            "function",
            "return",
            "TODO",
            "import",
            "try",
            "catch",
            "raise",
            "finally",
            "repeat",
            "switch",
            "case",
            "match",
            "assert",
            "continue",
            "break",
            "const",
            "class",
            "enum",
            "struct",
            "static",
            "new",
            "super",
            "this",
            "var",
            ...p,
          ]),
          h = new Map([]);
      },
      4830: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.processSnippetsForWishlist =
            t.selectSnippets =
            t.normalizeSnippetScore =
            t.announceSnippet =
            t.SnippetSemantics =
            t.SnippetProvider =
              void 0);
        const r = n(2417);
        var i, o;
        ((o = t.SnippetProvider || (t.SnippetProvider = {})).NeighboringTabs =
          "neighboring-tabs"),
          (o.Retrieval = "retrieval"),
          (o.SymbolDef = "symbol-def"),
          (function (e) {
            (e.Function = "function"),
              (e.Snippet = "snippet"),
              (e.Variable = "variable"),
              (e.Parameter = "parameter"),
              (e.Method = "method"),
              (e.Class = "class"),
              (e.Module = "module"),
              (e.Alias = "alias"),
              (e.Enum = "enum member"),
              (e.Interface = "interface");
          })((i = t.SnippetSemantics || (t.SnippetSemantics = {})));
        const s = {
          [i.Function]: "function",
          [i.Snippet]: "snippet",
          [i.Variable]: "variable",
          [i.Parameter]: "parameter",
          [i.Method]: "method",
          [i.Class]: "class",
          [i.Module]: "module",
          [i.Alias]: "alias",
          [i.Enum]: "enum member",
          [i.Interface]: "interface",
        };
        function a(e, t) {
          const n = s[e.semantics];
          let i =
            (e.relativePath
              ? `Compare this ${n} from ${e.relativePath}:`
              : `Compare this ${n}:`) +
            "\n" +
            e.snippet;
          return (
            i.endsWith("\n") || (i += "\n"), (0, r.commentBlockAsSingles)(i, t)
          );
        }
        function c(e, t) {
          const n = t[e.provider];
          if (!n) throw new Error("Unknown snippet provider: " + e.provider);
          const { score: r, ...i } = e;
          let o = r;
          if ("affine" !== n.normalizationFunction)
            throw new Error(
              `Unknown normalization function ${n.normalizationFunction} for snippet provider ${e.provider}`
            );
          {
            const [e, t] = n.normalizationParams;
            o = e * r + t;
          }
          return {
            ...i,
            providerScore: r,
            normalizedScore: o,
          };
        }
        function l(e) {
          e.sort((e, t) => t.normalizedScore - e.normalizedScore);
        }
        function u(e, t, n) {
          if (0 == t)
            return {
              reserved: [],
              candidates: [],
            };
          const r = e.map((e) => c(e, n)),
            i = new Map();
          let o;
          for (o in n) i.set(o, []);
          for (const e of r) {
            let t = i.get(e.provider);
            if (!t) throw new Error("Unknown snippet provider: " + e.provider);
            t.push(e);
          }
          for (const [e, t] of i) l(t);
          let s = [];
          for (o in n) {
            const e = n[o].reservedSnippetCount || 0;
            if (e > 0) {
              const t = i.get(o) || [];
              (s = s.concat(t.slice(0, e))), i.set(o, t.slice(e));
            }
          }
          l(s);
          let a = [];
          if (s.length > t)
            throw new Error(
              "Reserved snippet count exceeds number of snippets"
            );
          if (s.length < t) {
            const e = Array.from(i.values()).flat();
            l(e), (a = e.slice(0, t - s.length));
          }
          return {
            reserved: s,
            candidates: a,
          };
        }
        (t.announceSnippet = a),
          (t.normalizeSnippetScore = c),
          (t.selectSnippets = u),
          (t.processSnippetsForWishlist = function (e, t, n, r, i, o, s) {
            const { reserved: c, candidates: p } = u(e, o, r);
            let d = 0,
              h = [],
              f = i.high,
              m = i.low;
            function g(e, r) {
              const o = a(e, t),
                c = n.tokenLength(o);
              let l;
              return (
                r + c <= s
                  ? ((l = f), (f = i.priorities.justBelow(l)))
                  : ((l = m), (m = i.priorities.justBelow(l))),
                h.push({
                  announcedSnippet: o,
                  provider: e.provider,
                  providerScore: e.providerScore,
                  normalizedScore: e.normalizedScore,
                  priority: l,
                  tokens: c,
                  relativePath: e.relativePath,
                }),
                r + c
              );
            }
            for (const e of [...c, ...p]) {
              if (h.length >= o) break;
              d = g(e, d);
            }
            return l(h), h.reverse(), h;
          });
      },
      5380: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getIndentationWindowsDelineations = t.getBasicWindowDelineations =
            void 0);
        const r = n(8617),
          i = n(3469);
        (t.getBasicWindowDelineations = function (e, t) {
          const n = [],
            r = t.length;
          if (0 == r) return [];
          if (r < e) return [[0, r]];
          for (let t = 0; t < r - e + 1; t++) n.push([t, t + e]);
          return n;
        }),
          (t.getIndentationWindowsDelineations = function (e, t, n, o) {
            if (e.length < n || 0 == o) return [];
            const s = [],
              a = (0, r.clearLabels)((0, i.parseTree)(e.join("\n"), t));
            return (
              (0, r.visitTree)(
                a,
                (e) => {
                  if ("blank" === e.type)
                    return void (e.label = {
                      totalLength: 1,
                      firstLineAfter: e.lineNumber + 1,
                    });
                  let t = "line" === e.type ? 1 : 0,
                    r = "line" === e.type ? e.lineNumber + 1 : NaN;
                  function i(n) {
                    return -1 == n
                      ? r - t
                      : e.subs[n].label.firstLineAfter -
                          e.subs[n].label.totalLength;
                  }
                  function a(t, n) {
                    return 0 == t ? n + 1 : e.subs[t - 1].label.firstLineAfter;
                  }
                  let c = "line" === e.type ? -1 : 0,
                    l = "line" === e.type ? 1 : 0,
                    u = 0;
                  for (let p = 0; p < e.subs.length; p++) {
                    for (
                      ;
                      c >= 0 && c < e.subs.length && "blank" === e.subs[c].type;

                    )
                      (l -= e.subs[c].label.totalLength), c++;
                    if (
                      ("blank" !== e.subs[p].type && (u = p),
                      (r = e.subs[p].label.firstLineAfter),
                      (t += e.subs[p].label.totalLength),
                      (l += e.subs[p].label.totalLength),
                      l > o)
                    ) {
                      const t = i(c),
                        r = a(p, t),
                        d = u == p ? r : a(u, t);
                      for (n <= r - t && s.push([t, d]); l > o; )
                        (l -=
                          -1 == c
                            ? "line" == e.type
                              ? 1
                              : 0
                            : e.subs[c].label.totalLength),
                          c++;
                    }
                  }
                  if (c < e.subs.length) {
                    const t = i(c),
                      o = r,
                      a = -1 == c ? o : e.subs[u].label.firstLineAfter;
                    n <= o - t && s.push([t, a]);
                  }
                  e.label = {
                    totalLength: t,
                    firstLineAfter: r,
                  };
                },
                "bottomUp"
              ),
              s
                .sort((e, t) => e[0] - t[0] || e[1] - t[1])
                .filter(
                  (e, t, n) =>
                    0 == t || e[0] != n[t - 1][0] || e[1] != n[t - 1][1]
                )
            );
          });
      },
      2395: (e, t) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.findEditDistanceScore = void 0),
          (t.findEditDistanceScore = function (e, t) {
            if (0 === e.length || 0 === t.length)
              return {
                score: e.length + t.length,
              };
            const n = Array.from({
              length: e.length,
            }).map(() =>
              Array.from({
                length: t.length,
              }).map(() => 0)
            );
            for (let t = 0; t < e.length; t++) n[t][0] = t;
            for (let e = 0; e < t.length; e++) n[0][e] = e;
            for (let r = 0; r < t.length; r++)
              for (let i = 0; i < e.length; i++)
                n[i][r] = Math.min(
                  (0 == i ? r : n[i - 1][r]) + 1,
                  (0 == r ? i : n[i][r - 1]) + 1,
                  (0 == i || 0 == r ? Math.max(i, r) : n[i - 1][r - 1]) +
                    (e[i] == t[r] ? 0 : 1)
                );
            return {
              score: n[e.length - 1][t.length - 1],
            };
          });
      },
      1145: function (e, t, n) {
        "use strict";

        var r =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, r) {
                  void 0 === r && (r = n);
                  var i = Object.getOwnPropertyDescriptor(t, n);
                  (i &&
                    !("get" in i
                      ? !t.__esModule
                      : i.writable || i.configurable)) ||
                    (i = {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    }),
                    Object.defineProperty(e, r, i);
                }
              : function (e, t, n, r) {
                  void 0 === r && (r = n), (e[r] = t[n]);
                }),
          i =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                "default" === n ||
                  Object.prototype.hasOwnProperty.call(t, n) ||
                  r(t, e, n);
            };
        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          i(n(9323), t);
      },
      9323: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.getTokenizer = t.TokenizerName = void 0);
        const r = n(7147),
          i = n(1017),
          o = n(3837),
          s = (e, t) => Array.from(Array(t).keys()).slice(e),
          a = (e) => e.charCodeAt(0),
          c = new o.TextDecoder("utf-8"),
          l = (e) => c.decode(new Uint8Array(e));
        function u(e) {
          const t = new Set();
          let n = e[0];
          for (let r = 1; r < e.length; r++) {
            const i = e[r];
            t.add([n, i]), (n = i);
          }
          return t;
        }
        const p =
          /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
        var d;
        !(function (e) {
          (e.cushman001 = "cushman001"),
            (e.cushman002 = "cushman002"),
            (e.mock = "mock");
        })((d = t.TokenizerName || (t.TokenizerName = {})));
        const h = new Map();
        t.getTokenizer = function (e = d.cushman002) {
          let t = h.get(e);
          return (
            void 0 !== t ||
              ((t = e === d.mock ? new m() : new f(e)), h.set(e, t)),
            t
          );
        };
        class f {
          constructor(e = d.cushman002) {
            (this.decoder = new Map()),
              (this.byte_encoder = new Map()),
              (this.byte_decoder = new Map()),
              (this.cache = new Map()),
              (this.textEncoder = new o.TextEncoder()),
              (this.encodeStr = (e) => Array.from(this.textEncoder.encode(e)));
            let t = "",
              n = "";
            if (e === d.cushman001)
              (t = "vocab_cushman001.bpe"), (n = "tokenizer_cushman001.json");
            else {
              if (e !== d.cushman002)
                throw new Error(`Unknown tokenizer name: ${e}`);
              (t = "vocab_cushman002.bpe"), (n = "tokenizer_cushman002.json");
            }
            const c = r.readFileSync(i.resolve(__dirname, "resources", e, n)),
              l = JSON.parse(c.toString());
            this.encoder = new Map(Object.entries(l));
            for (let [e, t] of this.encoder) this.decoder.set(t, e);
            const u = r
              .readFileSync(i.resolve(__dirname, "resources", e, t), "utf-8")
              .split("\n")
              .slice(1)
              .filter((e) => e.trim().length > 0);
            (this.bpe_ranks = ((e, t) => {
              const n = new Map();
              return (
                e.forEach((r, i) => {
                  n.set(e[i], t[i]);
                }),
                n
              );
            })(u, s(0, u.length))),
              (function (e) {
                const t = s(a("!"), a("~") + 1).concat(
                  s(a("¡"), a("¬") + 1),
                  s(a("®"), a("ÿ") + 1)
                );
                let n = t.slice(),
                  r = 0;
                for (let e = 0; e < 256; e++)
                  t.includes(e) || (t.push(e), n.push(256 + r), (r += 1));
                const i = n.map((e) => ((e) => String.fromCharCode(e))(e));
                for (let n = 0; n < t.length; n++) e.set(t[n], i[n]);
              })(this.byte_encoder),
              this.byte_encoder.forEach((e, t, n) => {
                this.byte_decoder.set(e, t);
              });
          }
          byteEncodeStr(e) {
            return this.encodeStr(e).map((e) => this.byte_encoder.get(e));
          }
          bpe(e) {
            if (this.cache.has(e)) return this.cache.get(e);
            let t = this.byteEncodeStr(e),
              n = u(t);
            if (!n) return t.map((e) => this.encoder.get(e));
            for (;;) {
              const e = new Map();
              n.forEach((t) => {
                const n = t.join(" "),
                  r = this.bpe_ranks.get(n);
                e.set(void 0 === r || isNaN(r) ? 1e11 : r, t);
              });
              const r = Array.from(e.keys()).map((e) => Number(e)),
                i = e.get(Math.min(...r));
              if (!i || !this.bpe_ranks.has(i.join(" "))) break;
              const o = i[0],
                s = i[1];
              let a = [],
                c = 0;
              for (; c < t.length; ) {
                const e = t.indexOf(o, c);
                if (-1 === e) {
                  Array.prototype.push.apply(a, t.slice(c));
                  break;
                }
                Array.prototype.push.apply(a, t.slice(c, e)),
                  (c = e),
                  t[c] === o && c < t.length - 1 && t[c + 1] === s
                    ? (a.push(o + s), (c += 2))
                    : (a.push(t[c]), (c += 1));
              }
              if (((t = a), 1 === t.length)) break;
              n = u(t);
            }
            const r = t.map((e) => this.encoder.get(e));
            return this.cache.set(e, r), r;
          }
          tokenize(e) {
            let t = [];
            const n = Array.from(e.matchAll(p)).map((e) => e[0]);
            for (let e of n) {
              const n = this.bpe(e);
              Array.prototype.push.apply(t, n);
            }
            return t;
          }
          tokenLength(e) {
            return this.tokenize(e).length;
          }
          takeLastTokens(e, t) {
            if (t <= 0) return "";
            let n = Math.min(e.length, 4 * t),
              r = e.slice(-n),
              i = this.tokenize(r);
            for (; i.length < t + 2 && n < e.length; )
              (n = Math.min(e.length, n + 1 * t)),
                (r = e.slice(-n)),
                (i = this.tokenize(r));
            return i.length < t ? e : ((i = i.slice(-t)), this.detokenize(i));
          }
          takeFirstTokens(e, t) {
            if (t <= 0)
              return {
                text: "",
                tokens: [],
              };
            let n = Math.min(e.length, 4 * t),
              r = e.slice(0, n),
              i = this.tokenize(r);
            for (; i.length < t + 2 && n < e.length; )
              (n = Math.min(e.length, n + 1 * t)),
                (r = e.slice(0, n)),
                (i = this.tokenize(r));
            return i.length < t
              ? {
                  text: e,
                  tokens: i,
                }
              : ((i = i.slice(0, t)),
                {
                  text: this.detokenize(i),
                  tokens: i,
                });
          }
          takeLastLinesTokens(e, t) {
            const n = this.takeLastTokens(e, t);
            if (n.length === e.length || "\n" === e[e.length - n.length - 1])
              return n;
            let r = n.indexOf("\n");
            return n.substring(r + 1);
          }
          detokenize(e) {
            let t = e.map((e) => this.decoder.get(e)).join("");
            return (t = l(t.split("").map((e) => this.byte_decoder.get(e)))), t;
          }
          tokenizeStrings(e) {
            return this.tokenize(e).map((e) =>
              l(
                this.decoder
                  .get(e)
                  .split("")
                  .map((e) => this.byte_decoder.get(e))
              )
            );
          }
        }
        class m {
          constructor() {
            this.hash = (e) => {
              let t = 0;
              for (let n = 0; n < e.length; n++)
                (t = (t << 5) - t + e.charCodeAt(n)), (t &= 65535 & t);
              return t;
            };
          }
          tokenize(e) {
            return this.tokenizeStrings(e).map(this.hash);
          }
          detokenize(e) {
            return e.map((e) => e.toString()).join(" ");
          }
          tokenizeStrings(e) {
            return e.split(/\b/);
          }
          tokenLength(e) {
            return this.tokenizeStrings(e).length;
          }
          takeLastTokens(e, t) {
            return this.tokenizeStrings(e).slice(-t).join("");
          }
          takeFirstTokens(e, t) {
            const n = this.tokenizeStrings(e).slice(0, t);
            return {
              text: n.join(""),
              tokens: n.map(this.hash),
            };
          }
          takeLastLinesTokens(e, t) {
            const n = this.takeLastTokens(e, t);
            if (n.length === e.length || "\n" === e[e.length - n.length - 1])
              return n;
            let r = n.indexOf("\n");
            return n.substring(r + 1);
          }
        }
      },
      4456: (e, t, n) => {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0,
        }),
          (t.Priorities =
            t.PromptWishlist =
            t.PromptElementRanges =
            t.PromptChoices =
            t.PromptBackground =
            t.PromptElementKind =
              void 0);
        const r = n(8312);
        var i;
        !(function (e) {
          (e.BeforeCursor = "BeforeCursor"),
            (e.AfterCursor = "AfterCursor"),
            (e.SimilarFile = "SimilarFile"),
            (e.RetrievalSnippet = "RetrievalSnippet"),
            (e.SymbolDefinition = "SymbolDefinition"),
            (e.ImportedFile = "ImportedFile"),
            (e.LanguageMarker = "LanguageMarker"),
            (e.PathMarker = "PathMarker");
        })((i = t.PromptElementKind || (t.PromptElementKind = {})));
        class o {
          constructor() {
            (this.used = new Map()), (this.unused = new Map());
          }
          markUsed(e) {
            this.IsSnippet(e) && this.used.set(e.id, this.convert(e));
          }
          undoMarkUsed(e) {
            this.IsSnippet(e) && this.used.delete(e.id);
          }
          markUnused(e) {
            this.IsSnippet(e) && this.unused.set(e.id, this.convert(e));
          }
          convert(e) {
            return {
              score: e.score.toFixed(4),
              length: e.text.length,
            };
          }
          IsSnippet(e) {
            return e.kind == i.SimilarFile || e.kind == i.RetrievalSnippet;
          }
        }
        t.PromptBackground = o;
        class s {
          constructor() {
            (this.used = new Map()),
              (this.unused = new Map()),
              (this.usedCounts = new Map()),
              (this.unusedCounts = new Map());
          }
          markUsed(e) {
            this.used.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens),
              this.usedCounts.set(
                e.kind,
                (this.usedCounts.get(e.kind) || 0) + 1
              );
          }
          undoMarkUsed(e) {
            this.used.set(e.kind, (this.used.get(e.kind) || 0) - e.tokens),
              this.usedCounts.set(
                e.kind,
                (this.usedCounts.get(e.kind) || 0) - 1
              );
          }
          markUnused(e) {
            this.unused.set(e.kind, (this.unused.get(e.kind) || 0) + e.tokens),
              this.unusedCounts.set(
                e.kind,
                (this.unusedCounts.get(e.kind) || 0) + 1
              );
          }
        }
        t.PromptChoices = s;
        class a {
          constructor(e) {
            this.ranges = new Array();
            let t,
              n = 0;
            for (const { element: r } of e)
              0 !== r.text.length &&
                (t === i.BeforeCursor && r.kind === i.BeforeCursor
                  ? (this.ranges[this.ranges.length - 1].end += r.text.length)
                  : this.ranges.push({
                      kind: r.kind,
                      start: n,
                      end: n + r.text.length,
                    }),
                (t = r.kind),
                (n += r.text.length));
          }
        }
        (t.PromptElementRanges = a),
          (t.PromptWishlist = class {
            constructor(e, t) {
              (this.tokenizer = e),
                (this.content = []),
                (this.tokenizer = e),
                (this.lineEndingOption = t);
            }
            getContent() {
              return [...this.content];
            }
            convertLineEndings(e) {
              return (
                this.lineEndingOption === r.LineEndingOptions.ConvertToUnix &&
                  (e = e.replace(/\r\n/g, "\n").replace(/\r/g, "\n")),
                e
              );
            }
            append(e, t, n, r = this.tokenizer.tokenLength(e), i = NaN) {
              e = this.convertLineEndings(e);
              const o = this.content.length;
              return (
                this.content.push({
                  id: o,
                  text: e,
                  kind: t,
                  priority: n,
                  tokens: r,
                  requires: [],
                  excludes: [],
                  score: i,
                }),
                o
              );
            }
            appendLineForLine(e, t, n) {
              const r = (e = this.convertLineEndings(e)).split("\n");
              for (let e = 0; e < r.length - 1; e++) r[e] += "\n";
              const i = [];
              r.forEach((e, t) => {
                "\n" === e && i.length > 0 && !i[i.length - 1].endsWith("\n\n")
                  ? (i[i.length - 1] += "\n")
                  : i.push(e);
              });
              const o = [];
              return (
                i.forEach((e, r) => {
                  "" !== e &&
                    (o.push(this.append(e, t, n)),
                    r > 0 &&
                      (this.content[this.content.length - 2].requires = [
                        this.content[this.content.length - 1],
                      ]));
                }),
                o
              );
            }
            require(e, t) {
              const n = this.content.find((t) => t.id === e),
                r = this.content.find((e) => e.id === t);
              n && r && n.requires.push(r);
            }
            exclude(e, t) {
              const n = this.content.find((t) => t.id === e),
                r = this.content.find((e) => e.id === t);
              n && r && n.excludes.push(r);
            }
            fulfill(e) {
              const t = new s(),
                n = new o(),
                r = this.content.map((e, t) => ({
                  element: e,
                  index: t,
                }));
              r.sort((e, t) =>
                e.element.priority === t.element.priority
                  ? t.index - e.index
                  : t.element.priority - e.element.priority
              );
              const i = new Set(),
                c = new Set();
              let l;
              const u = [];
              let p = e;
              r.forEach((e) => {
                const r = e.element,
                  o = e.index;
                if (
                  p >= 0 &&
                  (p > 0 || void 0 === l) &&
                  r.requires.every((e) => i.has(e.id)) &&
                  !c.has(r.id)
                ) {
                  let s = r.tokens;
                  const a = (function (e, t) {
                    let n,
                      r = 1 / 0;
                    for (const i of e)
                      i.index > t && i.index < r && ((n = i), (r = i.index));
                    return n;
                  })(u, o)?.element;
                  r.text.endsWith("\n\n") && a && !a.text.match(/^\s/) && s++,
                    p >= s
                      ? ((p -= s),
                        i.add(r.id),
                        r.excludes.forEach((e) => c.add(e.id)),
                        t.markUsed(r),
                        n.markUsed(r),
                        u.push(e))
                      : void 0 === l
                      ? (l = e)
                      : (t.markUnused(e.element), n.markUnused(e.element));
                } else t.markUnused(r), n.markUnused(r);
              }),
                u.sort((e, t) => e.index - t.index);
              let d = u.reduce((e, t) => e + t.element.text, ""),
                h = this.tokenizer.tokenLength(d);
              for (; h > e; ) {
                u.sort((e, t) =>
                  t.element.priority === e.element.priority
                    ? t.index - e.index
                    : t.element.priority - e.element.priority
                );
                const e = u.pop();
                e &&
                  (t.undoMarkUsed(e.element),
                  t.markUnused(e.element),
                  n.undoMarkUsed(e.element),
                  n.markUnused(e.element),
                  void 0 !== l &&
                    (t.markUnused(l.element), n.markUnused(l.element)),
                  (l = void 0)),
                  u.sort((e, t) => e.index - t.index),
                  (d = u.reduce((e, t) => e + t.element.text, "")),
                  (h = this.tokenizer.tokenLength(d));
              }
              const f = [...u];
              if (void 0 !== l) {
                f.push(l), f.sort((e, t) => e.index - t.index);
                const r = f.reduce((e, t) => e + t.element.text, ""),
                  i = this.tokenizer.tokenLength(r);
                if (i <= e) {
                  t.markUsed(l.element), n.markUsed(l.element);
                  const e = new a(f);
                  return {
                    prefix: r,
                    suffix: "",
                    prefixLength: i,
                    suffixLength: 0,
                    promptChoices: t,
                    promptBackground: n,
                    promptElementRanges: e,
                  };
                }
                t.markUnused(l.element), n.markUnused(l.element);
              }
              const m = new a(u);
              return {
                prefix: d,
                suffix: "",
                prefixLength: h,
                suffixLength: 0,
                promptChoices: t,
                promptBackground: n,
                promptElementRanges: m,
              };
            }
          });
        class c {
          constructor() {
            this.registeredPriorities = [0, 1];
          }
          register(e) {
            if (e > c.TOP || e < c.BOTTOM)
              throw new Error("Priority must be between 0 and 1");
            return this.registeredPriorities.push(e), e;
          }
          justAbove(...e) {
            const t = Math.max(...e),
              n = Math.min(...this.registeredPriorities.filter((e) => e > t));
            return this.register((n + t) / 2);
          }
          justBelow(...e) {
            const t = Math.min(...e),
              n = Math.max(...this.registeredPriorities.filter((e) => e < t));
            return this.register((n + t) / 2);
          }
          between(e, t) {
            if (
              this.registeredPriorities.some((n) => n > e && n < t) ||
              !this.registeredPriorities.includes(e) ||
              !this.registeredPriorities.includes(t)
            )
              throw new Error(
                "Priorities must be adjacent in the list of priorities"
              );
            return this.register((e + t) / 2);
          }
        }
        (t.Priorities = c), (c.TOP = 1), (c.BOTTOM = 0);
      },
      4087: (
        module,
        __unused_webpack_exports,
        __nested_webpack_require_105435__
      ) => {
        var Module = void 0 !== Module ? Module : {},
          TreeSitter = (function () {
            var initPromise,
              document =
                "object" == typeof window
                  ? {
                      currentScript: window.document.currentScript,
                    }
                  : null;
            class Parser {
              constructor() {
                this.initialize();
              }
              initialize() {
                throw new Error(
                  "cannot construct a Parser before calling `init()`"
                );
              }
              static init(moduleOptions) {
                return (
                  initPromise ||
                  ((Module = Object.assign({}, Module, moduleOptions)),
                  (initPromise = new Promise((resolveInitPromise) => {
                    var moduleOverrides = Object.assign({}, Module),
                      arguments_ = [],
                      thisProgram = "./this.program",
                      quit_ = (e, t) => {
                        throw t;
                      },
                      ENVIRONMENT_IS_WEB = "object" == typeof window,
                      ENVIRONMENT_IS_WORKER =
                        "function" == typeof importScripts,
                      ENVIRONMENT_IS_NODE =
                        "object" == typeof process &&
                        "object" == typeof process.versions &&
                        "string" == typeof process.versions.node,
                      scriptDirectory = "",
                      read_,
                      readAsync,
                      readBinary,
                      setWindowTitle;
                    function locateFile(e) {
                      return Module.locateFile
                        ? Module.locateFile(e, scriptDirectory)
                        : scriptDirectory + e;
                    }
                    function logExceptionOnExit(e) {
                      e instanceof ExitStatus ||
                        err("exiting due to exception: " + e);
                    }
                    if (ENVIRONMENT_IS_NODE) {
                      var fs = __nested_webpack_require_105435__(7147),
                        nodePath = __nested_webpack_require_105435__(1017);
                      (scriptDirectory = ENVIRONMENT_IS_WORKER
                        ? nodePath.dirname(scriptDirectory) + "/"
                        : __dirname + "/"),
                        (read_ = (e, t) => (
                          (e = isFileURI(e)
                            ? new URL(e)
                            : nodePath.normalize(e)),
                          fs.readFileSync(e, t ? void 0 : "utf8")
                        )),
                        (readBinary = (e) => {
                          var t = read_(e, !0);
                          return t.buffer || (t = new Uint8Array(t)), t;
                        }),
                        (readAsync = (e, t, n) => {
                          (e = isFileURI(e)
                            ? new URL(e)
                            : nodePath.normalize(e)),
                            fs.readFile(e, function (e, r) {
                              e ? n(e) : t(r.buffer);
                            });
                        }),
                        process.argv.length > 1 &&
                          (thisProgram = process.argv[1].replace(/\\/g, "/")),
                        (arguments_ = process.argv.slice(2)),
                        (module.exports = Module),
                        (quit_ = (e, t) => {
                          if (keepRuntimeAlive())
                            throw ((process.exitCode = e), t);
                          logExceptionOnExit(t), process.exit(e);
                        }),
                        (Module.inspect = function () {
                          return "[Emscripten Module object]";
                        });
                    } else
                      (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
                        (ENVIRONMENT_IS_WORKER
                          ? (scriptDirectory = self.location.href)
                          : void 0 !== document &&
                            document.currentScript &&
                            (scriptDirectory = document.currentScript.src),
                        (scriptDirectory =
                          0 !== scriptDirectory.indexOf("blob:")
                            ? scriptDirectory.substr(
                                0,
                                scriptDirectory
                                  .replace(/[?#].*/, "")
                                  .lastIndexOf("/") + 1
                              )
                            : ""),
                        (read_ = (e) => {
                          var t = new XMLHttpRequest();
                          return (
                            t.open("GET", e, !1), t.send(null), t.responseText
                          );
                        }),
                        ENVIRONMENT_IS_WORKER &&
                          (readBinary = (e) => {
                            var t = new XMLHttpRequest();
                            return (
                              t.open("GET", e, !1),
                              (t.responseType = "arraybuffer"),
                              t.send(null),
                              new Uint8Array(t.response)
                            );
                          }),
                        (readAsync = (e, t, n) => {
                          var r = new XMLHttpRequest();
                          r.open("GET", e, !0),
                            (r.responseType = "arraybuffer"),
                            (r.onload = () => {
                              200 == r.status || (0 == r.status && r.response)
                                ? t(r.response)
                                : n();
                            }),
                            (r.onerror = n),
                            r.send(null);
                        }),
                        (setWindowTitle = (e) => (document.title = e)));
                    var out = Module.print || console.log.bind(console),
                      err = Module.printErr || console.warn.bind(console);
                    Object.assign(Module, moduleOverrides),
                      (moduleOverrides = null),
                      Module.arguments && (arguments_ = Module.arguments),
                      Module.thisProgram && (thisProgram = Module.thisProgram),
                      Module.quit && (quit_ = Module.quit);
                    var STACK_ALIGN = 16,
                      dynamicLibraries = Module.dynamicLibraries || [],
                      wasmBinary;
                    Module.wasmBinary && (wasmBinary = Module.wasmBinary);
                    var noExitRuntime = Module.noExitRuntime || !0,
                      wasmMemory;
                    "object" != typeof WebAssembly &&
                      abort("no native wasm support detected");
                    var ABORT = !1,
                      EXITSTATUS,
                      UTF8Decoder =
                        "undefined" != typeof TextDecoder
                          ? new TextDecoder("utf8")
                          : void 0,
                      buffer,
                      HEAP8,
                      HEAPU8,
                      HEAP16,
                      HEAPU16,
                      HEAP32,
                      HEAPU32,
                      HEAPF32,
                      HEAPF64;
                    function UTF8ArrayToString(e, t, n) {
                      for (var r = t + n, i = t; e[i] && !(i >= r); ) ++i;
                      if (i - t > 16 && e.buffer && UTF8Decoder)
                        return UTF8Decoder.decode(e.subarray(t, i));
                      for (var o = ""; t < i; ) {
                        var s = e[t++];
                        if (128 & s) {
                          var a = 63 & e[t++];
                          if (192 != (224 & s)) {
                            var c = 63 & e[t++];
                            if (
                              (s =
                                224 == (240 & s)
                                  ? ((15 & s) << 12) | (a << 6) | c
                                  : ((7 & s) << 18) |
                                    (a << 12) |
                                    (c << 6) |
                                    (63 & e[t++])) < 65536
                            )
                              o += String.fromCharCode(s);
                            else {
                              var l = s - 65536;
                              o += String.fromCharCode(
                                55296 | (l >> 10),
                                56320 | (1023 & l)
                              );
                            }
                          } else o += String.fromCharCode(((31 & s) << 6) | a);
                        } else o += String.fromCharCode(s);
                      }
                      return o;
                    }
                    function UTF8ToString(e, t) {
                      return e ? UTF8ArrayToString(HEAPU8, e, t) : "";
                    }
                    function stringToUTF8Array(e, t, n, r) {
                      if (!(r > 0)) return 0;
                      for (var i = n, o = n + r - 1, s = 0; s < e.length; ++s) {
                        var a = e.charCodeAt(s);
                        if (
                          (a >= 55296 &&
                            a <= 57343 &&
                            (a =
                              (65536 + ((1023 & a) << 10)) |
                              (1023 & e.charCodeAt(++s))),
                          a <= 127)
                        ) {
                          if (n >= o) break;
                          t[n++] = a;
                        } else if (a <= 2047) {
                          if (n + 1 >= o) break;
                          (t[n++] = 192 | (a >> 6)), (t[n++] = 128 | (63 & a));
                        } else if (a <= 65535) {
                          if (n + 2 >= o) break;
                          (t[n++] = 224 | (a >> 12)),
                            (t[n++] = 128 | ((a >> 6) & 63)),
                            (t[n++] = 128 | (63 & a));
                        } else {
                          if (n + 3 >= o) break;
                          (t[n++] = 240 | (a >> 18)),
                            (t[n++] = 128 | ((a >> 12) & 63)),
                            (t[n++] = 128 | ((a >> 6) & 63)),
                            (t[n++] = 128 | (63 & a));
                        }
                      }
                      return (t[n] = 0), n - i;
                    }
                    function stringToUTF8(e, t, n) {
                      return stringToUTF8Array(e, HEAPU8, t, n);
                    }
                    function lengthBytesUTF8(e) {
                      for (var t = 0, n = 0; n < e.length; ++n) {
                        var r = e.charCodeAt(n);
                        r <= 127
                          ? t++
                          : r <= 2047
                          ? (t += 2)
                          : r >= 55296 && r <= 57343
                          ? ((t += 4), ++n)
                          : (t += 3);
                      }
                      return t;
                    }
                    function updateGlobalBufferAndViews(e) {
                      (buffer = e),
                        (Module.HEAP8 = HEAP8 = new Int8Array(e)),
                        (Module.HEAP16 = HEAP16 = new Int16Array(e)),
                        (Module.HEAP32 = HEAP32 = new Int32Array(e)),
                        (Module.HEAPU8 = HEAPU8 = new Uint8Array(e)),
                        (Module.HEAPU16 = HEAPU16 = new Uint16Array(e)),
                        (Module.HEAPU32 = HEAPU32 = new Uint32Array(e)),
                        (Module.HEAPF32 = HEAPF32 = new Float32Array(e)),
                        (Module.HEAPF64 = HEAPF64 = new Float64Array(e));
                    }
                    var INITIAL_MEMORY = Module.INITIAL_MEMORY || 33554432;
                    (wasmMemory = Module.wasmMemory
                      ? Module.wasmMemory
                      : new WebAssembly.Memory({
                          initial: INITIAL_MEMORY / 65536,
                          maximum: 32768,
                        })),
                      wasmMemory && (buffer = wasmMemory.buffer),
                      (INITIAL_MEMORY = buffer.byteLength),
                      updateGlobalBufferAndViews(buffer);
                    var wasmTable = new WebAssembly.Table({
                        initial: 20,
                        element: "anyfunc",
                      }),
                      __ATPRERUN__ = [],
                      __ATINIT__ = [],
                      __ATMAIN__ = [],
                      __ATPOSTRUN__ = [],
                      __RELOC_FUNCS__ = [],
                      runtimeInitialized = !1;
                    function keepRuntimeAlive() {
                      return noExitRuntime;
                    }
                    function preRun() {
                      if (Module.preRun)
                        for (
                          "function" == typeof Module.preRun &&
                          (Module.preRun = [Module.preRun]);
                          Module.preRun.length;

                        )
                          addOnPreRun(Module.preRun.shift());
                      callRuntimeCallbacks(__ATPRERUN__);
                    }
                    function initRuntime() {
                      (runtimeInitialized = !0),
                        callRuntimeCallbacks(__RELOC_FUNCS__),
                        callRuntimeCallbacks(__ATINIT__);
                    }
                    function preMain() {
                      callRuntimeCallbacks(__ATMAIN__);
                    }
                    function postRun() {
                      if (Module.postRun)
                        for (
                          "function" == typeof Module.postRun &&
                          (Module.postRun = [Module.postRun]);
                          Module.postRun.length;

                        )
                          addOnPostRun(Module.postRun.shift());
                      callRuntimeCallbacks(__ATPOSTRUN__);
                    }
                    function addOnPreRun(e) {
                      __ATPRERUN__.unshift(e);
                    }
                    function addOnInit(e) {
                      __ATINIT__.unshift(e);
                    }
                    function addOnPostRun(e) {
                      __ATPOSTRUN__.unshift(e);
                    }
                    var runDependencies = 0,
                      runDependencyWatcher = null,
                      dependenciesFulfilled = null;
                    function addRunDependency(e) {
                      runDependencies++,
                        Module.monitorRunDependencies &&
                          Module.monitorRunDependencies(runDependencies);
                    }
                    function removeRunDependency(e) {
                      if (
                        (runDependencies--,
                        Module.monitorRunDependencies &&
                          Module.monitorRunDependencies(runDependencies),
                        0 == runDependencies &&
                          (null !== runDependencyWatcher &&
                            (clearInterval(runDependencyWatcher),
                            (runDependencyWatcher = null)),
                          dependenciesFulfilled))
                      ) {
                        var t = dependenciesFulfilled;
                        (dependenciesFulfilled = null), t();
                      }
                    }
                    function abort(e) {
                      throw (
                        (Module.onAbort && Module.onAbort(e),
                        err((e = "Aborted(" + e + ")")),
                        (ABORT = !0),
                        (EXITSTATUS = 1),
                        (e += ". Build with -sASSERTIONS for more info."),
                        new WebAssembly.RuntimeError(e))
                      );
                    }
                    var dataURIPrefix = "data:application/octet-stream;base64,",
                      wasmBinaryFile,
                      tempDouble,
                      tempI64;
                    function isDataURI(e) {
                      return e.startsWith(dataURIPrefix);
                    }
                    function isFileURI(e) {
                      return e.startsWith("file://");
                    }
                    function getBinary(e) {
                      try {
                        if (e == wasmBinaryFile && wasmBinary)
                          return new Uint8Array(wasmBinary);
                        if (readBinary) return readBinary(e);
                        throw "both async and sync fetching of the wasm failed";
                      } catch (e) {
                        abort(e);
                      }
                    }
                    function getBinaryPromise() {
                      if (
                        !wasmBinary &&
                        (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)
                      ) {
                        if (
                          "function" == typeof fetch &&
                          !isFileURI(wasmBinaryFile)
                        )
                          return fetch(wasmBinaryFile, {
                            credentials: "same-origin",
                          })
                            .then(function (e) {
                              if (!e.ok)
                                throw (
                                  "failed to load wasm binary file at '" +
                                  wasmBinaryFile +
                                  "'"
                                );
                              return e.arrayBuffer();
                            })
                            .catch(function () {
                              return getBinary(wasmBinaryFile);
                            });
                        if (readAsync)
                          return new Promise(function (e, t) {
                            readAsync(
                              wasmBinaryFile,
                              function (t) {
                                e(new Uint8Array(t));
                              },
                              t
                            );
                          });
                      }
                      return Promise.resolve().then(function () {
                        return getBinary(wasmBinaryFile);
                      });
                    }
                    function createWasm() {
                      var e = {
                        env: asmLibraryArg,
                        wasi_snapshot_preview1: asmLibraryArg,
                        "GOT.mem": new Proxy(asmLibraryArg, GOTHandler),
                        "GOT.func": new Proxy(asmLibraryArg, GOTHandler),
                      };
                      function t(e, t) {
                        var n = e.exports;
                        n = relocateExports(n, 1024);
                        var r = getDylinkMetadata(t);
                        r.neededDynlibs &&
                          (dynamicLibraries =
                            r.neededDynlibs.concat(dynamicLibraries)),
                          mergeLibSymbols(n, "main"),
                          (Module.asm = n),
                          addOnInit(Module.asm.__wasm_call_ctors),
                          __RELOC_FUNCS__.push(
                            Module.asm.__wasm_apply_data_relocs
                          ),
                          removeRunDependency("wasm-instantiate");
                      }
                      function n(e) {
                        t(e.instance, e.module);
                      }
                      function r(t) {
                        return getBinaryPromise()
                          .then(function (t) {
                            return WebAssembly.instantiate(t, e);
                          })
                          .then(function (e) {
                            return e;
                          })
                          .then(t, function (e) {
                            err("failed to asynchronously prepare wasm: " + e),
                              abort(e);
                          });
                      }
                      if (
                        (addRunDependency("wasm-instantiate"),
                        Module.instantiateWasm)
                      )
                        try {
                          return Module.instantiateWasm(e, t);
                        } catch (e) {
                          return (
                            err(
                              "Module.instantiateWasm callback failed with error: " +
                                e
                            ),
                            !1
                          );
                        }
                      return (
                        wasmBinary ||
                        "function" != typeof WebAssembly.instantiateStreaming ||
                        isDataURI(wasmBinaryFile) ||
                        isFileURI(wasmBinaryFile) ||
                        ENVIRONMENT_IS_NODE ||
                        "function" != typeof fetch
                          ? r(n)
                          : fetch(wasmBinaryFile, {
                              credentials: "same-origin",
                            }).then(function (t) {
                              return WebAssembly.instantiateStreaming(
                                t,
                                e
                              ).then(n, function (e) {
                                return (
                                  err("wasm streaming compile failed: " + e),
                                  err(
                                    "falling back to ArrayBuffer instantiation"
                                  ),
                                  r(n)
                                );
                              });
                            }),
                        {}
                      );
                    }
                    (wasmBinaryFile = "tree-sitter.wasm"),
                      isDataURI(wasmBinaryFile) ||
                        (wasmBinaryFile = locateFile(wasmBinaryFile));
                    var ASM_CONSTS = {};
                    function ExitStatus(e) {
                      (this.name = "ExitStatus"),
                        (this.message =
                          "Program terminated with exit(" + e + ")"),
                        (this.status = e);
                    }
                    var GOT = {},
                      CurrentModuleWeakSymbols = new Set([]),
                      GOTHandler = {
                        get: function (e, t) {
                          var n = GOT[t];
                          return (
                            n ||
                              (n = GOT[t] =
                                new WebAssembly.Global({
                                  value: "i32",
                                  mutable: !0,
                                })),
                            CurrentModuleWeakSymbols.has(t) ||
                              (n.required = !0),
                            n
                          );
                        },
                      };
                    function callRuntimeCallbacks(e) {
                      for (; e.length > 0; ) e.shift()(Module);
                    }
                    function getDylinkMetadata(e) {
                      var t = 0,
                        n = 0;
                      function r() {
                        for (var n = 0, r = 1; ; ) {
                          var i = e[t++];
                          if (((n += (127 & i) * r), (r *= 128), !(128 & i)))
                            break;
                        }
                        return n;
                      }
                      function i() {
                        var n = r();
                        return UTF8ArrayToString(e, (t += n) - n, n);
                      }
                      function o(e, t) {
                        if (e) throw new Error(t);
                      }
                      var s = "dylink.0";
                      if (e instanceof WebAssembly.Module) {
                        var a = WebAssembly.Module.customSections(e, s);
                        0 === a.length &&
                          ((s = "dylink"),
                          (a = WebAssembly.Module.customSections(e, s))),
                          o(0 === a.length, "need dylink section"),
                          (n = (e = new Uint8Array(a[0])).length);
                      } else {
                        o(
                          !(
                            1836278016 ==
                            new Uint32Array(
                              new Uint8Array(e.subarray(0, 24)).buffer
                            )[0]
                          ),
                          "need to see wasm magic number"
                        ),
                          o(0 !== e[8], "need the dylink section to be first"),
                          (t = 9);
                        var c = r();
                        (n = t + c), (s = i());
                      }
                      var l = {
                        neededDynlibs: [],
                        tlsExports: new Set(),
                        weakImports: new Set(),
                      };
                      if ("dylink" == s) {
                        (l.memorySize = r()),
                          (l.memoryAlign = r()),
                          (l.tableSize = r()),
                          (l.tableAlign = r());
                        for (var u = r(), p = 0; p < u; ++p) {
                          var d = i();
                          l.neededDynlibs.push(d);
                        }
                      } else
                        for (o("dylink.0" !== s); t < n; ) {
                          var h = e[t++],
                            f = r();
                          if (1 === h)
                            (l.memorySize = r()),
                              (l.memoryAlign = r()),
                              (l.tableSize = r()),
                              (l.tableAlign = r());
                          else if (2 === h)
                            for (u = r(), p = 0; p < u; ++p)
                              (d = i()), l.neededDynlibs.push(d);
                          else if (3 === h)
                            for (var m = r(); m--; ) {
                              var g = i();
                              256 & r() && l.tlsExports.add(g);
                            }
                          else if (4 === h)
                            for (m = r(); m--; )
                              i(),
                                (g = i()),
                                1 == (3 & r()) && l.weakImports.add(g);
                          else t += f;
                        }
                      return l;
                    }
                    function getValue(e, t = "i8") {
                      switch ((t.endsWith("*") && (t = "*"), t)) {
                        case "i1":
                        case "i8":
                          return HEAP8[e >> 0];
                        case "i16":
                          return HEAP16[e >> 1];
                        case "i32":
                        case "i64":
                          return HEAP32[e >> 2];
                        case "float":
                          return HEAPF32[e >> 2];
                        case "double":
                          return HEAPF64[e >> 3];
                        case "*":
                          return HEAPU32[e >> 2];
                        default:
                          abort("invalid type for getValue: " + t);
                      }
                      return null;
                    }
                    function asmjsMangle(e) {
                      return 0 == e.indexOf("dynCall_") ||
                        [
                          "stackAlloc",
                          "stackSave",
                          "stackRestore",
                          "getTempRet0",
                          "setTempRet0",
                        ].includes(e)
                        ? e
                        : "_" + e;
                    }
                    function mergeLibSymbols(e, t) {
                      for (var n in e)
                        if (e.hasOwnProperty(n)) {
                          asmLibraryArg.hasOwnProperty(n) ||
                            (asmLibraryArg[n] = e[n]);
                          var r = asmjsMangle(n);
                          Module.hasOwnProperty(r) || (Module[r] = e[n]),
                            "__main_argc_argv" == n && (Module._main = e[n]);
                        }
                    }
                    var LDSO = {
                      loadedLibsByName: {},
                      loadedLibsByHandle: {},
                    };
                    function dynCallLegacy(e, t, n) {
                      var r = Module["dynCall_" + e];
                      return n && n.length
                        ? r.apply(null, [t].concat(n))
                        : r.call(null, t);
                    }
                    var wasmTableMirror = [];
                    function getWasmTableEntry(e) {
                      var t = wasmTableMirror[e];
                      return (
                        t ||
                          (e >= wasmTableMirror.length &&
                            (wasmTableMirror.length = e + 1),
                          (wasmTableMirror[e] = t = wasmTable.get(e))),
                        t
                      );
                    }
                    function dynCall(e, t, n) {
                      return e.includes("j")
                        ? dynCallLegacy(e, t, n)
                        : getWasmTableEntry(t).apply(null, n);
                    }
                    function createInvokeFunction(e) {
                      return function () {
                        var t = stackSave();
                        try {
                          return dynCall(
                            e,
                            arguments[0],
                            Array.prototype.slice.call(arguments, 1)
                          );
                        } catch (e) {
                          if ((stackRestore(t), e !== e + 0)) throw e;
                          _setThrew(1, 0);
                        }
                      };
                    }
                    var ___heap_base = 78144;
                    function zeroMemory(e, t) {
                      return HEAPU8.fill(0, e, e + t), e;
                    }
                    function getMemory(e) {
                      if (runtimeInitialized) return zeroMemory(_malloc(e), e);
                      var t = ___heap_base,
                        n = (t + e + 15) & -16;
                      return (___heap_base = n), (GOT.__heap_base.value = n), t;
                    }
                    function isInternalSym(e) {
                      return [
                        "__cpp_exception",
                        "__c_longjmp",
                        "__wasm_apply_data_relocs",
                        "__dso_handle",
                        "__tls_size",
                        "__tls_align",
                        "__set_stack_limits",
                        "_emscripten_tls_init",
                        "__wasm_init_tls",
                        "__wasm_call_ctors",
                        "__start_em_asm",
                        "__stop_em_asm",
                      ].includes(e);
                    }
                    function uleb128Encode(e, t) {
                      e < 128 ? t.push(e) : t.push(e % 128 | 128, e >> 7);
                    }
                    function sigToWasmTypes(e) {
                      for (
                        var t = {
                            i: "i32",
                            j: "i32",
                            f: "f32",
                            d: "f64",
                            p: "i32",
                          },
                          n = {
                            parameters: [],
                            results: "v" == e[0] ? [] : [t[e[0]]],
                          },
                          r = 1;
                        r < e.length;
                        ++r
                      )
                        n.parameters.push(t[e[r]]),
                          "j" === e[r] && n.parameters.push("i32");
                      return n;
                    }
                    function generateFuncType(e, t) {
                      var n = e.slice(0, 1),
                        r = e.slice(1),
                        i = {
                          i: 127,
                          p: 127,
                          j: 126,
                          f: 125,
                          d: 124,
                        };
                      t.push(96), uleb128Encode(r.length, t);
                      for (var o = 0; o < r.length; ++o) t.push(i[r[o]]);
                      "v" == n ? t.push(0) : t.push(1, i[n]);
                    }
                    function convertJsFunctionToWasm(e, t) {
                      if ("function" == typeof WebAssembly.Function)
                        return new WebAssembly.Function(sigToWasmTypes(t), e);
                      var n = [1];
                      generateFuncType(t, n);
                      var r = [0, 97, 115, 109, 1, 0, 0, 0, 1];
                      uleb128Encode(n.length, r),
                        r.push.apply(r, n),
                        r.push(
                          2,
                          7,
                          1,
                          1,
                          101,
                          1,
                          102,
                          0,
                          0,
                          7,
                          5,
                          1,
                          1,
                          102,
                          0,
                          0
                        );
                      var i = new WebAssembly.Module(new Uint8Array(r));
                      return new WebAssembly.Instance(i, {
                        e: {
                          f: e,
                        },
                      }).exports.f;
                    }
                    function updateTableMap(e, t) {
                      if (functionsInTableMap)
                        for (var n = e; n < e + t; n++) {
                          var r = getWasmTableEntry(n);
                          r && functionsInTableMap.set(r, n);
                        }
                    }
                    var functionsInTableMap = void 0,
                      freeTableIndexes = [];
                    function getEmptyTableSlot() {
                      if (freeTableIndexes.length)
                        return freeTableIndexes.pop();
                      try {
                        wasmTable.grow(1);
                      } catch (e) {
                        if (!(e instanceof RangeError)) throw e;
                        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                      }
                      return wasmTable.length - 1;
                    }
                    function setWasmTableEntry(e, t) {
                      wasmTable.set(e, t),
                        (wasmTableMirror[e] = wasmTable.get(e));
                    }
                    function addFunction(e, t) {
                      if (
                        (functionsInTableMap ||
                          ((functionsInTableMap = new WeakMap()),
                          updateTableMap(0, wasmTable.length)),
                        functionsInTableMap.has(e))
                      )
                        return functionsInTableMap.get(e);
                      var n = getEmptyTableSlot();
                      try {
                        setWasmTableEntry(n, e);
                      } catch (r) {
                        if (!(r instanceof TypeError)) throw r;
                        setWasmTableEntry(n, convertJsFunctionToWasm(e, t));
                      }
                      return functionsInTableMap.set(e, n), n;
                    }
                    function updateGOT(e, t) {
                      for (var n in e)
                        if (!isInternalSym(n)) {
                          var r = e[n];
                          n.startsWith("orig$") &&
                            ((n = n.split("$")[1]), (t = !0)),
                            GOT[n] ||
                              (GOT[n] = new WebAssembly.Global({
                                value: "i32",
                                mutable: !0,
                              })),
                            (t || 0 == GOT[n].value) &&
                              ("function" == typeof r
                                ? (GOT[n].value = addFunction(r))
                                : "number" == typeof r
                                ? (GOT[n].value = r)
                                : err(
                                    "unhandled export type for `" +
                                      n +
                                      "`: " +
                                      typeof r
                                  ));
                        }
                    }
                    function relocateExports(e, t, n) {
                      var r = {};
                      for (var i in e) {
                        var o = e[i];
                        "object" == typeof o && (o = o.value),
                          "number" == typeof o && (o += t),
                          (r[i] = o);
                      }
                      return updateGOT(r, n), r;
                    }
                    function resolveGlobalSymbol(e, t) {
                      var n;
                      return (
                        t && (n = asmLibraryArg["orig$" + e]),
                        n || ((n = asmLibraryArg[e]) && n.stub && (n = void 0)),
                        n || (n = Module[asmjsMangle(e)]),
                        !n &&
                          e.startsWith("invoke_") &&
                          (n = createInvokeFunction(e.split("_")[1])),
                        n
                      );
                    }
                    function alignMemory(e, t) {
                      return Math.ceil(e / t) * t;
                    }
                    function loadWebAssemblyModule(binary, flags, handle) {
                      var metadata = getDylinkMetadata(binary);
                      function loadModule() {
                        var firstLoad = !handle || !HEAP8[(handle + 12) >> 0];
                        if (firstLoad) {
                          var memAlign = Math.pow(2, metadata.memoryAlign);
                          memAlign = Math.max(memAlign, STACK_ALIGN);
                          var memoryBase = metadata.memorySize
                              ? alignMemory(
                                  getMemory(metadata.memorySize + memAlign),
                                  memAlign
                                )
                              : 0,
                            tableBase = metadata.tableSize
                              ? wasmTable.length
                              : 0;
                          handle &&
                            ((HEAP8[(handle + 12) >> 0] = 1),
                            (HEAPU32[(handle + 16) >> 2] = memoryBase),
                            (HEAP32[(handle + 20) >> 2] = metadata.memorySize),
                            (HEAPU32[(handle + 24) >> 2] = tableBase),
                            (HEAP32[(handle + 28) >> 2] = metadata.tableSize));
                        } else
                          (memoryBase = HEAPU32[(handle + 16) >> 2]),
                            (tableBase = HEAPU32[(handle + 24) >> 2]);
                        var tableGrowthNeeded =
                            tableBase + metadata.tableSize - wasmTable.length,
                          moduleExports;
                        function resolveSymbol(e) {
                          var t = resolveGlobalSymbol(e, !1);
                          return t || (t = moduleExports[e]), t;
                        }
                        tableGrowthNeeded > 0 &&
                          wasmTable.grow(tableGrowthNeeded);
                        var proxyHandler = {
                            get: function (e, t) {
                              switch (t) {
                                case "__memory_base":
                                  return memoryBase;
                                case "__table_base":
                                  return tableBase;
                              }
                              return t in asmLibraryArg
                                ? asmLibraryArg[t]
                                : (t in e ||
                                    (e[t] = function () {
                                      return (
                                        n || (n = resolveSymbol(t)),
                                        n.apply(null, arguments)
                                      );
                                    }),
                                  e[t]);
                              var n;
                            },
                          },
                          proxy = new Proxy({}, proxyHandler),
                          info = {
                            "GOT.mem": new Proxy({}, GOTHandler),
                            "GOT.func": new Proxy({}, GOTHandler),
                            env: proxy,
                            wasi_snapshot_preview1: proxy,
                          };
                        function postInstantiation(instance) {
                          function addEmAsm(addr, body) {
                            for (
                              var args = [], arity = 0;
                              arity < 16 && -1 != body.indexOf("$" + arity);
                              arity++
                            )
                              args.push("$" + arity);
                            args = args.join(",");
                            var func = "(" + args + " ) => { " + body + "};";
                            ASM_CONSTS[start] = eval(func);
                          }
                          if (
                            (updateTableMap(tableBase, metadata.tableSize),
                            (moduleExports = relocateExports(
                              instance.exports,
                              memoryBase
                            )),
                            flags.allowUndefined || reportUndefinedSymbols(),
                            "__start_em_asm" in moduleExports)
                          )
                            for (
                              var start = moduleExports.__start_em_asm,
                                stop = moduleExports.__stop_em_asm;
                              start < stop;

                            ) {
                              var jsString = UTF8ToString(start);
                              addEmAsm(start, jsString),
                                (start = HEAPU8.indexOf(0, start) + 1);
                            }
                          var applyRelocs =
                            moduleExports.__wasm_apply_data_relocs;
                          applyRelocs &&
                            (runtimeInitialized
                              ? applyRelocs()
                              : __RELOC_FUNCS__.push(applyRelocs));
                          var init = moduleExports.__wasm_call_ctors;
                          return (
                            init &&
                              (runtimeInitialized
                                ? init()
                                : __ATINIT__.push(init)),
                            moduleExports
                          );
                        }
                        if (flags.loadAsync) {
                          if (binary instanceof WebAssembly.Module) {
                            var instance = new WebAssembly.Instance(
                              binary,
                              info
                            );
                            return Promise.resolve(postInstantiation(instance));
                          }
                          return WebAssembly.instantiate(binary, info).then(
                            function (e) {
                              return postInstantiation(e.instance);
                            }
                          );
                        }
                        var module =
                            binary instanceof WebAssembly.Module
                              ? binary
                              : new WebAssembly.Module(binary),
                          instance = new WebAssembly.Instance(module, info);
                        return postInstantiation(instance);
                      }
                      return (
                        (CurrentModuleWeakSymbols = metadata.weakImports),
                        flags.loadAsync
                          ? metadata.neededDynlibs
                              .reduce(function (e, t) {
                                return e.then(function () {
                                  return loadDynamicLibrary(t, flags);
                                });
                              }, Promise.resolve())
                              .then(function () {
                                return loadModule();
                              })
                          : (metadata.neededDynlibs.forEach(function (e) {
                              loadDynamicLibrary(e, flags);
                            }),
                            loadModule())
                      );
                    }
                    function loadDynamicLibrary(e, t, n) {
                      t = t || {
                        global: !0,
                        nodelete: !0,
                      };
                      var r = LDSO.loadedLibsByName[e];
                      if (r)
                        return (
                          t.global &&
                            !r.global &&
                            ((r.global = !0),
                            "loading" !== r.module &&
                              mergeLibSymbols(r.module, e)),
                          t.nodelete &&
                            r.refcount !== 1 / 0 &&
                            (r.refcount = 1 / 0),
                          r.refcount++,
                          n && (LDSO.loadedLibsByHandle[n] = r),
                          !t.loadAsync || Promise.resolve(!0)
                        );
                      function i(e) {
                        if (t.fs && t.fs.findObject(e)) {
                          var n = t.fs.readFile(e, {
                            encoding: "binary",
                          });
                          return (
                            n instanceof Uint8Array || (n = new Uint8Array(n)),
                            t.loadAsync ? Promise.resolve(n) : n
                          );
                        }
                        if (((e = locateFile(e)), t.loadAsync))
                          return new Promise(function (t, n) {
                            readAsync(e, (e) => t(new Uint8Array(e)), n);
                          });
                        if (!readBinary)
                          throw new Error(
                            e +
                              ": file not found, and synchronous loading of external files is not available"
                          );
                        return readBinary(e);
                      }
                      function o() {
                        if (
                          "undefined" != typeof preloadedWasm &&
                          preloadedWasm[e]
                        ) {
                          var r = preloadedWasm[e];
                          return t.loadAsync ? Promise.resolve(r) : r;
                        }
                        return t.loadAsync
                          ? i(e).then(function (e) {
                              return loadWebAssemblyModule(e, t, n);
                            })
                          : loadWebAssemblyModule(i(e), t, n);
                      }
                      function s(t) {
                        r.global && mergeLibSymbols(t, e), (r.module = t);
                      }
                      return (
                        (r = {
                          refcount: t.nodelete ? 1 / 0 : 1,
                          name: e,
                          module: "loading",
                          global: t.global,
                        }),
                        (LDSO.loadedLibsByName[e] = r),
                        n && (LDSO.loadedLibsByHandle[n] = r),
                        t.loadAsync
                          ? o().then(function (e) {
                              return s(e), !0;
                            })
                          : (s(o()), !0)
                      );
                    }
                    function reportUndefinedSymbols() {
                      for (var e in GOT)
                        if (0 == GOT[e].value) {
                          var t = resolveGlobalSymbol(e, !0);
                          if (!t && !GOT[e].required) continue;
                          if ("function" == typeof t)
                            GOT[e].value = addFunction(t, t.sig);
                          else {
                            if ("number" != typeof t)
                              throw new Error(
                                "bad export type for `" + e + "`: " + typeof t
                              );
                            GOT[e].value = t;
                          }
                        }
                    }
                    function preloadDylibs() {
                      dynamicLibraries.length
                        ? (addRunDependency("preloadDylibs"),
                          dynamicLibraries
                            .reduce(function (e, t) {
                              return e.then(function () {
                                return loadDynamicLibrary(t, {
                                  loadAsync: !0,
                                  global: !0,
                                  nodelete: !0,
                                  allowUndefined: !0,
                                });
                              });
                            }, Promise.resolve())
                            .then(function () {
                              reportUndefinedSymbols(),
                                removeRunDependency("preloadDylibs");
                            }))
                        : reportUndefinedSymbols();
                    }
                    function setValue(e, t, n = "i8") {
                      switch ((n.endsWith("*") && (n = "*"), n)) {
                        case "i1":
                        case "i8":
                          HEAP8[e >> 0] = t;
                          break;
                        case "i16":
                          HEAP16[e >> 1] = t;
                          break;
                        case "i32":
                          HEAP32[e >> 2] = t;
                          break;
                        case "i64":
                          (tempI64 = [
                            t >>> 0,
                            ((tempDouble = t),
                            +Math.abs(tempDouble) >= 1
                              ? tempDouble > 0
                                ? (0 |
                                    Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                    )) >>>
                                  0
                                : ~~+Math.ceil(
                                    (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                                  ) >>> 0
                              : 0),
                          ]),
                            (HEAP32[e >> 2] = tempI64[0]),
                            (HEAP32[(e + 4) >> 2] = tempI64[1]);
                          break;
                        case "float":
                          HEAPF32[e >> 2] = t;
                          break;
                        case "double":
                          HEAPF64[e >> 3] = t;
                          break;
                        case "*":
                          HEAPU32[e >> 2] = t;
                          break;
                        default:
                          abort("invalid type for setValue: " + n);
                      }
                    }
                    var ___memory_base = new WebAssembly.Global(
                        {
                          value: "i32",
                          mutable: !1,
                        },
                        1024
                      ),
                      ___stack_pointer = new WebAssembly.Global(
                        {
                          value: "i32",
                          mutable: !0,
                        },
                        78144
                      ),
                      ___table_base = new WebAssembly.Global(
                        {
                          value: "i32",
                          mutable: !1,
                        },
                        1
                      ),
                      nowIsMonotonic = !0,
                      _emscripten_get_now;
                    function __emscripten_get_now_is_monotonic() {
                      return nowIsMonotonic;
                    }
                    function _abort() {
                      abort("");
                    }
                    function _emscripten_date_now() {
                      return Date.now();
                    }
                    function _emscripten_memcpy_big(e, t, n) {
                      HEAPU8.copyWithin(e, t, t + n);
                    }
                    function getHeapMax() {
                      return 2147483648;
                    }
                    function emscripten_realloc_buffer(e) {
                      try {
                        return (
                          wasmMemory.grow(
                            (e - buffer.byteLength + 65535) >>> 16
                          ),
                          updateGlobalBufferAndViews(wasmMemory.buffer),
                          1
                        );
                      } catch (e) {}
                    }
                    function _emscripten_resize_heap(e) {
                      var t = HEAPU8.length;
                      e >>>= 0;
                      var n,
                        r = getHeapMax();
                      if (e > r) return !1;
                      for (var i = 1; i <= 4; i *= 2) {
                        var o = t * (1 + 0.2 / i);
                        if (
                          ((o = Math.min(o, e + 100663296)),
                          emscripten_realloc_buffer(
                            Math.min(
                              r,
                              (n = Math.max(e, o)) +
                                ((65536 - (n % 65536)) % 65536)
                            )
                          ))
                        )
                          return !0;
                      }
                      return !1;
                    }
                    (__emscripten_get_now_is_monotonic.sig = "i"),
                      (Module._abort = _abort),
                      (_abort.sig = "v"),
                      (_emscripten_date_now.sig = "d"),
                      (_emscripten_get_now = ENVIRONMENT_IS_NODE
                        ? () => {
                            var e = process.hrtime();
                            return 1e3 * e[0] + e[1] / 1e6;
                          }
                        : () => performance.now()),
                      (_emscripten_get_now.sig = "d"),
                      (_emscripten_memcpy_big.sig = "vppp"),
                      (_emscripten_resize_heap.sig = "ip");
                    var SYSCALLS = {
                      DEFAULT_POLLMASK: 5,
                      calculateAt: function (e, t, n) {
                        if (PATH.isAbs(t)) return t;
                        var r;
                        if (
                          ((r =
                            -100 === e
                              ? FS.cwd()
                              : SYSCALLS.getStreamFromFD(e).path),
                          0 == t.length)
                        ) {
                          if (!n) throw new FS.ErrnoError(44);
                          return r;
                        }
                        return PATH.join2(r, t);
                      },
                      doStat: function (e, t, n) {
                        try {
                          var r = e(t);
                        } catch (e) {
                          if (
                            e &&
                            e.node &&
                            PATH.normalize(t) !==
                              PATH.normalize(FS.getPath(e.node))
                          )
                            return -54;
                          throw e;
                        }
                        (HEAP32[n >> 2] = r.dev),
                          (HEAP32[(n + 8) >> 2] = r.ino),
                          (HEAP32[(n + 12) >> 2] = r.mode),
                          (HEAPU32[(n + 16) >> 2] = r.nlink),
                          (HEAP32[(n + 20) >> 2] = r.uid),
                          (HEAP32[(n + 24) >> 2] = r.gid),
                          (HEAP32[(n + 28) >> 2] = r.rdev),
                          (tempI64 = [
                            r.size >>> 0,
                            ((tempDouble = r.size),
                            +Math.abs(tempDouble) >= 1
                              ? tempDouble > 0
                                ? (0 |
                                    Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                    )) >>>
                                  0
                                : ~~+Math.ceil(
                                    (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                                  ) >>> 0
                              : 0),
                          ]),
                          (HEAP32[(n + 40) >> 2] = tempI64[0]),
                          (HEAP32[(n + 44) >> 2] = tempI64[1]),
                          (HEAP32[(n + 48) >> 2] = 4096),
                          (HEAP32[(n + 52) >> 2] = r.blocks);
                        var i = r.atime.getTime(),
                          o = r.mtime.getTime(),
                          s = r.ctime.getTime();
                        return (
                          (tempI64 = [
                            Math.floor(i / 1e3) >>> 0,
                            ((tempDouble = Math.floor(i / 1e3)),
                            +Math.abs(tempDouble) >= 1
                              ? tempDouble > 0
                                ? (0 |
                                    Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                    )) >>>
                                  0
                                : ~~+Math.ceil(
                                    (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                                  ) >>> 0
                              : 0),
                          ]),
                          (HEAP32[(n + 56) >> 2] = tempI64[0]),
                          (HEAP32[(n + 60) >> 2] = tempI64[1]),
                          (HEAPU32[(n + 64) >> 2] = (i % 1e3) * 1e3),
                          (tempI64 = [
                            Math.floor(o / 1e3) >>> 0,
                            ((tempDouble = Math.floor(o / 1e3)),
                            +Math.abs(tempDouble) >= 1
                              ? tempDouble > 0
                                ? (0 |
                                    Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                    )) >>>
                                  0
                                : ~~+Math.ceil(
                                    (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                                  ) >>> 0
                              : 0),
                          ]),
                          (HEAP32[(n + 72) >> 2] = tempI64[0]),
                          (HEAP32[(n + 76) >> 2] = tempI64[1]),
                          (HEAPU32[(n + 80) >> 2] = (o % 1e3) * 1e3),
                          (tempI64 = [
                            Math.floor(s / 1e3) >>> 0,
                            ((tempDouble = Math.floor(s / 1e3)),
                            +Math.abs(tempDouble) >= 1
                              ? tempDouble > 0
                                ? (0 |
                                    Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                    )) >>>
                                  0
                                : ~~+Math.ceil(
                                    (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                                  ) >>> 0
                              : 0),
                          ]),
                          (HEAP32[(n + 88) >> 2] = tempI64[0]),
                          (HEAP32[(n + 92) >> 2] = tempI64[1]),
                          (HEAPU32[(n + 96) >> 2] = (s % 1e3) * 1e3),
                          (tempI64 = [
                            r.ino >>> 0,
                            ((tempDouble = r.ino),
                            +Math.abs(tempDouble) >= 1
                              ? tempDouble > 0
                                ? (0 |
                                    Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                    )) >>>
                                  0
                                : ~~+Math.ceil(
                                    (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                                  ) >>> 0
                              : 0),
                          ]),
                          (HEAP32[(n + 104) >> 2] = tempI64[0]),
                          (HEAP32[(n + 108) >> 2] = tempI64[1]),
                          0
                        );
                      },
                      doMsync: function (e, t, n, r, i) {
                        if (!FS.isFile(t.node.mode))
                          throw new FS.ErrnoError(43);
                        if (2 & r) return 0;
                        var o = HEAPU8.slice(e, e + n);
                        FS.msync(t, o, i, n, r);
                      },
                      varargs: void 0,
                      get: function () {
                        return (
                          (SYSCALLS.varargs += 4),
                          HEAP32[(SYSCALLS.varargs - 4) >> 2]
                        );
                      },
                      getStr: function (e) {
                        return UTF8ToString(e);
                      },
                      getStreamFromFD: function (e) {
                        var t = FS.getStream(e);
                        if (!t) throw new FS.ErrnoError(8);
                        return t;
                      },
                    };
                    function _proc_exit(e) {
                      (EXITSTATUS = e),
                        keepRuntimeAlive() ||
                          (Module.onExit && Module.onExit(e), (ABORT = !0)),
                        quit_(e, new ExitStatus(e));
                    }
                    function exitJS(e, t) {
                      (EXITSTATUS = e), _proc_exit(e);
                    }
                    _proc_exit.sig = "vi";
                    var _exit = exitJS;
                    function _fd_close(e) {
                      try {
                        var t = SYSCALLS.getStreamFromFD(e);
                        return FS.close(t), 0;
                      } catch (e) {
                        if (
                          "undefined" == typeof FS ||
                          !(e instanceof FS.ErrnoError)
                        )
                          throw e;
                        return e.errno;
                      }
                    }
                    function convertI32PairToI53Checked(e, t) {
                      return (t + 2097152) >>> 0 < 4194305 - !!e
                        ? (e >>> 0) + 4294967296 * t
                        : NaN;
                    }
                    function _fd_seek(e, t, n, r, i) {
                      try {
                        var o = convertI32PairToI53Checked(t, n);
                        if (isNaN(o)) return 61;
                        var s = SYSCALLS.getStreamFromFD(e);
                        return (
                          FS.llseek(s, o, r),
                          (tempI64 = [
                            s.position >>> 0,
                            ((tempDouble = s.position),
                            +Math.abs(tempDouble) >= 1
                              ? tempDouble > 0
                                ? (0 |
                                    Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                    )) >>>
                                  0
                                : ~~+Math.ceil(
                                    (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                                  ) >>> 0
                              : 0),
                          ]),
                          (HEAP32[i >> 2] = tempI64[0]),
                          (HEAP32[(i + 4) >> 2] = tempI64[1]),
                          s.getdents &&
                            0 === o &&
                            0 === r &&
                            (s.getdents = null),
                          0
                        );
                      } catch (e) {
                        if (
                          "undefined" == typeof FS ||
                          !(e instanceof FS.ErrnoError)
                        )
                          throw e;
                        return e.errno;
                      }
                    }
                    function doWritev(e, t, n, r) {
                      for (var i = 0, o = 0; o < n; o++) {
                        var s = HEAPU32[t >> 2],
                          a = HEAPU32[(t + 4) >> 2];
                        t += 8;
                        var c = FS.write(e, HEAP8, s, a, r);
                        if (c < 0) return -1;
                        (i += c), void 0 !== r && (r += c);
                      }
                      return i;
                    }
                    function _fd_write(e, t, n, r) {
                      try {
                        var i = doWritev(SYSCALLS.getStreamFromFD(e), t, n);
                        return (HEAPU32[r >> 2] = i), 0;
                      } catch (e) {
                        if (
                          "undefined" == typeof FS ||
                          !(e instanceof FS.ErrnoError)
                        )
                          throw e;
                        return e.errno;
                      }
                    }
                    function _tree_sitter_log_callback(e, t) {
                      if (currentLogCallback) {
                        const n = UTF8ToString(t);
                        currentLogCallback(n, 0 !== e);
                      }
                    }
                    function _tree_sitter_parse_callback(e, t, n, r, i) {
                      var o = currentParseCallback(t, {
                        row: n,
                        column: r,
                      });
                      "string" == typeof o
                        ? (setValue(i, o.length, "i32"),
                          stringToUTF16(o, e, 10240))
                        : setValue(i, 0, "i32");
                    }
                    function handleException(e) {
                      if (e instanceof ExitStatus || "unwind" == e)
                        return EXITSTATUS;
                      quit_(1, e);
                    }
                    function allocateUTF8OnStack(e) {
                      var t = lengthBytesUTF8(e) + 1,
                        n = stackAlloc(t);
                      return stringToUTF8Array(e, HEAP8, n, t), n;
                    }
                    function stringToUTF16(e, t, n) {
                      if ((void 0 === n && (n = 2147483647), n < 2)) return 0;
                      for (
                        var r = t,
                          i = (n -= 2) < 2 * e.length ? n / 2 : e.length,
                          o = 0;
                        o < i;
                        ++o
                      ) {
                        var s = e.charCodeAt(o);
                        (HEAP16[t >> 1] = s), (t += 2);
                      }
                      return (HEAP16[t >> 1] = 0), t - r;
                    }
                    function AsciiToString(e) {
                      for (var t = ""; ; ) {
                        var n = HEAPU8[e++ >> 0];
                        if (!n) return t;
                        t += String.fromCharCode(n);
                      }
                    }
                    (_exit.sig = "vi"),
                      (_fd_close.sig = "ii"),
                      (_fd_seek.sig = "iijip"),
                      (_fd_write.sig = "iippp");
                    var asmLibraryArg = {
                        __heap_base: ___heap_base,
                        __indirect_function_table: wasmTable,
                        __memory_base: ___memory_base,
                        __stack_pointer: ___stack_pointer,
                        __table_base: ___table_base,
                        _emscripten_get_now_is_monotonic:
                          __emscripten_get_now_is_monotonic,
                        abort: _abort,
                        emscripten_get_now: _emscripten_get_now,
                        emscripten_memcpy_big: _emscripten_memcpy_big,
                        emscripten_resize_heap: _emscripten_resize_heap,
                        exit: _exit,
                        fd_close: _fd_close,
                        fd_seek: _fd_seek,
                        fd_write: _fd_write,
                        memory: wasmMemory,
                        tree_sitter_log_callback: _tree_sitter_log_callback,
                        tree_sitter_parse_callback: _tree_sitter_parse_callback,
                      },
                      asm = createWasm(),
                      ___wasm_call_ctors = (Module.___wasm_call_ctors =
                        function () {
                          return (___wasm_call_ctors =
                            Module.___wasm_call_ctors =
                              Module.asm.__wasm_call_ctors).apply(
                            null,
                            arguments
                          );
                        }),
                      ___wasm_apply_data_relocs =
                        (Module.___wasm_apply_data_relocs = function () {
                          return (___wasm_apply_data_relocs =
                            Module.___wasm_apply_data_relocs =
                              Module.asm.__wasm_apply_data_relocs).apply(
                            null,
                            arguments
                          );
                        }),
                      _malloc = (Module._malloc = function () {
                        return (_malloc = Module._malloc =
                          Module.asm.malloc).apply(null, arguments);
                      }),
                      _calloc = (Module._calloc = function () {
                        return (_calloc = Module._calloc =
                          Module.asm.calloc).apply(null, arguments);
                      }),
                      _realloc = (Module._realloc = function () {
                        return (_realloc = Module._realloc =
                          Module.asm.realloc).apply(null, arguments);
                      }),
                      _free = (Module._free = function () {
                        return (_free = Module._free = Module.asm.free).apply(
                          null,
                          arguments
                        );
                      }),
                      _ts_language_symbol_count =
                        (Module._ts_language_symbol_count = function () {
                          return (_ts_language_symbol_count =
                            Module._ts_language_symbol_count =
                              Module.asm.ts_language_symbol_count).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_version = (Module._ts_language_version =
                        function () {
                          return (_ts_language_version =
                            Module._ts_language_version =
                              Module.asm.ts_language_version).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_field_count =
                        (Module._ts_language_field_count = function () {
                          return (_ts_language_field_count =
                            Module._ts_language_field_count =
                              Module.asm.ts_language_field_count).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_symbol_name =
                        (Module._ts_language_symbol_name = function () {
                          return (_ts_language_symbol_name =
                            Module._ts_language_symbol_name =
                              Module.asm.ts_language_symbol_name).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_symbol_for_name =
                        (Module._ts_language_symbol_for_name = function () {
                          return (_ts_language_symbol_for_name =
                            Module._ts_language_symbol_for_name =
                              Module.asm.ts_language_symbol_for_name).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_symbol_type =
                        (Module._ts_language_symbol_type = function () {
                          return (_ts_language_symbol_type =
                            Module._ts_language_symbol_type =
                              Module.asm.ts_language_symbol_type).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_field_name_for_id =
                        (Module._ts_language_field_name_for_id = function () {
                          return (_ts_language_field_name_for_id =
                            Module._ts_language_field_name_for_id =
                              Module.asm.ts_language_field_name_for_id).apply(
                            null,
                            arguments
                          );
                        }),
                      _memset = (Module._memset = function () {
                        return (_memset = Module._memset =
                          Module.asm.memset).apply(null, arguments);
                      }),
                      _memcpy = (Module._memcpy = function () {
                        return (_memcpy = Module._memcpy =
                          Module.asm.memcpy).apply(null, arguments);
                      }),
                      _ts_parser_delete = (Module._ts_parser_delete =
                        function () {
                          return (_ts_parser_delete = Module._ts_parser_delete =
                            Module.asm.ts_parser_delete).apply(null, arguments);
                        }),
                      _ts_parser_reset = (Module._ts_parser_reset =
                        function () {
                          return (_ts_parser_reset = Module._ts_parser_reset =
                            Module.asm.ts_parser_reset).apply(null, arguments);
                        }),
                      _ts_parser_set_language =
                        (Module._ts_parser_set_language = function () {
                          return (_ts_parser_set_language =
                            Module._ts_parser_set_language =
                              Module.asm.ts_parser_set_language).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_parser_timeout_micros =
                        (Module._ts_parser_timeout_micros = function () {
                          return (_ts_parser_timeout_micros =
                            Module._ts_parser_timeout_micros =
                              Module.asm.ts_parser_timeout_micros).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_parser_set_timeout_micros =
                        (Module._ts_parser_set_timeout_micros = function () {
                          return (_ts_parser_set_timeout_micros =
                            Module._ts_parser_set_timeout_micros =
                              Module.asm.ts_parser_set_timeout_micros).apply(
                            null,
                            arguments
                          );
                        }),
                      _memmove = (Module._memmove = function () {
                        return (_memmove = Module._memmove =
                          Module.asm.memmove).apply(null, arguments);
                      }),
                      _memcmp = (Module._memcmp = function () {
                        return (_memcmp = Module._memcmp =
                          Module.asm.memcmp).apply(null, arguments);
                      }),
                      _ts_query_new = (Module._ts_query_new = function () {
                        return (_ts_query_new = Module._ts_query_new =
                          Module.asm.ts_query_new).apply(null, arguments);
                      }),
                      _ts_query_delete = (Module._ts_query_delete =
                        function () {
                          return (_ts_query_delete = Module._ts_query_delete =
                            Module.asm.ts_query_delete).apply(null, arguments);
                        }),
                      _iswspace = (Module._iswspace = function () {
                        return (_iswspace = Module._iswspace =
                          Module.asm.iswspace).apply(null, arguments);
                      }),
                      _iswalnum = (Module._iswalnum = function () {
                        return (_iswalnum = Module._iswalnum =
                          Module.asm.iswalnum).apply(null, arguments);
                      }),
                      _ts_query_pattern_count =
                        (Module._ts_query_pattern_count = function () {
                          return (_ts_query_pattern_count =
                            Module._ts_query_pattern_count =
                              Module.asm.ts_query_pattern_count).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_query_capture_count =
                        (Module._ts_query_capture_count = function () {
                          return (_ts_query_capture_count =
                            Module._ts_query_capture_count =
                              Module.asm.ts_query_capture_count).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_query_string_count = (Module._ts_query_string_count =
                        function () {
                          return (_ts_query_string_count =
                            Module._ts_query_string_count =
                              Module.asm.ts_query_string_count).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_query_capture_name_for_id =
                        (Module._ts_query_capture_name_for_id = function () {
                          return (_ts_query_capture_name_for_id =
                            Module._ts_query_capture_name_for_id =
                              Module.asm.ts_query_capture_name_for_id).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_query_string_value_for_id =
                        (Module._ts_query_string_value_for_id = function () {
                          return (_ts_query_string_value_for_id =
                            Module._ts_query_string_value_for_id =
                              Module.asm.ts_query_string_value_for_id).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_query_predicates_for_pattern =
                        (Module._ts_query_predicates_for_pattern = function () {
                          return (_ts_query_predicates_for_pattern =
                            Module._ts_query_predicates_for_pattern =
                              Module.asm.ts_query_predicates_for_pattern).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_copy = (Module._ts_tree_copy = function () {
                        return (_ts_tree_copy = Module._ts_tree_copy =
                          Module.asm.ts_tree_copy).apply(null, arguments);
                      }),
                      _ts_tree_delete = (Module._ts_tree_delete = function () {
                        return (_ts_tree_delete = Module._ts_tree_delete =
                          Module.asm.ts_tree_delete).apply(null, arguments);
                      }),
                      _ts_init = (Module._ts_init = function () {
                        return (_ts_init = Module._ts_init =
                          Module.asm.ts_init).apply(null, arguments);
                      }),
                      _ts_parser_new_wasm = (Module._ts_parser_new_wasm =
                        function () {
                          return (_ts_parser_new_wasm =
                            Module._ts_parser_new_wasm =
                              Module.asm.ts_parser_new_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_parser_enable_logger_wasm =
                        (Module._ts_parser_enable_logger_wasm = function () {
                          return (_ts_parser_enable_logger_wasm =
                            Module._ts_parser_enable_logger_wasm =
                              Module.asm.ts_parser_enable_logger_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_parser_parse_wasm = (Module._ts_parser_parse_wasm =
                        function () {
                          return (_ts_parser_parse_wasm =
                            Module._ts_parser_parse_wasm =
                              Module.asm.ts_parser_parse_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_type_is_named_wasm =
                        (Module._ts_language_type_is_named_wasm = function () {
                          return (_ts_language_type_is_named_wasm =
                            Module._ts_language_type_is_named_wasm =
                              Module.asm.ts_language_type_is_named_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_language_type_is_visible_wasm =
                        (Module._ts_language_type_is_visible_wasm =
                          function () {
                            return (_ts_language_type_is_visible_wasm =
                              Module._ts_language_type_is_visible_wasm =
                                Module.asm.ts_language_type_is_visible_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_root_node_wasm =
                        (Module._ts_tree_root_node_wasm = function () {
                          return (_ts_tree_root_node_wasm =
                            Module._ts_tree_root_node_wasm =
                              Module.asm.ts_tree_root_node_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_edit_wasm = (Module._ts_tree_edit_wasm =
                        function () {
                          return (_ts_tree_edit_wasm =
                            Module._ts_tree_edit_wasm =
                              Module.asm.ts_tree_edit_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_get_changed_ranges_wasm =
                        (Module._ts_tree_get_changed_ranges_wasm = function () {
                          return (_ts_tree_get_changed_ranges_wasm =
                            Module._ts_tree_get_changed_ranges_wasm =
                              Module.asm.ts_tree_get_changed_ranges_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_cursor_new_wasm =
                        (Module._ts_tree_cursor_new_wasm = function () {
                          return (_ts_tree_cursor_new_wasm =
                            Module._ts_tree_cursor_new_wasm =
                              Module.asm.ts_tree_cursor_new_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_cursor_delete_wasm =
                        (Module._ts_tree_cursor_delete_wasm = function () {
                          return (_ts_tree_cursor_delete_wasm =
                            Module._ts_tree_cursor_delete_wasm =
                              Module.asm.ts_tree_cursor_delete_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_cursor_reset_wasm =
                        (Module._ts_tree_cursor_reset_wasm = function () {
                          return (_ts_tree_cursor_reset_wasm =
                            Module._ts_tree_cursor_reset_wasm =
                              Module.asm.ts_tree_cursor_reset_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_cursor_goto_first_child_wasm =
                        (Module._ts_tree_cursor_goto_first_child_wasm =
                          function () {
                            return (_ts_tree_cursor_goto_first_child_wasm =
                              Module._ts_tree_cursor_goto_first_child_wasm =
                                Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_goto_next_sibling_wasm =
                        (Module._ts_tree_cursor_goto_next_sibling_wasm =
                          function () {
                            return (_ts_tree_cursor_goto_next_sibling_wasm =
                              Module._ts_tree_cursor_goto_next_sibling_wasm =
                                Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_goto_parent_wasm =
                        (Module._ts_tree_cursor_goto_parent_wasm = function () {
                          return (_ts_tree_cursor_goto_parent_wasm =
                            Module._ts_tree_cursor_goto_parent_wasm =
                              Module.asm.ts_tree_cursor_goto_parent_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_cursor_current_node_type_id_wasm =
                        (Module._ts_tree_cursor_current_node_type_id_wasm =
                          function () {
                            return (_ts_tree_cursor_current_node_type_id_wasm =
                              Module._ts_tree_cursor_current_node_type_id_wasm =
                                Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_current_node_is_named_wasm =
                        (Module._ts_tree_cursor_current_node_is_named_wasm =
                          function () {
                            return (_ts_tree_cursor_current_node_is_named_wasm =
                              Module._ts_tree_cursor_current_node_is_named_wasm =
                                Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_current_node_is_missing_wasm =
                        (Module._ts_tree_cursor_current_node_is_missing_wasm =
                          function () {
                            return (_ts_tree_cursor_current_node_is_missing_wasm =
                              Module._ts_tree_cursor_current_node_is_missing_wasm =
                                Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_current_node_id_wasm =
                        (Module._ts_tree_cursor_current_node_id_wasm =
                          function () {
                            return (_ts_tree_cursor_current_node_id_wasm =
                              Module._ts_tree_cursor_current_node_id_wasm =
                                Module.asm.ts_tree_cursor_current_node_id_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_start_position_wasm =
                        (Module._ts_tree_cursor_start_position_wasm =
                          function () {
                            return (_ts_tree_cursor_start_position_wasm =
                              Module._ts_tree_cursor_start_position_wasm =
                                Module.asm.ts_tree_cursor_start_position_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_end_position_wasm =
                        (Module._ts_tree_cursor_end_position_wasm =
                          function () {
                            return (_ts_tree_cursor_end_position_wasm =
                              Module._ts_tree_cursor_end_position_wasm =
                                Module.asm.ts_tree_cursor_end_position_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_start_index_wasm =
                        (Module._ts_tree_cursor_start_index_wasm = function () {
                          return (_ts_tree_cursor_start_index_wasm =
                            Module._ts_tree_cursor_start_index_wasm =
                              Module.asm.ts_tree_cursor_start_index_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_cursor_end_index_wasm =
                        (Module._ts_tree_cursor_end_index_wasm = function () {
                          return (_ts_tree_cursor_end_index_wasm =
                            Module._ts_tree_cursor_end_index_wasm =
                              Module.asm.ts_tree_cursor_end_index_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_tree_cursor_current_field_id_wasm =
                        (Module._ts_tree_cursor_current_field_id_wasm =
                          function () {
                            return (_ts_tree_cursor_current_field_id_wasm =
                              Module._ts_tree_cursor_current_field_id_wasm =
                                Module.asm.ts_tree_cursor_current_field_id_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_tree_cursor_current_node_wasm =
                        (Module._ts_tree_cursor_current_node_wasm =
                          function () {
                            return (_ts_tree_cursor_current_node_wasm =
                              Module._ts_tree_cursor_current_node_wasm =
                                Module.asm.ts_tree_cursor_current_node_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_node_symbol_wasm = (Module._ts_node_symbol_wasm =
                        function () {
                          return (_ts_node_symbol_wasm =
                            Module._ts_node_symbol_wasm =
                              Module.asm.ts_node_symbol_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_child_count_wasm =
                        (Module._ts_node_child_count_wasm = function () {
                          return (_ts_node_child_count_wasm =
                            Module._ts_node_child_count_wasm =
                              Module.asm.ts_node_child_count_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_named_child_count_wasm =
                        (Module._ts_node_named_child_count_wasm = function () {
                          return (_ts_node_named_child_count_wasm =
                            Module._ts_node_named_child_count_wasm =
                              Module.asm.ts_node_named_child_count_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_child_wasm = (Module._ts_node_child_wasm =
                        function () {
                          return (_ts_node_child_wasm =
                            Module._ts_node_child_wasm =
                              Module.asm.ts_node_child_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_named_child_wasm =
                        (Module._ts_node_named_child_wasm = function () {
                          return (_ts_node_named_child_wasm =
                            Module._ts_node_named_child_wasm =
                              Module.asm.ts_node_named_child_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_child_by_field_id_wasm =
                        (Module._ts_node_child_by_field_id_wasm = function () {
                          return (_ts_node_child_by_field_id_wasm =
                            Module._ts_node_child_by_field_id_wasm =
                              Module.asm.ts_node_child_by_field_id_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_next_sibling_wasm =
                        (Module._ts_node_next_sibling_wasm = function () {
                          return (_ts_node_next_sibling_wasm =
                            Module._ts_node_next_sibling_wasm =
                              Module.asm.ts_node_next_sibling_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_prev_sibling_wasm =
                        (Module._ts_node_prev_sibling_wasm = function () {
                          return (_ts_node_prev_sibling_wasm =
                            Module._ts_node_prev_sibling_wasm =
                              Module.asm.ts_node_prev_sibling_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_next_named_sibling_wasm =
                        (Module._ts_node_next_named_sibling_wasm = function () {
                          return (_ts_node_next_named_sibling_wasm =
                            Module._ts_node_next_named_sibling_wasm =
                              Module.asm.ts_node_next_named_sibling_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_prev_named_sibling_wasm =
                        (Module._ts_node_prev_named_sibling_wasm = function () {
                          return (_ts_node_prev_named_sibling_wasm =
                            Module._ts_node_prev_named_sibling_wasm =
                              Module.asm.ts_node_prev_named_sibling_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_parent_wasm = (Module._ts_node_parent_wasm =
                        function () {
                          return (_ts_node_parent_wasm =
                            Module._ts_node_parent_wasm =
                              Module.asm.ts_node_parent_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_descendant_for_index_wasm =
                        (Module._ts_node_descendant_for_index_wasm =
                          function () {
                            return (_ts_node_descendant_for_index_wasm =
                              Module._ts_node_descendant_for_index_wasm =
                                Module.asm.ts_node_descendant_for_index_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_node_named_descendant_for_index_wasm =
                        (Module._ts_node_named_descendant_for_index_wasm =
                          function () {
                            return (_ts_node_named_descendant_for_index_wasm =
                              Module._ts_node_named_descendant_for_index_wasm =
                                Module.asm.ts_node_named_descendant_for_index_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_node_descendant_for_position_wasm =
                        (Module._ts_node_descendant_for_position_wasm =
                          function () {
                            return (_ts_node_descendant_for_position_wasm =
                              Module._ts_node_descendant_for_position_wasm =
                                Module.asm.ts_node_descendant_for_position_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_node_named_descendant_for_position_wasm =
                        (Module._ts_node_named_descendant_for_position_wasm =
                          function () {
                            return (_ts_node_named_descendant_for_position_wasm =
                              Module._ts_node_named_descendant_for_position_wasm =
                                Module.asm.ts_node_named_descendant_for_position_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_node_start_point_wasm =
                        (Module._ts_node_start_point_wasm = function () {
                          return (_ts_node_start_point_wasm =
                            Module._ts_node_start_point_wasm =
                              Module.asm.ts_node_start_point_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_end_point_wasm =
                        (Module._ts_node_end_point_wasm = function () {
                          return (_ts_node_end_point_wasm =
                            Module._ts_node_end_point_wasm =
                              Module.asm.ts_node_end_point_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_start_index_wasm =
                        (Module._ts_node_start_index_wasm = function () {
                          return (_ts_node_start_index_wasm =
                            Module._ts_node_start_index_wasm =
                              Module.asm.ts_node_start_index_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_end_index_wasm =
                        (Module._ts_node_end_index_wasm = function () {
                          return (_ts_node_end_index_wasm =
                            Module._ts_node_end_index_wasm =
                              Module.asm.ts_node_end_index_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_to_string_wasm =
                        (Module._ts_node_to_string_wasm = function () {
                          return (_ts_node_to_string_wasm =
                            Module._ts_node_to_string_wasm =
                              Module.asm.ts_node_to_string_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_children_wasm = (Module._ts_node_children_wasm =
                        function () {
                          return (_ts_node_children_wasm =
                            Module._ts_node_children_wasm =
                              Module.asm.ts_node_children_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_named_children_wasm =
                        (Module._ts_node_named_children_wasm = function () {
                          return (_ts_node_named_children_wasm =
                            Module._ts_node_named_children_wasm =
                              Module.asm.ts_node_named_children_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_descendants_of_type_wasm =
                        (Module._ts_node_descendants_of_type_wasm =
                          function () {
                            return (_ts_node_descendants_of_type_wasm =
                              Module._ts_node_descendants_of_type_wasm =
                                Module.asm.ts_node_descendants_of_type_wasm).apply(
                              null,
                              arguments
                            );
                          }),
                      _ts_node_is_named_wasm = (Module._ts_node_is_named_wasm =
                        function () {
                          return (_ts_node_is_named_wasm =
                            Module._ts_node_is_named_wasm =
                              Module.asm.ts_node_is_named_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_has_changes_wasm =
                        (Module._ts_node_has_changes_wasm = function () {
                          return (_ts_node_has_changes_wasm =
                            Module._ts_node_has_changes_wasm =
                              Module.asm.ts_node_has_changes_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_has_error_wasm =
                        (Module._ts_node_has_error_wasm = function () {
                          return (_ts_node_has_error_wasm =
                            Module._ts_node_has_error_wasm =
                              Module.asm.ts_node_has_error_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_node_is_missing_wasm =
                        (Module._ts_node_is_missing_wasm = function () {
                          return (_ts_node_is_missing_wasm =
                            Module._ts_node_is_missing_wasm =
                              Module.asm.ts_node_is_missing_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_query_matches_wasm = (Module._ts_query_matches_wasm =
                        function () {
                          return (_ts_query_matches_wasm =
                            Module._ts_query_matches_wasm =
                              Module.asm.ts_query_matches_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      _ts_query_captures_wasm =
                        (Module._ts_query_captures_wasm = function () {
                          return (_ts_query_captures_wasm =
                            Module._ts_query_captures_wasm =
                              Module.asm.ts_query_captures_wasm).apply(
                            null,
                            arguments
                          );
                        }),
                      ___cxa_atexit = (Module.___cxa_atexit = function () {
                        return (___cxa_atexit = Module.___cxa_atexit =
                          Module.asm.__cxa_atexit).apply(null, arguments);
                      }),
                      _iswdigit = (Module._iswdigit = function () {
                        return (_iswdigit = Module._iswdigit =
                          Module.asm.iswdigit).apply(null, arguments);
                      }),
                      _iswalpha = (Module._iswalpha = function () {
                        return (_iswalpha = Module._iswalpha =
                          Module.asm.iswalpha).apply(null, arguments);
                      }),
                      _iswlower = (Module._iswlower = function () {
                        return (_iswlower = Module._iswlower =
                          Module.asm.iswlower).apply(null, arguments);
                      }),
                      _memchr = (Module._memchr = function () {
                        return (_memchr = Module._memchr =
                          Module.asm.memchr).apply(null, arguments);
                      }),
                      _strlen = (Module._strlen = function () {
                        return (_strlen = Module._strlen =
                          Module.asm.strlen).apply(null, arguments);
                      }),
                      _towupper = (Module._towupper = function () {
                        return (_towupper = Module._towupper =
                          Module.asm.towupper).apply(null, arguments);
                      }),
                      _setThrew = (Module._setThrew = function () {
                        return (_setThrew = Module._setThrew =
                          Module.asm.setThrew).apply(null, arguments);
                      }),
                      stackSave = (Module.stackSave = function () {
                        return (stackSave = Module.stackSave =
                          Module.asm.stackSave).apply(null, arguments);
                      }),
                      stackRestore = (Module.stackRestore = function () {
                        return (stackRestore = Module.stackRestore =
                          Module.asm.stackRestore).apply(null, arguments);
                      }),
                      stackAlloc = (Module.stackAlloc = function () {
                        return (stackAlloc = Module.stackAlloc =
                          Module.asm.stackAlloc).apply(null, arguments);
                      }),
                      __Znwm = (Module.__Znwm = function () {
                        return (__Znwm = Module.__Znwm =
                          Module.asm._Znwm).apply(null, arguments);
                      }),
                      __ZdlPv = (Module.__ZdlPv = function () {
                        return (__ZdlPv = Module.__ZdlPv =
                          Module.asm._ZdlPv).apply(null, arguments);
                      }),
                      __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev =
                        (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev =
                          function () {
                            return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev =
                              Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev =
                                Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm =
                        (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm =
                          function () {
                            return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm =
                              Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm =
                                Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm =
                        (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm =
                          function () {
                            return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm =
                              Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm =
                                Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm =
                        (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm =
                          function () {
                            return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm =
                              Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm =
                                Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm =
                        (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm =
                          function () {
                            return (__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm =
                              Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm =
                                Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc =
                        (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc =
                          function () {
                            return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc =
                              Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc =
                                Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev =
                        (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev =
                          function () {
                            return (__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev =
                              Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev =
                                Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw =
                        (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw =
                          function () {
                            return (__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw =
                              Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw =
                                Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(
                              null,
                              arguments
                            );
                          }),
                      __ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw =
                        (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw =
                          function () {
                            return (__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw =
                              Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw =
                                Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw).apply(
                              null,
                              arguments
                            );
                          }),
                      dynCall_jiji = (Module.dynCall_jiji = function () {
                        return (dynCall_jiji = Module.dynCall_jiji =
                          Module.asm.dynCall_jiji).apply(null, arguments);
                      }),
                      _orig$ts_parser_timeout_micros =
                        (Module._orig$ts_parser_timeout_micros = function () {
                          return (_orig$ts_parser_timeout_micros =
                            Module._orig$ts_parser_timeout_micros =
                              Module.asm.orig$ts_parser_timeout_micros).apply(
                            null,
                            arguments
                          );
                        }),
                      _orig$ts_parser_set_timeout_micros =
                        (Module._orig$ts_parser_set_timeout_micros =
                          function () {
                            return (_orig$ts_parser_set_timeout_micros =
                              Module._orig$ts_parser_set_timeout_micros =
                                Module.asm.orig$ts_parser_set_timeout_micros).apply(
                              null,
                              arguments
                            );
                          }),
                      calledRun;
                    function callMain(e) {
                      var t = Module._main;
                      if (t) {
                        (e = e || []).unshift(thisProgram);
                        var n = e.length,
                          r = stackAlloc(4 * (n + 1)),
                          i = r >> 2;
                        e.forEach((e) => {
                          HEAP32[i++] = allocateUTF8OnStack(e);
                        }),
                          (HEAP32[i] = 0);
                        try {
                          var o = t(n, r);
                          return exitJS(o, !0), o;
                        } catch (e) {
                          return handleException(e);
                        }
                      }
                    }
                    (Module.AsciiToString = AsciiToString),
                      (Module.stringToUTF16 = stringToUTF16),
                      (dependenciesFulfilled = function e() {
                        calledRun || run(),
                          calledRun || (dependenciesFulfilled = e);
                      });
                    var dylibsLoaded = !1;
                    function run(e) {
                      function t() {
                        calledRun ||
                          ((calledRun = !0),
                          (Module.calledRun = !0),
                          ABORT ||
                            (initRuntime(),
                            preMain(),
                            Module.onRuntimeInitialized &&
                              Module.onRuntimeInitialized(),
                            shouldRunNow && callMain(e),
                            postRun()));
                      }
                      (e = e || arguments_),
                        runDependencies > 0 ||
                          (!dylibsLoaded &&
                            (preloadDylibs(),
                            (dylibsLoaded = !0),
                            runDependencies > 0)) ||
                          (preRun(),
                          runDependencies > 0 ||
                            (Module.setStatus
                              ? (Module.setStatus("Running..."),
                                setTimeout(function () {
                                  setTimeout(function () {
                                    Module.setStatus("");
                                  }, 1),
                                    t();
                                }, 1))
                              : t()));
                    }
                    if (Module.preInit)
                      for (
                        "function" == typeof Module.preInit &&
                        (Module.preInit = [Module.preInit]);
                        Module.preInit.length > 0;

                      )
                        Module.preInit.pop()();
                    var shouldRunNow = !0;
                    Module.noInitialRun && (shouldRunNow = !1), run();
                    const C = Module,
                      INTERNAL = {},
                      SIZE_OF_INT = 4,
                      SIZE_OF_NODE = 5 * SIZE_OF_INT,
                      SIZE_OF_POINT = 2 * SIZE_OF_INT,
                      SIZE_OF_RANGE = 2 * SIZE_OF_INT + 2 * SIZE_OF_POINT,
                      ZERO_POINT = {
                        row: 0,
                        column: 0,
                      },
                      QUERY_WORD_REGEX = /[\w-.]*/g,
                      PREDICATE_STEP_TYPE_CAPTURE = 1,
                      PREDICATE_STEP_TYPE_STRING = 2,
                      LANGUAGE_FUNCTION_REGEX = /^_?tree_sitter_\w+/;
                    var VERSION,
                      MIN_COMPATIBLE_VERSION,
                      TRANSFER_BUFFER,
                      currentParseCallback,
                      currentLogCallback;
                    class ParserImpl {
                      static init() {
                        (TRANSFER_BUFFER = C._ts_init()),
                          (VERSION = getValue(TRANSFER_BUFFER, "i32")),
                          (MIN_COMPATIBLE_VERSION = getValue(
                            TRANSFER_BUFFER + SIZE_OF_INT,
                            "i32"
                          ));
                      }
                      initialize() {
                        C._ts_parser_new_wasm(),
                          (this[0] = getValue(TRANSFER_BUFFER, "i32")),
                          (this[1] = getValue(
                            TRANSFER_BUFFER + SIZE_OF_INT,
                            "i32"
                          ));
                      }
                      delete() {
                        C._ts_parser_delete(this[0]),
                          C._free(this[1]),
                          (this[0] = 0),
                          (this[1] = 0);
                      }
                      setLanguage(e) {
                        let t;
                        if (e) {
                          if (e.constructor !== Language)
                            throw new Error("Argument must be a Language");
                          {
                            t = e[0];
                            const n = C._ts_language_version(t);
                            if (n < MIN_COMPATIBLE_VERSION || VERSION < n)
                              throw new Error(
                                `Incompatible language version ${n}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${VERSION}.`
                              );
                          }
                        } else (t = 0), (e = null);
                        return (
                          (this.language = e),
                          C._ts_parser_set_language(this[0], t),
                          this
                        );
                      }
                      getLanguage() {
                        return this.language;
                      }
                      parse(e, t, n) {
                        if ("string" == typeof e)
                          currentParseCallback = (t, n, r) => e.slice(t, r);
                        else {
                          if ("function" != typeof e)
                            throw new Error(
                              "Argument must be a string or a function"
                            );
                          currentParseCallback = e;
                        }
                        this.logCallback
                          ? ((currentLogCallback = this.logCallback),
                            C._ts_parser_enable_logger_wasm(this[0], 1))
                          : ((currentLogCallback = null),
                            C._ts_parser_enable_logger_wasm(this[0], 0));
                        let r = 0,
                          i = 0;
                        if (n && n.includedRanges) {
                          (r = n.includedRanges.length),
                            (i = C._calloc(r, SIZE_OF_RANGE));
                          let e = i;
                          for (let t = 0; t < r; t++)
                            marshalRange(e, n.includedRanges[t]),
                              (e += SIZE_OF_RANGE);
                        }
                        const o = C._ts_parser_parse_wasm(
                          this[0],
                          this[1],
                          t ? t[0] : 0,
                          i,
                          r
                        );
                        if (!o)
                          throw (
                            ((currentParseCallback = null),
                            (currentLogCallback = null),
                            new Error("Parsing failed"))
                          );
                        const s = new Tree(
                          INTERNAL,
                          o,
                          this.language,
                          currentParseCallback
                        );
                        return (
                          (currentParseCallback = null),
                          (currentLogCallback = null),
                          s
                        );
                      }
                      reset() {
                        C._ts_parser_reset(this[0]);
                      }
                      setTimeoutMicros(e) {
                        C._ts_parser_set_timeout_micros(this[0], e);
                      }
                      getTimeoutMicros() {
                        return C._ts_parser_timeout_micros(this[0]);
                      }
                      setLogger(e) {
                        if (e) {
                          if ("function" != typeof e)
                            throw new Error(
                              "Logger callback must be a function"
                            );
                        } else e = null;
                        return (this.logCallback = e), this;
                      }
                      getLogger() {
                        return this.logCallback;
                      }
                    }
                    class Tree {
                      constructor(e, t, n, r) {
                        assertInternal(e),
                          (this[0] = t),
                          (this.language = n),
                          (this.textCallback = r);
                      }
                      copy() {
                        const e = C._ts_tree_copy(this[0]);
                        return new Tree(
                          INTERNAL,
                          e,
                          this.language,
                          this.textCallback
                        );
                      }
                      delete() {
                        C._ts_tree_delete(this[0]), (this[0] = 0);
                      }
                      edit(e) {
                        marshalEdit(e), C._ts_tree_edit_wasm(this[0]);
                      }
                      get rootNode() {
                        return (
                          C._ts_tree_root_node_wasm(this[0]),
                          unmarshalNode(this)
                        );
                      }
                      getLanguage() {
                        return this.language;
                      }
                      walk() {
                        return this.rootNode.walk();
                      }
                      getChangedRanges(e) {
                        if (e.constructor !== Tree)
                          throw new TypeError("Argument must be a Tree");
                        C._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
                        const t = getValue(TRANSFER_BUFFER, "i32"),
                          n = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"),
                          r = new Array(t);
                        if (t > 0) {
                          let e = n;
                          for (let n = 0; n < t; n++)
                            (r[n] = unmarshalRange(e)), (e += SIZE_OF_RANGE);
                          C._free(n);
                        }
                        return r;
                      }
                    }
                    class Node {
                      constructor(e, t) {
                        assertInternal(e), (this.tree = t);
                      }
                      get typeId() {
                        return (
                          marshalNode(this),
                          C._ts_node_symbol_wasm(this.tree[0])
                        );
                      }
                      get type() {
                        return this.tree.language.types[this.typeId] || "ERROR";
                      }
                      get endPosition() {
                        return (
                          marshalNode(this),
                          C._ts_node_end_point_wasm(this.tree[0]),
                          unmarshalPoint(TRANSFER_BUFFER)
                        );
                      }
                      get endIndex() {
                        return (
                          marshalNode(this),
                          C._ts_node_end_index_wasm(this.tree[0])
                        );
                      }
                      get text() {
                        return getText(
                          this.tree,
                          this.startIndex,
                          this.endIndex
                        );
                      }
                      isNamed() {
                        return (
                          marshalNode(this),
                          1 === C._ts_node_is_named_wasm(this.tree[0])
                        );
                      }
                      hasError() {
                        return (
                          marshalNode(this),
                          1 === C._ts_node_has_error_wasm(this.tree[0])
                        );
                      }
                      hasChanges() {
                        return (
                          marshalNode(this),
                          1 === C._ts_node_has_changes_wasm(this.tree[0])
                        );
                      }
                      isMissing() {
                        return (
                          marshalNode(this),
                          1 === C._ts_node_is_missing_wasm(this.tree[0])
                        );
                      }
                      equals(e) {
                        return this.id === e.id;
                      }
                      child(e) {
                        return (
                          marshalNode(this),
                          C._ts_node_child_wasm(this.tree[0], e),
                          unmarshalNode(this.tree)
                        );
                      }
                      namedChild(e) {
                        return (
                          marshalNode(this),
                          C._ts_node_named_child_wasm(this.tree[0], e),
                          unmarshalNode(this.tree)
                        );
                      }
                      childForFieldId(e) {
                        return (
                          marshalNode(this),
                          C._ts_node_child_by_field_id_wasm(this.tree[0], e),
                          unmarshalNode(this.tree)
                        );
                      }
                      childForFieldName(e) {
                        const t = this.tree.language.fields.indexOf(e);
                        if (-1 !== t) return this.childForFieldId(t);
                      }
                      get childCount() {
                        return (
                          marshalNode(this),
                          C._ts_node_child_count_wasm(this.tree[0])
                        );
                      }
                      get namedChildCount() {
                        return (
                          marshalNode(this),
                          C._ts_node_named_child_count_wasm(this.tree[0])
                        );
                      }
                      get firstChild() {
                        return this.child(0);
                      }
                      get firstNamedChild() {
                        return this.namedChild(0);
                      }
                      get lastChild() {
                        return this.child(this.childCount - 1);
                      }
                      get lastNamedChild() {
                        return this.namedChild(this.namedChildCount - 1);
                      }
                      get children() {
                        if (!this._children) {
                          marshalNode(this),
                            C._ts_node_children_wasm(this.tree[0]);
                          const e = getValue(TRANSFER_BUFFER, "i32"),
                            t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
                          if (((this._children = new Array(e)), e > 0)) {
                            let n = t;
                            for (let t = 0; t < e; t++)
                              (this._children[t] = unmarshalNode(this.tree, n)),
                                (n += SIZE_OF_NODE);
                            C._free(t);
                          }
                        }
                        return this._children;
                      }
                      get namedChildren() {
                        if (!this._namedChildren) {
                          marshalNode(this),
                            C._ts_node_named_children_wasm(this.tree[0]);
                          const e = getValue(TRANSFER_BUFFER, "i32"),
                            t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
                          if (((this._namedChildren = new Array(e)), e > 0)) {
                            let n = t;
                            for (let t = 0; t < e; t++)
                              (this._namedChildren[t] = unmarshalNode(
                                this.tree,
                                n
                              )),
                                (n += SIZE_OF_NODE);
                            C._free(t);
                          }
                        }
                        return this._namedChildren;
                      }
                      descendantsOfType(e, t, n) {
                        Array.isArray(e) || (e = [e]),
                          t || (t = ZERO_POINT),
                          n || (n = ZERO_POINT);
                        const r = [],
                          i = this.tree.language.types;
                        for (let t = 0, n = i.length; t < n; t++)
                          e.includes(i[t]) && r.push(t);
                        const o = C._malloc(SIZE_OF_INT * r.length);
                        for (let e = 0, t = r.length; e < t; e++)
                          setValue(o + e * SIZE_OF_INT, r[e], "i32");
                        marshalNode(this),
                          C._ts_node_descendants_of_type_wasm(
                            this.tree[0],
                            o,
                            r.length,
                            t.row,
                            t.column,
                            n.row,
                            n.column
                          );
                        const s = getValue(TRANSFER_BUFFER, "i32"),
                          a = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"),
                          c = new Array(s);
                        if (s > 0) {
                          let e = a;
                          for (let t = 0; t < s; t++)
                            (c[t] = unmarshalNode(this.tree, e)),
                              (e += SIZE_OF_NODE);
                        }
                        return C._free(a), C._free(o), c;
                      }
                      get nextSibling() {
                        return (
                          marshalNode(this),
                          C._ts_node_next_sibling_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      get previousSibling() {
                        return (
                          marshalNode(this),
                          C._ts_node_prev_sibling_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      get nextNamedSibling() {
                        return (
                          marshalNode(this),
                          C._ts_node_next_named_sibling_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      get previousNamedSibling() {
                        return (
                          marshalNode(this),
                          C._ts_node_prev_named_sibling_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      get parent() {
                        return (
                          marshalNode(this),
                          C._ts_node_parent_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      descendantForIndex(e, t = e) {
                        if ("number" != typeof e || "number" != typeof t)
                          throw new Error("Arguments must be numbers");
                        marshalNode(this);
                        let n = TRANSFER_BUFFER + SIZE_OF_NODE;
                        return (
                          setValue(n, e, "i32"),
                          setValue(n + SIZE_OF_INT, t, "i32"),
                          C._ts_node_descendant_for_index_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      namedDescendantForIndex(e, t = e) {
                        if ("number" != typeof e || "number" != typeof t)
                          throw new Error("Arguments must be numbers");
                        marshalNode(this);
                        let n = TRANSFER_BUFFER + SIZE_OF_NODE;
                        return (
                          setValue(n, e, "i32"),
                          setValue(n + SIZE_OF_INT, t, "i32"),
                          C._ts_node_named_descendant_for_index_wasm(
                            this.tree[0]
                          ),
                          unmarshalNode(this.tree)
                        );
                      }
                      descendantForPosition(e, t = e) {
                        if (!isPoint(e) || !isPoint(t))
                          throw new Error(
                            "Arguments must be {row, column} objects"
                          );
                        marshalNode(this);
                        let n = TRANSFER_BUFFER + SIZE_OF_NODE;
                        return (
                          marshalPoint(n, e),
                          marshalPoint(n + SIZE_OF_POINT, t),
                          C._ts_node_descendant_for_position_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      namedDescendantForPosition(e, t = e) {
                        if (!isPoint(e) || !isPoint(t))
                          throw new Error(
                            "Arguments must be {row, column} objects"
                          );
                        marshalNode(this);
                        let n = TRANSFER_BUFFER + SIZE_OF_NODE;
                        return (
                          marshalPoint(n, e),
                          marshalPoint(n + SIZE_OF_POINT, t),
                          C._ts_node_named_descendant_for_position_wasm(
                            this.tree[0]
                          ),
                          unmarshalNode(this.tree)
                        );
                      }
                      walk() {
                        return (
                          marshalNode(this),
                          C._ts_tree_cursor_new_wasm(this.tree[0]),
                          new TreeCursor(INTERNAL, this.tree)
                        );
                      }
                      toString() {
                        marshalNode(this);
                        const e = C._ts_node_to_string_wasm(this.tree[0]),
                          t = AsciiToString(e);
                        return C._free(e), t;
                      }
                    }
                    class TreeCursor {
                      constructor(e, t) {
                        assertInternal(e),
                          (this.tree = t),
                          unmarshalTreeCursor(this);
                      }
                      delete() {
                        marshalTreeCursor(this),
                          C._ts_tree_cursor_delete_wasm(this.tree[0]),
                          (this[0] = this[1] = this[2] = 0);
                      }
                      reset(e) {
                        marshalNode(e),
                          marshalTreeCursor(
                            this,
                            TRANSFER_BUFFER + SIZE_OF_NODE
                          ),
                          C._ts_tree_cursor_reset_wasm(this.tree[0]),
                          unmarshalTreeCursor(this);
                      }
                      get nodeType() {
                        return (
                          this.tree.language.types[this.nodeTypeId] || "ERROR"
                        );
                      }
                      get nodeTypeId() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_current_node_type_id_wasm(
                            this.tree[0]
                          )
                        );
                      }
                      get nodeId() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_current_node_id_wasm(this.tree[0])
                        );
                      }
                      get nodeIsNamed() {
                        return (
                          marshalTreeCursor(this),
                          1 ===
                            C._ts_tree_cursor_current_node_is_named_wasm(
                              this.tree[0]
                            )
                        );
                      }
                      get nodeIsMissing() {
                        return (
                          marshalTreeCursor(this),
                          1 ===
                            C._ts_tree_cursor_current_node_is_missing_wasm(
                              this.tree[0]
                            )
                        );
                      }
                      get nodeText() {
                        marshalTreeCursor(this);
                        const e = C._ts_tree_cursor_start_index_wasm(
                            this.tree[0]
                          ),
                          t = C._ts_tree_cursor_end_index_wasm(this.tree[0]);
                        return getText(this.tree, e, t);
                      }
                      get startPosition() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_start_position_wasm(this.tree[0]),
                          unmarshalPoint(TRANSFER_BUFFER)
                        );
                      }
                      get endPosition() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_end_position_wasm(this.tree[0]),
                          unmarshalPoint(TRANSFER_BUFFER)
                        );
                      }
                      get startIndex() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_start_index_wasm(this.tree[0])
                        );
                      }
                      get endIndex() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_end_index_wasm(this.tree[0])
                        );
                      }
                      currentNode() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_current_node_wasm(this.tree[0]),
                          unmarshalNode(this.tree)
                        );
                      }
                      currentFieldId() {
                        return (
                          marshalTreeCursor(this),
                          C._ts_tree_cursor_current_field_id_wasm(this.tree[0])
                        );
                      }
                      currentFieldName() {
                        return this.tree.language.fields[this.currentFieldId()];
                      }
                      gotoFirstChild() {
                        marshalTreeCursor(this);
                        const e = C._ts_tree_cursor_goto_first_child_wasm(
                          this.tree[0]
                        );
                        return unmarshalTreeCursor(this), 1 === e;
                      }
                      gotoNextSibling() {
                        marshalTreeCursor(this);
                        const e = C._ts_tree_cursor_goto_next_sibling_wasm(
                          this.tree[0]
                        );
                        return unmarshalTreeCursor(this), 1 === e;
                      }
                      gotoParent() {
                        marshalTreeCursor(this);
                        const e = C._ts_tree_cursor_goto_parent_wasm(
                          this.tree[0]
                        );
                        return unmarshalTreeCursor(this), 1 === e;
                      }
                    }
                    class Language {
                      constructor(e, t) {
                        assertInternal(e),
                          (this[0] = t),
                          (this.types = new Array(
                            C._ts_language_symbol_count(this[0])
                          ));
                        for (let e = 0, t = this.types.length; e < t; e++)
                          C._ts_language_symbol_type(this[0], e) < 2 &&
                            (this.types[e] = UTF8ToString(
                              C._ts_language_symbol_name(this[0], e)
                            ));
                        this.fields = new Array(
                          C._ts_language_field_count(this[0]) + 1
                        );
                        for (let e = 0, t = this.fields.length; e < t; e++) {
                          const t = C._ts_language_field_name_for_id(
                            this[0],
                            e
                          );
                          this.fields[e] = 0 !== t ? UTF8ToString(t) : null;
                        }
                      }
                      get version() {
                        return C._ts_language_version(this[0]);
                      }
                      get fieldCount() {
                        return this.fields.length - 1;
                      }
                      fieldIdForName(e) {
                        const t = this.fields.indexOf(e);
                        return -1 !== t ? t : null;
                      }
                      fieldNameForId(e) {
                        return this.fields[e] || null;
                      }
                      idForNodeType(e, t) {
                        const n = lengthBytesUTF8(e),
                          r = C._malloc(n + 1);
                        stringToUTF8(e, r, n + 1);
                        const i = C._ts_language_symbol_for_name(
                          this[0],
                          r,
                          n,
                          t
                        );
                        return C._free(r), i || null;
                      }
                      get nodeTypeCount() {
                        return C._ts_language_symbol_count(this[0]);
                      }
                      nodeTypeForId(e) {
                        const t = C._ts_language_symbol_name(this[0], e);
                        return t ? UTF8ToString(t) : null;
                      }
                      nodeTypeIsNamed(e) {
                        return !!C._ts_language_type_is_named_wasm(this[0], e);
                      }
                      nodeTypeIsVisible(e) {
                        return !!C._ts_language_type_is_visible_wasm(
                          this[0],
                          e
                        );
                      }
                      query(e) {
                        const t = lengthBytesUTF8(e),
                          n = C._malloc(t + 1);
                        stringToUTF8(e, n, t + 1);
                        const r = C._ts_query_new(
                          this[0],
                          n,
                          t,
                          TRANSFER_BUFFER,
                          TRANSFER_BUFFER + SIZE_OF_INT
                        );
                        if (!r) {
                          const t = getValue(
                              TRANSFER_BUFFER + SIZE_OF_INT,
                              "i32"
                            ),
                            r = UTF8ToString(
                              n,
                              getValue(TRANSFER_BUFFER, "i32")
                            ).length,
                            i = e.substr(r, 100).split("\n")[0];
                          let o,
                            s = i.match(QUERY_WORD_REGEX)[0];
                          switch (t) {
                            case 2:
                              o = new RangeError(`Bad node name '${s}'`);
                              break;
                            case 3:
                              o = new RangeError(`Bad field name '${s}'`);
                              break;
                            case 4:
                              o = new RangeError(`Bad capture name @${s}`);
                              break;
                            case 5:
                              (o = new TypeError(
                                `Bad pattern structure at offset ${r}: '${i}'...`
                              )),
                                (s = "");
                              break;
                            default:
                              (o = new SyntaxError(
                                `Bad syntax at offset ${r}: '${i}'...`
                              )),
                                (s = "");
                          }
                          throw (
                            ((o.index = r),
                            (o.length = s.length),
                            C._free(n),
                            o)
                          );
                        }
                        const i = C._ts_query_string_count(r),
                          o = C._ts_query_capture_count(r),
                          s = C._ts_query_pattern_count(r),
                          a = new Array(o),
                          c = new Array(i);
                        for (let e = 0; e < o; e++) {
                          const t = C._ts_query_capture_name_for_id(
                              r,
                              e,
                              TRANSFER_BUFFER
                            ),
                            n = getValue(TRANSFER_BUFFER, "i32");
                          a[e] = UTF8ToString(t, n);
                        }
                        for (let e = 0; e < i; e++) {
                          const t = C._ts_query_string_value_for_id(
                              r,
                              e,
                              TRANSFER_BUFFER
                            ),
                            n = getValue(TRANSFER_BUFFER, "i32");
                          c[e] = UTF8ToString(t, n);
                        }
                        const l = new Array(s),
                          u = new Array(s),
                          p = new Array(s),
                          d = new Array(s),
                          h = new Array(s);
                        for (let e = 0; e < s; e++) {
                          const t = C._ts_query_predicates_for_pattern(
                              r,
                              e,
                              TRANSFER_BUFFER
                            ),
                            n = getValue(TRANSFER_BUFFER, "i32");
                          (d[e] = []), (h[e] = []);
                          const i = [];
                          let o = t;
                          for (let t = 0; t < n; t++) {
                            const t = getValue(o, "i32");
                            o += SIZE_OF_INT;
                            const n = getValue(o, "i32");
                            if (
                              ((o += SIZE_OF_INT),
                              t === PREDICATE_STEP_TYPE_CAPTURE)
                            )
                              i.push({
                                type: "capture",
                                name: a[n],
                              });
                            else if (t === PREDICATE_STEP_TYPE_STRING)
                              i.push({
                                type: "string",
                                value: c[n],
                              });
                            else if (i.length > 0) {
                              if ("string" !== i[0].type)
                                throw new Error(
                                  "Predicates must begin with a literal value"
                                );
                              const t = i[0].value;
                              let n = !0;
                              switch (t) {
                                case "not-eq?":
                                  n = !1;
                                case "eq?":
                                  if (3 !== i.length)
                                    throw new Error(
                                      "Wrong number of arguments to `#eq?` predicate. Expected 2, got " +
                                        (i.length - 1)
                                    );
                                  if ("capture" !== i[1].type)
                                    throw new Error(
                                      `First argument of \`#eq?\` predicate must be a capture. Got "${i[1].value}"`
                                    );
                                  if ("capture" === i[2].type) {
                                    const t = i[1].name,
                                      r = i[2].name;
                                    h[e].push(function (e) {
                                      let i, o;
                                      for (const n of e)
                                        n.name === t && (i = n.node),
                                          n.name === r && (o = n.node);
                                      return (
                                        void 0 === i ||
                                        void 0 === o ||
                                        (i.text === o.text) === n
                                      );
                                    });
                                  } else {
                                    const t = i[1].name,
                                      r = i[2].value;
                                    h[e].push(function (e) {
                                      for (const i of e)
                                        if (i.name === t)
                                          return (i.node.text === r) === n;
                                      return !0;
                                    });
                                  }
                                  break;
                                case "not-match?":
                                  n = !1;
                                case "match?":
                                  if (3 !== i.length)
                                    throw new Error(
                                      `Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${
                                        i.length - 1
                                      }.`
                                    );
                                  if ("capture" !== i[1].type)
                                    throw new Error(
                                      `First argument of \`#match?\` predicate must be a capture. Got "${i[1].value}".`
                                    );
                                  if ("string" !== i[2].type)
                                    throw new Error(
                                      `Second argument of \`#match?\` predicate must be a string. Got @${i[2].value}.`
                                    );
                                  const r = i[1].name,
                                    o = new RegExp(i[2].value);
                                  h[e].push(function (e) {
                                    for (const t of e)
                                      if (t.name === r)
                                        return o.test(t.node.text) === n;
                                    return !0;
                                  });
                                  break;
                                case "set!":
                                  if (i.length < 2 || i.length > 3)
                                    throw new Error(
                                      `Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${
                                        i.length - 1
                                      }.`
                                    );
                                  if (i.some((e) => "string" !== e.type))
                                    throw new Error(
                                      'Arguments to `#set!` predicate must be a strings.".'
                                    );
                                  l[e] || (l[e] = {}),
                                    (l[e][i[1].value] = i[2]
                                      ? i[2].value
                                      : null);
                                  break;
                                case "is?":
                                case "is-not?":
                                  if (i.length < 2 || i.length > 3)
                                    throw new Error(
                                      `Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${
                                        i.length - 1
                                      }.`
                                    );
                                  if (i.some((e) => "string" !== e.type))
                                    throw new Error(
                                      `Arguments to \`#${t}\` predicate must be a strings.".`
                                    );
                                  const s = "is?" === t ? u : p;
                                  s[e] || (s[e] = {}),
                                    (s[e][i[1].value] = i[2]
                                      ? i[2].value
                                      : null);
                                  break;
                                default:
                                  d[e].push({
                                    operator: t,
                                    operands: i.slice(1),
                                  });
                              }
                              i.length = 0;
                            }
                          }
                          Object.freeze(l[e]),
                            Object.freeze(u[e]),
                            Object.freeze(p[e]);
                        }
                        return (
                          C._free(n),
                          new Query(
                            INTERNAL,
                            r,
                            a,
                            h,
                            d,
                            Object.freeze(l),
                            Object.freeze(u),
                            Object.freeze(p)
                          )
                        );
                      }
                      static load(e) {
                        let t;
                        if (e instanceof Uint8Array) t = Promise.resolve(e);
                        else {
                          const n = e;
                          if (
                            "undefined" != typeof process &&
                            process.versions &&
                            process.versions.node
                          ) {
                            const e = __nested_webpack_require_105435__(7147);
                            t = Promise.resolve(e.readFileSync(n));
                          } else
                            t = fetch(n).then((e) =>
                              e.arrayBuffer().then((t) => {
                                if (e.ok) return new Uint8Array(t);
                                {
                                  const n = new TextDecoder("utf-8").decode(t);
                                  throw new Error(
                                    `Language.load failed with status ${e.status}.\n\n${n}`
                                  );
                                }
                              })
                            );
                        }
                        const n =
                          "function" == typeof loadSideModule
                            ? loadSideModule
                            : loadWebAssemblyModule;
                        return t
                          .then((e) =>
                            n(e, {
                              loadAsync: !0,
                            })
                          )
                          .then((e) => {
                            const t = Object.keys(e),
                              n = t.find(
                                (e) =>
                                  LANGUAGE_FUNCTION_REGEX.test(e) &&
                                  !e.includes("external_scanner_")
                              );
                            n ||
                              console.log(
                                `Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(
                                  t,
                                  null,
                                  2
                                )}`
                              );
                            const r = e[n]();
                            return new Language(INTERNAL, r);
                          });
                      }
                    }
                    class Query {
                      constructor(e, t, n, r, i, o, s, a) {
                        assertInternal(e),
                          (this[0] = t),
                          (this.captureNames = n),
                          (this.textPredicates = r),
                          (this.predicates = i),
                          (this.setProperties = o),
                          (this.assertedProperties = s),
                          (this.refutedProperties = a),
                          (this.exceededMatchLimit = !1);
                      }
                      delete() {
                        C._ts_query_delete(this[0]), (this[0] = 0);
                      }
                      matches(e, t, n, r) {
                        t || (t = ZERO_POINT),
                          n || (n = ZERO_POINT),
                          r || (r = {});
                        let i = r.matchLimit;
                        if (void 0 === i) i = 0;
                        else if ("number" != typeof i)
                          throw new Error("Arguments must be numbers");
                        marshalNode(e),
                          C._ts_query_matches_wasm(
                            this[0],
                            e.tree[0],
                            t.row,
                            t.column,
                            n.row,
                            n.column,
                            i
                          );
                        const o = getValue(TRANSFER_BUFFER, "i32"),
                          s = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"),
                          a = getValue(
                            TRANSFER_BUFFER + 2 * SIZE_OF_INT,
                            "i32"
                          ),
                          c = new Array(o);
                        this.exceededMatchLimit = !!a;
                        let l = 0,
                          u = s;
                        for (let t = 0; t < o; t++) {
                          const n = getValue(u, "i32");
                          u += SIZE_OF_INT;
                          const r = getValue(u, "i32");
                          u += SIZE_OF_INT;
                          const i = new Array(r);
                          if (
                            ((u = unmarshalCaptures(this, e.tree, u, i)),
                            this.textPredicates[n].every((e) => e(i)))
                          ) {
                            c[l++] = {
                              pattern: n,
                              captures: i,
                            };
                            const e = this.setProperties[n];
                            e && (c[t].setProperties = e);
                            const r = this.assertedProperties[n];
                            r && (c[t].assertedProperties = r);
                            const o = this.refutedProperties[n];
                            o && (c[t].refutedProperties = o);
                          }
                        }
                        return (c.length = l), C._free(s), c;
                      }
                      captures(e, t, n, r) {
                        t || (t = ZERO_POINT),
                          n || (n = ZERO_POINT),
                          r || (r = {});
                        let i = r.matchLimit;
                        if (void 0 === i) i = 0;
                        else if ("number" != typeof i)
                          throw new Error("Arguments must be numbers");
                        marshalNode(e),
                          C._ts_query_captures_wasm(
                            this[0],
                            e.tree[0],
                            t.row,
                            t.column,
                            n.row,
                            n.column,
                            i
                          );
                        const o = getValue(TRANSFER_BUFFER, "i32"),
                          s = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"),
                          a = getValue(
                            TRANSFER_BUFFER + 2 * SIZE_OF_INT,
                            "i32"
                          ),
                          c = [];
                        this.exceededMatchLimit = !!a;
                        const l = [];
                        let u = s;
                        for (let t = 0; t < o; t++) {
                          const t = getValue(u, "i32");
                          u += SIZE_OF_INT;
                          const n = getValue(u, "i32");
                          u += SIZE_OF_INT;
                          const r = getValue(u, "i32");
                          if (
                            ((u += SIZE_OF_INT),
                            (l.length = n),
                            (u = unmarshalCaptures(this, e.tree, u, l)),
                            this.textPredicates[t].every((e) => e(l)))
                          ) {
                            const e = l[r],
                              n = this.setProperties[t];
                            n && (e.setProperties = n);
                            const i = this.assertedProperties[t];
                            i && (e.assertedProperties = i);
                            const o = this.refutedProperties[t];
                            o && (e.refutedProperties = o), c.push(e);
                          }
                        }
                        return C._free(s), c;
                      }
                      predicatesForPattern(e) {
                        return this.predicates[e];
                      }
                      didExceedMatchLimit() {
                        return this.exceededMatchLimit;
                      }
                    }
                    function getText(e, t, n) {
                      const r = n - t;
                      let i = e.textCallback(t, null, n);
                      for (t += i.length; t < n; ) {
                        const r = e.textCallback(t, null, n);
                        if (!(r && r.length > 0)) break;
                        (t += r.length), (i += r);
                      }
                      return t > n && (i = i.slice(0, r)), i;
                    }
                    function unmarshalCaptures(e, t, n, r) {
                      for (let i = 0, o = r.length; i < o; i++) {
                        const o = getValue(n, "i32"),
                          s = unmarshalNode(t, (n += SIZE_OF_INT));
                        (n += SIZE_OF_NODE),
                          (r[i] = {
                            name: e.captureNames[o],
                            node: s,
                          });
                      }
                      return n;
                    }
                    function assertInternal(e) {
                      if (e !== INTERNAL)
                        throw new Error("Illegal constructor");
                    }
                    function isPoint(e) {
                      return (
                        e &&
                        "number" == typeof e.row &&
                        "number" == typeof e.column
                      );
                    }
                    function marshalNode(e) {
                      let t = TRANSFER_BUFFER;
                      setValue(t, e.id, "i32"),
                        (t += SIZE_OF_INT),
                        setValue(t, e.startIndex, "i32"),
                        (t += SIZE_OF_INT),
                        setValue(t, e.startPosition.row, "i32"),
                        (t += SIZE_OF_INT),
                        setValue(t, e.startPosition.column, "i32"),
                        (t += SIZE_OF_INT),
                        setValue(t, e[0], "i32");
                    }
                    function unmarshalNode(e, t = TRANSFER_BUFFER) {
                      const n = getValue(t, "i32");
                      if (0 === n) return null;
                      const r = getValue((t += SIZE_OF_INT), "i32"),
                        i = getValue((t += SIZE_OF_INT), "i32"),
                        o = getValue((t += SIZE_OF_INT), "i32"),
                        s = getValue((t += SIZE_OF_INT), "i32"),
                        a = new Node(INTERNAL, e);
                      return (
                        (a.id = n),
                        (a.startIndex = r),
                        (a.startPosition = {
                          row: i,
                          column: o,
                        }),
                        (a[0] = s),
                        a
                      );
                    }
                    function marshalTreeCursor(e, t = TRANSFER_BUFFER) {
                      setValue(t + 0 * SIZE_OF_INT, e[0], "i32"),
                        setValue(t + 1 * SIZE_OF_INT, e[1], "i32"),
                        setValue(t + 2 * SIZE_OF_INT, e[2], "i32");
                    }
                    function unmarshalTreeCursor(e) {
                      (e[0] = getValue(
                        TRANSFER_BUFFER + 0 * SIZE_OF_INT,
                        "i32"
                      )),
                        (e[1] = getValue(
                          TRANSFER_BUFFER + 1 * SIZE_OF_INT,
                          "i32"
                        )),
                        (e[2] = getValue(
                          TRANSFER_BUFFER + 2 * SIZE_OF_INT,
                          "i32"
                        ));
                    }
                    function marshalPoint(e, t) {
                      setValue(e, t.row, "i32"),
                        setValue(e + SIZE_OF_INT, t.column, "i32");
                    }
                    function unmarshalPoint(e) {
                      return {
                        row: getValue(e, "i32"),
                        column: getValue(e + SIZE_OF_INT, "i32"),
                      };
                    }
                    function marshalRange(e, t) {
                      marshalPoint(e, t.startPosition),
                        marshalPoint((e += SIZE_OF_POINT), t.endPosition),
                        setValue((e += SIZE_OF_POINT), t.startIndex, "i32"),
                        setValue((e += SIZE_OF_INT), t.endIndex, "i32"),
                        (e += SIZE_OF_INT);
                    }
                    function unmarshalRange(e) {
                      const t = {};
                      return (
                        (t.startPosition = unmarshalPoint(e)),
                        (e += SIZE_OF_POINT),
                        (t.endPosition = unmarshalPoint(e)),
                        (e += SIZE_OF_POINT),
                        (t.startIndex = getValue(e, "i32")),
                        (e += SIZE_OF_INT),
                        (t.endIndex = getValue(e, "i32")),
                        t
                      );
                    }
                    function marshalEdit(e) {
                      let t = TRANSFER_BUFFER;
                      marshalPoint(t, e.startPosition),
                        (t += SIZE_OF_POINT),
                        marshalPoint(t, e.oldEndPosition),
                        (t += SIZE_OF_POINT),
                        marshalPoint(t, e.newEndPosition),
                        (t += SIZE_OF_POINT),
                        setValue(t, e.startIndex, "i32"),
                        (t += SIZE_OF_INT),
                        setValue(t, e.oldEndIndex, "i32"),
                        (t += SIZE_OF_INT),
                        setValue(t, e.newEndIndex, "i32"),
                        (t += SIZE_OF_INT);
                    }
                    for (const e of Object.getOwnPropertyNames(
                      ParserImpl.prototype
                    ))
                      Object.defineProperty(Parser.prototype, e, {
                        value: ParserImpl.prototype[e],
                        enumerable: !1,
                        writable: !1,
                      });
                    (Parser.Language = Language),
                      (Module.onRuntimeInitialized = () => {
                        ParserImpl.init(), resolveInitPromise();
                      });
                  })))
                );
              }
            }
            return Parser;
          })();
        module.exports = TreeSitter;
      },
      9491: (e) => {
        "use strict";

        e.exports = __webpack_require__(39491);
      },
      7147: (e) => {
        "use strict";

        e.exports = __webpack_require__(57147);
      },
      1017: (e) => {
        "use strict";

        e.exports = __webpack_require__(71017);
      },
      3837: (e) => {
        "use strict";

        e.exports = __webpack_require__(73837);
      },
      1267: (e) => {
        "use strict";

        e.exports = __webpack_require__(71267);
      },
    },
    __webpack_module_cache__ = {};
  function __nested_webpack_require_178258__(e) {
    var t = __webpack_module_cache__[e];
    if (void 0 !== t) return t.exports;
    var n = (__webpack_module_cache__[e] = {
      exports: {},
    });
    return (
      __webpack_modules__[e].call(
        n.exports,
        n,
        n.exports,
        __nested_webpack_require_178258__
      ),
      n.exports
    );
  }
  var __webpack_exports__ = __nested_webpack_require_178258__(5563);
  module.exports = __webpack_exports__;
})();
