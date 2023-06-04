const r = require(13685);
const i = require(95687);
const {
  Readable: o
} = require(12781);
const s = require(15158)("helix-fetch:h1");
const {
  RequestAbortedError: a
} = require(1787);
const {
  decodeStream: c
} = require(4544);
module.exports = {
  request: async (e, t, n) => {
    const {
      request: l
    } = "https:" === t.protocol ? i : r;
    const u = ((e, t) => {
      const {
        h1: n,
        options: {
          h1: o,
          rejectUnauthorized: s
        }
      } = e;
      return "https:" === t ? n.httpsAgent ? n.httpsAgent : o || "boolean" == typeof s ? (n.httpsAgent = new i.Agent("boolean" == typeof s ? {
        ...(o || {}),
        rejectUnauthorized: s
      } : o), n.httpsAgent) : void 0 : n.httpAgent ? n.httpAgent : o ? (n.httpAgent = new r.Agent(o), n.httpAgent) : void 0;
    })(e, t.protocol);
    const p = {
      ...n,
      agent: u
    };
    const {
      socket: d,
      body: h
    } = p;
    if (d) {
      delete p.socket;
      if (d.assigned) {
        d.assigned = !0;
        if (u) {
          p.agent = new Proxy(u, {
            get: (e, t) => "createConnection" !== t || d.inUse ? e[t] : (e, t) => {
              s(`agent reusing socket #${d.id} (${d.servername})`);
              d.inUse = !0;
              t(null, d);
            }
          });
        } else {
          p.createConnection = (e, t) => {
            s(`reusing socket #${d.id} (${d.servername})`);
            d.inUse = !0;
            t(null, d);
          };
        }
      }
    }
    return new Promise((e, n) => {
      let r;
      s(`${p.method} ${t.href}`);
      const {
        signal: i
      } = p;
      const u = () => {
        i.removeEventListener("abort", u);
        if (d && !d.inUse) {
          s(`discarding redundant socket used for ALPN: #${d.id} ${d.servername}`);
          d.destroy();
        }
        n(new a());
        if (r) {
          r.abort();
        }
      };
      if (i) {
        if (i.aborted) return void n(new a());
        i.addEventListener("abort", u);
      }
      r = l(t, p);
      r.once("response", t => {
        if (i) {
          i.removeEventListener("abort", u);
        }
        if (d && !d.inUse) {
          s(`discarding redundant socket used for ALPN: #${d.id} ${d.servername}`);
          d.destroy();
        }
        e(((e, t, n) => {
          const {
            statusCode: r,
            statusMessage: i,
            httpVersion: o,
            httpVersionMajor: s,
            httpVersionMinor: a,
            headers: l
          } = e;
          const u = t ? c(r, l, e, n) : e;
          return {
            statusCode: r,
            statusText: i,
            httpVersion: o,
            httpVersionMajor: s,
            httpVersionMinor: a,
            headers: l,
            readable: u,
            decoded: !(!t || u === e)
          };
        })(t, p.decode, n));
      });
      r.once("error", e => {
        if (i) {
          i.removeEventListener("abort", u);
        }
        if (d && !d.inUse) {
          s(`discarding redundant socket used for ALPN: #${d.id} ${d.servername}`);
          d.destroy();
        }
        if (r.aborted) {
          s(`${p.method} ${t.href} failed with: ${e.message}`);
          r.abort();
          n(e);
        }
      });
      if (h instanceof o) {
        h.pipe(r);
      } else {
        if (h) {
          r.write(h);
        }
        r.end();
      }
    });
  },
  setupContext: e => {
    e.h1 = {};
  },
  resetContext: async ({
    h1: e
  }) => {
    if (e.httpAgent) {
      s("resetContext: destroying httpAgent");
      e.httpAgent.destroy();
      delete e.httpAgent;
    }
    if (e.httpsAgent) {
      s("resetContext: destroying httpsAgent");
      e.httpsAgent.destroy();
      delete e.httpsAgent;
    }
  }
};