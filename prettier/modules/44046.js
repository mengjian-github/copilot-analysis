const r = require(73837);
const i = require(39491);
const o = require(69867);
const s = require(73223);
const a = "cls@contexts";
const c = "error@context";
const l = [];
for (let e in s.providers) l[s.providers[e]] = e;
const u = process.env.DEBUG_CLS_HOOKED;
let p = -1;
function d(e) {
  this.name = e;
  this.active = null;
  this._set = [];
  this.id = null;
  this._contexts = new Map();
}
function h(e) {
  return process.namespaces[e];
}
function f(e) {
  let t = h(e);
  i.ok(t, "can't delete nonexistent namespace! \"" + e + '"');
  i.ok(t.id, "don't assign to process.namespaces directly! " + r.inspect(t));
  process.namespaces[e] = null;
}
function m(e) {
  if (process.env.DEBUG) {
    process._rawDebug(e);
  }
}
function g(e) {
  return e ? "function" == typeof e ? e.name ? e.name : (e.toString().trim().match(/^function\s*([^\s(]+)/) || [])[1] : e.constructor && e.constructor.name ? e.constructor.name : void 0 : e;
}
module.exports = {
  getNamespace: h,
  createNamespace: function (e) {
    i.ok(e, "namespace must be given a name.");
    if (u) {
      m("CREATING NAMESPACE " + e);
    }
    let t = new d(e);
    t.id = p;
    s.addHooks({
      init(n, i, o, s, a) {
        p = n;
        if (s) {
          t._contexts.set(n, t._contexts.get(s));
          if (u) {
            m("PARENTID: " + e + " uid:" + n + " parent:" + s + " provider:" + o);
          }
        } else {
          t._contexts.set(p, t.active);
        }
        if (u) {
          m("INIT " + e + " uid:" + n + " parent:" + s + " provider:" + l[o] + " active:" + r.inspect(t.active, !0));
        }
      },
      pre(n, i) {
        p = n;
        let o = t._contexts.get(n);
        if (o) {
          if (u) {
            m(" PRE " + e + " uid:" + n + " handle:" + g(i) + " context:" + r.inspect(o));
          }
          t.enter(o);
        } else {
          if (u) {
            m(" PRE MISSING CONTEXT " + e + " uid:" + n + " handle:" + g(i));
          }
        }
      },
      post(n, i) {
        p = n;
        let o = t._contexts.get(n);
        if (o) {
          if (u) {
            m(" POST " + e + " uid:" + n + " handle:" + g(i) + " context:" + r.inspect(o));
          }
          t.exit(o);
        } else {
          if (u) {
            m(" POST MISSING CONTEXT " + e + " uid:" + n + " handle:" + g(i));
          }
        }
      },
      destroy(n) {
        p = n;
        if (u) {
          m("DESTROY " + e + " uid:" + n + " context:" + r.inspect(t._contexts.get(p)) + " active:" + r.inspect(t.active, !0));
        }
        t._contexts.delete(n);
      }
    });
    process.namespaces[e] = t;
    return t;
  },
  destroyNamespace: f,
  reset: function () {
    if (process.namespaces) {
      Object.keys(process.namespaces).forEach(function (e) {
        f(e);
      });
    }
    process.namespaces = Object.create(null);
  },
  ERROR_SYMBOL: c
};
d.prototype.set = function (e, t) {
  if (!this.active) throw new Error("No context available. ns.run() or ns.bind() must be called first.");
  if (u) {
    m("    SETTING KEY:" + e + "=" + t + " in ns:" + this.name + " uid:" + p + " active:" + r.inspect(this.active, !0));
  }
  this.active[e] = t;
  return t;
};
d.prototype.get = function (e) {
  if (this.active) {
    if (u) {
      m("    GETTING KEY:" + e + "=" + this.active[e] + " " + this.name + " uid:" + p + " active:" + r.inspect(this.active, !0));
    }
    return this.active[e];
  }
  if (u) {
    m("    GETTING KEY:" + e + "=undefined " + this.name + " uid:" + p + " active:" + r.inspect(this.active, !0));
  }
};
d.prototype.createContext = function () {
  if (u) {
    m("   CREATING Context: " + this.name + " uid:" + p + " len:" + this._set.length + "  active:" + r.inspect(this.active, !0, 2, !0));
  }
  let e = Object.create(this.active ? this.active : Object.prototype);
  e._ns_name = this.name;
  e.id = p;
  if (u) {
    m("   CREATED Context: " + this.name + " uid:" + p + " len:" + this._set.length + "  context:" + r.inspect(e, !0, 2, !0));
  }
  return e;
};
d.prototype.run = function (e) {
  let t = this.createContext();
  this.enter(t);
  try {
    if (u) {
      m(" BEFORE RUN: " + this.name + " uid:" + p + " len:" + this._set.length + " " + r.inspect(t));
    }
    e(t);
    return t;
  } catch (e) {
    throw e && (e[c] = t), e;
  } finally {
    if (u) {
      m(" AFTER RUN: " + this.name + " uid:" + p + " len:" + this._set.length + " " + r.inspect(t));
    }
    this.exit(t);
  }
};
d.prototype.runAndReturn = function (e) {
  var t;
  this.run(function (n) {
    t = e(n);
  });
  return t;
};
d.prototype.runPromise = function (e) {
  let t = this.createContext();
  this.enter(t);
  let n = e(t);
  if (!n || !n.then || !n.catch) throw new Error("fn must return a promise.");
  if (u) {
    m(" BEFORE runPromise: " + this.name + " uid:" + p + " len:" + this._set.length + " " + r.inspect(t));
  }
  return n.then(e => (u && m(" AFTER runPromise: " + this.name + " uid:" + p + " len:" + this._set.length + " " + r.inspect(t)), this.exit(t), e)).catch(e => {
    throw e[c] = t, u && m(" AFTER runPromise: " + this.name + " uid:" + p + " len:" + this._set.length + " " + r.inspect(t)), this.exit(t), e;
  });
};
d.prototype.bind = function (e, t) {
  if (t) {
    t = this.active ? this.active : this.createContext();
  }
  let n = this;
  return function () {
    n.enter(t);
    try {
      return e.apply(this, arguments);
    } catch (e) {
      throw e && (e[c] = t), e;
    } finally {
      n.exit(t);
    }
  };
};
d.prototype.enter = function (e) {
  i.ok(e, "context must be provided for entering");
  if (u) {
    m("  ENTER " + this.name + " uid:" + p + " len:" + this._set.length + " context: " + r.inspect(e));
  }
  this._set.push(this.active);
  this.active = e;
};
d.prototype.exit = function (e) {
  i.ok(e, "context must be provided for exiting");
  if (u) {
    m("  EXIT " + this.name + " uid:" + p + " len:" + this._set.length + " context: " + r.inspect(e));
  }
  if (this.active === e) return i.ok(this._set.length, "can't remove top context"), void (this.active = this._set.pop());
  let t = this._set.lastIndexOf(e);
  if (t < 0) {
    if (u) {
      m("??ERROR?? context exiting but not entered - ignoring: " + r.inspect(e));
    }
    i.ok(t >= 0, "context not currently entered; can't exit. \n" + r.inspect(this) + "\n" + r.inspect(e));
  } else {
    i.ok(t, "can't remove top context");
    this._set.splice(t, 1);
  }
};
d.prototype.bindEmitter = function (e) {
  i.ok(e.on && e.addListener && e.emit, "can only bind real EEs");
  let t = this;
  let n = "context@" + this.name;
  o(e, function (e) {
    if (e) {
      if (e[a]) {
        e[a] = Object.create(null);
      }
      e[a][n] = {
        namespace: t,
        context: t.active
      };
    }
  }, function (e) {
    if (!e || !e[a]) return e;
    let t = e;
    let n = e[a];
    Object.keys(n).forEach(function (e) {
      let r = n[e];
      t = r.namespace.bind(t, r.context);
    });
    return t;
  });
};
d.prototype.fromException = function (e) {
  return e[c];
};
process.namespaces = {};
if (s._state && !s._state.enabled) {
  s.enable();
}
if (u) {
  var y = require(92512);
  for (var _ in y.filter._modifiers) y.filter.deattach(_);
}