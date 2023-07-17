/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product WorkCard SIC-100
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] === 0xaa) {
        decoded.transfer_number = readUInt8LE(bytes.slice(1, 2));
        decoded.function_number = readUInt8LE(bytes.slice(2, 3));

        if (bytes[2] === 0x01) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.UTC = readUInt32LE(bytes.slice(4, 8));
            decoded.lat = readUInt32LE(bytes.slice(8, 12)) / 1000000;
            decoded.lon = readUInt32LE(bytes.slice(12, 16)) / 1000000;
            decoded.speed = readUInt8LE(bytes.slice(16, 17));
            decoded.azimuth = readUInt16LEe(bytes.slice(17, 19));
            decoded.height = readUInt16LE(bytes.slice(19, 21));
            decoded.PDOP = readUInt16LE(bytes.slice(21, 23)) / 10;
            decoded.HDOP = readUInt16LE(bytes.slice(23, 25)) / 10;
            decoded.HACC = readUInt16LE(bytes.slice(25, 27)) / 10;
            decoded.step_number = readUInt16LE(bytes.slice(27, 29));
            decoded.electric_quantity = readUInt8LE(bytes.slice(29, 30));
        }
        else if (bytes[2] === 0x02) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.UTC = readUInt32LE(bytes.slice(4, 8));
            decoded.Beacon_number = readUInt8LE(bytes.slice(8, 9));
            decoded.Beacon_ID_Major = readUInt8LE(bytes.slice(9, 10));
            decoded.Beacon_ID_Minor = readUInt16LE(bytes.slice(10, 12));
            decoded.distance = readUInt16LE(bytes.slice(12, 14));
        }
        else if (bytes[2] === 0x03) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.UTC = readUInt32LE(bytes.slice(4, 8));
            decoded.Warn_ID = readUInt8LE(bytes.slice(8, 9)).toString(2);
        }
        else if (bytes[2] === 0x04) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.Voltage_supply = readUInt8LE(bytes.slice(4, 5)) / 10;
            decoded.step_number_sum = readUInt16LE(bytes.slice(5, 7));
            decoded.step_number_add = readUInt16LE(bytes.slice(7, 9));

        }
        else if (bytes[2] === 0x05) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.data_type = readUInt8LE(bytes.slice(4, 5));
            decoded.ID = readUInt16LE(bytes.slice(5, 7)).toString(16);
        }
        else if (bytes[2] === 0x06) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.ID = readUInt16LE(bytes.slice(4, 6));
        }
        else if (bytes[2] === 0x07) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.check = readUInt8LE(bytes.slice(4, 5));
        }
        else if (bytes[2] === 0x08) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.Receiver_fuction_number = readUInt8LE(bytes.slice(4, 5));
            decoded.location_mode = readUInt8LE(bytes.slice(5, 6));
            decoded.location_ON = readUInt8LE(bytes.slice(6, 7));
            decoded.GPS_Timespace = readUInt16LE(bytes.slice(7, 9));
            decoded.Blueteeth_Timespace = readUInt16LE(bytes.slice(9, 11));
            decoded.GPS_UP_Timespace = readUInt16LE(bytes.slice(11, 13));
            decoded.DateUP_ON = readUInt8LE(bytes.slice(13, 14));
            decoded.UTC = readUInt32LE(bytes.slice(14, 18));
        }
        else if (bytes[2] === 0x11) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.location_mode = readUInt8LE(bytes.slice(4, 5));
            decoded.BLE_Timespace = readUInt16LE(bytes.slice(5, 7));
            decoded.GPS_Timespace = readUInt16LE(bytes.slice(7, 9));
            decoded.BLE_UP_Time = readUInt16LE(bytes.slice(9, 11));
            decoded.GPS_UP_Time = readUInt16LE(bytes.slice(11, 13));
            decoded.GPS_ON = readUInt8LE(bytes.slice(13, 14));
            decoded.BLE_ON = readUInt8LE(bytes.slice(14, 15));
            decoded.DataUp_ON = readUInt8LE(bytes.slice(15, 16));
        }
        else if (bytes[2] === 0x15) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.voice = readUInt8LE(bytes.slice(4, 5));
        }
        else if (bytes[2] === 0x16) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.UTC = readuint32(bytes.slice(4, 8));
        }
        else if (bytes[2] === 0x17) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
            decoded.UTC = readuint32(bytes.slice(4, 8));
        }
        else if (bytes[2] === 0x19) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
        }
        else if (bytes[2] === 0x1c) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
        }
        else if (bytes[2] === 0x1d) {
            decoded.Data_Length = readUInt8LE(bytes.slice(3, 4));
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


