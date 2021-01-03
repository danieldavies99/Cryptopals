const aesjs = require("aes-js");
const utility = require("../Utility");

function generateRandomBuffer(length) {
  let bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(Math.floor(Math.random() * 255));
  }
  return Buffer.from(bytes);
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBytes(minLength, maxLength) {
  let length = randomInteger(minLength, maxLength);
  return generateRandomBuffer(length);
}

function encryptionOracle(input) {
  const preBytes = getRandomBytes(5, 10);
  const postBytes = getRandomBytes(5, 10);
  const appendedInput = utility.PKCS7pad(
    Buffer.concat([preBytes, input, postBytes]),
    16
  );
  const key = generateRandomBuffer(16);

  if (Math.random() > 0.5) {
    return {
      method: "ECB",
      value: utility.ECBEncrypt(appendedInput, key),
    };
  }

  const iv = generateRandomBuffer(16);
  return {
    method: "CBC",
    value: utility.CBCEncrypt(appendedInput, iv, key),
  };
}

console.log(encryptionOracle(Buffer.from("YELLOWSUBMARINE YELLOWSUBMARINE ")));
