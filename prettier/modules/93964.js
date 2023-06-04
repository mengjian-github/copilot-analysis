const r = require(73837);
const i = require(39491);
const o = require(69867);
const s = require(50852);
const a = "cls@contexts";
const c = "error@context";
const l = process.env.DEBUG_CLS_HOOKED;
let u = -1;
function p(e) {
  this.name = e;
  this.active = null;
  this._set = [];
  this.id = null;
  this._contexts = new Map();
  this._indent = 0;
}
function d(e) {
  return process.namespaces[e];
}
function h(e) {
  let t = d(e);
  i.ok(t, "can't delete nonexistent namespace! \"" + e + '"');
  i.ok(t.id, "don't assign to process.namespaces directly! " + r.inspect(t));
  process.namespaces[e] = null;
}
function f(...e) {
  if (l) {
    process._rawDebug(`${r.format(...e)}`);
  }
}
module.exports = {
  getNamespace: d,
  createNamespace: function (e) {
    i.ok(e, "namespace must be given a name.");
    if (l) {
      f(`NS-CREATING NAMESPACE (${e})`);
    }
    let t = new p(e);
    t.id = u;
    s.createHook({
      init(n, i, o, a) {
        u = s.executionAsyncId();
        if (t.active) {
          if (t._contexts.set(n, t.active), l) {
            f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT [${i}] (${e}) asyncId:${n} currentUid:${u} triggerId:${o} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} resource:${a}`);
          }
        } else if (0 === u) {
          const o = s.triggerAsyncId(),
            c = t._contexts.get(o);
          if (c) {
            if (t._contexts.set(n, c), l) {
              f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT USING CONTEXT FROM TRIGGERID [${i}] (${e}) asyncId:${n} currentUid:${u} triggerId:${o} active:${r.inspect(t.active, {
                showHidden: !0,
                depth: 2,
                colors: !0
              })} resource:${a}`);
            }
          } else if (l) {
            f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT MISSING CONTEXT [${i}] (${e}) asyncId:${n} currentUid:${u} triggerId:${o} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} resource:${a}`);
          }
        }
        if (l && "PROMISE" === i) {
          f(r.inspect(a, {
            showHidden: !0
          }));
          const s = a.parentId;
          f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT RESOURCE-PROMISE [${i}] (${e}) parentId:${s} asyncId:${n} currentUid:${u} triggerId:${o} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} resource:${a}`);
        }
      },
      before(n) {
        let i;
        u = s.executionAsyncId();
        i = t._contexts.get(n) || t._contexts.get(u);
        if (i) {
          if (l) {
            const o = s.triggerAsyncId();
            f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}BEFORE (${e}) asyncId:${n} currentUid:${u} triggerId:${o} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} context:${r.inspect(i)}`), t._indent += 2;
          }
          t.enter(i);
        } else if (l) {
          const i = s.triggerAsyncId();
          f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}BEFORE MISSING CONTEXT (${e}) asyncId:${n} currentUid:${u} triggerId:${i} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} namespace._contexts:${r.inspect(t._contexts, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })}`), t._indent += 2;
        }
      },
      after(n) {
        let i;
        u = s.executionAsyncId();
        i = t._contexts.get(n) || t._contexts.get(u);
        if (i) {
          if (l) {
            const o = s.triggerAsyncId();
            t._indent -= 2;
            f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}AFTER (${e}) asyncId:${n} currentUid:${u} triggerId:${o} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} context:${r.inspect(i)}`);
          }
          t.exit(i);
        } else if (l) {
          const o = s.triggerAsyncId();
          t._indent -= 2;
          f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}AFTER MISSING CONTEXT (${e}) asyncId:${n} currentUid:${u} triggerId:${o} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} context:${r.inspect(i)}`);
        }
      },
      destroy(n) {
        u = s.executionAsyncId();
        if (l) {
          const i = s.triggerAsyncId();
          f(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}DESTROY (${e}) currentUid:${u} asyncId:${n} triggerId:${i} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} context:${r.inspect(t._contexts.get(u))}`);
        }
        t._contexts.delete(n);
      }
    }).enable();
    process.namespaces[e] = t;
    return t;
  },
  destroyNamespace: h,
  reset: function () {
    if (process.namespaces) {
      Object.keys(process.namespaces).forEach(function (e) {
        h(e);
      });
    }
    process.namespaces = Object.create(null);
  },
  ERROR_SYMBOL: c
};
p.prototype.set = function (e, t) {
  if (!this.active) throw new Error("No context available. ns.run() or ns.bind() must be called first.");
  this.active[e] = t;
  if (l) {
    f(" ".repeat(this._indent < 0 ? 0 : this._indent) + "CONTEXT-SET KEY:" + e + "=" + t + " in ns:" + this.name + " currentUid:" + u + " active:" + r.inspect(this.active, {
      showHidden: !0,
      depth: 2,
      colors: !0
    }));
  }
  return t;
};
p.prototype.get = function (e) {
  if (this.active) {
    if (l) {
      const t = s.executionAsyncId();
      const n = s.triggerAsyncId();
      const i = " ".repeat(this._indent < 0 ? 0 : this._indent);
      f(i + "CONTEXT-GETTING KEY:" + e + "=" + this.active[e] + " (" + this.name + ") currentUid:" + u + " active:" + r.inspect(this.active, {
        showHidden: !0,
        depth: 2,
        colors: !0
      }));
      f(`${i}CONTEXT-GETTING KEY: (${this.name}) ${e}=${this.active[e]} currentUid:${u} asyncHooksCurrentId:${t} triggerId:${n} len:${this._set.length} active:${r.inspect(this.active)}`);
    }
    return this.active[e];
  }
  if (l) {
    const t = s.currentId();
    const n = s.triggerAsyncId();
    f(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-GETTING KEY NO ACTIVE NS: (${this.name}) ${e}=undefined currentUid:${u} asyncHooksCurrentId:${t} triggerId:${n} len:${this._set.length}`);
  }
};
p.prototype.createContext = function () {
  let e = Object.create(this.active ? this.active : Object.prototype);
  e._ns_name = this.name;
  e.id = u;
  if (l) {
    const t = s.executionAsyncId(),
      n = s.triggerAsyncId();
    f(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-CREATED Context: (${this.name}) currentUid:${u} asyncHooksCurrentId:${t} triggerId:${n} len:${this._set.length} context:${r.inspect(e, {
      showHidden: !0,
      depth: 2,
      colors: !0
    })}`);
  }
  return e;
};
p.prototype.run = function (e) {
  let t = this.createContext();
  this.enter(t);
  try {
    if (l) {
      const e = s.triggerAsyncId();
      const n = s.executionAsyncId();
      f(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-RUN BEGIN: (${this.name}) currentUid:${u} triggerId:${e} asyncHooksCurrentId:${n} len:${this._set.length} context:${r.inspect(t)}`);
    }
    e(t);
    return t;
  } catch (e) {
    throw e && (e[c] = t), e;
  } finally {
    if (l) {
      const e = s.triggerAsyncId();
      const n = s.executionAsyncId();
      f(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-RUN END: (${this.name}) currentUid:${u} triggerId:${e} asyncHooksCurrentId:${n} len:${this._set.length} ${r.inspect(t)}`);
    }
    this.exit(t);
  }
};
p.prototype.runAndReturn = function (e) {
  let t;
  this.run(function (n) {
    t = e(n);
  });
  return t;
};
p.prototype.runPromise = function (e) {
  let t = this.createContext();
  this.enter(t);
  let n = e(t);
  if (!n || !n.then || !n.catch) throw new Error("fn must return a promise.");
  if (l) {
    f("CONTEXT-runPromise BEFORE: (" + this.name + ") currentUid:" + u + " len:" + this._set.length + " " + r.inspect(t));
  }
  return n.then(e => (l && f("CONTEXT-runPromise AFTER then: (" + this.name + ") currentUid:" + u + " len:" + this._set.length + " " + r.inspect(t)), this.exit(t), e)).catch(e => {
    throw e[c] = t, l && f("CONTEXT-runPromise AFTER catch: (" + this.name + ") currentUid:" + u + " len:" + this._set.length + " " + r.inspect(t)), this.exit(t), e;
  });
};
p.prototype.bind = function (e, t) {
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
p.prototype.enter = function (e) {
  i.ok(e, "context must be provided for entering");
  if (l) {
    const t = s.executionAsyncId(),
      n = s.triggerAsyncId();
    f(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-ENTER: (${this.name}) currentUid:${u} triggerId:${n} asyncHooksCurrentId:${t} len:${this._set.length} ${r.inspect(e)}`);
  }
  this._set.push(this.active);
  this.active = e;
};
p.prototype.exit = function (e) {
  i.ok(e, "context must be provided for exiting");
  if (l) {
    const t = s.executionAsyncId(),
      n = s.triggerAsyncId();
    f(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-EXIT: (${this.name}) currentUid:${u} triggerId:${n} asyncHooksCurrentId:${t} len:${this._set.length} ${r.inspect(e)}`);
  }
  if (this.active === e) {
    i.ok(this._set.length, "can't remove top context");
    return void (this.active = this._set.pop());
  }
  let t = this._set.lastIndexOf(e);
  if (t < 0) {
    if (l) {
      f("??ERROR?? context exiting but not entered - ignoring: " + r.inspect(e));
    }
    i.ok(t >= 0, "context not currently entered; can't exit. \n" + r.inspect(this) + "\n" + r.inspect(e));
  } else {
    i.ok(t, "can't remove top context");
    this._set.splice(t, 1);
  }
};
p.prototype.bindEmitter = function (e) {
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
p.prototype.fromException = function (e) {
  return e[c];
};
process.namespaces = {};