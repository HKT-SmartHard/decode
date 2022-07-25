/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product undefine
 */
function Decoder(bytes, port) {
    var decoded = {
        hard_ver: 0,
        soft_ver: 0,
        id: "",
        counterA: 0,
        counterB: 0,
    };

    if (checkReportSync(bytes) == false)
        return;

    var dataLen = bytes.length - 5;
    var i = 5;
    while (dataLen--) {
        var type = bytes[i];
        i++;
        switch (type) {
            case 0x01:  //software_ver and hardware_ver
                decoded.hard_ver = bytes[i];
                decoded.soft_ver = bytes[i + 1];
                dataLen -= 2;
                i += 2;
                break;
            case 0x02:  //ID
                decoded.id = hexToString(bytes.slice(i, i + 6));
                dataLen -= 6;
                i += 6;
                break;
            case 0x03:// BATTERY
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x07:// people counter report
                decoded.counterA = byteToUint16(bytes.slice(i, i + 2));
                decoded.counterB = byteToUint16(bytes.slice(i + 2, i + 4));

                dataLen -= 4;
                i += 4;
                break;
        }
    }
    return decoded;
}


function byteToUint16(bytes) {
    var value = bytes[0] * 0xFF + bytes[1];
    return value;
}

function byteToInt16(bytes) {
    var value = bytes[0] * 0xFF + bytes[1];
    return value > 0x7fff ? value - 0x10000 : value;
}

function byteToInt32(bytes) {
    var value = bytes[0] * 0xFF * 0xFF + bytes[1] * 0xFF + bytes[2];
    return value > 0x7fffff ? value - 0x1000000 : value;
}

function hexToString(bytes) {

    var value = "";
    var arr = bytes.toString(16).split(",");
    for (var i = 0; i < arr.length; i++) {
        value += parseInt(arr[i]).toString(16);
    }
    return value;
}

function checkReportSync(bytes) {
    if (bytes[0] == 0x68 && bytes[1] == 0x6B && bytes[2] == 0x74) {
        return true;
    }
    return false;
}

var info_report = [0x68, 0x6B, 0x74, 0x00, 0x01, 0x01, 0x01, 0x05, 0x02, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66];
var data_report = [0x68, 0x6B, 0x74, 0x00, 0x59, 0x07, 0x00, 0x33, 0x00, 0x22];

console.log(Decoder(info_report, 10))
console.log(Decoder(data_report, 10))

