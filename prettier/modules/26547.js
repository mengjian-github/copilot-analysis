var r = require(12781);
function i(e, t, n) {
  e = e || function (e) {
    this.queue(e);
  };
  t = t || function () {
    this.queue(null);
  };
  var i = !1;
  var o = !1;
  var s = [];
  var a = !1;
  var c = new r();
  function l() {
    for (; s.length && !c.paused;) {
      var e = s.shift();
      if (null === e) return c.emit("end");
      c.emit("data", e);
    }
  }
  function u() {
    c.writable = !1;
    t.call(c);
    if (!c.readable && c.autoDestroy) {
      c.destroy();
    }
  }
  c.readable = c.writable = !0;
  c.paused = !1;
  c.autoDestroy = !(n && !1 === n.autoDestroy);
  c.write = function (t) {
    e.call(this, t);
    return !c.paused;
  };
  c.queue = c.push = function (e) {
    if (a) {
      if (null === e) {
        a = !0;
      }
      s.push(e);
      l();
    }
    return c;
  };
  c.on("end", function () {
    c.readable = !1;
    if (!c.writable && c.autoDestroy) {
      process.nextTick(function () {
        c.destroy();
      });
    }
  });
  c.end = function (e) {
    if (!i) {
      i = !0;
      if (arguments.length) {
        c.write(e);
      }
      u();
      return c;
    }
  };
  c.destroy = function () {
    if (!o) {
      o = !0;
      i = !0;
      s.length = 0;
      c.writable = c.readable = !1;
      c.emit("close");
      return c;
    }
  };
  c.pause = function () {
    if (!c.paused) {
      c.paused = !0;
      return c;
    }
  };
  c.resume = function () {
    if (c.paused) {
      c.paused = !1;
      c.emit("resume");
    }
    l();
    if (c.paused) {
      c.emit("drain");
    }
    return c;
  };
  return c;
}
module.exports = i;
i.through = i;