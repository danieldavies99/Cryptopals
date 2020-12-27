const utility = require("../Utility");
const input = utility.loadString("./set1/inputs/c6InputCustom.txt");
const inputBuffer = Buffer.from(input, "base64");

// Write a function to compute the edit distance/Hamming distance between two strings.
// The Hamming distance is just the number of differing bits.
function editDistance(bufferOne, bufferTwo) {
  let results = [];
  for (let i = 0; i < bufferOne.length; i++) {
    results.push(bufferOne[i] ^ bufferTwo[i]);
  }
  let total = 0;
  for (let i = 0; i < results.length; i++) {
    if (results[i].toString(2).match(/1/g)) {
      total += results[i].toString(2).match(/1/g).length;
    }
  }
  return total;
}
// Confirm working
// console.log(
//   editDistance(
//     Buffer.from("this is a test"), 
//     Buffer.from("wokka wokka!!!")
//   ) === 37
// );

function getNormalizedEditDistanceForKeySize(keySize, input) {
  let iterations = 0;
  let editDistances = [];

  while (true) {
    let firstBytes = [];
    let secondBytes = [];

    for (
      let i = iterations * keySize * 2;
      i < keySize + iterations * keySize * 2;
      i++
    ) {
      firstBytes.push(input[i]);
      secondBytes.push(input[i + keySize]);
    }

    //stop when max number of keysize length blocks have been checked
    if (iterations * keySize * 2 > input.length - keySize * 2) {
      break;
    }

    let editDistanceValue = editDistance(
      Buffer.from(firstBytes),
      Buffer.from(secondBytes)
    );
    editDistances.push(editDistanceValue / keySize);
    iterations++;
  }

  const sum = editDistances.reduce((a, b) => a + b, 0);
  const avg = sum / editDistances.length;
  return {
    keySize: keySize,
    editDistance: avg,
  };
}

function getTopThreeKeySizes(input, maxKeySizeLength) {
  let editDistancesForKeySize = [];
  for (let i = 1; i < maxKeySizeLength + 1; i++) {
    editDistancesForKeySize.push(getNormalizedEditDistanceForKeySize(i, input));
  }
  return editDistancesForKeySize.sort(function (a, b) {
    return a.editDistance - b.editDistance;
  }).slice(0,3);
}

function getKeySizeLengthBlocks(input, keySize) {
  let keySizeLengthBlocks = [];
  for (let i = 0; i < input.length / keySize; i++) {
    let newblock = [];
    for (let j = 0; j < keySize; j++) {
      newblock.push(input[i * keySize + j]);
    }
    keySizeLengthBlocks.push(newblock);
  }
  return keySizeLengthBlocks;
}

function transposeBlocks(blocks) {
  let transposedBlocks = [];
  for (let i = 0; i < blocks[0].length; i++) {
    let newBlock = [];
    for (let j = 0; j < blocks.length; j++) {
      if (blocks[j][i]) {
        newBlock.push(blocks[j][i]);
      }
    }
    transposedBlocks.push(newBlock);
  }
  return transposedBlocks;
}

function getSingleByteXORKey(input) {
  scores = [];
  input = Buffer.from(input, "hex"); //this might not be necessary

  for (var i = 0; i < 128; i++) {
    let results = [];
    for (var j = 0; j < input.length; j++) {
      results.push(input[j] ^ i);
    }
    scores.push({
      character: String.fromCharCode(i),
      score: utility.scoreString(Buffer.from(results).toString(), 50),
    });
  }
  scores = scores.sort(function (a, b) {
    return b.score - a.score;
  });
  return scores[0];
}

function decryptRepeatingKeyXor(key, message) {
  results = [];
  var input = Buffer.from(message, "hex");

  for (i = 0; i < input.length; i++) {
    var index = i % key.length;
    results.push(input[i] ^ key.charCodeAt(index));
  }
  return Buffer.from(results);
}

// For each KEYSIZE, take the first KEYSIZE worth of bytes,
// and the second KEYSIZE worth of bytes, and find the edit distance between them.
// Normalize this result by dividing by KEYSIZE.
// The KEYSIZE with the smallest normalized edit distance is probably the key.
// You could proceed perhaps with the smallest 2-3 KEYSIZE values.
// Or take 4 KEYSIZE blocks instead of 2 and average the distances
let editDistancesForKeySize = getTopThreeKeySizes(inputBuffer, 40);

// Now that you probably know the KEYSIZE:
// break the ciphertext into blocks of KEYSIZE length.
// Now transpose the blocks: make a block that is the first byte of every block,
// and a block that is the second byte of every block, and so on.
let transposedBlocks = transposeBlocks(
  getKeySizeLengthBlocks(inputBuffer, editDistancesForKeySize[0].keySize)
);

// Solve each block as if it was single-character XOR.
// You already have code to do this.
// For each block, the single-byte XOR key that produces
// the best looking histogram is the repeating-key XOR key byte for that block.
// Put them together and you have the key.
let key = transposedBlocks.reduce((accumulator, currentValue) => {
  return (accumulator += getSingleByteXORKey(currentValue).character);
}, "");

console.log("\nkey: " + key + "\n");
console.log("message:");
console.log(decryptRepeatingKeyXor(key, inputBuffer).toString());