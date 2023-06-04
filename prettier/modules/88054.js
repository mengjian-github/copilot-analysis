var r = this && this.__importDefault || function (e) {
  return e && e.__esModule ? e : {
    default: e
  };
};
const i = require(82361);
const o = r(require(15158));
const s = r(require(96304));
const a = o.default("agent-base");
function c() {
  const {
    stack: e
  } = new Error();
  return "string" == typeof e && e.split("\n").some(e => -1 !== e.indexOf("(https.js:") || -1 !== e.indexOf("node:https:"));
}
function l(e, t) {
  return new l.Agent(e, t);
}
!function (e) {
  class t extends i.EventEmitter {
    constructor(e, t) {
      super();
      let n = t;
      if ("function" == typeof e) {
        this.callback = e;
      } else {
        if (e) {
          n = e;
        }
      }
      this.timeout = null;
      if (n && "number" == typeof n.timeout) {
        this.timeout = n.timeout;
      }
      this.maxFreeSockets = 1;
      this.maxSockets = 1;
      this.maxTotalSockets = 1 / 0;
      this.sockets = {};
      this.freeSockets = {};
      this.requests = {};
      this.options = {};
    }
    get defaultPort() {
      return "number" == typeof this.explicitDefaultPort ? this.explicitDefaultPort : c() ? 443 : 80;
    }
    set defaultPort(e) {
      this.explicitDefaultPort = e;
    }
    get protocol() {
      return "string" == typeof this.explicitProtocol ? this.explicitProtocol : c() ? "https:" : "http:";
    }
    set protocol(e) {
      this.explicitProtocol = e;
    }
    callback(e, t, n) {
      throw new Error('"agent-base" has no default implementation, you must subclass and override `callback()`');
    }
    addRequest(e, t) {
      const n = Object.assign({}, t);
      if ("boolean" != typeof n.secureEndpoint) {
        n.secureEndpoint = c();
      }
      if (null == n.host) {
        n.host = "localhost";
      }
      if (null == n.port) {
        n.port = n.secureEndpoint ? 443 : 80;
      }
      if (null == n.protocol) {
        n.protocol = n.secureEndpoint ? "https:" : "http:";
      }
      if (n.host && n.path) {
        delete n.path;
      }
      delete n.agent;
      delete n.hostname;
      delete n._defaultAgent;
      delete n.defaultPort;
      delete n.createConnection;
      e._last = !0;
      e.shouldKeepAlive = !1;
      let r = !1;
      let i = null;
      const o = n.timeout || this.timeout;
      const l = t => {
        if (e._hadError) {
          e.emit("error", t);
          e._hadError = !0;
        }
      };
      const u = () => {
        i = null;
        r = !0;
        const e = new Error(`A "socket" was not created for HTTP request before ${o}ms`);
        e.code = "ETIMEOUT";
        l(e);
      };
      const p = e => {
        if (r) {
          if (null !== i) {
            clearTimeout(i);
            i = null;
          }
          l(e);
        }
      };
      const d = t => {
        if (r) return;
        if (null != i) {
          clearTimeout(i);
          i = null;
        }
        o = t;
        if (Boolean(o) && "function" == typeof o.addRequest) return a("Callback returned another Agent instance %o", t.constructor.name), void t.addRequest(e, n);
        var o;
        if (t) {
          t.once("free", () => {
            this.freeSocket(t, n);
          });
          return void e.onSocket(t);
        }
        const s = new Error(`no Duplex stream was returned to agent-base for \`${e.method} ${e.path}\``);
        l(s);
      };
      if ("function" == typeof this.callback) {
        if (this.promisifiedCallback) {
          if (this.callback.length >= 3) {
            a("Converting legacy callback function to promise");
            this.promisifiedCallback = s.default(this.callback);
          } else {
            this.promisifiedCallback = this.callback;
          }
        }
        if ("number" == typeof o && o > 0) {
          i = setTimeout(u, o);
        }
        if ("port" in n && "number" != typeof n.port) {
          n.port = Number(n.port);
        }
        try {
          a("Resolving socket for %o request: %o", n.protocol, `${e.method} ${e.path}`);
          Promise.resolve(this.promisifiedCallback(e, n)).then(d, p);
        } catch (e) {
          Promise.reject(e).catch(p);
        }
      } else l(new Error("`callback` is not defined"));
    }
    freeSocket(e, t) {
      a("Freeing socket %o %o", e.constructor.name, t);
      e.destroy();
    }
    destroy() {
      a("Destroying agent %o", this.constructor.name);
    }
  }
  e.Agent = t;
  e.prototype = e.Agent.prototype;
}(l || (l = {}));
module.exports = l;