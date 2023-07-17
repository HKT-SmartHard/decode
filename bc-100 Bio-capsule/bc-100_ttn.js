/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product BC-100
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] === 0xF2)//帧类型
    {
        decoded.Temperature = readInt16LE(bytes.slice(1, 3)) / 100;
        decoded.Gastric_momentum = readUInt32LE(bytes.slice(3, 7));
        decoded.acc_x = readInt8LE(bytes.slice(7, 8));
        decoded.acc_y = readInt8LE(bytes.slice(8, 9));
        decoded.acc_z = readInt8LE(bytes.slice(9, 10));
        decoded.Bat = readUInt8LE(bytes.slice(10, 11));
        //decoded.PH=readUInt8LE(bytes.slice(11,12))/10;
    }
    else if (bytes[0] === 0xF5)//帧类型
    {
        decoded.Temperature = readInt16LE(bytes.slice(1, 3));
        decoded.Gastric_momentum = readUInt32LE(bytes.slice(3, 7));
        decoded.acc_x = readInt8LE(bytes.slice(7, 8));
        decoded.acc_y = readInt8LE(bytes.slice(8, 9));
        decoded.acc_z = readInt8LE(bytes.slice(9, 10));
        decoded.Bat = readUInt8LE(bytes.slice(10, 11));
        //  decoded.PH=readUInt8LE(bytes.slice(11,12))/10;
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
    if (byte[7] & 0xF0)
    {
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

function Decoder(bytes, port) {
    return easy_decode(bytes);
}
