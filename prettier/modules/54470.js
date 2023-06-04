var r = require(22037);
var i = require(57147);
var o = require(71017);
var s = require(55290);
var a = require(63580);
var c = require(95282);
var l = function () {
  function e(e) {
    this.keys = new s.ContextTagKeys();
    this.tags = {};
    this._loadApplicationContext(e);
    this._loadDeviceContext();
    this._loadInternalContext();
  }
  e.prototype._loadApplicationContext = function (t) {
    t = t || o.resolve(__dirname, "../../../../package.json");
    if (!e.appVersion[t]) {
      e.appVersion[t] = "unknown";
      try {
        var n = JSON.parse(i.readFileSync(t, "utf8"));
        n && "string" == typeof n.version && (e.appVersion[t] = n.version);
      } catch (e) {
        c.info("unable to read app version: ", e);
      }
    }
    this.tags[this.keys.applicationVersion] = e.appVersion[t];
  };
  e.prototype._loadDeviceContext = function () {
    var t = r && r.hostname();
    var n = e.DefaultRoleName;
    if (process.env.WEBSITE_SITE_NAME) {
      n = process.env.WEBSITE_SITE_NAME;
    }
    if (process.env.WEBSITE_INSTANCE_ID) {
      t = process.env.WEBSITE_INSTANCE_ID;
    }
    this.tags[this.keys.deviceId] = "";
    this.tags[this.keys.cloudRoleInstance] = t;
    this.tags[this.keys.deviceOSVersion] = r && r.type() + " " + r.release();
    this.tags[this.keys.cloudRole] = n;
    this.tags["ai.device.osArchitecture"] = r && r.arch();
    this.tags["ai.device.osPlatform"] = r && r.platform();
  };
  e.prototype._loadInternalContext = function () {
    e.sdkVersion = a.APPLICATION_INSIGHTS_SDK_VERSION;
    this.tags[this.keys.internalSdkVersion] = "node:" + e.sdkVersion;
  };
  e.DefaultRoleName = "Web";
  e.appVersion = {};
  e.sdkVersion = null;
  return e;
}();
module.exports = l;