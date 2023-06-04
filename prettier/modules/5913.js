function n() {}
function r(e, t, n, r, i) {
  for (o = 0, s = t.length, a = 0, c = 0, void 0; o < s; o++) {
    var o;
    var s;
    var a;
    var c;
    var l = t[o];
    if (l.removed) {
      l.value = e.join(r.slice(c, c + l.count));
      c += l.count;
      if (o && t[o - 1].added) {
        var u = t[o - 1];
        t[o - 1] = t[o], t[o] = u;
      }
    } else {
      if (!l.added && i) {
        var p = n.slice(a, a + l.count);
        p = p.map(function (e, t) {
          var n = r[c + t];
          return n.length > e.length ? n : e;
        });
        l.value = e.join(p);
      } else l.value = e.join(n.slice(a, a + l.count));
      a += l.count;
      if (l.added) {
        c += l.count;
      }
    }
  }
  var d = t[s - 1];
  if (s > 1 && "string" == typeof d.value && (d.added || d.removed) && e.equals("", d.value)) {
    t[s - 2].value += d.value;
    t.pop();
  }
  return t;
}
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = n;
n.prototype = {
  diff: function (e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    var i = n.callback;
    if ("function" == typeof n) {
      i = n;
      n = {};
    }
    this.options = n;
    var o = this;
    function s(e) {
      return i ? (setTimeout(function () {
        i(void 0, e);
      }, 0), !0) : e;
    }
    e = this.castInput(e);
    t = this.castInput(t);
    e = this.removeEmpty(this.tokenize(e));
    var a = (t = this.removeEmpty(this.tokenize(t))).length;
    var c = e.length;
    var l = 1;
    var u = a + c;
    if (n.maxEditLength) {
      u = Math.min(u, n.maxEditLength);
    }
    var p = [{
      newPos: -1,
      components: []
    }];
    var d = this.extractCommon(p[0], t, e, 0);
    if (p[0].newPos + 1 >= a && d + 1 >= c) return s([{
      value: this.join(t),
      count: t.length
    }]);
    function h() {
      for (var n = -1 * l; n <= l; n += 2) {
        var i = void 0;
        var u = p[n - 1];
        var d = p[n + 1];
        var h = (d ? d.newPos : 0) - n;
        if (u) {
          p[n - 1] = void 0;
        }
        var f = u && u.newPos + 1 < a;
        var m = d && 0 <= h && h < c;
        if (f || m) {
          if (!f || m && u.newPos < d.newPos) {
            i = {
              newPos: (g = d).newPos,
              components: g.components.slice(0)
            };
            o.pushComponent(i.components, void 0, !0);
          } else {
            (i = u).newPos++;
            o.pushComponent(i.components, !0, void 0);
          }
          h = o.extractCommon(i, t, e, n);
          if (i.newPos + 1 >= a && h + 1 >= c) return s(r(o, i.components, t, e, o.useLongestToken));
          p[n] = i;
        } else p[n] = void 0;
      }
      var g;
      l++;
    }
    if (i) !function e() {
      setTimeout(function () {
        if (l > u) return i();
        if (h()) {
          e();
        }
      }, 0);
    }();else for (; l <= u;) {
      var f = h();
      if (f) return f;
    }
  },
  pushComponent: function (e, t, n) {
    var r = e[e.length - 1];
    if (r && r.added === t && r.removed === n) {
      e[e.length - 1] = {
        count: r.count + 1,
        added: t,
        removed: n
      };
    } else {
      e.push({
        count: 1,
        added: t,
        removed: n
      });
    }
  },
  extractCommon: function (e, t, n, r) {
    for (i = t.length, o = n.length, s = e.newPos, a = s - r, c = 0, void 0; s + 1 < i && a + 1 < o && this.equals(t[s + 1], n[a + 1]);) {
      var i;
      var o;
      var s;
      var a;
      var c;
      s++;
      a++;
      c++;
    }
    if (c) {
      e.components.push({
        count: c
      });
    }
    e.newPos = s;
    return a;
  },
  equals: function (e, t) {
    return this.options.comparator ? this.options.comparator(e, t) : e === t || this.options.ignoreCase && e.toLowerCase() === t.toLowerCase();
  },
  removeEmpty: function (e) {
    for (t = [], n = 0, void 0; n < e.length; n++) {
      var t;
      var n;
      if (e[n]) {
        t.push(e[n]);
      }
    }
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
  }
};