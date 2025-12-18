/**
 * Payload Decoder for Chirpstack v4
 *
 * Copyright 2025 HKT SmartHard
 * 
 * @product Liquid level sensor
 */
function decodeUplink(input) {
    const bytes = input.bytes;
    if (bytes.length !== 5 || bytes[0] !== 0x05) {
        return { data: { error: "Invalid data" } };
    }
    
    const decoded = {
        sensorType: bytes[0],
        frameType: bytes[1],
        frame: bytes[1] === 0x01 ? "Heartbeat" : bytes[1] === 0x02 ? "Alert" : "Unknown",
        batteryVoltage: (bytes[2] & 0x7F) / 10,
        batteryStatus: (bytes[2] & 0x80) ? "Low" : "Normal",
        liquidLevel: (bytes[3] << 8) | bytes[4],
        unit: "cm"
    };
    
    if (bytes[1] === 0x02) {
        decoded.alert = decoded.liquidLevel > 0 ? "Alert" : "Normal";
    }
    
    return { data: decoded };
}