const r = require(49012);
if (process && r.gte(process.versions.node, "8.0.0")) {
  module.exports = require(93964);
} else {
  module.exports = require(44046);
}