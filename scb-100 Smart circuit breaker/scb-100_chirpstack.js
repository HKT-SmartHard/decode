/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SCB-100
 */

function easy_decode(bytes) {
    var decoded = {};
    if (bytes[0] === 0xAA) {
        if (bytes[1] === 0x07 || bytes[1] === 0x06) {
            if (bytes.length === 68)
                decoded.CMD = readUInt8LE(bytes.slice(1, 2));
            decoded.addr = readUInt8LE(bytes.slice(2, 3));
            decoded.Ratedcurrent = readUInt8LE(bytes.slice(3, 4));
            decoded.types = readUInt8LE(bytes.slice(4, 5));
            decoded.payload = readUInt8LE(bytes.slice(5, 6));
            decoded.Totalvoltage = readUInt16LE(bytes.slice(6, 8));
            decoded.Leakagecurrent = readUInt16LE(bytes.slice(8, 10));
            decoded.power = readUInt16LE(bytes.slice(10, 12));
            decoded.temperature = readInt16LE(bytes.slice(12, 14)) / 10;
            decoded.current = readUInt16LE(bytes.slice(14, 16));
            decoded.warning = readUInt16LE(bytes.slice(16, 18)).toString(2);
            decoded.Q = readUInt32LE_SWP32(bytes.slice(18, 22));
            decoded.Phasevoltage_A = readUInt16LE(bytes.slice(22, 24));
            decoded.Phasevoltage_B = readUInt16LE(bytes.slice(24, 26));
            decoded.Phasevoltage_C = readUInt16LE(bytes.slice(26, 28));
            decoded.Phasecurrent_A = readUInt16LE(bytes.slice(28, 30));
            decoded.Phasecurrent_B = readUInt16LE(bytes.slice(30, 32));
            decoded.Phasecurrent_C = readUInt16LE(bytes.slice(32, 34));
            decoded.Phasecurrent_N = readUInt16LE(bytes.slice(34, 36));
            decoded.Phasepower_A = readUInt16LE(bytes.slice(36, 38));
            decoded.Phasepower_B = readUInt16LE(bytes.slice(38, 40));
            decoded.Phasepower_C = readUInt16LE(bytes.slice(40, 42));
            decoded.Phase_A_Warning = readUInt16LE(bytes.slice(42, 44));
            decoded.Phase_B_Warning = readUInt16LE(bytes.slice(44, 46));
            decoded.Phase_C_Warning = readUInt16LE(bytes.slice(46, 48));
            decoded.closing = readUInt16LE(bytes.slice(48, 50)).toString(16);
            decoded.Phasepower_factor_A = readUInt16LE(bytes.slice(50, 52));
            decoded.Phasepower_factor_B = readUInt16LE(bytes.slice(52, 54));
            decoded.Phasepower_factor_C = readUInt16LE(bytes.slice(54, 56));
            decoded.temperature_A = readUInt16LE(bytes.slice(56, 5));
            decoded.temperature_B = readUInt16LE(bytes.slice(58, 60));
            decoded.temperature_C = readUInt16LE(bytes.slice(60, 62));
            decoded.temperature_N = readUInt16LE(bytes.slice(62, 64));
            decoded.Remotecontrol = readUInt8LE(bytes.slice(64, 65));
        }
        else if (bytes[1] === 0x05 && bytes.length === 49) {
            decoded.CMD = readUInt8LE(bytes.slice(1, 2));
            decoded.addr = readUInt8LE(bytes.slice(2, 3));
            decoded.Types_Loadcurrent = readUInt8LE(bytes.slice(3, 4));
            decoded.Types = readUInt8LE(bytes.slice(4, 5));
            decoded.Datalength = readUInt8LE(bytes.slice(5, 6));
            decoded.voltagelimit_UP = readUInt16LE(bytes.slice(6, 8));
            decoded.voltagelimit_Down = readUInt16LE(bytes.slice(8, 10));
            decoded.Ratedcurrent_limit_UP = readUInt16LE(bytes.slice(10, 12));
            decoded.powerlimit_UP = readUInt16LE(bytes.slice(12, 14));
            decoded.temperaturelimit = readUInt16LE(bytes.slice(14, 16));
            decoded.currentlimit = readUInt16LE(bytes.slice(16, 18));
            decoded.Phasecurrent_A_UPLimit = readUInt16LE(bytes.slice(18, 20));
            decoded.Phasecurrent_B_UPLimit = readUInt16LE(bytes.slice(20, 22));
            decoded.Phasecurrent_C_UPLimit = readUInt16LE(bytes.slice(22, 24));
            decoded.Phasepower_A_UPLimit = readUInt16LE(bytes.slice(24, 26));
            decoded.Phasepower_B_UPLimit = readUInt16LE(bytes.slice(26, 28));
            decoded.Phasepower_C_UPLimit = readUInt16LE(bytes.slice(28, 30));
            decoded.V_Warn_UPLimit = readUInt16LE(bytes.slice(30, 32));
            decoded.V_Warn_DownLimit = readUInt16LE(bytes.slice(32, 34));
            decoded.Ratedcurrent_Warn_UPLimit = readUInt16LE(bytes.slice(34, 36));
            decoded.temperature_Warn_UPLimit = readUInt16LE(bytes.slice(36, 38)) / 10;
            decoded.current_A_Warning = readUInt16LE(bytes.slice(38, 40));
            decoded.current_B_Warning = readUInt16LE(bytes.slice(40, 42));
            decoded.current_C_Warning = readUInt16LE(bytes.slice(42, 44));
            decoded.current_warning = readUInt16LE(bytes.slice(44, 46));
        }
        else if (bytes.length === 7) {
            decoded.CMD = readUInt8LE(bytes.slice(1, 2));
            decoded.addr = readUInt8LE(bytes.slice(2, 3));
            decoded.Datalength = readUInt8LE(bytes.slice(3, 4));
        }
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

function readDoubleLE(byte) {
    var n;
    var Exponent;
    if (byte[7] & 0xF0) {
        byte[7] = byte[7] & 0x7F;
        Exponent = (byte[7] << 4) + ((byte[6] & 0xF0) >> 4);
        n = Exponent - 1023;
    }
    else {
        Exponent = (byte[7] << 4) + ((byte[6] & 0xF0) >> 4);
        n = Exponent - 1023;
    }
    var integer = ((byte[6] & 0x0F) << 24) + (byte[5] << 16) + (byte[4] << 8) + byte[3];
    var Integer = (integer >> (28 - n)) + (0x01 << n);
    var decimal = (integer - ((integer >> (28 - n)) << (28 - n))) / Math.pow(2, 28 - n);
    return Integer + decimal;

}


function readX16LE(byte) {
    var value = (byte[0] << 8) + byte[1];
    return (value & 0xFFFF);
}

function readX16LE_SWP32(byte) {
    var value = (byte[1] << 8) + byte[0];
    return (value & 0xFFFF);
}

function readS16LE(byte) {
    var value = (byte[0] << 8) + byte[1];
    return (value & 0xFFFF);
}

function readS16LE_SWP32(byte) {
    var value = (byte[1] << 8) + byte[0];
    return (value & 0xFFFF);
}

function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}
