var input = "1c0111001f010100061a024b53535009181c";
var key = "686974207468652062756c6c277320657965";
var solution = "746865206b696420646f6e277420706c6179";

var inputBuffer = Buffer.from(input, "hex");
var keyBuffer = Buffer.from(key, "hex");

var results = [];

for (var i = 0; i < inputBuffer.length; i++) {
  //^	
  //XOR	
  //x = 5 ^ 1	
  //0101 ^ 0001	
  //0100	 
  //4
  results.push(inputBuffer[i] ^ keyBuffer[i]);
}
console.log(
  "xor'd matches solution: " +
    (Buffer.from(results).toString("hex") === solution)
);
