function eightBitByteString(n) {
    if (n < 0 || n > 255 || n % 1 !== 0) {
        throw new Error(n + " does not fit in a byte");
    }
    return ("000000000" + n.toString(2)).substr(-8)
}

function base64translate(input) {
    const base64characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    let byteString = '';
    for(const c of input) {
        byteString += eightBitByteString(c.charCodeAt(0));
    }
    let sixBitByteArray = byteString.match(/[\s\S]{1,6}/g) || [];
    while(sixBitByteArray[sixBitByteArray.length - 1].length % 6 !== 0) {
        sixBitByteArray[sixBitByteArray.length - 1] += 0;
    }
    let result = sixBitByteArray.reduce((result, current) => {
        return result += base64characters[parseInt(current,2)]
    }, "");
    while(result.length % 4 !== 0) {
        result += "=";
    }
    return result;
}

console.log(base64translate(`49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d`));