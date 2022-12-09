/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product HKT-PS-100
 */
function Decoder(bytes, port) {

    var decoded = {};

    var type = bytes[0];
    switch (type) {
        case 0x01:// sensor heatbeat
            decoded.pressure = hex2float(bytes.slice(5, 9)); //Mpa
            decoded.angle = bytes[9];      //°
            decoded.temperature = bytes[10];    //℃
            decoded.battery = hex2float(bytes.slice(11, 15));   //v
            decoded.sampleFrequency = byteToUint16(bytes.slice(15, 17));    //sec
            decoded.reportFrequency = byteToUint16(bytes.slice(17, 19)); //min
            decoded.isInstall = bytes[19];
            break;
        case 0x02:// sensor alarm
            decoded.isPressureHighThresholdAlarm = bytes[5];
            decoded.isPressureLowThresholdAlarm = bytes[6];
            decoded.isAngleAlarm = bytes[7];
            decoded.isTemperatureAlarm = bytes[8];
            decoded.isVoltageAlarm = bytes[9];  //v
            decoded.pressure = hex2float(bytes.slice(10, 14)); //Mpa
            decoded.angle = bytes[14];      //°
            decoded.temperature = bytes[15];    //℃
            decoded.battery = hex2float(bytes.slice(16, 20));   //v
            break;
        case 0x03:  //sensor fault alarm
            decoded.isPressureFault = bytes[5];
            decoded.isAngleFault = bytes[6];
            decoded.pressure = hex2float(bytes.slice(7, 11)); //Mpa
            decoded.angle = bytes[11];
            break;
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

function byteToUint32(bytes) {
    var value = ((bytes[0] & 0xFF) << 24) |
        ((bytes[1] & 0xFF) << 16) |
        ((bytes[2] & 0xFF) << 8) |
        (bytes[3] & 0xFF);
    return value;
}


//IEEE754
function hex2float(bytes) {

    var num = byteToUint32(bytes);
    if(num == 0)
        return 0
    var sign = (num & 0x80000000) ? -1 : 1;
    var exponent = ((num >> 23) & 0xff) - 127;
    var mantissa = 1 + ((num & 0x7fffff) / 0x7fffff);
    return sign * mantissa * Math.pow(2, exponent);
}


var heatbeat_report = [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3F, 0x1E, 0x40, 0x01, 0xCA, 0xC1, 0x00, 0x1E, 0x00, 0x02, 0x01];
var alarm_report = [0x02, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x3F, 0x1E, 0x40, 0x01, 0xCA, 0xC1];
var fault_report = [0x03, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x3F];

console.log(Decoder(heatbeat_report, 10))
console.log(Decoder(alarm_report, 10))
console.log(Decoder(fault_report, 10))

