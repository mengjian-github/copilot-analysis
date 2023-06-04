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
function i(e) {
  return {
    newPos: e.newPos,
    components: e.components.slice(0)
  };
}
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = n;
n.prototype = {
  diff: function (e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    var o = n.callback;
    if ("function" == typeof n) {
      o = n;
      n = {};
    }
    this.options = n;
    var s = this;
    function a(e) {
      return o ? (setTimeout(function () {
        o(void 0, e);
      }, 0), !0) : e;
    }
    e = this.castInput(e);
    t = this.castInput(t);
    e = this.removeEmpty(this.tokenize(e));
    var c = (t = this.removeEmpty(this.tokenize(t))).length;
    var l = e.length;
    var u = 1;
    var p = c + l;
    if (n.maxEditLength) {
      p = Math.min(p, n.maxEditLength);
    }
    var d = [{
      newPos: -1,
      components: []
    }];
    var h = this.extractCommon(d[0], t, e, 0);
    if (d[0].newPos + 1 >= c && h + 1 >= l) return a([{
      value: this.join(t),
      count: t.length
    }]);
    function f() {
      for (var n = -1 * u; n <= u; n += 2) {
        var o = void 0;
        var p = d[n - 1];
        var h = d[n + 1];
        var f = (h ? h.newPos : 0) - n;
        if (p) {
          d[n - 1] = void 0;
        }
        var m = p && p.newPos + 1 < c;
        var g = h && 0 <= f && f < l;
        if (m || g) {
          if (!m || g && p.newPos < h.newPos) {
            o = i(h);
            s.pushComponent(o.components, void 0, !0);
          } else {
            (o = p).newPos++;
            s.pushComponent(o.components, !0, void 0);
          }
          f = s.extractCommon(o, t, e, n);
          if (o.newPos + 1 >= c && f + 1 >= l) return a(r(s, o.components, t, e, s.useLongestToken));
          d[n] = o;
        } else d[n] = void 0;
      }
      u++;
    }
    if (o) !function e() {
      setTimeout(function () {
        if (u > p) return o();
        if (f()) {
          e();
        }
      }, 0);
    }();else for (; u <= p;) {
      var m = f();
      if (m) return m;
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