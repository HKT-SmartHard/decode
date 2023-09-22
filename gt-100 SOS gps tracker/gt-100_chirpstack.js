/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-GT10
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] == 0xaa) {
        decoded.UTC = readUInt32LE(bytes.slice(1, 5));
        decoded.lat = readUInt32LE(bytes.slice(5, 9)) / 1000000;
        decoded.lon = readUInt32LE(bytes.slice(9, 13)) / 1000000;
        decoded.speed = readUInt8LE(bytes.slice(13, 14));
        decoded.azimuth = readUInt16LE(bytes.slice(14, 16));
        decoded.hight = readUInt16LE(bytes.slice(16, 18));
        console.log(formatDate(decoded.UTC));
        if (bytes[18] == 0x01) {
            decoded.functioncode = readUInt8LE(bytes.slice(18, 19));
            decoded.Datelength = readUInt8LE(bytes.slice(19, 20));
            decoded.warning = readUInt8LE(bytes.slice(20, 21));
        }
        else if (bytes[18] == 0x02) {
            decoded.functioncode = readUInt8LE(bytes.slice(18, 19));
            decoded.Datelength = readUInt8LE(bytes.slice(19, 20));
            decoded.step_number = readUInt16LE(bytes.slice(20, 22));
            decoded.Woek_ID = ((bytes[22] * Math.pow(2, 24)) + (bytes[23] * Math.pow(2, 16)) + (bytes[24] * Math.pow(2, 8)) + bytes[25]).toString(16);
            decoded.electric = readUInt8LE(bytes.slice(26, 27));
        }

    }
    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return (bytes & 0xFF);
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
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

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

/* ******************************************
 * util
 ********************************************/
function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
    var date = new Date(time * 1000);

    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index;
    });

    var newTime = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

    return newTime;
}

function bytesToHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}


function HexString2Bytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 !== 0) {
        return null;
    }
    len /= 2;
    var arrBytes = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        arrBytes.push(v);
        pos += 2;
    }
    return arrBytes;
}

function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}

