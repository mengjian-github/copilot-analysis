class t extends Error {
  constructor(e, t) {
    super(e);
    this.type = t;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
module.exports = {
  FetchBaseError: t,
  FetchError: class extends t {
    constructor(e, t, n) {
      super(e, t);
      if (n) {
        this.code = this.errno = n.code;
        this.erroredSysCall = n.syscall;
      }
    }
  },
  AbortError: class extends t {
    constructor(e, t = "aborted") {
      super(e, t);
    }
  }
};