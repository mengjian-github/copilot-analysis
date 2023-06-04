var r = this && this.__awaiter || function (e, t, n, r) {
  return new (n || (n = Promise))(function (i, o) {
    function s(e) {
      try {
        c(r.next(e));
      } catch (e) {
        o(e);
      }
    }
    function a(e) {
      try {
        c(r.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function c(e) {
      var t;
      if (e.done) {
        i(e.value);
      } else {
        (t = e.value, t instanceof n ? t : new n(function (e) {
          e(t);
        })).then(s, a);
      }
    }
    c((r = r.apply(e, t || [])).next());
  });
};
var i = this && this.__generator || function (e, t) {
  var n;
  var r;
  var i;
  var o;
  var s = {
    label: 0,
    sent: function () {
      if (1 & i[0]) throw i[1];
      return i[1];
    },
    trys: [],
    ops: []
  };
  o = {
    next: a(0),
    throw: a(1),
    return: a(2)
  };
  if ("function" == typeof Symbol) {
    o[Symbol.iterator] = function () {
      return this;
    };
  }
  return o;
  function a(o) {
    return function (a) {
      return function (o) {
        if (n) throw new TypeError("Generator is already executing.");
        for (; s;) try {
          n = 1;
          if (r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
          switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
            case 0:
            case 1:
              i = o;
              break;
            case 4:
              s.label++;
              return {
                value: o[1],
                done: !1
              };
            case 5:
              s.label++;
              r = o[1];
              o = [0];
              continue;
            case 7:
              o = s.ops.pop();
              s.trys.pop();
              continue;
            default:
              if (!((i = (i = s.trys).length > 0 && i[i.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                s = 0;
                continue;
              }
              if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                s.label = o[1];
                break;
              }
              if (6 === o[0] && s.label < i[1]) {
                s.label = i[1];
                i = o;
                break;
              }
              if (i && s.label < i[2]) {
                s.label = i[2];
                s.ops.push(o);
                break;
              }
              if (i[2]) {
                s.ops.pop();
              }
              s.trys.pop();
              continue;
          }
          o = t.call(e, s);
        } catch (e) {
          o = [6, e];
          r = 0;
        } finally {
          n = i = 0;
        }
        if (5 & o[0]) throw o[1];
        return {
          value: o[0] ? o[1] : void 0,
          done: !0
        };
      }([o, a]);
    };
  }
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FileAccessControl = void 0;
var o = require(57147);
var s = require(22037);
var a = require(32081);
var c = require(95282);
var FileAccessControl = function () {
  function e() {}
  e.checkFileProtection = function () {
    if (!e.OS_PROVIDES_FILE_PROTECTION && !e.OS_FILE_PROTECTION_CHECKED) {
      e.OS_FILE_PROTECTION_CHECKED = !0;
      if (e.USE_ICACLS) {
        try {
          e.OS_PROVIDES_FILE_PROTECTION = o.existsSync(e.ICACLS_PATH);
        } catch (e) {}
        if (e.OS_PROVIDES_FILE_PROTECTION) {
          c.warn(e.TAG, "Could not find ICACLS in expected location! This is necessary to use disk retry mode on Windows.");
        }
      } else e.OS_PROVIDES_FILE_PROTECTION = !0;
    }
  };
  e.applyACLRules = function (t) {
    return r(this, void 0, void 0, function () {
      var n;
      var r;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            if (!e.USE_ICACLS) return [3, 7];
            if (void 0 !== e.ACLED_DIRECTORIES[t]) return [3, 6];
            e.ACLED_DIRECTORIES[t] = !1;
            i.label = 1;
          case 1:
            i.trys.push([1, 4,, 5]);
            return [4, this._getACLIdentity()];
          case 2:
            n = i.sent();
            return [4, this._runICACLS(this._getACLArguments(t, n))];
          case 3:
            i.sent();
            e.ACLED_DIRECTORIES[t] = !0;
            return [3, 5];
          case 4:
            throw r = i.sent(), e.ACLED_DIRECTORIES[t] = !1, r;
          case 5:
            return [3, 7];
          case 6:
            if (!e.ACLED_DIRECTORIES[t]) throw new Error("Setting ACL restrictions did not succeed (cached result)");
            i.label = 7;
          case 7:
            return [2];
        }
      });
    });
  };
  e.applyACLRulesSync = function (t) {
    if (e.USE_ICACLS) {
      if (void 0 === e.ACLED_DIRECTORIES[t]) {
        this._runICACLSSync(this._getACLArguments(t, this._getACLIdentitySync()));
        return void (e.ACLED_DIRECTORIES[t] = !0);
      }
      if (!e.ACLED_DIRECTORIES[t]) throw new Error("Setting ACL restrictions did not succeed (cached result)");
    }
  };
  e._runICACLS = function (t) {
    return new Promise(function (n, r) {
      var i = a.spawn(e.ICACLS_PATH, t, {
        windowsHide: !0
      });
      i.on("error", function (e) {
        return r(e);
      });
      i.on("close", function (e, t) {
        if (0 === e) {
          n();
        } else {
          r(new Error("Setting ACL restrictions did not succeed (ICACLS returned code " + e + ")"));
        }
      });
    });
  };
  e._runICACLSSync = function (t) {
    if (!a.spawnSync) throw new Error("Could not synchronously call ICACLS under current version of Node.js");
    var n = a.spawnSync(e.ICACLS_PATH, t, {
      windowsHide: !0
    });
    if (n.error) throw n.error;
    if (0 !== n.status) throw new Error("Setting ACL restrictions did not succeed (ICACLS returned code " + n.status + ")");
  };
  e._getACLIdentity = function () {
    return new Promise(function (t, n) {
      if (e.ACL_IDENTITY) {
        t(e.ACL_IDENTITY);
      }
      var r = a.spawn(e.POWERSHELL_PATH, ["-Command", "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name"], {
        windowsHide: !0,
        stdio: ["ignore", "pipe", "pipe"]
      });
      var i = "";
      r.stdout.on("data", function (e) {
        return i += e;
      });
      r.on("error", function (e) {
        return n(e);
      });
      r.on("close", function (r, o) {
        e.ACL_IDENTITY = i && i.trim();
        if (0 === r) {
          t(e.ACL_IDENTITY);
        } else {
          n(new Error("Getting ACL identity did not succeed (PS returned code " + r + ")"));
        }
      });
    });
  };
  e._getACLIdentitySync = function () {
    if (e.ACL_IDENTITY) return e.ACL_IDENTITY;
    if (a.spawnSync) {
      var t = a.spawnSync(e.POWERSHELL_PATH, ["-Command", "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name"], {
        windowsHide: !0,
        stdio: ["ignore", "pipe", "pipe"]
      });
      if (t.error) throw t.error;
      if (0 !== t.status) throw new Error("Getting ACL identity did not succeed (PS returned code " + t.status + ")");
      e.ACL_IDENTITY = t.stdout && t.stdout.toString().trim();
      return e.ACL_IDENTITY;
    }
    throw new Error("Could not synchronously get ACL identity under current version of Node.js");
  };
  e._getACLArguments = function (e, t) {
    return [e, "/grant", "*S-1-5-32-544:(OI)(CI)F", "/grant", t + ":(OI)(CI)F", "/inheritance:r"];
  };
  e.TAG = "FileAccessControl";
  e.ICACLS_PATH = process.env.systemdrive + "/windows/system32/icacls.exe";
  e.POWERSHELL_PATH = process.env.systemdrive + "/windows/system32/windowspowershell/v1.0/powershell.exe";
  e.ACLED_DIRECTORIES = {};
  e.ACL_IDENTITY = null;
  e.OS_FILE_PROTECTION_CHECKED = !1;
  e.OS_PROVIDES_FILE_PROTECTION = !1;
  e.USE_ICACLS = "Windows_NT" === s.type();
  return e;
}();
exports.FileAccessControl = FileAccessControl;