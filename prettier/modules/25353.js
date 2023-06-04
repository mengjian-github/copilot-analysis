var r = require(37651);
var i = require(55912);
module.exports = function (e) {
  if (Object.keys(this.jobs).length) {
    this.index = this.size;
    r(this);
    i(e)(null, this.results);
  }
};