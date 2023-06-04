var r = this && this.__createBinding || (Object.create ? function (e, t, n, r) {
  if (void 0 === r) {
    r = n;
  }
  var i = Object.getOwnPropertyDescriptor(t, n);
  if (i && !("get" in i ? !t.__esModule : i.writable || i.configurable)) {
    i = {
      enumerable: !0,
      get: function () {
        return t[n];
      }
    };
  }
  Object.defineProperty(e, r, i);
} : function (e, t, n, r) {
  if (void 0 === r) {
    r = n;
  }
  e[r] = t[n];
});
var i = this && this.__exportStar || function (e, t) {
  for (var n in e) if ("default" === n || Object.prototype.hasOwnProperty.call(t, n)) {
    r(t, e, n);
  }
};
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.createWorker = exports.SnippetSemantics = exports.SnippetProvider = exports.NeighboringTabsOption = exports.NeighboringSnippetType = exports.getCursorContext = exports.languageCommentMarkers = exports.commentBlockAsSingles = exports.comment = exports.FileSystem = void 0;
const o = require(1017);
const s = require(1267);
i(require(3346), exports);
var a = require(2271);
Object.defineProperty(exports, "FileSystem", {
  enumerable: !0,
  get: function () {
    return a.FileSystem;
  }
});
i(require(2180), exports);
var c = require(2417);
Object.defineProperty(exports, "comment", {
  enumerable: !0,
  get: function () {
    return c.comment;
  }
});
Object.defineProperty(exports, "commentBlockAsSingles", {
  enumerable: !0,
  get: function () {
    return c.commentBlockAsSingles;
  }
});
Object.defineProperty(exports, "languageCommentMarkers", {
  enumerable: !0,
  get: function () {
    return c.languageCommentMarkers;
  }
});
i(require(8306), exports);
i(require(9610), exports);
i(require(8312), exports);
var l = require(648);
Object.defineProperty(exports, "getCursorContext", {
  enumerable: !0,
  get: function () {
    return l.getCursorContext;
  }
});
i(require(6845), exports);
var u = require(9125);
Object.defineProperty(exports, "NeighboringSnippetType", {
  enumerable: !0,
  get: function () {
    return u.NeighboringSnippetType;
  }
});
Object.defineProperty(exports, "NeighboringTabsOption", {
  enumerable: !0,
  get: function () {
    return u.NeighboringTabsOption;
  }
});
var p = require(4830);
Object.defineProperty(exports, "SnippetProvider", {
  enumerable: !0,
  get: function () {
    return p.SnippetProvider;
  }
});
Object.defineProperty(exports, "SnippetSemantics", {
  enumerable: !0,
  get: function () {
    return p.SnippetSemantics;
  }
});
i(require(1145), exports);
exports.createWorker = function () {
  return new s.Worker(o.resolve(__dirname, "..", "dist", "worker.js"));
};