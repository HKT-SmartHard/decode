/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product BC-100
 */


function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] == 0xF2) {
        decoded.Temperature = readInt16LE(bytes.slice(1, 3)) / 100;
        decoded.Gastric_momentum = readUInt32LE(bytes.slice(3, 7));
        decoded.acc_x = readInt8LE(bytes.slice(7, 8));
        decoded.acc_y = readInt8LE(bytes.slice(8, 9));
        decoded.acc_z = readInt8LE(bytes.slice(9, 10));
        decoded.Bat = readUInt8LE(bytes.slice(10, 11));
        //decoded.PH=readUInt8LE(bytes.slice(11,12))/10;
    }
    else if (bytes[0] >= 0xC1 && bytes[0] <= 0xC6) {
        let uint = (1 << ((bytes[0] & 0x0F) - 1) )/ 127.0
        if(bytes[0] == 0xC5){
            uint = 20 /127
        }else if(bytes[0] == 0xC6){
            uint = 40 /127
        }
        var sensorStatus = bytes[1]

        if ((sensorStatus >> 7) & 0x01) {
            decoded.sensorStatus = "Reboot";
        }

        if ((sensorStatus >> 4) & 0x01) {
            decoded.sensorStatus = "ACC XYZ Same";
        }

        if ((sensorStatus >> 3) & 0x01) {
            decoded.sensorStatus = "ACC Init Fail";
        }

        if ((sensorStatus >> 2) & 0x01) {
            decoded.sensorStatus = "Temperature unusual";
        }

        if ((sensorStatus >> 1) & 0x01) {
            decoded.sensorStatus = "CRC ERROR";
        }

        if ((sensorStatus) & 0x01) {
            decoded.sensorStatus = "NO ACK";
        }

        var value = readInt12LE(bytes.slice(2, 4))
        let temperature = (value * 3100.0 / 2048.0 + 4000) / 100.0 - 0.4 + 0.005;
        decoded.Temperature = parseFloat(temperature.toFixed(2));

        value =  readInt8LE(bytes[4]) * uint + decoded.Temperature
        decoded.Temperature_1 = parseFloat(value.toFixed(2));

        value = readInt8LE(bytes[5]) * uint + decoded.Temperature_1
        decoded.Temperature_2 = parseFloat(value.toFixed(2));

        value = readInt8LE(bytes[6]) * uint + decoded.Temperature_2
        decoded.Temperature_3 = parseFloat(value.toFixed(2));

        value = readInt8LE(bytes[7]) * uint + decoded.Temperature_3
        decoded.Temperature_4 = parseFloat(value.toFixed(2));

        value = readInt8LE(bytes[8]) * uint + decoded.Temperature_4
        decoded.Temperature_5 = parseFloat(value.toFixed(2));

        value = readInt8LE(bytes[9]) * uint + decoded.Temperature_5
        decoded.Temperature_6 = parseFloat(value.toFixed(2));

        decoded.Gastric_momentum = readUInt32LE(bytes.slice(10, 14));
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

function readInt12LE(byte) {
    var ref = readUInt16LE(byte) & 0xFFF;
    return (ref > 0x7FF) ? ref - 0x1000 : ref;
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

