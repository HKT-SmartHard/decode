/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product  WorkCardmini  SIC-200
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] === 0x01) {
        decoded.fuctioncode = readUInt8LE(bytes.slice(0, 1));
        decoded.UTC = readUInt32LE(bytes.slice(1, 5));
        dateFormat(decoded.UTC);
        decoded.lat = readUInt32LE(bytes.slice(5, 9)) / 1000000;
        decoded.lon = readUInt32LE(bytes.slice(9, 13)) / 1000000;
        decoded.speed = readUInt16LE(bytes.slice(13, 15));
        decoded.electric = readUInt8LE(bytes.slice(15, 16));
    }
    else if (bytes[0] === 0x02) {
        decoded.fuctioncode = readUInt8LE(0, 1);
        decoded.UTC = readUInt32LE(bytes.slice(1, 5));
        decoded.Beacon_number = readUInt8LE(bytes.slice(5, 6));
        decoded.Beacon_ID_Major = {};
        decoded.Beacon_ID_Minor = {};
        decoded.RSSI = {};
        for (k = 1; k <= decoded.Beacon_number; k++) {
            decoded.Beacon_ID_Major[k] = readUInt16LE(bytes.slice(6 + 6 * (k - 1), 8 + 6 * (k - 1)));
            decoded.Beacon_ID_Minor[k] = readUInt16LE(bytes.slice(10 + 6 * (k - 1), 12 + 6 * (k - 1)));
            decoded.RSSI[k] = readUInt16LE(bytes.slice(12 + 6 * (k - 1), 14 + 6 * (k - 1)));
        }

    }
    else if (bytes[0] === 0x03) {
        decoded.fuctioncode = readUInt8LE(bytes.slice(0, 1));
        decoded.low_battery = readUInt8LE(bytes.slice(1, 2));
        decoded.charge = readUInt8LE(bytes.slice(2, 3));
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
    if (byte[7] & 0xF0)//求阶码与阶数
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

function dateFormat(timestamp) {
    var date = new Date(timestamp * 1000);
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = (date.getHours() + 8 >= 24 ? date.getDate() + 1 : date.getDate()) + ' ';
    h = (date.getHours() + 8 >= 24 ? '0' + (date.getHours() - 16) : date.getHours() + 8) + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();

    console.log(Y + M + D + h + m + s);
}

function Decoder(bytes, port) {
    return easy_decode(bytes);
}
