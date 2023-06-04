if (global._stackChain) {
  if (global._stackChain.version !== require(32301).i8) throw new Error("Conflicting version of stack-chain found");
  module.exports = global._stackChain;
} else module.exports = global._stackChain = require(87898);