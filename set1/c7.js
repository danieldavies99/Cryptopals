const aesjs = require('aes-js');
const utility = require("../Utility");

var key = Buffer.from("YELLOW SUBMARINE");
var input = utility.loadString("./set1/c7Inputs.txt")

var inputBuffer = Buffer.from(input, "base64");

var aesEcb = new aesjs.ModeOfOperation.ecb(key);
var decryptedBytes = aesEcb.decrypt(inputBuffer);

var decryptedText = Buffer.from(decryptedBytes).toString();

console.log(decryptedText);