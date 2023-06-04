Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.LineWithValueAndCost = void 0;
const r = require(23228);
class LineWithValueAndCost {
  constructor(e, t, n = r.getTokenizer().tokenLength(e + "\n"), i = "strict") {
    this.text = e;
    this._value = t;
    this._cost = n;
    if (e.includes("\n") && "none" !== i) throw new Error("LineWithValueAndCost: text contains newline");
    if (t < 0 && "none" !== i) throw new Error("LineWithValueAndCost: value is negative");
    if (n < 0 && "none" !== i) throw new Error("LineWithValueAndCost: cost is negative");
    if ("strict" == i && t > 1) throw new Error("Value should normally be between 0 and 1 -- set validation to `loose` to ignore this error");
  }
  get value() {
    return this._value;
  }
  get cost() {
    return this._cost;
  }
  adjustValue(e) {
    this._value *= e;
    return this;
  }
  recost(e = e => r.getTokenizer().tokenLength(e + "\n")) {
    this._cost = e(this.text);
    return this;
  }
  copy() {
    return new LineWithValueAndCost(this.text, this.value, this.cost, "none");
  }
}
exports.LineWithValueAndCost = LineWithValueAndCost;