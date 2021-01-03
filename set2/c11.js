const aesjs = require("aes-js");
const utility = require("../Utility");

function generateRandomKey(length) {
  let bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(Math.floor(Math.random() * 255));
  }
  return Buffer.from(bytes);
}

console.log(generateRandomKey(16));
