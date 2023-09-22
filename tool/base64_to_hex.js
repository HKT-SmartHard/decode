
function base64toHex(base64) {
    const binaryString = atob(base64);
    const hexArray = [];

    for (let i = 0; i < binaryString.length; i++) {
        const hex = binaryString.charCodeAt(i).toString(16);
        hexArray.push("0x");
        hexArray.push(hex.padStart(2, '0'));
        hexArray.push(",");
    }

    var hexString = hexArray.join('')
    hexString = hexString.substring(0, hexString.length - 1);

    return hexString;
}

const base64String = 'VCxTMSwwMDk1NjkwNjAwMDAyZGI2LDEsMyw4LCosKiwqLDI4LjE=';
console.log(base64toHex(base64String));

// var data = [0x68, 0x6b, 0x74, 0x00, 0x3e, 0x30, 0xc2, 0xff, 0x63, 0xbc, 0x5f, 0x94];
// console.log(easy_decode(data));
