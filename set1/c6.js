let utility = require("../Utility");
let input = utility.loadString("./set1/c6InputCustom.txt");
let inputBuffer = Buffer.from(input, "base64");
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

//confirm edit distance calculation working
//console.log(editDistance(Buffer.from("this is a test"), Buffer.from("wokka wokka!!!") ));

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

    if(iterations * keySize * 2 > input.length - keySize * 2) {
      break;
    } 

    let editDistanceValue = editDistance(
      Buffer.from(firstBytes),
      Buffer.from(secondBytes)
    );
    editDistances.push(editDistanceValue  / keySize);
    iterations++;
  }

  const sum = editDistances.reduce((a, b) => a + b, 0);
  const avg = sum / editDistances.length;
  return( {
    keySize: keySize,
    editDistance: avg}
  );
}

// Now that you probably know the KEYSIZE: 
// break the ciphertext into blocks of KEYSIZE length.
function getKeySizeLengthBlocks(input, keySize) {
  let blocks = [];
  for(let i = 0; i < input.length / keySize; i++) {
    let block = [];
    
    for(let j = 0; j < keySize; j++) {
      
      block.push(input[i*keySize + j]);
    }
    blocks.push(block);
  }
  return blocks;
}

//Now transpose the blocks: make a block that is the first byte of every block, 
//and a block that is the second byte of every block, and so on.
function transposeBlocks(blocks) {
  let transposedBlocks = [];
  for(let i = 0; i < blocks[0].length; i++) {
    let newBlock = [];
    for(let j = 0; j < blocks.length; j++) {
      if(blocks[j][i]) {
        newBlock.push(blocks[j][i])
      }
    }
    transposedBlocks.push(newBlock)
  }
  return transposedBlocks;
}

let editDistancesForKeySize = []
for (let i = 1; i < 41; i++) {
 editDistancesForKeySize.push(getNormalizedEditDistanceForKeySize(i, inputBuffer));
}
//sort by edit distance
editDistancesForKeySize = editDistancesForKeySize.sort(function(a, b){return a.editDistance - b.editDistance});

let keySizeBlocks = getKeySizeLengthBlocks(inputBuffer, editDistancesForKeySize[0].keySize);
let transposedBlocks = transposeBlocks(keySizeBlocks);

// console.log(keySizeBlocks[0])
// console.log(transposedBlocks[0]);

function getSingleByteXORKey(input) {
  scores = []
  var inputBuffer = Buffer.from(input, "hex");

  for (var i = 0; i < 128; i++) {
    let results = [];
    for (var j = 0; j < inputBuffer.length; j++) {
      results.push(inputBuffer[j] ^ i);
    }
    scores.push({
      character: String.fromCharCode(i),
      score: utility.scoreString(Buffer.from(results).toString(), 50)
    });
  }
  scores = scores.sort(function(a, b){return b.score - a.score});
  return scores[0];
}

let key = "";
for(let i = 0; i < transposedBlocks.length; i++) {
  key += getSingleByteXORKey(transposedBlocks[i]).character;
}

function decryptRepeatingKeyXor(key, message) {
  results = [];
  var inputBuffer = Buffer.from(message, "hex");

  for (i = 0; i < inputBuffer.length; i++) {
    var index = i % key.length;
    results.push(inputBuffer[i] ^ key.charCodeAt(index));
  }

  return Buffer.from(results);
}

console.log("key : " + key + "\n");
console.log("message: \n")
console.log(decryptRepeatingKeyXor(key, inputBuffer).toString());