/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product HKT-SNFV-100
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] === 0x02) {
        decoded.command = bytes[0];
        decoded.cumulativeFlow = readUInt32LE_SWP32(bytes.slice(1, 5)) / 1000 + "m3";
        decoded.equipmentStatus = bytes[5];
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

        decoded.equipmentAlarm = bytes[6];
        status = decoded.equipmentAlarm;
        if (status & 0x01) {
            decoded.batteryAlarm = "Alarm";
        } else {
            decoded.batteryAlarm = "Normal";
        }

        if (status & 0x04) {
            decoded.valveFaultAlarm = "Alarm";
        } else {
            decoded.valveFaultAlarm = "Normal";
        }

        if (status & 0x08) {
            decoded.strongMagneticInterferenceAlarm = "Alarm";
        } else {
            decoded.strongMagneticInterferenceAlarm = "Normal";
        }

        if (status & 0x10) {
            decoded.standbySwitchAlarm = "Alarm";
        } else {
            decoded.standbySwitchAlarm = "Normal";
        }

        if (status & 0x20) {
            decoded.hallFaultAlarm = "Alarm";
        } else {
            decoded.hallFaultAlarm = "Normal";
        }

        decoded.electricity = readUInt16LE_SWP16(bytes.slice(7, 9)) / 100 + "V";
        decoded.rssi = readInt8LE(bytes.slice(9, 10));
        decoded.snr = readInt8LE(bytes.slice(10, 11));
        decoded.frameidentification = readUInt8LE(bytes.slice(11, 12));
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

function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}