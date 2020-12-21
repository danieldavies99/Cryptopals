let utility = require("../Utility");

let input = utility.loadString("./set1/c6Inputs.txt");
//console.log(input);
let inputBuffer = Buffer.from(input);
//console.log(inputBuffer);

function repeatingKeyXor(key, message) {
  results = [];
  var inputBuffer = Buffer.from(message);

  for (i = 0; i < inputBuffer.length; i++) {
    var index = i % key.length;
    results.push(inputBuffer[i] ^ key.charCodeAt(index));
  }

  return Buffer.from(results);
}

function editDistance(stringOne, stringTwo) {
  const bufferOne = Buffer.from(stringOne);
  const bufferTwo = Buffer.from(stringTwo);

  let results = [];
  for (let i = 0; i < stringOne.length; i++) {
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
//confirm working
//console.log(editDistance("this is a test", "wokka wokka!!!"));

function getNormalizedEditDistanceForKeySize(KeySize, inputBuffer) {
  let iterations = 0;
  editDistances = [];

  while (true) {
    let firstBytes = [];
    let secondBytes = [];

    for (
      let j = 0 + iterations * KeySize * 2;
      j < KeySize + iterations * KeySize * 2;
      j++
    ) {
      firstBytes.push(inputBuffer[j]);
      secondBytes.push(inputBuffer[j + KeySize]);
    }

    if (iterations * KeySize * 2 > inputBuffer.length - KeySize) {
      break;
    } else {
      //console.log(Buffer.from(firstBytes).toString());
      //console.log(Buffer.from(secondBytes).toString());
      //console.log();
      let editDistanceValue = editDistance(
        Buffer.from(firstBytes).toString(),
        Buffer.from(secondBytes).toString()
      ); /// KeySize;
      editDistances.push(editDistanceValue / KeySize);
    }
    iterations++;
  }
  //console.log(editDistances);

  const sum = editDistances.reduce((a, b) => a + b, 0);
  const avg = sum / editDistances.length || 0;

  console.log(
    "keysize : " +
      KeySize +
      " edit distance : " +
      avg +
      //" total iterations : " +
      //iterations +
      "\n"
  );
}

for (let i = 1; i < 41; i++) {
  getNormalizedEditDistanceForKeySize(i, inputBuffer);
}

//getNormalizedEditDistanceForKeySize(10, inputBuffer);
