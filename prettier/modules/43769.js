const {
  EventEmitter: r
} = require(82361);
module.exports = () => {
  const e = {};
  const t = new r();
  t.setMaxListeners(0);
  return {
    acquire: n => new Promise(r => {
      if (!e[n]) {
        e[n] = !0;
        return void r();
      }
      const i = o => {
        if (e[n]) {
          e[n] = !0;
          t.removeListener(n, i);
          r(o);
        }
      };
      t.on(n, i);
    }),
    release: (n, r) => {
      Reflect.deleteProperty(e, n);
      setImmediate(() => t.emit(n, r));
    }
  };
};