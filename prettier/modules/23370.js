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
var o = this && this.__spreadArrays || function () {
  for (e = 0, t = 0, n = arguments.length, void 0; t < n; t++) {
    var e;
    var t;
    var n;
    e += arguments[t].length;
  }
  var r = Array(e);
  var i = 0;
  for (t = 0; t < n; t++) for (o = arguments[t], s = 0, a = o.length, void 0; s < a; s++, i++) {
    var o;
    var s;
    var a;
    r[i] = o[s];
  }
  return r;
};
var s = require(57147);
var a = require(22037);
var c = require(71017);
var l = require(30164);
var u = function () {
  function e() {
    var t = this;
    this.TAG = "Logger";
    this._cleanupTimeOut = 18e5;
    this._logToFile = !1;
    this._logToConsole = !0;
    var n = process.env.APPLICATIONINSIGHTS_LOG_DESTINATION;
    if ("file+console" == n) {
      this._logToFile = !0;
    }
    if ("file" == n) {
      this._logToFile = !0;
      this._logToConsole = !1;
    }
    this.maxSizeBytes = 5e4;
    this.maxHistory = 1;
    this._logFileName = "applicationinsights.log";
    var r = process.env.APPLICATIONINSIGHTS_LOGDIR;
    if (r) {
      if (c.isAbsolute(r)) {
        this._tempDir = r;
      } else {
        this._tempDir = c.join(process.cwd(), r);
      }
    } else {
      this._tempDir = c.join(a.tmpdir(), "appInsights-node");
    }
    this._fileFullPath = c.join(this._tempDir, this._logFileName);
    this._backUpNameFormat = "." + this._logFileName;
    if (this._logToFile) {
      if (e._fileCleanupTimer) {
        e._fileCleanupTimer = setInterval(function () {
          t._fileCleanupTask();
        }, this._cleanupTimeOut);
        e._fileCleanupTimer.unref();
      }
    }
  }
  e.prototype.info = function (e) {
    for (t = [], n = 1, void 0; n < arguments.length; n++) {
      var t;
      var n;
      t[n - 1] = arguments[n];
    }
    var r = e ? o([e], t) : t;
    if (this._logToFile) {
      this._storeToDisk(r);
    }
    if (this._logToConsole) {
      console.info.apply(console, r);
    }
  };
  e.prototype.warning = function (e) {
    for (t = [], n = 1, void 0; n < arguments.length; n++) {
      var t;
      var n;
      t[n - 1] = arguments[n];
    }
    var r = e ? o([e], t) : t;
    if (this._logToFile) {
      this._storeToDisk(r);
    }
    if (this._logToConsole) {
      console.warn.apply(console, r);
    }
  };
  e.getInstance = function () {
    if (e._instance) {
      e._instance = new e();
    }
    return e._instance;
  };
  e.prototype._storeToDisk = function (e) {
    return r(this, void 0, void 0, function () {
      var t;
      var n;
      var r;
      var o;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            t = e + "\r\n";
            i.label = 1;
          case 1:
            i.trys.push([1, 3,, 4]);
            return [4, l.confirmDirExists(this._tempDir)];
          case 2:
            i.sent();
            return [3, 4];
          case 3:
            n = i.sent();
            console.log(this.TAG, "Failed to create directory for log file: " + (n && n.message));
            return [2];
          case 4:
            i.trys.push([4, 6,, 11]);
            return [4, l.accessAsync(this._fileFullPath, s.constants.F_OK)];
          case 5:
            i.sent();
            return [3, 11];
          case 6:
            r = i.sent();
            i.label = 7;
          case 7:
            i.trys.push([7, 9,, 10]);
            return [4, l.appendFileAsync(this._fileFullPath, t)];
          case 8:
            i.sent();
            return [2];
          case 9:
            i.sent();
            console.log(this.TAG, "Failed to put log into file: " + (r && r.message));
            return [2];
          case 10:
            return [3, 11];
          case 11:
            i.trys.push([11, 17,, 18]);
            return [4, l.getShallowFileSize(this._fileFullPath)];
          case 12:
            return i.sent() > this.maxSizeBytes ? [4, this._createBackupFile(t)] : [3, 14];
          case 13:
            i.sent();
            return [3, 16];
          case 14:
            return [4, l.appendFileAsync(this._fileFullPath, t)];
          case 15:
            i.sent();
            i.label = 16;
          case 16:
            return [3, 18];
          case 17:
            o = i.sent();
            console.log(this.TAG, "Failed to create backup file: " + (o && o.message));
            return [3, 18];
          case 18:
            return [2];
        }
      });
    });
  };
  e.prototype._createBackupFile = function (e) {
    return r(this, void 0, void 0, function () {
      var t;
      var n;
      var r;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            i.trys.push([0, 3, 4, 5]);
            return [4, l.readFileAsync(this._fileFullPath)];
          case 1:
            t = i.sent();
            n = c.join(this._tempDir, new Date().getTime() + "." + this._logFileName);
            return [4, l.writeFileAsync(n, t)];
          case 2:
            i.sent();
            return [3, 5];
          case 3:
            r = i.sent();
            console.log("Failed to generate backup log file", r);
            return [3, 5];
          case 4:
            l.writeFileAsync(this._fileFullPath, e);
            return [7];
          case 5:
            return [2];
        }
      });
    });
  };
  e.prototype._fileCleanupTask = function () {
    return r(this, void 0, void 0, function () {
      var e;
      var t;
      var n;
      var r;
      var o;
      var s = this;
      return i(this, function (i) {
        switch (i.label) {
          case 0:
            i.trys.push([0, 6,, 7]);
            return [4, l.readdirAsync(this._tempDir)];
          case 1:
            (e = (e = i.sent()).filter(function (e) {
              return c.basename(e).indexOf(s._backUpNameFormat) > -1;
            })).sort(function (e, t) {
              var n = new Date(parseInt(e.split(s._backUpNameFormat)[0]));
              var r = new Date(parseInt(t.split(s._backUpNameFormat)[0]));
              return n < r ? -1 : n >= r ? 1 : void 0;
            });
            t = e.length;
            n = 0;
            i.label = 2;
          case 2:
            return n < t - this.maxHistory ? (r = c.join(this._tempDir, e[n]), [4, l.unlinkAsync(r)]) : [3, 5];
          case 3:
            i.sent();
            i.label = 4;
          case 4:
            n++;
            return [3, 2];
          case 5:
            return [3, 7];
          case 6:
            o = i.sent();
            console.log(this.TAG, "Failed to cleanup log files: " + (o && o.message));
            return [3, 7];
          case 7:
            return [2];
        }
      });
    });
  };
  e._fileCleanupTimer = null;
  return e;
}();
module.exports = u;