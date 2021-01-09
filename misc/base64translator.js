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

console.log(base64translate(`
Sometimes I feel like life is just a game
And I get the urge to jump in front of a moving train
But like some kind of sick joke
You keep me alive, 
Every time I pass out
You're there to revive.
`));