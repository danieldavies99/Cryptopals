let utility = require("../Utility");

let answer = '0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f'


function repeatingKeyXor(key, message) {
  results = [];
  var inputBuffer = Buffer.from(message);

  for (i = 0; i < inputBuffer.length; i++) {
    var index = i % key.length;
    results.push(inputBuffer[i] ^ key.charCodeAt(index));
  }

  return Buffer.from(results);
}

console.log(
  "repeating Key XOR returns expected result? " +
    (repeatingKeyXor(
      "ICE",
      "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal"
    ).toString("hex") == answer)
);

function decryptRepeatingKeyXor(key, message) {
  results = [];
  var inputBuffer = Buffer.from(message, "hex");

  for (i = 0; i < inputBuffer.length; i++) {
    var index = i % key.length;
    results.push(inputBuffer[i] ^ key.charCodeAt(index));
  }

  return Buffer.from(results);
}

console.log(decryptRepeatingKeyXor("ICE", answer).toString());