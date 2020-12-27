const aesjs = require("aes-js");
const utility = require("../Utility");

let input = utility.loadArray("./set1/inputs/c8Inputs.txt");

function splitInto16ByteBlocks(input) {
  let resultBlocks = [];
  for (let i = 0; i < input.length / 16; i++) {
    let newBlock = [];
    for (let j = 0; j < 16; j++) {
      newBlock.push(input[(i * 16) + j]);
    }
    resultBlocks.push(newBlock);
  }
  return resultBlocks;
}

function compressArray(original) {
	return original.reduce((a,b)=>a.set(JSON.stringify(b),a.get(JSON.stringify(b))+1||0),new Map)
};

let ciphertextDuplicates = [];
input.forEach((ciphertext, i) => {
  let inputBuffer = Buffer.from(ciphertext, "hex");
  const result = compressArray(splitInto16ByteBlocks(inputBuffer))
  let totalDupes = 0;
  for (let [key, value] of result) {
    if(value > 1) {
      totalDupes += value;
    }
  }
  ciphertextDuplicates.push({
    line: i + 1,
    duplicates: totalDupes,
  })
  //console.log("line : " + (i + 1) + " duplicates : " + totalDupes );
});

ciphertextDuplicates = ciphertextDuplicates.sort(function (a, b) {
  return b.duplicates - a.duplicates;
});

console.log("ECB encrypted cyphertext line : " + ciphertextDuplicates[0].line)
// solution line 133, as it has the most duplicate 16 byte blocks.