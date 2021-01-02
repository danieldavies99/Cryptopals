const aesjs = require("aes-js");
const utility = require("../Utility");

/*
const key = Buffer.from("YELLOW SUBMARINE");
const aesEcb = new aesjs.ModeOfOperation.ecb(key);
//encrypt
let input = utility.PKCS7pad(
  Buffer.from(
    "sometimes I feel like life is just a game and I get the urge to jump in front of a moving train"
  ),
  key.length
);

let encryptedBytes = aesEcb.encrypt(input);
console.log("encrypted: \n" + Buffer.from(encryptedBytes).toString() + "\n");

//decrypt
let decryptedBytes = aesEcb.decrypt(encryptedBytes);
/-*
let decryptedText = Buffer.from(decryptedBytes).toString();
console.log("decrypted: \n" + decryptedText);
*/
function CBCEncrypt(input, key, IV) {
    
}

function CBCDecrypt(input, key, IV) {
  const aesEcb = new aesjs.ModeOfOperation.ecb(key);
}

const input = Buffer.from(utility.loadArray("./set2/inputs/c10Inputs.txt"), "base64");
const key = Buffer.from("YELLOW SUBMARINE");
const IV = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
CBCDecrypt(input, key, IV);

const plaintextInput