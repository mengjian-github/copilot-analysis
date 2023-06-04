const r = require(71017);
const i = require(32081);
const {
  promises: o,
  constants: s
} = require(57147);
const a = require(82818);
const c = require(41595);
const l = require(1906);
const u = r.join(__dirname, "xdg-open");
const {
  platform: p,
  arch: d
} = process;
let h;
const f = (() => {
  const e = "/mnt/";
  let t;
  return async function () {
    if (t) return t;
    const n = "/etc/wsl.conf";
    let r = !1;
    try {
      await o.access(n, s.F_OK);
      r = !0;
    } catch {}
    if (!r) return e;
    const i = await o.readFile(n, {
      encoding: "utf8"
    });
    const a = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(i);
    return a ? (t = a.groups.mountPoint.trim(), t = t.endsWith("/") ? t : `${t}/`, t) : e;
  };
})();
const m = async (e, t) => {
  let n;
  for (const r of e) try {
    return await t(r);
  } catch (e) {
    n = e;
  }
  throw n;
};
const g = async e => {
  e = {
    wait: !1,
    background: !1,
    newInstance: !1,
    allowNonzeroExitCode: !1,
    ...e
  };
  if (Array.isArray(e.app)) return m(e.app, t => g({
    ...e,
    app: t
  }));
  let t;
  let {
    name: n,
    arguments: r = []
  } = e.app || {};
  r = [...r];
  if (Array.isArray(n)) return m(n, t => g({
    ...e,
    app: {
      name: t,
      arguments: r
    }
  }));
  const l = [];
  const d = {};
  if ("darwin" === p) {
    t = "open";
    if (e.wait) {
      l.push("--wait-apps");
    }
    if (e.background) {
      l.push("--background");
    }
    if (e.newInstance) {
      l.push("--new");
    }
    if (n) {
      l.push("-a", n);
    }
  } else if ("win32" === p || a && (void 0 === h && (h = (() => {
    try {
      o.statSync("/run/.containerenv");
      return !0;
    } catch {
      return !1;
    }
  })() || c()), !h) && !n) {
    const i = await f();
    t = a ? `${i}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` : `${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;
    l.push("-NoProfile", "-NonInteractive", "–ExecutionPolicy", "Bypass", "-EncodedCommand");
    if (a) {
      d.windowsVerbatimArguments = !0;
    }
    const o = ["Start"];
    if (e.wait) {
      o.push("-Wait");
    }
    if (n) {
      o.push(`"\`"${n}\`""`, "-ArgumentList");
      if (e.target) {
        r.unshift(e.target);
      }
    } else {
      if (e.target) {
        o.push(`"${e.target}"`);
      }
    }
    if (r.length > 0) {
      r = r.map(e => `"\`"${e}\`""`);
      o.push(r.join(","));
    }
    e.target = Buffer.from(o.join(" "), "utf16le").toString("base64");
  } else {
    if (n) t = n;else {
      const e = "/" === __dirname;
      let n = !1;
      try {
        await o.access(u, s.X_OK);
        n = !0;
      } catch {}
      t = process.versions.electron || "android" === p || e || !n ? "xdg-open" : u;
    }
    if (r.length > 0) {
      l.push(...r);
    }
    if (e.wait) {
      d.stdio = "ignore";
      d.detached = !0;
    }
  }
  if (e.target) {
    l.push(e.target);
  }
  if ("darwin" === p && r.length > 0) {
    l.push("--args", ...r);
  }
  const y = i.spawn(t, l, d);
  return e.wait ? new Promise((t, n) => {
    y.once("error", n);
    y.once("close", r => {
      if (!e.allowNonzeroExitCode && r > 0) {
        n(new Error(`Exited with code ${r}`));
      } else {
        t(y);
      }
    });
  }) : (y.unref(), y);
};
const y = (e, t) => {
  if ("string" != typeof e) throw new TypeError("Expected a `target`");
  return g({
    ...t,
    target: e
  });
};
function _(e) {
  if ("string" == typeof e || Array.isArray(e)) return e;
  const {
    [d]: t
  } = e;
  if (!t) throw new Error(`${d} is not supported`);
  return t;
}
function v({
  [p]: e
}, {
  wsl: t
}) {
  if (t && a) return _(t);
  if (!e) throw new Error(`${p} is not supported`);
  return _(e);
}
const b = {};
l(b, "chrome", () => v({
  darwin: "google chrome",
  win32: "chrome",
  linux: ["google-chrome", "google-chrome-stable", "chromium"]
}, {
  wsl: {
    ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
  }
}));
l(b, "firefox", () => v({
  darwin: "firefox",
  win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  linux: "firefox"
}, {
  wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
}));
l(b, "edge", () => v({
  darwin: "microsoft edge",
  win32: "msedge",
  linux: ["microsoft-edge", "microsoft-edge-dev"]
}, {
  wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
}));
y.apps = b;
y.openApp = (e, t) => {
  if ("string" != typeof e) throw new TypeError("Expected a `name`");
  const {
    arguments: n = []
  } = t || {};
  if (null != n && !Array.isArray(n)) throw new TypeError("Expected `appArguments` as Array type");
  return g({
    ...t,
    app: {
      name: e,
      arguments: n
    }
  });
};
module.exports = y;