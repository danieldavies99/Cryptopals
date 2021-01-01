let inputBuffer = Buffer.from("YELLO");

function ceilToNearest(n, multiple) {
  return Math.ceil(n / multiple) * multiple;
}
function calcPaddingSize(input, blockSize) {
  return ceilToNearest(input.length, blockSize) - input.length === 0
    ? blockSize
    : ceilToNearest(input.length, blockSize) - input.length;
}
//later implemented as utility.PKCS7pad() for future use
function pad(input, blockSize) {
  let paddingSize = calcPaddingSize(input, blockSize);
  let paddingBytes = [];
  for (let i = 0; i < paddingSize; i++) {
    paddingBytes.push(paddingSize);
  }
  let paddingBuffer = Buffer.from(paddingBytes);
  return Buffer.concat([input, paddingBuffer]);
}

let paddedBuffer = pad(inputBuffer, 16);
console.log(paddedBuffer);
console.log(paddedBuffer.toString());
