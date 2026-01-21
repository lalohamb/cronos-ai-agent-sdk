// Setup for Jest tests
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};