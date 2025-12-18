/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2025 HKT SmartHard
 * 
 * @product Liquid level sensor
 */

function Decoder(bytes, port) {
    var decoded = {};
    
    if (bytes.length !== 5 || bytes[0] !== 0x05) {
        decoded.error = "Invalid data format";
        return decoded;
    }
    
    decoded.SensorID = bytes[0];
    decoded.frameType = bytes[1] === 0x01 ? "Heartbeat frame" : 
                       bytes[1] === 0x02 ? "Alert frame" : "Unknown frame";
    
    // Parse battery voltage and status (byte 2)
    var batteryData = bytes[2];
    decoded.batteryVoltage = (batteryData & 0x7F) * 0.1;
    decoded.batteryStatus = (batteryData & 0x80) ? "Battery low voltage" : "Battery voltage is normal";
    
    // Parse liquid level (bytes 3-4, big endian)
    decoded.liquidLevel = (bytes[3] << 8) | bytes[4];
    decoded.liquidLevelUnit = "cm";
    
    // For alert frames, add alert status
    if (bytes[1] === 0x02) {
        decoded.alertStatus = decoded.liquidLevel > 0 ? "Alert" : "No alert";
    }
    
    return decoded;
}