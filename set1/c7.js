const aesjs = require('aes-js');
const utility = require("../Utility");

let key = Buffer.from("YELLOW SUBMARINE");
let input = utility.loadString("./set1/c7Inputs.txt")

let inputBuffer = Buffer.from(input, "base64");

let aesEcb = new aesjs.ModeOfOperation.ecb(key);
let decryptedBytes = aesEcb.decrypt(inputBuffer);

let decryptedText = Buffer.from(decryptedBytes).toString();

console.log(decryptedText);