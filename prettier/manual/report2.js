Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.DiagnosticReport = exports.openDiagnosticReport = void 0;
  const r = require(22037),
    i = require(24404),
    o = require(89496),
    s = require(30362),
    a = require(51133),
    c = require(82279);
  exports.openDiagnosticReport = async function (e) {
    const t = new l(e => void 0 !== o.extensions.getExtension(e), process.env),
      n = await t.collectData(e),
      r = t.formatAsMarkdown(n),
      i = await o.workspace.openTextDocument({
        language: "markdown",
        content: r
      });
    await o.window.showTextDocument(i);
  };
  class l {
    constructor(e, t) {
      this.isExtensionInstalled = e, this.environment = t;
    }
    async collectData(e) {
      return {
        sections: [this.collectConfigurationSection(), this.collectEnvironmentSection(), await this.collectFeatureFlagsSection(e), this.collectExtensionSection(e), this.collectNodeSection(), await this.collectReachabilitySection(e)]
      };
    }
    collectConfigurationSection() {
      return {
        name: "Configuration",
        items: {
          "HTTP proxy": this.findVsCodeConfiguration("http", "proxy"),
          "HTTP proxy autentication": this.findVsCodeConfiguration("http", "proxyAuthorization"),
          "Proxy Strict SSL": this.findVsCodeConfiguration("http", "proxyStrictSSL"),
          "Extension HTTP proxy support": this.findVsCodeConfiguration("http", "proxySupport")
        }
      };
    }
    collectNodeSection() {
      return {
        name: "Node setup",
        items: {
          "Number of root certificates": i.rootCertificates.length,
          "Operating system": r.type(),
          "Operating system version": r.release(),
          "Operating system architecture": r.arch(),
          NODE_OPTIONS: this.findEnvironmentVariable("NODE_OPTIONS"),
          NODE_EXTRA_CA_CERTS: this.findEnvironmentVariable("NODE_EXTRA_CA_CERTS"),
          NODE_TLS_REJECT_UNAUTHORIZED: this.findEnvironmentVariable("NODE_TLS_REJECT_UNAUTHORIZED"),
          "tls default min version": i.DEFAULT_MIN_VERSION,
          "tls default max version": i.DEFAULT_MAX_VERSION
        }
      };
    }
    collectExtensionSection(e) {
      return {
        name: "Extensions",
        items: {
          "Copilot Version": (0, a.getVersion)(e),
          "Is `win-ca` installed?": void 0 !== this.isExtensionInstalled("ukoloff.win-ca"),
          "Is `mac-ca` installed?": void 0 !== this.isExtensionInstalled("linhmtran168.mac-ca-vscode")
        }
      };
    }
    collectEnvironmentSection() {
      return {
        name: "Environment",
        items: {
          http_proxy: this.findEnvironmentVariable("http_proxy"),
          https_proxy: this.findEnvironmentVariable("https_proxy"),
          no_proxy: this.findEnvironmentVariable("no_proxy"),
          SSL_CERT_FILE: this.findEnvironmentVariable("SSL_CERT_FILE"),
          SSL_CERT_DIR: this.findEnvironmentVariable("SSL_CERT_DIR"),
          OPENSSL_CONF: this.findEnvironmentVariable("OPENSSL_CONF")
        }
      };
    }
    async collectFeatureFlagsSection(e) {
      const t = await e.get(s.CopilotTokenManager).getCopilotToken(e);
      return {
        name: "Feature Flags",
        items: {
          "Self Signed Certificates": "1" === t.getTokenValue("ssc") ? "enabled" : "disabled",
          "Send Restricted Telemetry": "1" === t.getTokenValue("rt") ? "enabled" : "disabled"
        }
      };
    }
    async collectReachabilitySection(e) {
      return {
        name: "Reachability",
        items: {
          "github.com": await this.determineReachability(e, "https://github.com"),
          "copilot-proxy.githubusercontent.com": await this.determineReachability(e, "https://copilot-proxy.githubusercontent.com/_ping"),
          "default.exp-tas.com": await this.determineReachability(e, "https://default.exp-tas.com/vscode/ab")
        }
      };
    }
    async determineReachability(e, t) {
      try {
        const n = await e.get(c.Fetcher).fetch(t, {});
        return `HTTP ${n.status} - ${n.statusText}`;
      } catch (e) {
        return e.message;
      }
    }
    formatAsMarkdown(e) {
      return e.sections.map(e => this.formatSectionAsMarkdown(e)).join(r.EOL + r.EOL);
    }
    formatSectionAsMarkdown(e) {
      return `## ${e.name}` + r.EOL + r.EOL + Object.keys(e.items).filter(e => "name" !== e).map(t => `- ${t}: ${e.items[t] ?? "n/a"}`).join(r.EOL);
    }
    findEnvironmentVariable(e) {
      const t = Object.keys(this.environment).find(t => t.toLowerCase() === e.toLowerCase());
      return t ? this.environment[t] : void 0;
    }
    findVsCodeConfiguration(e, t) {
      return o.workspace.getConfiguration(e).get(t);
    }
  }
  exports.DiagnosticReport = l;