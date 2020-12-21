let utility = require("../Utility");

var input =
  "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736";

var inputBuffer = Buffer.from(input, "hex");

var results = [];

for (var i = 0; i < 128; i++) {
  for (var j = 0; j < inputBuffer.length; j++) {
    results.push(inputBuffer[j] ^ i);
  }
  let score = utility.scoreString(Buffer.from(results).toString(), 200);

  if (score > 0) {
    console.log(
      String.fromCharCode(i) +
        " : " +
        score +
        " = " +
        Buffer.from(results).toString()
    );
  }
  results = [];
}
