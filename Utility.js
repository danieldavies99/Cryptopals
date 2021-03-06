//loading a text file into an array
const aesjs = require("aes-js");
var fs = require("fs");

function loadArray(path) {
  var array = fs.readFileSync(path).toString().split("\n");
  return array;
}

function loadString(path) {
  return fs.readFileSync(path, "utf-8");
}

//score string
function scoreString(string, penaltyValue) {
  let score = 0;
  for (let i = 0; i < string.length; i++) {
    if (
      string.charCodeAt(i) < 47 &&
      string.charCodeAt(i) != 32 && //space
      string.charCodeAt(i) != 10 && //space
      string.charCodeAt(i) != 9 && //tab
      string.charCodeAt(i) != 33 && //!
      string.charCodeAt(i) != 34 && //"
      string.charCodeAt(i) != 39 && //'
      string.charCodeAt(i) != 46 //.
    ) {
      score -= penaltyValue;
    }
    if (string.charCodeAt(i) > 122) {
      score -= penaltyValue;
    }
    if (
      string.charCodeAt(i) === 96 || //`
      string.charCodeAt(i) === 94 //^
    ) {
      score -= penaltyValue;
    }
    switch (string.charCodeAt(i)) {
      case 69: //e
      case 101:
        score += 12;
        break;

      case 84: //t
      case 116:
        score += 11;
        break;

      case 65: //a
      case 97:
        score += 10;
        break;

      case 79:
      case 111:
        score += 9;
        break;

      case 73: //i
      case 105:
        score += 8;
        break;

      case 78: //n
      case 110:
        score += 7;
        break;

      case 83: //s
      case 115:
        score += 6;
        break;

      case 72: //h
      case 104:
        score += 5;
        break;

      case 82: //r
      case 114:
        score += 4;
        break;

      case 68: //d
      case 100:
        score += 3;
        break;

      case 76: //l
      case 108:
        score += 3;
        break;

      case 85: //u
      case 117:
        score += 2;
        break;

      case 32: //space
      case 32:
        score += 4;
        break;
    }
  }
  return score;
}

function ceilToNearest(n, multiple) {
  return Math.ceil(n / multiple) * multiple;
}
function calcPaddingSize(input, blockSize) {
  return ceilToNearest(input.length, blockSize) - input.length === 0
    ? blockSize
    : ceilToNearest(input.length, blockSize) - input.length;
}
function PKCS7pad(input, blockSize) {
  let paddingSize = calcPaddingSize(input, blockSize);
  let paddingBytes = [];
  for (let i = 0; i < paddingSize; i++) {
    paddingBytes.push(paddingSize);
  }
  let paddingBuffer = Buffer.from(paddingBytes);
  return Buffer.concat([input, paddingBuffer]);
}

function XOR(b1, b2) {
  if (b1.length != b2.length) {
    console.log("Buffer lengths aren't equal in XOR");
    return -1;
  }
  let XORBytes = [];
  for (let i = 0; i < b1.length; i++) {
    XORBytes.push(b1[i] ^ b2[i]);
  }
  return Buffer.from(XORBytes);
}

function ECBEncrypt(input, key) {
  let aesEcb = new aesjs.ModeOfOperation.ecb(key);
  return Buffer.from(aesEcb.encrypt(input));
}

function ECBDecrypt(input, key) {
  let aesEcb = new aesjs.ModeOfOperation.ecb(key);
  return Buffer.from(aesEcb.decrypt(input));
}

function encryptCBCBlock(plainTextBlock, previousCipherTextBlock, key) {
  const aesEcb = new aesjs.ModeOfOperation.ecb(key);
  return Buffer.from(
    aesEcb.encrypt(XOR(plainTextBlock, previousCipherTextBlock))
  );
}
function CBCEncrypt(input, IV, key) {
  const keySize = key.length;
  const paddedInput = PKCS7pad(input, keySize);

  //first block
  let result = encryptCBCBlock(input.slice(0, keySize), IV, key);

  for (let i = 1; i < paddedInput.length / keySize; i++) {
    let newBlock = encryptCBCBlock(
      paddedInput.slice(i * keySize, i * keySize + keySize),
      result.slice((i - 1) * keySize, i * keySize),
      key
    );
    result = Buffer.concat([result, newBlock]);
  }
  return result;
}

function decryptCBCBlock(currentCipherTextBlock, previousCipherTextBlock, key) {
  const aesEcb = new aesjs.ModeOfOperation.ecb(key);
  let decryptedCurrentBlock = aesEcb.decrypt(currentCipherTextBlock);
  return XOR(decryptedCurrentBlock, previousCipherTextBlock);
}
function CBCDecrypt(input, IV, key) {
  const keySize = key.length;
  const aesEcb = new aesjs.ModeOfOperation.ecb(key);

  //first block
  let results = decryptCBCBlock(input.slice(0, keySize), IV, key);

  for (let i = 1; i < input.length / keySize; i++) {
    let newBlock = decryptCBCBlock(
      input.slice(i * keySize, i * keySize + keySize),
      input.slice((i - 1) * keySize, i * keySize),
      key
    );
    results = Buffer.concat([results, newBlock]);
  }
  return results;
}

module.exports = {
  scoreString,
  loadArray,
  loadString,
  PKCS7pad,
  XOR,
  ECBEncrypt,
  ECBDecrypt,
  CBCEncrypt,
  CBCDecrypt,
};
