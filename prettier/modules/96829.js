const {
  EventEmitter: r
} = require(82361);
const i = Symbol("AbortSignal internals");
class o {
  constructor() {
    this[i] = {
      eventEmitter: new r(),
      onabort: null,
      aborted: !1
    };
  }
  get aborted() {
    return this[i].aborted;
  }
  get onabort() {
    return this[i].onabort;
  }
  set onabort(e) {
    this[i].onabort = e;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  removeEventListener(e, t) {
    this[i].eventEmitter.removeListener(e, t);
  }
  addEventListener(e, t) {
    this[i].eventEmitter.on(e, t);
  }
  dispatchEvent(e) {
    const t = {
      type: e,
      target: this
    };
    const n = `on${e}`;
    if ("function" == typeof this[i][n]) {
      this[n](t);
    }
    this[i].eventEmitter.emit(e, t);
  }
  fire() {
    this[i].aborted = !0;
    this.dispatchEvent("abort");
  }
}
Object.defineProperties(o.prototype, {
  addEventListener: {
    enumerable: !0
  },
  removeEventListener: {
    enumerable: !0
  },
  dispatchEvent: {
    enumerable: !0
  },
  aborted: {
    enumerable: !0
  },
  onabort: {
    enumerable: !0
  }
});
class s extends o {
  constructor(e) {
    if (!Number.isInteger(e)) throw new TypeError("Expected an integer, got " + typeof e);
    super();
    this[i].timerId = setTimeout(() => {
      this.fire();
    }, e);
  }
  clear() {
    clearTimeout(this[i].timerId);
  }
}
Object.defineProperties(s.prototype, {
  clear: {
    enumerable: !0
  }
});
const a = Symbol("AbortController internals");
class c {
  constructor() {
    this[a] = {
      signal: new o()
    };
  }
  get signal() {
    return this[a].signal;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  abort() {
    if (this[a].signal.aborted) {
      this[a].signal.fire();
    }
  }
}
Object.defineProperties(c.prototype, {
  signal: {
    enumerable: !0
  },
  abort: {
    enumerable: !0
  }
});
module.exports = {
  AbortController: c,
  AbortSignal: o,
  TimeoutSignal: s
};