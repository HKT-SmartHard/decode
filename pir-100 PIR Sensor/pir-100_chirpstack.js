/**
 * Payload Decoder for The Chirpstack v4
 *
 * Copyright 2025 HKT SmartHard
 *
 * @product PIR-100
 */

function easy_decode(bytes) {
    var decoded = {};

    var len = bytes.length;

    if (len == 5) {
        if (bytes[1] === 0x01) {
            decoded.reportType = "Heartbeat Report";
            decoded.sensorType = bytes[2];
            decoded.frameType = bytes[3];
            decoded.infraredStatus = bytes[4] === 0 ? "Not Triggered" : "Triggered";
            decoded.antiTamperSwitch = bytes[5] === 0 ? "Not Removed" : "Removed";
            decoded.batteryVoltage = bytes[6] / 10;
        } else if (bytes[1] === 0x02) {
            decoded.reportType = "Event Report";
            decoded.sensorType = bytes[2];
            decoded.frameType = bytes[3];
            decoded.infraredStatus = bytes[4] === 0 ? "Not Triggered" : "Triggered";
            decoded.antiTamperSwitch = bytes[5] === 0 ? "Not Removed" : "Removed";
            decoded.batteryVoltage = bytes[6] / 10;
        }
    }
    return decoded;
}

function bytesToUint32(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}


function decodeUplink(input) {
    let decoded = easy_decode(input.bytes);
    return { data: decoded };
}