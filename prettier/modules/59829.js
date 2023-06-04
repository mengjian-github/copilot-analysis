var r = this && this.__importDefault || function (e) {
  return e && e.__esModule ? e : {
    default: e
  };
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
const i = r(require(15158)).default("https-proxy-agent:parse-proxy-response");
exports.default = function (e) {
  return new Promise((t, n) => {
    let r = 0;
    const o = [];
    function s() {
      const n = e.read();
      if (n) {
        (function (e) {
          o.push(e);
          r += e.length;
          const n = Buffer.concat(o, r);
          if (-1 === n.indexOf("\r\n\r\n")) {
            i("have not received end of HTTP headers yet...");
            return void s();
          }
          const a = n.toString("ascii", 0, n.indexOf("\r\n"));
          const c = +a.split(" ")[1];
          i("got proxy server response: %o", a);
          t({
            statusCode: c,
            buffered: n
          });
        })(n);
      } else {
        e.once("readable", s);
      }
    }
    function a(e) {
      i("onclose had error %o", e);
    }
    function c() {
      i("onend");
    }
    e.on("error", function t(r) {
      e.removeListener("end", c);
      e.removeListener("error", t);
      e.removeListener("close", a);
      e.removeListener("readable", s);
      i("onerror %o", r);
      n(r);
    });
    e.on("close", a);
    e.on("end", c);
    s();
  });
};