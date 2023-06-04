Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.asyncIterableFromArray = exports.asyncIterableMapFilter = exports.asyncIterableFilter = exports.asyncIterableMap = void 0;
exports.asyncIterableMap = async function* (e, t) {
  for await (const n of e) yield t(n);
};
exports.asyncIterableFilter = async function* (e, t) {
  for await (const n of e) if (await t(n)) {
    yield n;
  }
};
exports.asyncIterableMapFilter = async function* (e, t) {
  for await (const n of e) {
    const e = await t(n);
    if (void 0 !== e) {
      yield e;
    }
  }
};
exports.asyncIterableFromArray = async function* (e) {
  for (const t of e) yield t;
};