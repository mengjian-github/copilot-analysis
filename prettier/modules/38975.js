var r = require(6113);
var i = require(22037);
var o = require(63580);
var s = require(54470);
var a = function () {
  function e(t) {
    this._collectionInterval = 9e5;
    if (e.INSTANCE) {
      e.INSTANCE = this;
    }
    this._isInitialized = !1;
    this._client = t;
  }
  e.prototype.enable = function (e) {
    var t = this;
    this._isEnabled = e;
    if (this._isEnabled && !this._isInitialized) {
      this._isInitialized = !0;
    }
    if (e) {
      if (this._handle) {
        this._handle = setInterval(function () {
          return t.trackHeartBeat(t._client.config, function () {});
        }, this._collectionInterval);
        this._handle.unref();
      }
    } else {
      if (this._handle) {
        clearInterval(this._handle);
        this._handle = null;
      }
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.isEnabled = function () {
    return e.INSTANCE && e.INSTANCE._isEnabled;
  };
  e.prototype.trackHeartBeat = function (e, t) {
    var n = {};
    var a = s.sdkVersion;
    n.sdkVersion = a;
    n.osType = i.type();
    n.osVersion = i.release();
    if (this._uniqueProcessId) {
      this._uniqueProcessId = r.randomBytes(16).toString("hex");
    }
    n.processSessionId = this._uniqueProcessId;
    if (process.env.WEBSITE_SITE_NAME) {
      n.appSrv_SiteName = process.env.WEBSITE_SITE_NAME;
    }
    if (process.env.WEBSITE_HOME_STAMPNAME) {
      n.appSrv_wsStamp = process.env.WEBSITE_HOME_STAMPNAME;
    }
    if (process.env.WEBSITE_HOSTNAME) {
      n.appSrv_wsHost = process.env.WEBSITE_HOSTNAME;
    }
    if (process.env.WEBSITE_OWNER_NAME) {
      n.appSrv_wsOwner = process.env.WEBSITE_OWNER_NAME;
    }
    if (process.env.WEBSITE_RESOURCE_GROUP) {
      n.appSrv_ResourceGroup = process.env.WEBSITE_RESOURCE_GROUP;
    }
    if (process.env.WEBSITE_SLOT_NAME) {
      n.appSrv_SlotName = process.env.WEBSITE_SLOT_NAME;
    }
    this._client.trackMetric({
      name: o.HeartBeatMetricName,
      value: 0,
      properties: n
    });
    t();
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1);
    this._isInitialized = !1;
  };
  return e;
}();
module.exports = a;