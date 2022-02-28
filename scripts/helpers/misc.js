function h1Separator() {
  console.log("\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_\n");
}
function h2Separator() {
  console.log("---------------");
}

function h1(title) {
  console.log("*** ", title, " ***\n");
}
module.exports = {
  h1Separator,
  h2Separator,
  h1,
};
