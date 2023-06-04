require.r(exports);
require.d(exports, {
  NIL: () => S,
  parse: () => _,
  stringify: () => d,
  v1: () => y,
  v3: () => b,
  v4: () => w,
  v5: () => T,
  validate: () => l,
  version: () => x
});
var r = require(6113);
var i = require.n(r);
const o = new Uint8Array(256);
let s = o.length;
function a() {
  if (s > o.length - 16) {
    i().randomFillSync(o);
    s = 0;
  }
  return o.slice(s, s += 16);
}
const c = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
const l = function (e) {
  return "string" == typeof e && c.test(e);
};
const u = [];
for (let e = 0; e < 256; ++e) u.push((e + 256).toString(16).slice(1));
function p(e, t = 0) {
  return (u[e[t + 0]] + u[e[t + 1]] + u[e[t + 2]] + u[e[t + 3]] + "-" + u[e[t + 4]] + u[e[t + 5]] + "-" + u[e[t + 6]] + u[e[t + 7]] + "-" + u[e[t + 8]] + u[e[t + 9]] + "-" + u[e[t + 10]] + u[e[t + 11]] + u[e[t + 12]] + u[e[t + 13]] + u[e[t + 14]] + u[e[t + 15]]).toLowerCase();
}
const d = function (e, t = 0) {
  const n = p(e, t);
  if (!l(n)) throw TypeError("Stringified UUID is invalid");
  return n;
};
let h;
let f;
let m = 0;
let g = 0;
const y = function (e, t, n) {
  let r = t && n || 0;
  const i = t || new Array(16);
  let o = (e = e || {}).node || h;
  let s = void 0 !== e.clockseq ? e.clockseq : f;
  if (null == o || null == s) {
    const t = e.random || (e.rng || a)();
    if (null == o) {
      o = h = [1 | t[0], t[1], t[2], t[3], t[4], t[5]];
    }
    if (null == s) {
      s = f = 16383 & (t[6] << 8 | t[7]);
    }
  }
  let c = void 0 !== e.msecs ? e.msecs : Date.now();
  let l = void 0 !== e.nsecs ? e.nsecs : g + 1;
  const u = c - m + (l - g) / 1e4;
  if (u < 0 && void 0 === e.clockseq) {
    s = s + 1 & 16383;
  }
  if ((u < 0 || c > m) && void 0 === e.nsecs) {
    l = 0;
  }
  if (l >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  m = c;
  g = l;
  f = s;
  c += 122192928e5;
  const d = (1e4 * (268435455 & c) + l) % 4294967296;
  i[r++] = d >>> 24 & 255;
  i[r++] = d >>> 16 & 255;
  i[r++] = d >>> 8 & 255;
  i[r++] = 255 & d;
  const y = c / 4294967296 * 1e4 & 268435455;
  i[r++] = y >>> 8 & 255;
  i[r++] = 255 & y;
  i[r++] = y >>> 24 & 15 | 16;
  i[r++] = y >>> 16 & 255;
  i[r++] = s >>> 8 | 128;
  i[r++] = 255 & s;
  for (let e = 0; e < 6; ++e) i[r + e] = o[e];
  return t || p(i);
};
const _ = function (e) {
  if (!l(e)) throw TypeError("Invalid UUID");
  let t;
  const n = new Uint8Array(16);
  n[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24;
  n[1] = t >>> 16 & 255;
  n[2] = t >>> 8 & 255;
  n[3] = 255 & t;
  n[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8;
  n[5] = 255 & t;
  n[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8;
  n[7] = 255 & t;
  n[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8;
  n[9] = 255 & t;
  n[10] = (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255;
  n[11] = t / 4294967296 & 255;
  n[12] = t >>> 24 & 255;
  n[13] = t >>> 16 & 255;
  n[14] = t >>> 8 & 255;
  n[15] = 255 & t;
  return n;
};
function v(e, t, n) {
  function r(e, r, i, o) {
    var s;
    if ("string" == typeof e) {
      e = function (e) {
        e = unescape(encodeURIComponent(e));
        const t = [];
        for (let n = 0; n < e.length; ++n) t.push(e.charCodeAt(n));
        return t;
      }(e);
    }
    if ("string" == typeof r) {
      r = _(r);
    }
    if (16 !== (null === (s = r) || void 0 === s ? void 0 : s.length)) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    let a = new Uint8Array(16 + e.length);
    a.set(r);
    a.set(e, r.length);
    a = n(a);
    a[6] = 15 & a[6] | t;
    a[8] = 63 & a[8] | 128;
    if (i) {
      o = o || 0;
      for (let e = 0; e < 16; ++e) i[o + e] = a[e];
      return i;
    }
    return p(a);
  }
  try {
    r.name = e;
  } catch (e) {}
  r.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  r.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  return r;
}
const b = v("v3", 48, function (e) {
  if (Array.isArray(e)) {
    e = Buffer.from(e);
  } else {
    if ("string" == typeof e) {
      e = Buffer.from(e, "utf8");
    }
  }
  return i().createHash("md5").update(e).digest();
});
const E = {
  randomUUID: i().randomUUID
};
const w = function (e, t, n) {
  if (E.randomUUID && !t && !e) return E.randomUUID();
  const r = (e = e || {}).random || (e.rng || a)();
  r[6] = 15 & r[6] | 64;
  r[8] = 63 & r[8] | 128;
  if (t) {
    n = n || 0;
    for (let e = 0; e < 16; ++e) t[n + e] = r[e];
    return t;
  }
  return p(r);
};
const T = v("v5", 80, function (e) {
  if (Array.isArray(e)) {
    e = Buffer.from(e);
  } else {
    if ("string" == typeof e) {
      e = Buffer.from(e, "utf8");
    }
  }
  return i().createHash("sha1").update(e).digest();
});
const S = "00000000-0000-0000-0000-000000000000";
const x = function (e) {
  if (!l(e)) throw TypeError("Invalid UUID");
  return parseInt(e.slice(14, 15), 16);
};