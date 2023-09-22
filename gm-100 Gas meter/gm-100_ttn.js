/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] === 0x02) {        //PAFDS
        decoded.accumulated_traffic = readUInt32LE_SWP32(bytes.slice(1, 5)) / 1000; //m^3
        decoded.total_purchase_amount = readUInt32LE_SWP32(bytes.slice(5, 9)) / 1000;//m^3
        decoded.temperature = readUInt16LE_SWP16(bytes.slice(9, 11)) / 100;  //℃
        decoded.pressure_value = readUInt16LE_SWP16(bytes.slice(11, 13)) / 100;  //kpa
        decoded.device_status = readUInt8LE(bytes.slice(13, 14));
        decoded.alarm_status = readUInt8LE(bytes.slice(14, 15));
        decoded.electricity_voltage = readUInt16LE_SWP16(bytes.slice(15, 17)) / 100;
    }
    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return (bytes & 0xFF);
}

function readUInt8LE_SWP8(bytes) {
    return (value & 0xFF);
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function readUInt16LE_SWP16(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
}

function readUInt32LE_SWP32(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFFFFFF);
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readInt32LE_SWP32(bytes) {
    var ref = readUInt32LE_SWP32(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

function readDoubleLE(bytes) {
    var n;
    var Exponent;
    if (bytes[7] & 0xF0) {
        bytes[7] = bytes[7] & 0x7F;
        Exponent = (bytes[7] << 4) + ((bytes[6] & 0xF0) >> 4);
        n = Exponent - 1023;
    }
    else {
        Exponent = (bytes[7] << 4) + ((bytes[6] & 0xF0) >> 4);
        n = Exponent - 1023;
    }
    var integer = ((bytes[6] & 0x0F) << 24) + (bytes[5] << 16) + (bytes[4] << 8) + bytes[3];
    var Integer = (integer >> (28 - n)) + (0x01 << n);
    var decimal = (integer - ((integer >> (28 - n)) << (28 - n))) / Math.pow(2, 28 - n);
    return Integer + decimal;
}

function readX16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function readX16LE_SWP32(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}

function readS16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function readS16LE_SWP32(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return (value & 0xFFFF);
}

function dateFormat(timestamp) {
    var date = new Date(timestamp * 1000);
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + 8 + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return (Y + M + D + h + m + s);
}

function Decoder(bytes, port) {
    return easy_decode(bytes);
}