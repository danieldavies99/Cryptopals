//loading a text file into an array
var fs = require("fs");

function loadArray(path) {
  var array = fs.readFileSync(path).toString().split("\n");
  return array;
}

function loadString(path) {
  return fs.readFileSync(path, 'utf-8').toString();
}

//score string
function scoreString(string, penaltyValue) {
  let score = 0;
  for (let i = 0; i < string.length; i++) {
    if (
      string.charCodeAt(i) < 47 &&
      string.charCodeAt(i) != 32 && //space
      string.charCodeAt(i) != 10 && //space
      string.charCodeAt(i) != 9 && //tab
      string.charCodeAt(i) != 33 && //!
      string.charCodeAt(i) != 34 && //"
      string.charCodeAt(i) != 39 && //'
      string.charCodeAt(i) != 46 //.
    ) {
      score -= penaltyValue;
    }
    if (string.charCodeAt(i) > 122) {
      score -= penaltyValue;
    }
    if (
      string.charCodeAt(i) === 96 || //`
      string.charCodeAt(i) === 94 //^
    ) {
      score -= penaltyValue;
    }
    switch (string.charCodeAt(i)) {
      case 69: //e
      case 101:
        score += 12;
        break;

      case 84: //t
      case 116:
        score += 11;
        break;

      case 65: //a
      case 97:
        score += 10;
        break;

      case 79:
      case 111:
        score += 9;
        break;

      case 73: //i
      case 105:
        score += 8;
        break;

      case 78: //n
      case 110:
        score += 7;
        break;

      case 83: //s
      case 115:
        score += 6;
        break;

      case 72: //h
      case 104:
        score += 5;
        break;

      case 82: //r
      case 114:
        score += 4;
        break;

      case 68: //d
      case 100:
        score += 3;
        break;

      case 76: //l
      case 108:
        score += 3;
        break;

      case 85: //u
      case 117:
        score += 2;
        break;

      case 32: //space
      case 32:
        score += 4;
        break;
    }
  }
  return score;
}

module.exports = { scoreString, loadArray, loadString };
