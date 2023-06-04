require.d(exports, {
  q: () => s
});
var r = function () {
  function e() {
    var e = this;
    this._promise = new Promise(function (t, n) {
      e._resolve = t;
      e._reject = n;
    });
  }
  Object.defineProperty(e.prototype, "promise", {
    get: function () {
      return this._promise;
    },
    enumerable: !1,
    configurable: !0
  });
  e.prototype.resolve = function (e) {
    this._resolve(e);
  };
  e.prototype.reject = function (e) {
    this._reject(e);
  };
  return e;
}();
var i = function (e, t) {
  var n = "function" == typeof Symbol && e[Symbol.iterator];
  if (!n) return e;
  var r;
  var i;
  var o = n.call(e);
  var s = [];
  try {
    for (; (void 0 === t || t-- > 0) && !(r = o.next()).done;) s.push(r.value);
  } catch (e) {
    i = {
      error: e
    };
  } finally {
    try {
      if (r && !r.done && (n = o.return)) {
        n.call(o);
      }
    } finally {
      if (i) throw i.error;
    }
  }
  return s;
};
var o = function (e, t, n) {
  if (n || 2 === arguments.length) for (i = 0, o = t.length, void 0; i < o; i++) {
    var r;
    var i;
    var o;
    if (!r && i in t) {
      if (r) {
        r = Array.prototype.slice.call(t, 0, i);
      }
      r[i] = t[i];
    }
  }
  return e.concat(r || Array.prototype.slice.call(t));
};
var s = function () {
  function e(e, t) {
    this._callback = e;
    this._that = t;
    this._isCalled = !1;
    this._deferred = new r();
  }
  Object.defineProperty(e.prototype, "isCalled", {
    get: function () {
      return this._isCalled;
    },
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperty(e.prototype, "promise", {
    get: function () {
      return this._deferred.promise;
    },
    enumerable: !1,
    configurable: !0
  });
  e.prototype.call = function () {
    for (t = this, n = [], r = 0, void 0; r < arguments.length; r++) {
      var e;
      var t;
      var n;
      var r;
      n[r] = arguments[r];
    }
    if (!this._isCalled) {
      this._isCalled = !0;
      try {
        Promise.resolve((e = this._callback).call.apply(e, o([this._that], i(n), !1))).then(function (e) {
          return t._deferred.resolve(e);
        }, function (e) {
          return t._deferred.reject(e);
        });
      } catch (e) {
        this._deferred.reject(e);
      }
    }
    return this._deferred.promise;
  };
  return e;
}();