const {
  connect: r,
  constants: i
} = require(85158);
const {
  Readable: o
} = require(12781);
const s = require(15158)("helix-fetch:h2");
const {
  RequestAbortedError: a
} = require(1787);
const {
  decodeStream: c
} = require(4544);
const {
  NGHTTP2_CANCEL: l
} = i;
const u = 3e5;
const p = 5e3;
const d = (e, t, n, r = () => {}) => {
  const i = {
    ...e
  };
  const o = i[":status"];
  delete i[":status"];
  const s = n ? c(o, e, t, r) : t;
  return {
    statusCode: o,
    statusText: "",
    httpVersion: "2.0",
    httpVersionMajor: 2,
    httpVersionMinor: 0,
    headers: i,
    readable: s,
    decoded: !(!n || s === t)
  };
};
module.exports = {
  request: async (e, t, n) => {
    const {
      origin: i,
      pathname: c,
      search: h,
      hash: f
    } = t;
    const m = `${c}${h}${f}`;
    const {
      options: {
        h2: g = {}
      },
      h2: {
        sessionCache: y
      }
    } = e;
    const {
      idleSessionTimeout: _ = u,
      pushPromiseHandler: v,
      pushHandler: b
    } = g;
    const E = {
      ...n
    };
    const {
      method: w,
      headers: T,
      socket: S,
      body: x,
      decode: C
    } = E;
    if (S) {
      delete E.socket;
    }
    if (T.host) {
      T[":authority"] = T.host;
      delete T.host;
    }
    return new Promise((n, c) => {
      let u;
      let h = y[i];
      if (!h || h.closed || h.destroyed) {
        const t = !(!1 === e.options.rejectUnauthorized || !1 === g.rejectUnauthorized);
        const n = {
          ...g,
          rejectUnauthorized: t
        };
        if (S && !S.inUse) {
          n.createConnection = () => (s(`reusing socket #${S.id} (${S.servername})`), S.inUse = !0, S);
        }
        const o = !(!v && !b);
        h = r(i, {
          ...n,
          settings: {
            enablePush: o
          }
        });
        h.setMaxListeners(1e3);
        h.setTimeout(_, () => {
          s(`closing session ${i} after ${_} ms of inactivity`);
          h.close();
        });
        h.once("connect", () => {
          s(`session ${i} established`);
          s(`caching session ${i}`);
          y[i] = h;
        });
        h.on("localSettings", e => {
          s(`session ${i} localSettings: ${JSON.stringify(e)}`);
        });
        h.on("remoteSettings", e => {
          s(`session ${i} remoteSettings: ${JSON.stringify(e)}`);
        });
        h.once("close", () => {
          s(`session ${i} closed`);
          if (y[i] === h) {
            s(`discarding cached session ${i}`);
            delete y[i];
          }
        });
        h.once("error", e => {
          s(`session ${i} encountered error: ${e}`);
          if (y[i] === h) {
            s(`discarding cached session ${i}`);
            delete y[i];
          }
        });
        h.on("frameError", (e, t, n) => {
          s(`session ${i} encountered frameError: type: ${e}, code: ${t}, id: ${n}`);
        });
        h.once("goaway", (e, t, n) => {
          s(`session ${i} received GOAWAY frame: errorCode: ${e}, lastStreamID: ${t}, opaqueData: ${n ? n.toString() : void 0}`);
        });
        h.on("stream", (t, n, r) => {
          ((e, t, n, r, i, o) => {
            const {
              options: {
                h2: {
                  pushPromiseHandler: a,
                  pushHandler: c,
                  pushedStreamIdleTimeout: u = p
                }
              }
            } = e;
            const h = i[":path"];
            const f = `${t}${h}`;
            s(`received PUSH_PROMISE: ${f}, stream #${r.id}, headers: ${JSON.stringify(i)}, flags: ${o}`);
            if (a) {
              a(f, i, () => {
                r.close(l);
              });
            }
            r.on("push", (e, o) => {
              s(`received push headers for ${t}${h}, stream #${r.id}, headers: ${JSON.stringify(e)}, flags: ${o}`);
              r.setTimeout(u, () => {
                s(`closing pushed stream #${r.id} after ${u} ms of inactivity`);
                r.close(l);
              });
              if (c) {
                c(f, i, d(e, r, n));
              }
            });
            r.on("aborted", () => {
              s(`pushed stream #${r.id} aborted`);
            });
            r.on("error", e => {
              s(`pushed stream #${r.id} encountered error: ${e}`);
            });
            r.on("frameError", (e, t, n) => {
              s(`pushed stream #${r.id} encountered frameError: type: ${e}, code: ${t}, id: ${n}`);
            });
          })(e, i, C, t, n, r);
        });
      } else if (S && S.id !== h.socket.id && !S.inUse) {
        s(`discarding redundant socket used for ALPN: #${S.id} ${S.servername}`);
        S.destroy();
      }
      s(`${w} ${t.host}${m}`);
      const {
        signal: f
      } = E;
      const I = () => {
        f.removeEventListener("abort", I);
        c(new a());
        if (u) {
          u.close(l);
        }
      };
      if (f) {
        if (f.aborted) return void c(new a());
        f.addEventListener("abort", I);
      }
      const A = e => {
        s(`session ${i} encountered error during ${E.method} ${t.href}: ${e}`);
        c(e);
      };
      h.once("error", A);
      u = h.request({
        ":method": w,
        ":path": m,
        ...T
      });
      u.once("response", e => {
        h.off("error", A);
        if (f) {
          f.removeEventListener("abort", I);
        }
        n(d(e, u, E.decode, c));
      });
      u.once("error", e => {
        h.off("error", A);
        if (f) {
          f.removeEventListener("abort", I);
        }
        if (u.rstCode !== l) {
          s(`${E.method} ${t.href} failed with: ${e.message}`);
          u.close(l);
          c(e);
        }
      });
      u.once("frameError", (e, n, r) => {
        h.off("error", A);
        s(`encountered frameError during ${E.method} ${t.href}: type: ${e}, code: ${n}, id: ${r}`);
      });
      u.on("push", (e, t) => {
        s(`received 'push' event: headers: ${JSON.stringify(e)}, flags: ${t}`);
      });
      if (x instanceof o) {
        x.pipe(u);
      } else {
        if (x) {
          u.write(x);
        }
        u.end();
      }
    });
  },
  setupContext: e => {
    e.h2 = {
      sessionCache: {}
    };
  },
  resetContext: async ({
    h2: e
  }) => Promise.all(Object.values(e.sessionCache).map(e => new Promise(t => {
    e.on("close", t);
    s(`resetContext: destroying session (socket #${e.socket && e.socket.id}, ${e.socket && e.socket.servername})`);
    e.destroy();
  })))
};