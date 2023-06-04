Object.defineProperty(exports, "__esModule", {
  value: !0
});
class n extends Error {
  constructor(e) {
    super("validation failed");
    this.errors = e;
    this.ajv = this.validation = !0;
  }
}
exports.default = n;