Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.LRUCacheMap = exports.keyForPrompt = void 0;
const r = require(81354);
exports.keyForPrompt = function (e) {
  return r.SHA256(e.prefix + e.suffix).toString();
};
class LRUCacheMap {
  constructor(e = 10) {
    this.valueMap = new Map();
    this.lruKeys = [];
    this.sizeLimit = e;
  }
  set(e, t) {
    let n;
    if (this.valueMap.has(e)) {
      n = e;
    } else {
      if (this.lruKeys.length >= this.sizeLimit) {
        n = this.lruKeys[0];
      }
    }
    if (void 0 !== n) {
      this.delete(n);
    }
    this.valueMap.set(e, t);
    this.touchKeyInLRU(e);
    return this;
  }
  get(e) {
    if (this.valueMap.has(e)) {
      const t = this.valueMap.get(e);
      this.touchKeyInLRU(e);
      return t;
    }
  }
  delete(e) {
    return !!this.has(e) && (this.removeKeyFromLRU(e), void 0 !== this.valueMap.get(e) && this.valueMap.delete(e), !0);
  }
  clear() {
    this.valueMap.clear();
    this.lruKeys = [];
  }
  get size() {
    return this.valueMap.size;
  }
  keys() {
    return this.lruKeys.slice().values();
  }
  values() {
    return new Map(this.valueMap).values();
  }
  entries() {
    return new Map(this.valueMap).entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  has(e) {
    return this.valueMap.has(e);
  }
  forEach(e, t) {
    new Map(this.valueMap).forEach(e, t);
  }
  get [Symbol.toStringTag]() {
    return "LRUCacheMap";
  }
  peek(e) {
    return this.valueMap.get(e);
  }
  removeKeyFromLRU(e) {
    const t = this.lruKeys.indexOf(e);
    if (-1 !== t) {
      this.lruKeys.splice(t, 1);
    }
  }
  touchKeyInLRU(e) {
    this.removeKeyFromLRU(e);
    this.lruKeys.push(e);
  }
}
exports.LRUCacheMap = LRUCacheMap;