/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SCB-100
 * Version: 2.1 (Fixed Energy Calculation & Length Tolerance)
 * 
 * Changelog:
 * - Fixed Electric Power (Q) parsing: Low Bytes (19-20) + High Bytes (21-22).
 * - Fixed Scale Factor for Energy: Divided by 1000.
 * - Added tolerance for frames slightly shorter than 68 bytes (e.g., missing tail/CRC).
 */

function decodeUplink(input) {
    var bytes = input.bytes;
    
    if (!bytes || bytes.length < 50) {
        return { data: { error: "Frame too short" } };
    }

    // Check Header
    if (bytes[0] !== 0xAA) {
        return { data: { error: "Invalid Header" } };
    }

    var cmd = bytes[1];
    
    // Support Real-time Data (0x06, 0x07)
    if (cmd === 0x07 || cmd === 0x06) {
        
        // Helper: Read Big-Endian UInt16
        function readUInt16BE(buf, offset) {
            if (offset + 1 >= buf.length) return 0;
            return (buf[offset] << 8) | buf[offset + 1];
        }

        // Helper: Read Big-Endian Int16 (for signed temp)
        function readInt16BE(buf, offset) {
            if (offset + 1 >= buf.length) return 0;
            var val = (buf[offset] << 8) | buf[offset + 1];
            return (val > 0x7FFF) ? val - 0x10000 : val;
        }

        var decoded = {};
        decoded.CMD = cmd;
        decoded.addr = bytes[2];
        decoded.model = bytes[3]; 
        decoded.typeCode = bytes[4]; 
        
        var typeMap = { 0x06: "3/4P", 0x07: "2P", 0x08: "1P" };
        decoded.type = typeMap[bytes[4]] || "Unknown";

        // --- Parsing ---

        // Voltage (Index 6)
        decoded.totalVoltage = readUInt16BE(bytes, 6);
        
        // Leakage Current (Index 8)
        decoded.leakageCurrent = readUInt16BE(bytes, 8);
        
        // Power (Index 10)
        decoded.power = readUInt16BE(bytes, 10);
        
        // Temperature (Index 12)
        decoded.temperature = readUInt16BE(bytes, 12) / 10.0;
        
        // Current (Index 14)
        decoded.current = readUInt16BE(bytes, 14) / 100.0;

        // Warning (Index 16)
        var warningVal = readUInt16BE(bytes, 16);
        decoded.testUnfinished = (warningVal & 0x01) ? "1" : "0";
        decoded.leakageProtectionNormal = (warningVal & 0x02) ? "1" : "0";

        // *** ELECTRIC POWER CONSUMPTION (Q) ***
        // Protocol: Bytes 19-20 (Low), Bytes 21-22 (High)
        // Indices: 18-19 (Low), 20-21 (High)
        if (bytes.length >= 22) {
            var qLow = readUInt16BE(bytes, 18);
            var qHigh = readUInt16BE(bytes, 20);
            // Combine: High << 16 | Low
            var qTotal = (qHigh << 16) | qLow;
            // Scale: / 1000 based on sample data verification
            decoded.electricPowerConsumption = qTotal / 1000.0;
        } else {
            decoded.electricPowerConsumption = 0;
        }

        // Phase Voltages (Index 22, 24, 26)
        decoded.aPhaseVoltage = readUInt16BE(bytes, 22);
        decoded.bPhaseVoltage = (bytes.length >= 25) ? readUInt16BE(bytes, 24) : 0;
        decoded.cPhaseVoltage = (bytes.length >= 27) ? readUInt16BE(bytes, 26) : 0;

        // Phase Currents (Index 28, 30, 32, 34)
        decoded.aPhaseCurrent = (bytes.length >= 29) ? readUInt16BE(bytes, 28) / 100.0 : 0;
        decoded.bPhaseCurrent = (bytes.length >= 31) ? readUInt16BE(bytes, 30) / 100.0 : 0;
        decoded.cPhaseCurrent = (bytes.length >= 33) ? readUInt16BE(bytes, 32) / 100.0 : 0;
        decoded.nPhaseCurrent = (bytes.length >= 35) ? readUInt16BE(bytes, 34) / 100.0 : 0;

        // Phase Power (Index 36, 38, 40)
        decoded.aPhasePower = (bytes.length >= 37) ? readUInt16BE(bytes, 36) : 0;
        decoded.bPhasePower = (bytes.length >= 39) ? readUInt16BE(bytes, 38) : 0;
        decoded.cPhasePower = (bytes.length >= 41) ? readUInt16BE(bytes, 40) : 0;

        // Phase Warnings (Index 42, 44, 46)
        var aWarn = (bytes.length >= 43) ? readUInt16BE(bytes, 42) : 0;
        var bWarn = (bytes.length >= 45) ? readUInt16BE(bytes, 44) : 0;
        var cWarn = (bytes.length >= 47) ? readUInt16BE(bytes, 46) : 0;

        decoded.aPhaseTestUnfinished = (aWarn & 0x01) ? "1" : "0";
        decoded.aPhaseLeakageProtectionNormal = (aWarn & 0x02) ? "1" : "0";
        
        decoded.bPhaseTestUnfinished = (bWarn & 0x01) ? "1" : "0";
        decoded.bPhaseLeakageProtectionNormal = (bWarn & 0x02) ? "1" : "0";

        decoded.cPhaseTestUnfinished = (cWarn & 0x01) ? "1" : "0";
        decoded.cPhaseLeakageProtectionNormal = (cWarn & 0x02) ? "1" : "0";

        // Closing Status (Index 48)
        var closingVal = (bytes.length >= 49) ? readUInt16BE(bytes, 48) : 0;
        decoded.onOff = (closingVal === 0x5A00) ? 1 : 0;

        // Power Factors (Index 50, 52, 54)
        decoded.aPhasePowerFactor = (bytes.length >= 51) ? readUInt16BE(bytes, 50) / 100.0 : 0;
        decoded.bPhasePowerFactor = (bytes.length >= 53) ? readUInt16BE(bytes, 52) / 100.0 : 0;
        decoded.cPhasePowerFactor = (bytes.length >= 55) ? readUInt16BE(bytes, 54) / 100.0 : 0;

        // Terminal Temperatures (Index 56, 58, 60, 62)
        decoded.aTerminalTemperature = (bytes.length >= 57) ? readUInt16BE(bytes, 56) / 10.0 : 0;
        decoded.bTerminalTemperature = (bytes.length >= 59) ? readInt16BE(bytes, 58) / 10.0 : 0;
        decoded.cTerminalTemperature = (bytes.length >= 61) ? readUInt16BE(bytes, 60) / 10.0 : 0;
        decoded.nTerminalTemperature = (bytes.length >= 63) ? readUInt16BE(bytes, 62) / 10.0 : 0;

        // Remote Control (Index 64)
        decoded.canRemoteCtrl = (bytes.length >= 65) ? bytes[64] : 0;

        // Frame Tail Check (Optional Warning)
        var frameValid = true;
        if (bytes.length >= 68) {
            if (bytes[bytes.length - 1] !== 0x55) frameValid = false;
        } else {
            // If length < 68, we parsed what we could, but note it might be truncated
            frameValid = false; 
        }

        // Format Output
        return {
            data: {
                decodeStatus: true,
                decodeData: {
                    properties: {},
                    events: [],
                    funcReply: {},
                    subData: [{
                        childSign: decoded.addr.toString(),
                        properties: {
                            fullLoadCurrent: decoded.model,
                            devSpecs: decoded.typeCode.toString(),
                            totalVoltage: decoded.totalVoltage,
                            leakageCurrent: decoded.leakageCurrent,
                            power: decoded.power,
                            temperature: decoded.temperature,
                            current: decoded.current,
                            testUnfinished: decoded.testUnfinished,
                            leakageProtectionNormal: decoded.leakageProtectionNormal,
                            electricPowerConsumption: decoded.electricPowerConsumption,
                            aPhaseVoltage: decoded.aPhaseVoltage,
                            bPhaseVoltage: decoded.bPhaseVoltage,
                            cPhaseVoltage: decoded.cPhaseVoltage,
                            aPhaseCurrent: decoded.aPhaseCurrent,
                            bPhaseCurrent: decoded.bPhaseCurrent,
                            cPhaseCurrent: decoded.cPhaseCurrent,
                            nPhaseCurrent: decoded.nPhaseCurrent,
                            aPhasePower: decoded.aPhasePower,
                            bPhasePower: decoded.bPhasePower,
                            cPhasePower: decoded.cPhasePower,
                            aPhaseTestUnfinished: decoded.aPhaseTestUnfinished,
                            aPhaseLeakageProtectionNormal: decoded.aPhaseLeakageProtectionNormal,
                            bPhaseTestUnfinished: decoded.bPhaseTestUnfinished,
                            bPhaseLeakageProtectionNormal: decoded.bPhaseLeakageProtectionNormal,
                            cPhaseTestUnfinished: decoded.cPhaseTestUnfinished,
                            cPhaseLeakageProtectionNormal: decoded.cPhaseLeakageProtectionNormal,
                            onOff: decoded.onOff,
                            aPhasePowerFactor: decoded.aPhasePowerFactor,
                            bPhasePowerFactor: decoded.bPhasePowerFactor,
                            cPhasePowerFactor: decoded.cPhasePowerFactor,
                            aTerminalTemperature: decoded.aTerminalTemperature,
                            bTerminalTemperature: decoded.bTerminalTemperature,
                            cTerminalTemperature: decoded.cTerminalTemperature,
                            nTerminalTemperature: decoded.nTerminalTemperature,
                            canRemoteCtrl: decoded.canRemoteCtrl
                        },
                        events: []
                    }]
                }
            }
        };
    }

    return { data: { decodeStatus: false, message: "Unsupported CMD: 0x" + cmd.toString(16) } };
}

function Decoder(bytes, port) {
    return decodeUplink({ bytes: bytes }).data;
}
