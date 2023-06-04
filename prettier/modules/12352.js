const t = (e, t) => function () {
  const n = t.promiseModule;
  const r = new Array(arguments.length);
  for (let e = 0; e < arguments.length; e++) r[e] = arguments[e];
  return new n((n, i) => {
    if (t.errorFirst) {
      r.push(function (e, r) {
        if (t.multiArgs) {
          const t = new Array(arguments.length - 1);
          for (let e = 1; e < arguments.length; e++) t[e - 1] = arguments[e];
          if (e) {
            t.unshift(e);
            i(t);
          } else {
            n(t);
          }
        } else if (e) {
          i(e);
        } else {
          n(r);
        }
      });
    } else {
      r.push(function (e) {
        if (t.multiArgs) {
          const e = new Array(arguments.length - 1);
          for (let t = 0; t < arguments.length; t++) e[t] = arguments[t];
          n(e);
        } else n(e);
      });
    }
    e.apply(this, r);
  });
};
module.exports = (e, n) => {
  n = Object.assign({
    exclude: [/.+(Sync|Stream)$/],
    errorFirst: !0,
    promiseModule: Promise
  }, n);
  const r = e => {
    const t = t => "string" == typeof t ? e === t : t.test(e);
    return n.include ? n.include.some(t) : !n.exclude.some(t);
  };
  let i;
  i = "function" == typeof e ? function () {
    return n.excludeMain ? e.apply(this, arguments) : t(e, n).apply(this, arguments);
  } : Object.create(Object.getPrototypeOf(e));
  for (const o in e) {
    const s = e[o];
    i[o] = "function" == typeof s && r(o) ? t(s, n) : s;
  }
  return i;
};