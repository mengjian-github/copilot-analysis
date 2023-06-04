Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(32531);
class i extends Error {
  constructor(e, t, n, i) {
    super(i || `can't resolve reference ${n} from id ${t}`);
    this.missingRef = r.resolveUrl(e, t, n);
    this.missingSchema = r.normalizeId(r.getFullPath(e, this.missingRef));
  }
}
exports.default = i;