var r = require(3832);
require(97116);
var i = module.exports = r.pem = r.pem || {};
function o(e) {
  for (t = e.name + ": ", n = [], r = function (e, t) {
    return " " + t;
  }, i = 0, void 0; i < e.values.length; ++i) {
    var t;
    var n;
    var r;
    var i;
    n.push(e.values[i].replace(/^(\S+\r\n)/, r));
  }
  t += n.join(",") + "\r\n";
  var o = 0;
  var s = -1;
  for (i = 0; i < t.length; ++i, ++o) if (o > 65 && -1 !== s) {
    var a = t[s];
    if ("," === a) {
      ++s;
      t = t.substr(0, s) + "\r\n " + t.substr(s);
    } else {
      t = t.substr(0, s) + "\r\n" + a + t.substr(s + 1);
    }
    o = i - s - 1;
    s = -1;
    ++i;
  } else if (" " !== t[i] && "\t" !== t[i] && "," !== t[i]) {
    s = i;
  }
  return t;
}
function s(e) {
  return e.replace(/^\s+/, "");
}
i.encode = function (e, t) {
  t = t || {};
  var n;
  var i = "-----BEGIN " + e.type + "-----\r\n";
  if (e.procType) {
    i += o(n = {
      name: "Proc-Type",
      values: [String(e.procType.version), e.procType.type]
    });
  }
  if (e.contentDomain) {
    i += o(n = {
      name: "Content-Domain",
      values: [e.contentDomain]
    });
  }
  if (e.dekInfo) {
    n = {
      name: "DEK-Info",
      values: [e.dekInfo.algorithm]
    };
    if (e.dekInfo.parameters) {
      n.values.push(e.dekInfo.parameters);
    }
    i += o(n);
  }
  if (e.headers) for (var s = 0; s < e.headers.length; ++s) i += o(e.headers[s]);
  if (e.procType) {
    i += "\r\n";
  }
  return (i += r.util.encode64(e.body, t.maxline || 64) + "\r\n") + "-----END " + e.type + "-----\r\n";
};
i.decode = function (e) {
  for (n = [], i = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g, o = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/, a = /\r?\n/, void 0; t = i.exec(e);) {
    var t;
    var n;
    var i;
    var o;
    var a;
    var c = t[1];
    if ("NEW CERTIFICATE REQUEST" === c) {
      c = "CERTIFICATE REQUEST";
    }
    var l = {
      type: c,
      procType: null,
      contentDomain: null,
      dekInfo: null,
      headers: [],
      body: r.util.decode64(t[3])
    };
    n.push(l);
    if (t[2]) {
      for (var u = t[2].split(a), p = 0; t && p < u.length;) {
        for (var d = u[p].replace(/\s+$/, ""), h = p + 1; h < u.length; ++h) {
          var f = u[h];
          if (!/\s/.test(f[0])) break;
          d += f, p = h;
        }
        if (t = d.match(o)) {
          for (var m = {
              name: t[1],
              values: []
            }, g = t[2].split(","), y = 0; y < g.length; ++y) m.values.push(s(g[y]));
          if (l.procType) {
            if (l.contentDomain || "Content-Domain" !== m.name) {
              if (l.dekInfo || "DEK-Info" !== m.name) l.headers.push(m);else {
                if (0 === m.values.length) throw new Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.');
                l.dekInfo = {
                  algorithm: g[0],
                  parameters: g[1] || null
                };
              }
            } else l.contentDomain = g[0] || "";
          } else {
            if ("Proc-Type" !== m.name) throw new Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".');
            if (2 !== m.values.length) throw new Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.');
            l.procType = {
              version: g[0],
              type: g[1]
            };
          }
        }
        ++p;
      }
      if ("ENCRYPTED" === l.procType && !l.dekInfo) throw new Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".');
    }
  }
  if (0 === n.length) throw new Error("Invalid PEM formatted message.");
  return n;
};