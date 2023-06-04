Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.FormattedDocument = void 0;
const r = require(91465);
const i = "### File References\n\n";
const o = "### License Summary\n\n";
function s(e) {
  return `## ${r.CodeQuoteFeatureName} matches for ${e}\n\n<sub><sup>_Matches will be tracked with their appromixate line numbers below. As changes are made to the file, these references may become inaccurate. Matches will not persist when a file is closed._</sup></sub>`;
}
function a(e) {
  const {
    nwo: t,
    license: n,
    url: r
  } = e;
  return `| [${t}](${r}) | ${(i = n, "NOASSERTION" === i ? "Unknown license" : i)} | \n`;
  var i;
}
function c(e, t, n) {
  return null === n ? `${i} Fetching file references...` : 0 === n ? `${i} Error fetching file references.` : `${i}${(r = e.length, o = n, r < 50 || r === o ? "" : "These links constitute of representative sample of license types, not a complete list of references.\n\n")}${function (e, t) {
    const n = e.reduce((e, t) => (e[t.license] ? e[t.license].push(t) : e[t.license] = [t], e), {});
    return `| Match Location | Repo License | \n| --- | --- | \n${t.flatMap(([e, t]) => n[e].slice(0, t.adjusted)).map(a).join("")}`;
  }(e, t)}`;
  var r;
  var o;
}
exports.FormattedDocument = {
  create: (e, t) => Array.from(t).reduce((e, t) => {
    if (t.deletedAt) return e;
    const n = t.completion;
    t.snippets.forEach(t => {
      const {
        sortedTotals: r,
        totalLicenses: i
      } = function (e) {
        if (!e) return {
          sortedTotals: [],
          totalLicenses: null
        };
        const {
          count: t
        } = e;
        const n = Object.values(t).reduce((e, t) => e + Number(t), 0);
        const r = {};
        let i = 0;
        for (const [e, s] of Object.entries(t)) {
          const t = Number(s) / n;
          const a = (o = Math.round(50 * t)) < 1 ? 1 : o;
          i += a;
          r[e] = {
            raw: Number(s),
            adjusted: a
          };
        }
        var o;
        const s = Object.entries(r).sort((e, t) => t[1].raw - e[1].raw);
        let a = 0;
        let c = i - 50;
        for (; c > 0;) {
          if (a > s.length - 1 || 1 === s[a][1].adjusted) {
            a = 0;
          }
          c -= 1;
          s[a][1].adjusted -= 1;
          a += 1;
        }
        return {
          sortedTotals: s,
          totalLicenses: n
        };
      }(t.licenseStats);
      var s;
      var a;
      var l;
      var u;
      var p;
      var d;
      var h;
      var f;
      e.push([(p = n.position.line, `### Match\n\n<sub>originally detected at line ${p + 1}</sub>\n\n`), (l = t.match.occurrences, u = t.match.capped, u ? `\n<sub>We are currently sampling only the first ${Number(l).toLocaleString()} matches to public code, but we have detected more.</sub>\n\n` : ""), (s = n.telemetry.properties.languageId, a = t.match.matched_source, `Matched content:\n\n\n\n\`\`\`${s}\n${a}\n\`\`\`\n`), (d = r, h = i, 0 === h ? `${o} Error fetching licenses.` : null === h ? `${o} Fetching license data...` : `${o} This snippet matches ${h} reference${1 === h ? "" : "s"} to public code. Below, you can find links to a sample of 50 of these references.\n\n ${(f = d, f.map(([e, t]) => `* ${e} (${t.raw})`).join("\n"))}`), c(t.files, r, i)].join("\n\n"));
    });
    return e;
  }, [s(e)]).join("\n\n\n***\n\n\n")
};