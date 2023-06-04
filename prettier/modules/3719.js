Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.parsePatch = function (e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
  var n = e.split(/\r\n|[\n\v\f\r\x85]/);
  var r = e.match(/\r\n|[\n\v\f\r\x85]/g) || [];
  var i = [];
  var o = 0;
  function s() {
    var e = {};
    for (i.push(e); o < n.length;) {
      var r = n[o];
      if (/^(\-\-\-|\+\+\+|@@)\s/.test(r)) break;
      var s = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(r);
      if (s) {
        e.index = s[1];
      }
      o++;
    }
    for (a(e), a(e), e.hunks = []; o < n.length;) {
      var l = n[o];
      if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(l)) break;
      if (/^@@/.test(l)) e.hunks.push(c());else {
        if (l && t.strict) throw new Error("Unknown line " + (o + 1) + " " + JSON.stringify(l));
        o++;
      }
    }
  }
  function a(e) {
    var t = /^(---|\+\+\+)\s+(.*)$/.exec(n[o]);
    if (t) {
      var r = "---" === t[1] ? "old" : "new";
      var i = t[2].split("\t", 2);
      var s = i[0].replace(/\\\\/g, "\\");
      if (/^".*"$/.test(s)) {
        s = s.substr(1, s.length - 2);
      }
      e[r + "FileName"] = s;
      e[r + "Header"] = (i[1] || "").trim();
      o++;
    }
  }
  function c() {
    var e = o;
    var i = n[o++].split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    var s = {
      oldStart: +i[1],
      oldLines: void 0 === i[2] ? 1 : +i[2],
      newStart: +i[3],
      newLines: void 0 === i[4] ? 1 : +i[4],
      lines: [],
      linedelimiters: []
    };
    if (0 === s.oldLines) {
      s.oldStart += 1;
    }
    if (0 === s.newLines) {
      s.newStart += 1;
    }
    for (a = 0, c = 0, void 0; o < n.length && !(0 === n[o].indexOf("--- ") && o + 2 < n.length && 0 === n[o + 1].indexOf("+++ ") && 0 === n[o + 2].indexOf("@@")); o++) {
      var a;
      var c;
      var l = 0 == n[o].length && o != n.length - 1 ? " " : n[o][0];
      if ("+" !== l && "-" !== l && " " !== l && "\\" !== l) break;
      s.lines.push(n[o]);
      s.linedelimiters.push(r[o] || "\n");
      if ("+" === l) {
        a++;
      } else {
        if ("-" === l) {
          c++;
        } else {
          if (" " === l) {
            a++;
            c++;
          }
        }
      }
    }
    if (a || 1 !== s.newLines) {
      s.newLines = 0;
    }
    if (c || 1 !== s.oldLines) {
      s.oldLines = 0;
    }
    if (t.strict) {
      if (a !== s.newLines) throw new Error("Added line count did not match for hunk at line " + (e + 1));
      if (c !== s.oldLines) throw new Error("Removed line count did not match for hunk at line " + (e + 1));
    }
    return s;
  }
  for (; o < n.length;) s();
  return i;
};