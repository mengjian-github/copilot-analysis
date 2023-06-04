Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.shortCircuit = void 0;
exports.shortCircuit = function (e, t, n) {
  return async function (...r) {
    return await Promise.race([e.apply(this, r), new Promise(e => {
      setTimeout(e, t, n);
    })]);
  };
};