Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.AzureVirtualMachine = void 0;
var r = require(95282);
var i = require(25740);
var o = require(88723);
var AzureVirtualMachine = function () {
  function e() {}
  e.getAzureComputeMetadata = function (t, n) {
    var s;
    var a = this;
    var c = {};
    var l = ((s = {
      method: "GET"
    })[o.disableCollectionRequestOption] = !0, s.headers = {
      Metadata: "True"
    }, s);
    var u = i.makeRequest(t, "http://169.254.169.254/metadata/instance/compute?api-version=2017-12-01&format=json", l, function (t) {
      if (200 === t.statusCode) {
        c.isVM = !0;
        var i = "";
        t.on("data", function (e) {
          i += e;
        });
        t.on("end", function () {
          try {
            var t = JSON.parse(i);
            c.id = t.vmId || "";
            c.subscriptionId = t.subscriptionId || "";
            c.osType = t.osType || "";
          } catch (t) {
            r.info(e.TAG, t);
          }
          n(c);
        });
      } else n(c);
    }, !1, !1);
    if (u) {
      setTimeout(function () {
        a._requestTimedOut = !0;
        u.abort();
      }, e.HTTP_TIMEOUT);
      u.on("error", function (t) {
        if (a._requestTimedOut && t) {
          t.name = "telemetry timeout";
          t.message = "telemetry request timed out";
        }
        if (t && t.message && t.message.indexOf("UNREACH") > -1) {
          c.isVM = !1;
        } else {
          r.info(e.TAG, t);
        }
        n(c);
      });
      u.end();
    }
  };
  e.HTTP_TIMEOUT = 2500;
  e.TAG = "AzureVirtualMachine";
  return e;
}();
exports.AzureVirtualMachine = AzureVirtualMachine;