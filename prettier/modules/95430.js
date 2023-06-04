Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.registerCopilotEnvelopeListener = void 0;
const r = require(89496);
const i = require(94777);
const o = require(68446);
const s = require(47302);
exports.registerCopilotEnvelopeListener = function (e) {
  function t() {
    const e = !s.ConnectionState.isDisabled();
    a.updateCodeQuoteEnabled(e);
  }
  const n = s.ConnectionState.listen(t);
  const a = new o.CodeQuoteHeaderContributor();
  const c = e.get(i.HeaderContributors);
  c.add(a);
  t();
  return new r.Disposable(() => {
    c.remove(a);
    n.dispose();
  });
};