Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getTokenizer = exports.TokenizerName = void 0;
const r = require(7147);
const i = require(1017);
const o = require(3837);
const s = (e, t) => Array.from(Array(t).keys()).slice(e);
const a = e => e.charCodeAt(0);
const c = new o.TextDecoder("utf-8");
const l = e => c.decode(new Uint8Array(e));
function u(e) {
  const t = new Set();
  let n = e[0];
  for (let r = 1; r < e.length; r++) {
    const i = e[r];
    t.add([n, i]);
    n = i;
  }
  return t;
}
const p = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
var d;
!function (e) {
  e.cushman001 = "cushman001";
  e.cushman002 = "cushman002";
  e.mock = "mock";
}(d = exports.TokenizerName || (exports.TokenizerName = {}));
const h = new Map();
exports.getTokenizer = function (e = d.cushman002) {
  let t = h.get(e);
  if (void 0 !== t) {
    t = e === d.mock ? new m() : new f(e);
    h.set(e, t);
  }
  return t;
};
class f {
  constructor(e = d.cushman002) {
    this.decoder = new Map();
    this.byte_encoder = new Map();
    this.byte_decoder = new Map();
    this.cache = new Map();
    this.textEncoder = new o.TextEncoder();
    this.encodeStr = e => Array.from(this.textEncoder.encode(e));
    let t = "";
    let n = "";
    if (e === d.cushman001) {
      t = "vocab_cushman001.bpe";
      n = "tokenizer_cushman001.json";
    } else {
      if (e !== d.cushman002) throw new Error(`Unknown tokenizer name: ${e}`);
      t = "vocab_cushman002.bpe";
      n = "tokenizer_cushman002.json";
    }
    const c = r.readFileSync(i.resolve(__dirname, "resources", e, n));
    const l = JSON.parse(c.toString());
    this.encoder = new Map(Object.entries(l));
    for (let [e, t] of this.encoder) this.decoder.set(t, e);
    const u = r.readFileSync(i.resolve(__dirname, "resources", e, t), "utf-8").split("\n").slice(1).filter(e => e.trim().length > 0);
    this.bpe_ranks = ((e, t) => {
      const n = new Map();
      e.forEach((r, i) => {
        n.set(e[i], t[i]);
      });
      return n;
    })(u, s(0, u.length));
    (function (e) {
      const t = s(a("!"), a("~") + 1).concat(s(a("¡"), a("¬") + 1), s(a("®"), a("ÿ") + 1));
      let n = t.slice();
      let r = 0;
      for (let e = 0; e < 256; e++) if (t.includes(e)) {
        t.push(e);
        n.push(256 + r);
        r += 1;
      }
      const i = n.map(e => (e => String.fromCharCode(e))(e));
      for (let n = 0; n < t.length; n++) e.set(t[n], i[n]);
    })(this.byte_encoder);
    this.byte_encoder.forEach((e, t, n) => {
      this.byte_decoder.set(e, t);
    });
  }
  byteEncodeStr(e) {
    return this.encodeStr(e).map(e => this.byte_encoder.get(e));
  }
  bpe(e) {
    if (this.cache.has(e)) return this.cache.get(e);
    let t = this.byteEncodeStr(e);
    let n = u(t);
    if (!n) return t.map(e => this.encoder.get(e));
    for (;;) {
      const e = new Map();
      n.forEach(t => {
        const n = t.join(" ");
        const r = this.bpe_ranks.get(n);
        e.set(void 0 === r || isNaN(r) ? 1e11 : r, t);
      });
      const r = Array.from(e.keys()).map(e => Number(e));
      const i = e.get(Math.min(...r));
      if (!i || !this.bpe_ranks.has(i.join(" "))) break;
      const o = i[0];
      const s = i[1];
      let a = [];
      let c = 0;
      for (; c < t.length;) {
        const e = t.indexOf(o, c);
        if (-1 === e) {
          Array.prototype.push.apply(a, t.slice(c));
          break;
        }
        Array.prototype.push.apply(a, t.slice(c, e));
        c = e;
        if (t[c] === o && c < t.length - 1 && t[c + 1] === s) {
          a.push(o + s);
          c += 2;
        } else {
          a.push(t[c]);
          c += 1;
        }
      }
      t = a;
      if (1 === t.length) break;
      n = u(t);
    }
    const r = t.map(e => this.encoder.get(e));
    this.cache.set(e, r);
    return r;
  }
  tokenize(e) {
    let t = [];
    const n = Array.from(e.matchAll(p)).map(e => e[0]);
    for (let e of n) {
      const n = this.bpe(e);
      Array.prototype.push.apply(t, n);
    }
    return t;
  }
  tokenLength(e) {
    return this.tokenize(e).length;
  }
  takeLastTokens(e, t) {
    if (t <= 0) return "";
    let n = Math.min(e.length, 4 * t);
    let r = e.slice(-n);
    let i = this.tokenize(r);
    for (; i.length < t + 2 && n < e.length;) {
      n = Math.min(e.length, n + 1 * t);
      r = e.slice(-n);
      i = this.tokenize(r);
    }
    return i.length < t ? e : (i = i.slice(-t), this.detokenize(i));
  }
  takeFirstTokens(e, t) {
    if (t <= 0) return {
      text: "",
      tokens: []
    };
    let n = Math.min(e.length, 4 * t);
    let r = e.slice(0, n);
    let i = this.tokenize(r);
    for (; i.length < t + 2 && n < e.length;) {
      n = Math.min(e.length, n + 1 * t);
      r = e.slice(0, n);
      i = this.tokenize(r);
    }
    return i.length < t ? {
      text: e,
      tokens: i
    } : (i = i.slice(0, t), {
      text: this.detokenize(i),
      tokens: i
    });
  }
  takeLastLinesTokens(e, t) {
    const n = this.takeLastTokens(e, t);
    if (n.length === e.length || "\n" === e[e.length - n.length - 1]) return n;
    let r = n.indexOf("\n");
    return n.substring(r + 1);
  }
  detokenize(e) {
    let t = e.map(e => this.decoder.get(e)).join("");
    t = l(t.split("").map(e => this.byte_decoder.get(e)));
    return t;
  }
  tokenizeStrings(e) {
    return this.tokenize(e).map(e => l(this.decoder.get(e).split("").map(e => this.byte_decoder.get(e))));
  }
}
class m {
  constructor() {
    this.hash = e => {
      let t = 0;
      for (let n = 0; n < e.length; n++) {
        t = (t << 5) - t + e.charCodeAt(n);
        t &= 65535 & t;
      }
      return t;
    };
  }
  tokenize(e) {
    return this.tokenizeStrings(e).map(this.hash);
  }
  detokenize(e) {
    return e.map(e => e.toString()).join(" ");
  }
  tokenizeStrings(e) {
    return e.split(/\b/);
  }
  tokenLength(e) {
    return this.tokenizeStrings(e).length;
  }
  takeLastTokens(e, t) {
    return this.tokenizeStrings(e).slice(-t).join("");
  }
  takeFirstTokens(e, t) {
    const n = this.tokenizeStrings(e).slice(0, t);
    return {
      text: n.join(""),
      tokens: n.map(this.hash)
    };
  }
  takeLastLinesTokens(e, t) {
    const n = this.takeLastTokens(e, t);
    if (n.length === e.length || "\n" === e[e.length - n.length - 1]) return n;
    let r = n.indexOf("\n");
    return n.substring(r + 1);
  }
}