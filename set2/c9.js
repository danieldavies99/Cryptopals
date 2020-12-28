let inputBuffer = Buffer.from("YELLOW SUBMARINE");


function ceilToNearest(n, multiple)
{
    return Math.ceil(n/multiple)*multiple;
}
function calcPaddingSize(input, blockSize) {
  return ceilToNearest(input.length, blockSize) - input.length === 0 ? blockSize : ceilToNearest(input.length, blockSize) - input.length;
}

function pad(input, blockSize) {
  let paddingSize = calcPaddingSize(input, blockSize);
  console.log("input length : " + input.length);
  console.log("padding length : " + paddingSize);
  let paddingBytes = []
  for (let i = 0; i < paddingSize; i++) {
    paddingBytes.push(paddingSize)
  }
  console.log(paddingBytes);
  let paddingBuffer = Buffer.from(paddingBytes);
  console.log(paddingBuffer);
  return Buffer.concat([input, paddingBuffer]);
}

let paddedBuffer = pad(inputBuffer, 20);
console.log(paddedBuffer);
console.log(paddedBuffer.toString());