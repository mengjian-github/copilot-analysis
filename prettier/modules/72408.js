var n = Symbol.for("react.element");
var r = Symbol.for("react.portal");
var Fragment = Symbol.for("react.fragment");
var StrictMode = Symbol.for("react.strict_mode");
var Profiler = Symbol.for("react.profiler");
var a = Symbol.for("react.provider");
var c = Symbol.for("react.context");
var l = Symbol.for("react.forward_ref");
var Suspense = Symbol.for("react.suspense");
var p = Symbol.for("react.memo");
var d = Symbol.for("react.lazy");
var h = Symbol.iterator;
var f = {
  isMounted: function () {
    return !1;
  },
  enqueueForceUpdate: function () {},
  enqueueReplaceState: function () {},
  enqueueSetState: function () {}
};
var m = Object.assign;
var g = {};
function Component(e, t, n) {
  this.props = e;
  this.context = t;
  this.refs = g;
  this.updater = n || f;
}
function _() {}
function PureComponent(e, t, n) {
  this.props = e;
  this.context = t;
  this.refs = g;
  this.updater = n || f;
}
Component.prototype.isReactComponent = {};
Component.prototype.setState = function (e, t) {
  if ("object" != typeof e && "function" != typeof e && null != e) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
Component.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
_.prototype = Component.prototype;
var b = PureComponent.prototype = new _();
b.constructor = PureComponent;
m(b, Component.prototype);
b.isPureReactComponent = !0;
var E = Array.isArray;
var w = Object.prototype.hasOwnProperty;
var T = {
  current: null
};
var S = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
};
function createElement(e, t, r) {
  var i;
  var o = {};
  var s = null;
  var a = null;
  if (null != t) for (i in void 0 !== t.ref && (a = t.ref), void 0 !== t.key && (s = "" + t.key), t) if (w.call(t, i) && !S.hasOwnProperty(i)) {
    o[i] = t[i];
  }
  var c = arguments.length - 2;
  if (1 === c) o.children = r;else if (1 < c) {
    for (l = Array(c), u = 0, void 0; u < c; u++) {
      var l;
      var u;
      l[u] = arguments[u + 2];
    }
    o.children = l;
  }
  if (e && e.defaultProps) for (i in c = e.defaultProps) if (void 0 === o[i]) {
    o[i] = c[i];
  }
  return {
    $$typeof: n,
    type: e,
    key: s,
    ref: a,
    props: o,
    _owner: T.current
  };
}
function isValidElement(e) {
  return "object" == typeof e && null !== e && e.$$typeof === n;
}
var I = /\/+/g;
function A(e, t) {
  return "object" == typeof e && null !== e && null != e.key ? function (e) {
    var t = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + e.replace(/[=:]/g, function (e) {
      return t[e];
    });
  }("" + e.key) : t.toString(36);
}
function k(e, t, i, o, s) {
  var a = typeof e;
  if ("undefined" !== a && "boolean" !== a) {
    e = null;
  }
  var c = !1;
  if (null === e) c = !0;else switch (a) {
    case "string":
    case "number":
      c = !0;
      break;
    case "object":
      switch (e.$$typeof) {
        case n:
        case r:
          c = !0;
      }
  }
  if (c) {
    s = s(c = e);
    e = "" === o ? "." + A(c, 0) : o;
    if (E(s)) {
      i = "";
      if (null != e) {
        i = e.replace(I, "$&/") + "/";
      }
      k(s, t, i, "", function (e) {
        return e;
      });
    } else {
      if (null != s) {
        if (isValidElement(s)) {
          s = function (e, t) {
            return {
              $$typeof: n,
              type: e.type,
              key: t,
              ref: e.ref,
              props: e.props,
              _owner: e._owner
            };
          }(s, i + (!s.key || c && c.key === s.key ? "" : ("" + s.key).replace(I, "$&/") + "/") + e);
        }
        t.push(s);
      }
    }
    return 1;
  }
  c = 0;
  o = "" === o ? "." : o + ":";
  if (E(e)) for (var l = 0; l < e.length; l++) {
    var u = o + A(a = e[l], l);
    c += k(a, t, i, u, s);
  } else if (u = function (e) {
    return null === e || "object" != typeof e ? null : "function" == typeof (e = h && e[h] || e["@@iterator"]) ? e : null;
  }(e), "function" == typeof u) for (e = u.call(e), l = 0; !(a = e.next()).done;) c += k(a = a.value, t, i, u = o + A(a, l++), s);else if ("object" === a) throw t = String(e), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return c;
}
function P(e, t, n) {
  if (null == e) return e;
  var r = [];
  var i = 0;
  k(e, r, "", "", function (e) {
    return t.call(n, e, i++);
  });
  return r;
}
function N(e) {
  if (-1 === e._status) {
    var t = e._result;
    (t = t()).then(function (t) {
      if (0 !== e._status && -1 !== e._status) {
        e._status = 1;
        e._result = t;
      }
    }, function (t) {
      if (0 !== e._status && -1 !== e._status) {
        e._status = 2;
        e._result = t;
      }
    });
    if (-1 === e._status) {
      e._status = 0;
      e._result = t;
    }
  }
  if (1 === e._status) return e._result.default;
  throw e._result;
}
var O = {
  current: null
};
var R = {
  transition: null
};
var __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  ReactCurrentDispatcher: O,
  ReactCurrentBatchConfig: R,
  ReactCurrentOwner: T
};
exports.Children = {
  map: P,
  forEach: function (e, t, n) {
    P(e, function () {
      t.apply(this, arguments);
    }, n);
  },
  count: function (e) {
    var t = 0;
    P(e, function () {
      t++;
    });
    return t;
  },
  toArray: function (e) {
    return P(e, function (e) {
      return e;
    }) || [];
  },
  only: function (e) {
    if (!isValidElement(e)) throw Error("React.Children.only expected to receive a single React element child.");
    return e;
  }
};
exports.Component = Component;
exports.Fragment = Fragment;
exports.Profiler = Profiler;
exports.PureComponent = PureComponent;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
exports.cloneElement = function (e, t, r) {
  if (null == e) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var i = m({}, e.props);
  var o = e.key;
  var s = e.ref;
  var a = e._owner;
  if (null != t) {
    if (void 0 !== t.ref) {
      s = t.ref;
      a = T.current;
    }
    if (void 0 !== t.key) {
      o = "" + t.key;
    }
    if (e.type && e.type.defaultProps) var c = e.type.defaultProps;
    for (l in t) if (w.call(t, l) && !S.hasOwnProperty(l)) {
      i[l] = void 0 === t[l] && void 0 !== c ? c[l] : t[l];
    }
  }
  var l = arguments.length - 2;
  if (1 === l) i.children = r;else if (1 < l) {
    c = Array(l);
    for (var u = 0; u < l; u++) c[u] = arguments[u + 2];
    i.children = c;
  }
  return {
    $$typeof: n,
    type: e.type,
    key: o,
    ref: s,
    props: i,
    _owner: a
  };
};
exports.createContext = function (e) {
  (e = {
    $$typeof: c,
    _currentValue: e,
    _currentValue2: e,
    _threadCount: 0,
    Provider: null,
    Consumer: null,
    _defaultValue: null,
    _globalName: null
  }).Provider = {
    $$typeof: a,
    _context: e
  };
  return e.Consumer = e;
};
exports.createElement = createElement;
exports.createFactory = function (e) {
  var t = createElement.bind(null, e);
  t.type = e;
  return t;
};
exports.createRef = function () {
  return {
    current: null
  };
};
exports.forwardRef = function (e) {
  return {
    $$typeof: l,
    render: e
  };
};
exports.isValidElement = isValidElement;
exports.lazy = function (e) {
  return {
    $$typeof: d,
    _payload: {
      _status: -1,
      _result: e
    },
    _init: N
  };
};
exports.memo = function (e, t) {
  return {
    $$typeof: p,
    type: e,
    compare: void 0 === t ? null : t
  };
};
exports.startTransition = function (e) {
  var t = R.transition;
  R.transition = {};
  try {
    e();
  } finally {
    R.transition = t;
  }
};
exports.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
exports.useCallback = function (e, t) {
  return O.current.useCallback(e, t);
};
exports.useContext = function (e) {
  return O.current.useContext(e);
};
exports.useDebugValue = function () {};
exports.useDeferredValue = function (e) {
  return O.current.useDeferredValue(e);
};
exports.useEffect = function (e, t) {
  return O.current.useEffect(e, t);
};
exports.useId = function () {
  return O.current.useId();
};
exports.useImperativeHandle = function (e, t, n) {
  return O.current.useImperativeHandle(e, t, n);
};
exports.useInsertionEffect = function (e, t) {
  return O.current.useInsertionEffect(e, t);
};
exports.useLayoutEffect = function (e, t) {
  return O.current.useLayoutEffect(e, t);
};
exports.useMemo = function (e, t) {
  return O.current.useMemo(e, t);
};
exports.useReducer = function (e, t, n) {
  return O.current.useReducer(e, t, n);
};
exports.useRef = function (e) {
  return O.current.useRef(e);
};
exports.useState = function (e) {
  return O.current.useState(e);
};
exports.useSyncExternalStore = function (e, t, n) {
  return O.current.useSyncExternalStore(e, t, n);
};
exports.useTransition = function () {
  return O.current.useTransition();
};
exports.version = "18.2.0";