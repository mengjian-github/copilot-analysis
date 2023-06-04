Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
const r = require(27159);
const i = require(93924);
const o = require(1240);
const s = require(98);
const a = ["/properties"];
const c = "http://json-schema.org/draft-07/schema";
class l extends r.default {
  _addVocabularies() {
    super._addVocabularies();
    i.default.forEach(e => this.addVocabulary(e));
    if (this.opts.discriminator) {
      this.addKeyword(o.default);
    }
  }
  _addDefaultMetaSchema() {
    super._addDefaultMetaSchema();
    if (!this.opts.meta) return;
    const e = this.opts.$data ? this.$dataMetaSchema(s, a) : s;
    this.addMetaSchema(e, c, !1);
    this.refs["http://json-schema.org/schema"] = c;
  }
  defaultMeta() {
    return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
  }
}
module.exports = exports = l;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = l;
var u = require(74815);
Object.defineProperty(exports, "KeywordCxt", {
  enumerable: !0,
  get: function () {
    return u.KeywordCxt;
  }
});
var p = require(93487);
Object.defineProperty(exports, "_", {
  enumerable: !0,
  get: function () {
    return p._;
  }
});
Object.defineProperty(exports, "str", {
  enumerable: !0,
  get: function () {
    return p.str;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: !0,
  get: function () {
    return p.stringify;
  }
});
Object.defineProperty(exports, "nil", {
  enumerable: !0,
  get: function () {
    return p.nil;
  }
});
Object.defineProperty(exports, "Name", {
  enumerable: !0,
  get: function () {
    return p.Name;
  }
});
Object.defineProperty(exports, "CodeGen", {
  enumerable: !0,
  get: function () {
    return p.CodeGen;
  }
});