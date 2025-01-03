/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2025 HKT SmartHard
 * 
 * @product OBA-1000
 */

function easy_decode(bytes) {
    var decoded = {};

    var len = bytes.length;

    if (len == 5) {
        decoded.SensorID = bytes[0];
        decoded.frameType = (bytes[1] & 0x01) === 0x01 ? "Data frame" : "Heartbeat frame";

        let alertStatus = bytes[2];
        switch (alertStatus) {
            case 0:
                decoded.alertStatus = "No alert";
                break;
            case 1:
                decoded.alertStatus = "Alert";
                break;
            case 2:
                decoded.alertStatus = "Delayed alert report";
                break;
        }

        // Parse anti - tamper status
        decoded.antiTamperStatus = (bytes[3] & 0x01) === 0x01 ? "Device tampered" : "Device not tampered";

        // Parse battery voltage and battery status
        let batteryData = bytes[4];
        if ((batteryData & 0x80) === 0x80) {
            decoded.batteryVoltage = (batteryData & 0x7F) * 0.1;
            decoded.batteryStatus = (batteryData & 0x7F) === 0x23 ? "Battery voltage is normal" : "Battery low voltage";
        } else {
            decoded.batteryVoltage = (batteryData & 0x7F) * 0.1;
            decoded.batteryStatus = "Battery voltage is normal";
        }
    }
    return decoded;
}

function Decoder(bytes, port) {
    return easy_decode(bytes);
}
