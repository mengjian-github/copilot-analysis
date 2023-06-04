Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
const r = require(57023);
const i = require(98490);
var o = require(57023);
Object.defineProperty(exports, "_", {
  enumerable: !0,
  get: function () {
    return o._;
  }
});
Object.defineProperty(exports, "str", {
  enumerable: !0,
  get: function () {
    return o.str;
  }
});
Object.defineProperty(exports, "strConcat", {
  enumerable: !0,
  get: function () {
    return o.strConcat;
  }
});
Object.defineProperty(exports, "nil", {
  enumerable: !0,
  get: function () {
    return o.nil;
  }
});
Object.defineProperty(exports, "getProperty", {
  enumerable: !0,
  get: function () {
    return o.getProperty;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: !0,
  get: function () {
    return o.stringify;
  }
});
Object.defineProperty(exports, "regexpCode", {
  enumerable: !0,
  get: function () {
    return o.regexpCode;
  }
});
Object.defineProperty(exports, "Name", {
  enumerable: !0,
  get: function () {
    return o.Name;
  }
});
var s = require(98490);
Object.defineProperty(exports, "Scope", {
  enumerable: !0,
  get: function () {
    return s.Scope;
  }
});
Object.defineProperty(exports, "ValueScope", {
  enumerable: !0,
  get: function () {
    return s.ValueScope;
  }
});
Object.defineProperty(exports, "ValueScopeName", {
  enumerable: !0,
  get: function () {
    return s.ValueScopeName;
  }
});
Object.defineProperty(exports, "varKinds", {
  enumerable: !0,
  get: function () {
    return s.varKinds;
  }
});
exports.operators = {
  GT: new r._Code(">"),
  GTE: new r._Code(">="),
  LT: new r._Code("<"),
  LTE: new r._Code("<="),
  EQ: new r._Code("==="),
  NEQ: new r._Code("!=="),
  NOT: new r._Code("!"),
  OR: new r._Code("||"),
  AND: new r._Code("&&"),
  ADD: new r._Code("+")
};
class a {
  optimizeNodes() {
    return this;
  }
  optimizeNames(e, t) {
    return this;
  }
}
class c extends a {
  constructor(e, t, n) {
    super();
    this.varKind = e;
    this.name = t;
    this.rhs = n;
  }
  render({
    es5: e,
    _n: t
  }) {
    const n = e ? i.varKinds.var : this.varKind;
    const r = void 0 === this.rhs ? "" : ` = ${this.rhs}`;
    return `${n} ${this.name}${r};` + t;
  }
  optimizeNames(e, t) {
    if (e[this.name.str]) {
      if (this.rhs) {
        this.rhs = N(this.rhs, e, t);
      }
      return this;
    }
  }
  get names() {
    return this.rhs instanceof r._CodeOrName ? this.rhs.names : {};
  }
}
class l extends a {
  constructor(e, t, n) {
    super();
    this.lhs = e;
    this.rhs = t;
    this.sideEffects = n;
  }
  render({
    _n: e
  }) {
    return `${this.lhs} = ${this.rhs};` + e;
  }
  optimizeNames(e, t) {
    if (!(this.lhs instanceof r.Name) || e[this.lhs.str] || this.sideEffects) {
      this.rhs = N(this.rhs, e, t);
      return this;
    }
  }
  get names() {
    return P(this.lhs instanceof r.Name ? {} : {
      ...this.lhs.names
    }, this.rhs);
  }
}
class u extends l {
  constructor(e, t, n, r) {
    super(e, n, r);
    this.op = t;
  }
  render({
    _n: e
  }) {
    return `${this.lhs} ${this.op}= ${this.rhs};` + e;
  }
}
class p extends a {
  constructor(e) {
    super();
    this.label = e;
    this.names = {};
  }
  render({
    _n: e
  }) {
    return `${this.label}:` + e;
  }
}
class d extends a {
  constructor(e) {
    super();
    this.label = e;
    this.names = {};
  }
  render({
    _n: e
  }) {
    return `break${this.label ? ` ${this.label}` : ""};` + e;
  }
}
class h extends a {
  constructor(e) {
    super();
    this.error = e;
  }
  render({
    _n: e
  }) {
    return `throw ${this.error};` + e;
  }
  get names() {
    return this.error.names;
  }
}
class f extends a {
  constructor(e) {
    super();
    this.code = e;
  }
  render({
    _n: e
  }) {
    return `${this.code};` + e;
  }
  optimizeNodes() {
    return `${this.code}` ? this : void 0;
  }
  optimizeNames(e, t) {
    this.code = N(this.code, e, t);
    return this;
  }
  get names() {
    return this.code instanceof r._CodeOrName ? this.code.names : {};
  }
}
class m extends a {
  constructor(e = []) {
    super();
    this.nodes = e;
  }
  render(e) {
    return this.nodes.reduce((t, n) => t + n.render(e), "");
  }
  optimizeNodes() {
    const {
      nodes: e
    } = this;
    let t = e.length;
    for (; t--;) {
      const n = e[t].optimizeNodes();
      if (Array.isArray(n)) {
        e.splice(t, 1, ...n);
      } else {
        if (n) {
          e[t] = n;
        } else {
          e.splice(t, 1);
        }
      }
    }
    return e.length > 0 ? this : void 0;
  }
  optimizeNames(e, t) {
    const {
      nodes: n
    } = this;
    let r = n.length;
    for (; r--;) {
      const i = n[r];
      if (i.optimizeNames(e, t)) {
        O(e, i.names);
        n.splice(r, 1);
      }
    }
    return n.length > 0 ? this : void 0;
  }
  get names() {
    return this.nodes.reduce((e, t) => k(e, t.names), {});
  }
}
class g extends m {
  render(e) {
    return "{" + e._n + super.render(e) + "}" + e._n;
  }
}
class y extends m {}
class _ extends g {}
_.kind = "else";
class v extends g {
  constructor(e, t) {
    super(t);
    this.condition = e;
  }
  render(e) {
    let t = `if(${this.condition})` + super.render(e);
    if (this.else) {
      t += "else " + this.else.render(e);
    }
    return t;
  }
  optimizeNodes() {
    super.optimizeNodes();
    const e = this.condition;
    if (!0 === e) return this.nodes;
    let t = this.else;
    if (t) {
      const e = t.optimizeNodes();
      t = this.else = Array.isArray(e) ? new _(e) : e;
    }
    return t ? !1 === e ? t instanceof v ? t : t.nodes : this.nodes.length ? this : new v(not(e), t instanceof v ? [t] : t.nodes) : !1 !== e && this.nodes.length ? this : void 0;
  }
  optimizeNames(e, t) {
    var n;
    this.else = null === (n = this.else) || void 0 === n ? void 0 : n.optimizeNames(e, t);
    if (super.optimizeNames(e, t) || this.else) return this.condition = N(this.condition, e, t), this;
  }
  get names() {
    const e = super.names;
    P(e, this.condition);
    if (this.else) {
      k(e, this.else.names);
    }
    return e;
  }
}
v.kind = "if";
class b extends g {}
b.kind = "for";
class E extends b {
  constructor(e) {
    super();
    this.iteration = e;
  }
  render(e) {
    return `for(${this.iteration})` + super.render(e);
  }
  optimizeNames(e, t) {
    if (super.optimizeNames(e, t)) {
      this.iteration = N(this.iteration, e, t);
      return this;
    }
  }
  get names() {
    return k(super.names, this.iteration.names);
  }
}
class w extends b {
  constructor(e, t, n, r) {
    super();
    this.varKind = e;
    this.name = t;
    this.from = n;
    this.to = r;
  }
  render(e) {
    const t = e.es5 ? i.varKinds.var : this.varKind;
    const {
      name: n,
      from: r,
      to: o
    } = this;
    return `for(${t} ${n}=${r}; ${n}<${o}; ${n}++)` + super.render(e);
  }
  get names() {
    const e = P(super.names, this.from);
    return P(e, this.to);
  }
}
class T extends b {
  constructor(e, t, n, r) {
    super();
    this.loop = e;
    this.varKind = t;
    this.name = n;
    this.iterable = r;
  }
  render(e) {
    return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(e);
  }
  optimizeNames(e, t) {
    if (super.optimizeNames(e, t)) {
      this.iterable = N(this.iterable, e, t);
      return this;
    }
  }
  get names() {
    return k(super.names, this.iterable.names);
  }
}
class S extends g {
  constructor(e, t, n) {
    super();
    this.name = e;
    this.args = t;
    this.async = n;
  }
  render(e) {
    return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(e);
  }
}
S.kind = "func";
class x extends m {
  render(e) {
    return "return " + super.render(e);
  }
}
x.kind = "return";
class C extends g {
  render(e) {
    let t = "try" + super.render(e);
    if (this.catch) {
      t += this.catch.render(e);
    }
    if (this.finally) {
      t += this.finally.render(e);
    }
    return t;
  }
  optimizeNodes() {
    var e;
    var t;
    super.optimizeNodes();
    if (null === (e = this.catch) || void 0 === e) {
      e.optimizeNodes();
    }
    if (null === (t = this.finally) || void 0 === t) {
      t.optimizeNodes();
    }
    return this;
  }
  optimizeNames(e, t) {
    var n;
    var r;
    super.optimizeNames(e, t);
    if (null === (n = this.catch) || void 0 === n) {
      n.optimizeNames(e, t);
    }
    if (null === (r = this.finally) || void 0 === r) {
      r.optimizeNames(e, t);
    }
    return this;
  }
  get names() {
    const e = super.names;
    if (this.catch) {
      k(e, this.catch.names);
    }
    if (this.finally) {
      k(e, this.finally.names);
    }
    return e;
  }
}
class I extends g {
  constructor(e) {
    super();
    this.error = e;
  }
  render(e) {
    return `catch(${this.error})` + super.render(e);
  }
}
I.kind = "catch";
class A extends g {
  render(e) {
    return "finally" + super.render(e);
  }
}
function k(e, t) {
  for (const n in t) e[n] = (e[n] || 0) + (t[n] || 0);
  return e;
}
function P(e, t) {
  return t instanceof r._CodeOrName ? k(e, t.names) : e;
}
function N(e, t, n) {
  return e instanceof r.Name ? o(e) : (i = e) instanceof r._Code && i._items.some(e => e instanceof r.Name && 1 === t[e.str] && void 0 !== n[e.str]) ? new r._Code(e._items.reduce((e, t) => (t instanceof r.Name && (t = o(t)), t instanceof r._Code ? e.push(...t._items) : e.push(t), e), [])) : e;
  var i;
  function o(e) {
    const r = n[e.str];
    return void 0 === r || 1 !== t[e.str] ? e : (delete t[e.str], r);
  }
}
function O(e, t) {
  for (const n in t) e[n] = (e[n] || 0) - (t[n] || 0);
}
function not(e) {
  return "boolean" == typeof e || "number" == typeof e || null === e ? !e : r._`!${B(e)}`;
}
A.kind = "finally";
exports.CodeGen = class {
  constructor(e, t = {}) {
    this._values = {};
    this._blockStarts = [];
    this._constants = {};
    this.opts = {
      ...t,
      _n: t.lines ? "\n" : ""
    };
    this._extScope = e;
    this._scope = new i.Scope({
      parent: e
    });
    this._nodes = [new y()];
  }
  toString() {
    return this._root.render(this.opts);
  }
  name(e) {
    return this._scope.name(e);
  }
  scopeName(e) {
    return this._extScope.name(e);
  }
  scopeValue(e, t) {
    const n = this._extScope.value(e, t);
    (this._values[n.prefix] || (this._values[n.prefix] = new Set())).add(n);
    return n;
  }
  getScopeValue(e, t) {
    return this._extScope.getValue(e, t);
  }
  scopeRefs(e) {
    return this._extScope.scopeRefs(e, this._values);
  }
  scopeCode() {
    return this._extScope.scopeCode(this._values);
  }
  _def(e, t, n, r) {
    const i = this._scope.toName(t);
    if (void 0 !== n && r) {
      this._constants[i.str] = n;
    }
    this._leafNode(new c(e, i, n));
    return i;
  }
  const(e, t, n) {
    return this._def(i.varKinds.const, e, t, n);
  }
  let(e, t, n) {
    return this._def(i.varKinds.let, e, t, n);
  }
  var(e, t, n) {
    return this._def(i.varKinds.var, e, t, n);
  }
  assign(e, t, n) {
    return this._leafNode(new l(e, t, n));
  }
  add(e, n) {
    return this._leafNode(new u(e, exports.operators.ADD, n));
  }
  code(e) {
    if ("function" == typeof e) {
      e();
    } else {
      if (e !== r.nil) {
        this._leafNode(new f(e));
      }
    }
    return this;
  }
  object(...e) {
    const t = ["{"];
    for (const [n, i] of e) {
      if (t.length > 1) {
        t.push(",");
      }
      t.push(n);
      if (n !== i || this.opts.es5) {
        t.push(":");
        r.addCodeArg(t, i);
      }
    }
    t.push("}");
    return new r._Code(t);
  }
  if(e, t, n) {
    this._blockNode(new v(e));
    if (t && n) this.code(t).else().code(n).endIf();else if (t) this.code(t).endIf();else if (n) throw new Error('CodeGen: "else" body without "then" body');
    return this;
  }
  elseIf(e) {
    return this._elseNode(new v(e));
  }
  else() {
    return this._elseNode(new _());
  }
  endIf() {
    return this._endBlockNode(v, _);
  }
  _for(e, t) {
    this._blockNode(e);
    if (t) {
      this.code(t).endFor();
    }
    return this;
  }
  for(e, t) {
    return this._for(new E(e), t);
  }
  forRange(e, t, n, r, o = this.opts.es5 ? i.varKinds.var : i.varKinds.let) {
    const s = this._scope.toName(e);
    return this._for(new w(o, s, t, n), () => r(s));
  }
  forOf(e, t, n, o = i.varKinds.const) {
    const s = this._scope.toName(e);
    if (this.opts.es5) {
      const e = t instanceof r.Name ? t : this.var("_arr", t);
      return this.forRange("_i", 0, r._`${e}.length`, t => {
        this.var(s, r._`${e}[${t}]`);
        n(s);
      });
    }
    return this._for(new T("of", o, s, t), () => n(s));
  }
  forIn(e, t, n, o = this.opts.es5 ? i.varKinds.var : i.varKinds.const) {
    if (this.opts.ownProperties) return this.forOf(e, r._`Object.keys(${t})`, n);
    const s = this._scope.toName(e);
    return this._for(new T("in", o, s, t), () => n(s));
  }
  endFor() {
    return this._endBlockNode(b);
  }
  label(e) {
    return this._leafNode(new p(e));
  }
  break(e) {
    return this._leafNode(new d(e));
  }
  return(e) {
    const t = new x();
    this._blockNode(t);
    this.code(e);
    if (1 !== t.nodes.length) throw new Error('CodeGen: "return" should have one node');
    return this._endBlockNode(x);
  }
  try(e, t, n) {
    if (!t && !n) throw new Error('CodeGen: "try" without "catch" and "finally"');
    const r = new C();
    this._blockNode(r);
    this.code(e);
    if (t) {
      const e = this.name("e");
      this._currNode = r.catch = new I(e), t(e);
    }
    if (n) {
      this._currNode = r.finally = new A();
      this.code(n);
    }
    return this._endBlockNode(I, A);
  }
  throw(e) {
    return this._leafNode(new h(e));
  }
  block(e, t) {
    this._blockStarts.push(this._nodes.length);
    if (e) {
      this.code(e).endBlock(t);
    }
    return this;
  }
  endBlock(e) {
    const t = this._blockStarts.pop();
    if (void 0 === t) throw new Error("CodeGen: not in self-balancing block");
    const n = this._nodes.length - t;
    if (n < 0 || void 0 !== e && n !== e) throw new Error(`CodeGen: wrong number of nodes: ${n} vs ${e} expected`);
    this._nodes.length = t;
    return this;
  }
  func(e, t = r.nil, n, i) {
    this._blockNode(new S(e, t, n));
    if (i) {
      this.code(i).endFunc();
    }
    return this;
  }
  endFunc() {
    return this._endBlockNode(S);
  }
  optimize(e = 1) {
    for (; e-- > 0;) {
      this._root.optimizeNodes();
      this._root.optimizeNames(this._root.names, this._constants);
    }
  }
  _leafNode(e) {
    this._currNode.nodes.push(e);
    return this;
  }
  _blockNode(e) {
    this._currNode.nodes.push(e);
    this._nodes.push(e);
  }
  _endBlockNode(e, t) {
    const n = this._currNode;
    if (n instanceof e || t && n instanceof t) {
      this._nodes.pop();
      return this;
    }
    throw new Error(`CodeGen: not in block "${t ? `${e.kind}/${t.kind}` : e.kind}"`);
  }
  _elseNode(e) {
    const t = this._currNode;
    if (!(t instanceof v)) throw new Error('CodeGen: "else" without "if"');
    this._currNode = t.else = e;
    return this;
  }
  get _root() {
    return this._nodes[0];
  }
  get _currNode() {
    const e = this._nodes;
    return e[e.length - 1];
  }
  set _currNode(e) {
    const t = this._nodes;
    t[t.length - 1] = e;
  }
};
exports.not = not;
const M = D(exports.operators.AND);
exports.and = function (...e) {
  return e.reduce(M);
};
const L = D(exports.operators.OR);
function D(e) {
  return (t, n) => t === r.nil ? n : n === r.nil ? t : r._`${B(t)} ${e} ${B(n)}`;
}
function B(e) {
  return e instanceof r.Name ? e : r._`(${e})`;
}
exports.or = function (...e) {
  return e.reduce(L);
};