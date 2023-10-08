

function hex_join(hexString) {

    var combine = ""

    for (let i = 0; i < hexString.length-1; i += 2) {
        combine += "0x" + hexString.slice(i, i + 2).toString() + ","
    }
    combine = combine.substring(0, combine.length - 1);
    
    return combine
}


var data = "BD02800035A0116575";
console.log(hex_join(data));

var data1 = "EF AA F8 08 CD";
console.log(data1.replaceAll(" ",",0x"));