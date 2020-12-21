let utility = require("../Utility");

var inputs = utility.loadArray("./set1/c4Inputs.txt");

var results = [];

function search(input, lineNum) {
  var inputBuffer = Buffer.from(input, "hex");
  for (var i = 0; i < 128; i++) {
    for (var j = 0; j < inputBuffer.length; j++) {
      results.push(inputBuffer[j] ^ i);
    }

    let score = utility.scoreString(Buffer.from(results).toString(), 100);

    if (score > 0) {
      console.log(
        "line : " +
          lineNum +
          " char : " +
          String.fromCharCode(i) +
          " : " +
          utility.scoreString(score) +
          " = " +
          Buffer.from(results).toString()
      );
    }
    results = [];
  }
}

inputs.forEach((input, index) => search(input, index));
