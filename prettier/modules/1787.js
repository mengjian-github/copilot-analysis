class t extends Error {
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
module.exports = {
  RequestAbortedError: t
};