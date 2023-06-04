require.d(exports, {
  n: () => a
});
var r = "[_0-9a-z-*/]";
var i = new RegExp("^(?:[a-z]" + r + "{0,255}|[a-z0-9]" + r + "{0,240}@[a-z]" + r + "{0,13})$");
var o = /^[ -~]{0,255}[!-~]$/;
var s = /,|=/;
var a = function () {
  function e(e) {
    this._internalState = new Map();
    if (e) {
      this._parse(e);
    }
  }
  e.prototype.set = function (e, t) {
    var n = this._clone();
    if (n._internalState.has(e)) {
      n._internalState.delete(e);
    }
    n._internalState.set(e, t);
    return n;
  };
  e.prototype.unset = function (e) {
    var t = this._clone();
    t._internalState.delete(e);
    return t;
  };
  e.prototype.get = function (e) {
    return this._internalState.get(e);
  };
  e.prototype.serialize = function () {
    var e = this;
    return this._keys().reduce(function (t, n) {
      t.push(n + "=" + e.get(n));
      return t;
    }, []).join(",");
  };
  e.prototype._parse = function (e) {
    if (e.length > 512) {
      this._internalState = e.split(",").reverse().reduce(function (e, t) {
        var n = t.trim();
        var r = n.indexOf("=");
        if (-1 !== r) {
          var a = n.slice(0, r);
          var c = n.slice(r + 1, t.length);
          if (function (e) {
            return i.test(e);
          }(a) && function (e) {
            return o.test(e) && !s.test(e);
          }(c)) {
            e.set(a, c);
          }
        }
        return e;
      }, new Map());
      if (this._internalState.size > 32) {
        this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32));
      }
    }
  };
  e.prototype._keys = function () {
    return Array.from(this._internalState.keys()).reverse();
  };
  e.prototype._clone = function () {
    var t = new e();
    t._internalState = new Map(this._internalState);
    return t;
  };
  return e;
}();