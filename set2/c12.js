const utility = require("../Utility");
// Copy your oracle function to a new function that encrypts
// buffers under ECB mode using a consistent but unknown key
const key = Buffer.from([
  21,
  160,
  202,
  138,
  157,
  45,
  17,
  154,
  116,
  207,
  150,
  230,
  179,
  242,
  219,
  246,
]);

const unknownBuffer = Buffer.from(
  utility.loadString("./set2/inputs/c12inputs.txt"),
  "base64"
);

function encryptionOracle(knownInput, unknownInput, key) {
  const appendedInput = utility.PKCS7pad(
    Buffer.concat([knownInput, unknownInput]),
    16
  );
  return {
    method: "ECB",
    value: utility.ECBEncrypt(appendedInput, key),
  };
}


