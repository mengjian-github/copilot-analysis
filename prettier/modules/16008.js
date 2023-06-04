var r = require(72337);
module.exports = function (e) {
  var t = {
    protocols: [],
    protocol: null,
    port: null,
    resource: "",
    host: "",
    user: "",
    password: "",
    pathname: "",
    hash: "",
    search: "",
    href: e,
    query: {},
    parse_failed: !1
  };
  try {
    var n = new URL(e);
    t.protocols = r(n);
    t.protocol = t.protocols[0];
    t.port = n.port;
    t.resource = n.hostname;
    t.host = n.host;
    t.user = n.username || "";
    t.password = n.password || "";
    t.pathname = n.pathname;
    t.hash = n.hash.slice(1);
    t.search = n.search.slice(1);
    t.href = n.href;
    t.query = Object.fromEntries(n.searchParams);
  } catch (n) {
    t.protocols = ["file"];
    t.protocol = t.protocols[0];
    t.port = "";
    t.resource = "";
    t.user = "";
    t.pathname = "";
    t.hash = "";
    t.search = "";
    t.href = e;
    t.query = {};
    t.parse_failed = !0;
  }
  return t;
};