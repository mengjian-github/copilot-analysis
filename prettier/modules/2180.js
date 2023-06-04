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
const o = require(6647);
const s = require(1152);
const a = require(3469);
a.registerLanguageSpecificParser("markdown", s.processMarkdown);
a.registerLanguageSpecificParser("java", o.processJava);
i(require(4876), exports);
i(require(3059), exports);
i(require(8617), exports);
i(require(3469), exports);