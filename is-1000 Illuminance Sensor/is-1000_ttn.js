/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2025 HKT SmartHard
 * 
 * @product IS-1000 Illuminance Sensor
 */

function easy_decode(bytes) {
    let decodedData = {};
    let dataLength = bytes.length - 1;
    let index = 1;
    while (dataLength--) {
        let typeCode = bytes[index];
        switch (typeCode) {
            case 0x01:
                decodedData.productModel = bytes[index + 1];
                dataLength -= 2;
                index += 2;
                break;
            case 0x04:
                decodedData.batteryVoltage = ((bytes[index + 1] << 8) | bytes[index + 2]).toString() + "mV";
                dataLength -= 3;
                index += 3;
                break;
            case 0x7d:
                decodedData.batteryStatus = (bytes[index + 1] & 0x01) === 0x01 ? "Battery low voltage" : "Battery voltage is normal";
                dataLength -= 2;
                index += 2;
                break;
            case 0x77:
                decodedData.antiTamperStatus = (bytes[index + 1] & 0x01) === 0x01 ? "Device tampered" : "Device not tampered";
                dataLength -= 2;
                index += 2;
                break;
            case 0x48:
                decodedData.illuminance = bytesToUint32(bytes.slice(index + 1, index + 5)).toString() + "lux";
                dataLength -= 5;
                index += 5;
                break;
            case 0x05:
                decodedData.lowBatteryVoltageWarning = (bytes[index + 1] & 0x01) === 0x01 ? "low voltage" : "normal";
                dataLength -= 2;
                index += 2;
                break;
            case 0x03:
                decodedData.antiTamperEvent = (bytes[index + 1] & 0x01) === 0x01 ? "yes" : "no";
                dataLength -= 2;
                index += 2;
                break;
            default:
                dataLength = 0;
                break;
        }
    }
    return decodedData;
}

function bytesToUint32(bytes) {
    return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}

function Decoder(bytes, port) {
    return easy_decode(bytes);
}
