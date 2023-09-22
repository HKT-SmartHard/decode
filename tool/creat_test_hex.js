

function hex_join(hexString) {

    var combine = ""

    for (let i = 0; i < hexString.length - 1; i++) {
        combine += "0x" + hexString.slice(i, i + 2).toString() + ","
    }
    combine = combine.substring(0, combine.length - 1);
    
    return combine
}


var data = "12345678";
console.log(hex_join(data));