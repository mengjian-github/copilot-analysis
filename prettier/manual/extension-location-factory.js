Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.ExtensionLocationFactory = void 0;
  const r = require(89496),
    i = require(16403);
  class o extends i.LocationFactory {
    range(e, t, n, i) {
      return void 0 !== n && void 0 !== i ? new r.Range(e, t, n, i) : new r.Range(e, t);
    }
    position(e, t) {
      return new r.Position(e, t);
    }
  }
  exports.ExtensionLocationFactory = o;