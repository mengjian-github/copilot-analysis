var r;
r = require(78249);
require(64938);
(function () {
  var e = r;
  var t = e.lib.Hasher;
  var n = e.x64;
  var i = n.Word;
  var o = n.WordArray;
  var s = e.algo;
  function a() {
    return i.create.apply(i, arguments);
  }
  var c = [a(1116352408, 3609767458), a(1899447441, 602891725), a(3049323471, 3964484399), a(3921009573, 2173295548), a(961987163, 4081628472), a(1508970993, 3053834265), a(2453635748, 2937671579), a(2870763221, 3664609560), a(3624381080, 2734883394), a(310598401, 1164996542), a(607225278, 1323610764), a(1426881987, 3590304994), a(1925078388, 4068182383), a(2162078206, 991336113), a(2614888103, 633803317), a(3248222580, 3479774868), a(3835390401, 2666613458), a(4022224774, 944711139), a(264347078, 2341262773), a(604807628, 2007800933), a(770255983, 1495990901), a(1249150122, 1856431235), a(1555081692, 3175218132), a(1996064986, 2198950837), a(2554220882, 3999719339), a(2821834349, 766784016), a(2952996808, 2566594879), a(3210313671, 3203337956), a(3336571891, 1034457026), a(3584528711, 2466948901), a(113926993, 3758326383), a(338241895, 168717936), a(666307205, 1188179964), a(773529912, 1546045734), a(1294757372, 1522805485), a(1396182291, 2643833823), a(1695183700, 2343527390), a(1986661051, 1014477480), a(2177026350, 1206759142), a(2456956037, 344077627), a(2730485921, 1290863460), a(2820302411, 3158454273), a(3259730800, 3505952657), a(3345764771, 106217008), a(3516065817, 3606008344), a(3600352804, 1432725776), a(4094571909, 1467031594), a(275423344, 851169720), a(430227734, 3100823752), a(506948616, 1363258195), a(659060556, 3750685593), a(883997877, 3785050280), a(958139571, 3318307427), a(1322822218, 3812723403), a(1537002063, 2003034995), a(1747873779, 3602036899), a(1955562222, 1575990012), a(2024104815, 1125592928), a(2227730452, 2716904306), a(2361852424, 442776044), a(2428436474, 593698344), a(2756734187, 3733110249), a(3204031479, 2999351573), a(3329325298, 3815920427), a(3391569614, 3928383900), a(3515267271, 566280711), a(3940187606, 3454069534), a(4118630271, 4000239992), a(116418474, 1914138554), a(174292421, 2731055270), a(289380356, 3203993006), a(460393269, 320620315), a(685471733, 587496836), a(852142971, 1086792851), a(1017036298, 365543100), a(1126000580, 2618297676), a(1288033470, 3409855158), a(1501505948, 4234509866), a(1607167915, 987167468), a(1816402316, 1246189591)];
  var l = [];
  !function () {
    for (var e = 0; e < 80; e++) l[e] = a();
  }();
  var u = s.SHA512 = t.extend({
    _doReset: function () {
      this._hash = new o.init([new i.init(1779033703, 4089235720), new i.init(3144134277, 2227873595), new i.init(1013904242, 4271175723), new i.init(2773480762, 1595750129), new i.init(1359893119, 2917565137), new i.init(2600822924, 725511199), new i.init(528734635, 4215389547), new i.init(1541459225, 327033209)]);
    },
    _doProcessBlock: function (e, t) {
      for (n = this._hash.words, r = n[0], i = n[1], o = n[2], s = n[3], a = n[4], u = n[5], p = n[6], d = n[7], h = r.high, f = r.low, m = i.high, g = i.low, y = o.high, _ = o.low, v = s.high, b = s.low, E = a.high, w = a.low, T = u.high, S = u.low, x = p.high, C = p.low, I = d.high, A = d.low, k = h, P = f, N = m, O = g, R = y, M = _, L = v, D = b, B = E, F = w, j = T, U = S, $ = x, V = C, H = I, q = A, z = 0, void 0; z < 80; z++) {
        var n;
        var r;
        var i;
        var o;
        var s;
        var a;
        var u;
        var p;
        var d;
        var h;
        var f;
        var m;
        var g;
        var y;
        var _;
        var v;
        var b;
        var E;
        var w;
        var T;
        var S;
        var x;
        var C;
        var I;
        var A;
        var k;
        var P;
        var N;
        var O;
        var R;
        var M;
        var L;
        var D;
        var B;
        var F;
        var j;
        var U;
        var $;
        var V;
        var H;
        var q;
        var z;
        var K;
        var G;
        var W = l[z];
        if (z < 16) {
          G = W.high = 0 | e[t + 2 * z];
          K = W.low = 0 | e[t + 2 * z + 1];
        } else {
          var Q = l[z - 15];
          var Z = Q.high;
          var X = Q.low;
          var Y = (Z >>> 1 | X << 31) ^ (Z >>> 8 | X << 24) ^ Z >>> 7;
          var J = (X >>> 1 | Z << 31) ^ (X >>> 8 | Z << 24) ^ (X >>> 7 | Z << 25);
          var ee = l[z - 2];
          var te = ee.high;
          var ne = ee.low;
          var re = (te >>> 19 | ne << 13) ^ (te << 3 | ne >>> 29) ^ te >>> 6;
          var ie = (ne >>> 19 | te << 13) ^ (ne << 3 | te >>> 29) ^ (ne >>> 6 | te << 26);
          var oe = l[z - 7];
          var se = oe.high;
          var ae = oe.low;
          var ce = l[z - 16];
          var le = ce.high;
          var ue = ce.low;
          G = (G = (G = Y + se + ((K = J + ae) >>> 0 < J >>> 0 ? 1 : 0)) + re + ((K += ie) >>> 0 < ie >>> 0 ? 1 : 0)) + le + ((K += ue) >>> 0 < ue >>> 0 ? 1 : 0);
          W.high = G;
          W.low = K;
        }
        var pe;
        var de = B & j ^ ~B & $;
        var he = F & U ^ ~F & V;
        var fe = k & N ^ k & R ^ N & R;
        var me = P & O ^ P & M ^ O & M;
        var ge = (k >>> 28 | P << 4) ^ (k << 30 | P >>> 2) ^ (k << 25 | P >>> 7);
        var ye = (P >>> 28 | k << 4) ^ (P << 30 | k >>> 2) ^ (P << 25 | k >>> 7);
        var _e = (B >>> 14 | F << 18) ^ (B >>> 18 | F << 14) ^ (B << 23 | F >>> 9);
        var ve = (F >>> 14 | B << 18) ^ (F >>> 18 | B << 14) ^ (F << 23 | B >>> 9);
        var be = c[z];
        var Ee = be.high;
        var we = be.low;
        var Te = H + _e + ((pe = q + ve) >>> 0 < q >>> 0 ? 1 : 0);
        var Se = ye + me;
        H = $;
        q = V;
        $ = j;
        V = U;
        j = B;
        U = F;
        B = L + (Te = (Te = (Te = Te + de + ((pe += he) >>> 0 < he >>> 0 ? 1 : 0)) + Ee + ((pe += we) >>> 0 < we >>> 0 ? 1 : 0)) + G + ((pe += K) >>> 0 < K >>> 0 ? 1 : 0)) + ((F = D + pe | 0) >>> 0 < D >>> 0 ? 1 : 0) | 0;
        L = R;
        D = M;
        R = N;
        M = O;
        N = k;
        O = P;
        k = Te + (ge + fe + (Se >>> 0 < ye >>> 0 ? 1 : 0)) + ((P = pe + Se | 0) >>> 0 < pe >>> 0 ? 1 : 0) | 0;
      }
      f = r.low = f + P;
      r.high = h + k + (f >>> 0 < P >>> 0 ? 1 : 0);
      g = i.low = g + O;
      i.high = m + N + (g >>> 0 < O >>> 0 ? 1 : 0);
      _ = o.low = _ + M;
      o.high = y + R + (_ >>> 0 < M >>> 0 ? 1 : 0);
      b = s.low = b + D;
      s.high = v + L + (b >>> 0 < D >>> 0 ? 1 : 0);
      w = a.low = w + F;
      a.high = E + B + (w >>> 0 < F >>> 0 ? 1 : 0);
      S = u.low = S + U;
      u.high = T + j + (S >>> 0 < U >>> 0 ? 1 : 0);
      C = p.low = C + V;
      p.high = x + $ + (C >>> 0 < V >>> 0 ? 1 : 0);
      A = d.low = A + q;
      d.high = I + H + (A >>> 0 < q >>> 0 ? 1 : 0);
    },
    _doFinalize: function () {
      var e = this._data;
      var t = e.words;
      var n = 8 * this._nDataBytes;
      var r = 8 * e.sigBytes;
      t[r >>> 5] |= 128 << 24 - r % 32;
      t[30 + (r + 128 >>> 10 << 5)] = Math.floor(n / 4294967296);
      t[31 + (r + 128 >>> 10 << 5)] = n;
      e.sigBytes = 4 * t.length;
      this._process();
      return this._hash.toX32();
    },
    clone: function () {
      var e = t.clone.call(this);
      e._hash = this._hash.clone();
      return e;
    },
    blockSize: 32
  });
  e.SHA512 = t._createHelper(u);
  e.HmacSHA512 = t._createHmacHelper(u);
})();
module.exports = r.SHA512;