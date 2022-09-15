/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product HKT-DMS01
 */

function Decoder(bytes, port) {

    var decoded = {};

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
            case 0x03:// battery
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x08:// door status
                decoded.doorStatus = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x22:// run mode
                decoded.runMode = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x23:// counter time
                decoded.startHours = bytes[i];
                decoded.startMins = bytes[i + 1];
                decoded.endHours = bytes[i + 2];
                decoded.endMins = bytes[i + 3];
                dataLen -= 4;
                i += 4;
                break;
            case 0x24:// counter intervel
                decoded.counterIntervel = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x25:// hearter intervel
                decoded.hearterIntervel = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x26:// counter report
                decoded.counterA = byteToUint16(bytes.slice(i, i + 2));
                decoded.counterB = byteToUint16(bytes.slice(i + 2, i + 4));
                decoded.totalCounterA = byteToUint32(bytes.slice(i + 4, i + 8));
                decoded.totalCounterB = byteToUint32(bytes.slice(i + 8, i + 12));
                dataLen -= 12;
                i += 12;
                break;
            case 0x84:// tamper status
                decoded.tamperStatus = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
        }
    }
    return decoded;
}

function byteToUint16(bytes) {
    var value = (bytes[0] << 8) | bytes[1];
    return value;
}

function byteToUint32(bytes) {
    var value = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | (bytes[3] << 0);
    return value;
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

var info_report = [0x68, 0x6B, 0x74, 0x00, 0x2D, 0x08, 0x00, 0x84, 0x00, 0x03, 0x5D];
var data_report = [0x68, 0x6B, 0x74, 0x00, 0x59, 0x26, 0x00, 0x33, 0x00, 0x22, 0x00, 0x00, 0x12, 0x22, 0x00, 0x00, 0x22, 0x22];

console.log(Decoder(info_report, 10))
console.log(Decoder(data_report, 10))


