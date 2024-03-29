/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SM-100
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] === 0x02) {
        decoded.command = bytes[0];
        decoded.waterNumber = SWPHEXString(bytes.slice(1, 5));
        decoded.cumulativeFlow = readUInt32LE_SWP32(bytes.slice(5, 9)) / 1000 + "m³";
        decoded.topUpFlow = readUInt32LE_SWP32(bytes.slice(9, 13));
        decoded.equipmentStatus = bytes[13];
        var status = decoded.equipmentStatus;
        if (status & 0x04) {
            decoded.batteryStatus = "Low";
        } else {
            decoded.batteryStatus = "Normal";
        }
        if (status & 0x03) {
            decoded.valveStatus = "Abnormal";
        } else if (status & 0x01) {
            decoded.valveStatus = "OFF";
        } else {
            decoded.valveStatus = "ON";
        }

        decoded.equipmentAlarm = bytes[14];
        status = decoded.equipmentAlarm;
        if (status & 0x01) {
            decoded.batteryAlarm = "Alarm";
        } else {
            decoded.batteryAlarm = "Normal";
        }

        if (status & 0x02) {
            decoded.reverseFlow = "Alarm";
        } else {
            decoded.reverseFlow = "Normal";
        }

        if (status & 0x04) {
            decoded.valveFailure = "Alarm"; 
        } else {
            decoded.valveFailure = "Normal";
        }

        if (status & 0x08) {
            decoded.waterPipeLeakageFault = "Alarm";
        } else {
            decoded.waterPipeLeakageFault = "Normal";
        }

        if (status & 0x10) {
            decoded.temperatureSensorFault = "Alarm";
        } else {
            decoded.temperatureSensorFault = "Normal";
        }

        if (status & 0x20) {
            decoded.flowSensorFailureOrATC = "Alarm";
        } else {
            decoded.flowSensorFailureOrATC = "Normal";
        }

        if (status & 0x40) {
            decoded.waterPipeInstallationPositionReverse = "Reverse";
        } else {
            decoded.waterPipeInstallationPositionReverse = "Forward";
        }

        decoded.electricity = readUInt16LE_SWP16(bytes.slice(15, 17)) / 100 + "V";;
        decoded.rssi = readInt8LE(bytes.slice(17, 18));
        decoded.snr = readInt8LE(bytes.slice(18, 19));
        decoded.frameidentification = readUInt8LE(bytes.slice(19, 20));
    }
    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(byte) {
    return (byte & 0xFF);
}

function readUInt8LE_SWP8(byte) {
    return (value & 0xFF);
}

function readInt8LE(byte) {
    var ref = readUInt8LE(byte);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(byte) {
    var value = (byte[0] << 8) + byte[1];
    return (value & 0xFFFF);
}

function readUInt16LE_SWP16(byte) {
    var value = (byte[1] << 8) + byte[0];
    return (value & 0xFFFF);
}

function readInt16LE(byte) {
    var ref = readUInt16LE(byte);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(byte) {
    var value = (byte[0] << 24) + (byte[1] << 16) + (byte[2] << 8) + byte[3];
    return (value & 0xFFFFFFFF);
}

function readUInt32LE_SWP32(byte) {
    var value = (byte[3] << 24) + (byte[2] << 16) + (byte[1] << 8) + byte[0];
    return (value & 0xFFFFFFFF);
}

function readInt32LE(byte) {
    var ref = readUInt32LE(byte);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readInt32LE_SWP32(byte) {
    var ref = readUInt32LE_SWP32(byte);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function SWPHEXString(hexString) {
    var combine = ""
    var len = hexString.length
    while (len--) {
        combine += hexString[len].toString().toUpperCase().padStart(2, '0')
    }
    combine = combine.substring(0, combine.length);
    return combine
}

function Decoder(bytes, port) {
    return easy_decode(bytes);
}