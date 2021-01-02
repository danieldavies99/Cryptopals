const aesjs = require("aes-js");
const utility = require("../Utility");

//In CBC mode, each block of plaintext is XORed with the previous ciphertext block before being encrypted.
function encryptCBCBlock(plainTextBlock, previousCipherTextBlock, key) {
  const aesEcb = new aesjs.ModeOfOperation.ecb(key);
  return Buffer.from(
    aesEcb.encrypt(utility.XOR(plainTextBlock, previousCipherTextBlock))
  );
}
function CBCEncrypt(input, IV, key) {
  const keySize = key.length;
  const paddedInput = utility.PKCS7pad(input, keySize);

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
  return utility.XOR(decryptedCurrentBlock, previousCipherTextBlock);
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


const input = Buffer.from(
  utility.loadString("./set2/inputs/c10InputsCustom.txt"),
  "base64"
);
const key = Buffer.from("YELLOW SUBMARINE");
const IV = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
console.log(CBCDecrypt(input, IV, key).toString());
