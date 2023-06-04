var r = require(39266);
function i(e) {
  if ("string" != typeof e) throw new Error("The url must be a string.");
  if (/^([a-z\d-]{1,39})\/([-\.\w]{1,100})$/i.test(e)) {
    e = "https://github.com/" + e;
  }
  var t = r(e);
  var n = t.resource.split(".");
  var o = null;
  switch (t.toString = function (e) {
    return i.stringify(this, e);
  }, t.source = n.length > 2 ? n.slice(1 - n.length).join(".") : t.source = t.resource, t.git_suffix = /\.git$/.test(t.pathname), t.name = decodeURIComponent((t.pathname || t.href).replace(/(^\/)|(\/$)/g, "").replace(/\.git$/, "")), t.owner = decodeURIComponent(t.user), t.source) {
    case "git.cloudforge.com":
      t.owner = t.user;
      t.organization = n[0];
      t.source = "cloudforge.com";
      break;
    case "visualstudio.com":
      if ("vs-ssh.visualstudio.com" === t.resource) {
        if (4 === (o = t.name.split("/")).length) {
          t.organization = o[1];
          t.owner = o[2];
          t.name = o[3];
          t.full_name = o[2] + "/" + o[3];
        }
        break;
      }
      if (2 === (o = t.name.split("/")).length) {
        t.owner = o[1];
        t.name = o[1];
        t.full_name = "_git/" + t.name;
      } else {
        if (3 === o.length) {
          t.name = o[2];
          if ("DefaultCollection" === o[0]) {
            t.owner = o[2];
            t.organization = o[0];
            t.full_name = t.organization + "/_git/" + t.name;
          } else {
            t.owner = o[0];
            t.full_name = t.owner + "/_git/" + t.name;
          }
        } else {
          if (4 === o.length) {
            t.organization = o[0];
            t.owner = o[1];
            t.name = o[3];
            t.full_name = t.organization + "/" + t.owner + "/_git/" + t.name;
          }
        }
      }
      break;
    case "dev.azure.com":
    case "azure.com":
      if ("ssh.dev.azure.com" === t.resource) {
        if (4 === (o = t.name.split("/")).length) {
          t.organization = o[1];
          t.owner = o[2];
          t.name = o[3];
        }
        break;
      }
      if (5 === (o = t.name.split("/")).length) {
        t.organization = o[0];
        t.owner = o[1];
        t.name = o[4];
        t.full_name = "_git/" + t.name;
      } else {
        if (3 === o.length) {
          t.name = o[2];
          if ("DefaultCollection" === o[0]) {
            t.owner = o[2];
            t.organization = o[0];
            t.full_name = t.organization + "/_git/" + t.name;
          } else {
            t.owner = o[0];
            t.full_name = t.owner + "/_git/" + t.name;
          }
        } else {
          if (4 === o.length) {
            t.organization = o[0];
            t.owner = o[1];
            t.name = o[3];
            t.full_name = t.organization + "/" + t.owner + "/_git/" + t.name;
          }
        }
      }
      if (t.query && t.query.path) {
        t.filepath = t.query.path.replace(/^\/+/g, "");
      }
      if (t.query && t.query.version) {
        t.ref = t.query.version.replace(/^GB/, "");
      }
      break;
    default:
      var s = (o = t.name.split("/")).length - 1;
      if (o.length >= 2) {
        var a = o.indexOf("-", 2);
        var c = o.indexOf("blob", 2);
        var l = o.indexOf("tree", 2);
        var u = o.indexOf("commit", 2);
        var p = o.indexOf("src", 2);
        var d = o.indexOf("raw", 2);
        var h = o.indexOf("edit", 2);
        s = a > 0 ? a - 1 : c > 0 ? c - 1 : l > 0 ? l - 1 : u > 0 ? u - 1 : p > 0 ? p - 1 : d > 0 ? d - 1 : h > 0 ? h - 1 : s;
        t.owner = o.slice(0, s).join("/");
        t.name = o[s];
        if (u) {
          t.commit = o[s + 2];
        }
      }
      t.ref = "";
      t.filepathtype = "";
      t.filepath = "";
      var f = o.length > s && "-" === o[s + 1] ? s + 1 : s;
      if (o.length > f + 2 && ["raw", "src", "blob", "tree", "edit"].indexOf(o[f + 1]) >= 0) {
        t.filepathtype = o[f + 1];
        t.ref = o[f + 2];
        if (o.length > f + 3) {
          t.filepath = o.slice(f + 3).join("/");
        }
      }
      t.organization = t.owner;
  }
  if (t.full_name) {
    t.full_name = t.owner;
    if (t.name) {
      if (t.full_name) {
        t.full_name += "/";
      }
      t.full_name += t.name;
    }
  }
  if (t.owner.startsWith("scm/")) {
    t.source = "bitbucket-server";
    t.owner = t.owner.replace("scm/", "");
    t.organization = t.owner;
    t.full_name = t.owner + "/" + t.name;
  }
  var m = /(projects|users)\/(.*?)\/repos\/(.*?)((\/.*$)|$)/.exec(t.pathname);
  if (null != m) {
    t.source = "bitbucket-server";
    if ("users" === m[1]) {
      t.owner = "~" + m[2];
    } else {
      t.owner = m[2];
    }
    t.organization = t.owner;
    t.name = m[3];
    if ((o = m[4].split("/")).length > 1) {
      if (["raw", "browse"].indexOf(o[1]) >= 0) {
        t.filepathtype = o[1];
        if (o.length > 2) {
          t.filepath = o.slice(2).join("/");
        }
      } else {
        if ("commits" === o[1] && o.length > 2) {
          t.commit = o[2];
        }
      }
    }
    t.full_name = t.owner + "/" + t.name;
    if (t.query.at) {
      t.ref = t.query.at;
    } else {
      t.ref = "";
    }
  }
  return t;
}
i.stringify = function (e, t) {
  t = t || (e.protocols && e.protocols.length ? e.protocols.join("+") : e.protocol);
  var n = e.port ? ":" + e.port : "";
  var r = e.user || "git";
  var i = e.git_suffix ? ".git" : "";
  switch (t) {
    case "ssh":
      return n ? "ssh://" + r + "@" + e.resource + n + "/" + e.full_name + i : r + "@" + e.resource + ":" + e.full_name + i;
    case "git+ssh":
    case "ssh+git":
    case "ftp":
    case "ftps":
      return t + "://" + r + "@" + e.resource + n + "/" + e.full_name + i;
    case "http":
    case "https":
      return t + "://" + (e.token ? function (e) {
        return "bitbucket.org" === e.source ? "x-token-auth:" + e.token + "@" : e.token + "@";
      }(e) : e.user && (e.protocols.includes("http") || e.protocols.includes("https")) ? e.user + "@" : "") + e.resource + n + "/" + function (e) {
        return "bitbucket-server" === e.source ? "scm/" + e.full_name : "" + e.full_name;
      }(e) + i;
    default:
      return e.href;
  }
};
module.exports = i;