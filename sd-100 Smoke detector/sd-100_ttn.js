/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SD-100
 */



function easy_decode(bytes) {
    var decoded = {};

    if (checkReportSync(bytes) == false)
        return;

    var temp;
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
            case 0x89:// BATTERY
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x09:// TEMPERATURE
                temp = byteToInt32(bytes.slice(i, i + 3));
                if (temp > 0x7FFFFFFF)
                    temp = -(temp & 0x7FFFFFFF);
                // ℃
                decoded.temperature = byteToInt32(bytes.slice(i, i + 3)) / 1000;

                // ℉
                // decoded.temperature = byteToInt16(bytes.slice(i, i + 3)) / 1000 * 1.8 + 32;

                dataLen -= 3;
                i += 3;
                break;
            case 0x27:// SMOKE_WARNING
                decoded.smoke_warning = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x28:// TEMPERATURE_WARNING
                decoded.temperature_warning = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
        }
    }
    return decoded;
}



function byteToUint16(bytes) {
    var value = (bytes[1] << 8) | bytes[0];
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


function Decoder(bytes, port) {
    return easy_decode(bytes);
}
