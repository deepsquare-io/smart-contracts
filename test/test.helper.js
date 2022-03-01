function describeRevert(callback) {
  describe("should revert if", callback);
}

function describeOk(callback) {
  describe("if everything ok", callback);
}

module.exports = {
  describeRevert,
  describeOk,
};
