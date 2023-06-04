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
exports.getShallowFileSize = exports.getShallowDirectorySizeSync = exports.getShallowDirectorySize = exports.confirmDirExists = exports.unlinkAsync = exports.readdirAsync = exports.readFileAsync = exports.writeFileAsync = exports.appendFileAsync = exports.accessAsync = exports.mkdirAsync = exports.lstatAsync = exports.statAsync = void 0;
var o = require(57147);
var s = require(71017);
var a = require(73837);
exports.statAsync = a.promisify(o.stat);
exports.lstatAsync = a.promisify(o.lstat);
exports.mkdirAsync = a.promisify(o.mkdir);
exports.accessAsync = a.promisify(o.access);
exports.appendFileAsync = a.promisify(o.appendFile);
exports.writeFileAsync = a.promisify(o.writeFile);
exports.readFileAsync = a.promisify(o.readFile);
exports.readdirAsync = a.promisify(o.readdir);
exports.unlinkAsync = a.promisify(o.unlink);
exports.confirmDirExists = function (e) {
  return r(void 0, void 0, void 0, function () {
    var n;
    var r;
    return i(this, function (i) {
      switch (i.label) {
        case 0:
          i.trys.push([0, 2,, 7]);
          return [4, exports.lstatAsync(e)];
        case 1:
          if (!i.sent().isDirectory()) throw new Error("Path existed but was not a directory");
          return [3, 7];
        case 2:
          if (!(n = i.sent()) || "ENOENT" !== n.code) return [3, 6];
          i.label = 3;
        case 3:
          i.trys.push([3, 5,, 6]);
          return [4, exports.mkdirAsync(e)];
        case 4:
          i.sent();
          return [3, 6];
        case 5:
          if ((r = i.sent()) && "EEXIST" !== r.code) throw r;
          return [3, 6];
        case 6:
          return [3, 7];
        case 7:
          return [2];
      }
    });
  });
};
exports.getShallowDirectorySize = function (e) {
  return r(void 0, void 0, void 0, function () {
    var n;
    var r;
    var o;
    var a;
    var c;
    var l;
    return i(this, function (i) {
      switch (i.label) {
        case 0:
          return [4, exports.readdirAsync(e)];
        case 1:
          n = i.sent();
          r = 0;
          o = 0;
          a = n;
          i.label = 2;
        case 2:
          return o < a.length ? (c = a[o], [4, exports.statAsync(s.join(e, c))]) : [3, 5];
        case 3:
          if ((l = i.sent()).isFile()) {
            r += l.size;
          }
          i.label = 4;
        case 4:
          o++;
          return [3, 2];
        case 5:
          return [2, r];
      }
    });
  });
};
exports.getShallowDirectorySizeSync = function (e) {
  for (t = o.readdirSync(e), n = 0, r = 0, void 0; r < t.length; r++) {
    var t;
    var n;
    var r;
    n += o.statSync(s.join(e, t[r])).size;
  }
  return n;
};
exports.getShallowFileSize = function (e) {
  return r(void 0, void 0, void 0, function () {
    var n;
    return i(this, function (r) {
      switch (r.label) {
        case 0:
          return [4, exports.statAsync(e)];
        case 1:
          return (n = r.sent()).isFile() ? [2, n.size] : [2];
      }
    });
  });
};