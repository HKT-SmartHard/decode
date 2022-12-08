/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product HKT-SD-100
 */
function Decoder(bytes, port) {

    var decoded = {};

    if (checkReportSync(bytes) == false)
        return;

    var status = byteToUint16Swap(bytes.slice(2, 4));

    decoded.voltageAlarm = status >> 8 & 0x01;
    decoded.tamperAlarm = status >> 4 & 0x01;
    decoded.faultAlarm = status >> 2 & 0x01;
    decoded.smokeAlarm = status >> 1 & 0x01;

    var dataLen = bytes[4];
    var i = 5;
    while (dataLen--) {
        var type = bytes[i];
        i++;
        switch (type) {
            case 0x88:// battery /mv
                decoded.battery = byteToUint16Swap(bytes.slice(i, i + 2));
                i += 2;
                break;
            case 0x03:// temperature /0.1℃
                decoded.temperature = byteToUint16Swap(bytes.slice(i, i + 2)) / 10;
                i += 2;
                break;
            case 0xff:// report interval /min
                decoded.reportInterval = byteToUint16Swap(bytes.slice(i, i + 2));
                i += 2;
                break;
        }
    }
    return decoded;
}


function byteToUint16Swap(bytes) {
    var value = (bytes[1] << 8) | bytes[0];
    return value;
}


function checkReportSync(bytes) {
    if (bytes[0] == 0x01 && bytes[1] == 0x28) {
        return true;
    }
    return false;
}


var data_report = [0x01, 0x28, 0x10, 0x00, 0x03, 0x88, 0x00, 0x0c, 0x03, 0xbc, 0x00, 0xff, 0xa0, 0x05];

console.log(Decoder(data_report, 10))

