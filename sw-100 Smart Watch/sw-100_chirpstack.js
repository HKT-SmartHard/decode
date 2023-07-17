/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SW-100
 */

function easy_decode(bytes) {
    var decoded = {};
    if (bytes[0] === 0xbd && bytes[1] === 0xbd && bytes[2] === 0xbd && bytes[3] === 0xbd) {
        if (bytes[4] === 0xF6 && bytes.length === 17)//Battery voltage upload
        {
            decoded.Bat_volt = readUInt16LE_SWP16(bytes.slice(5, 7));
            decoded.Step_num = readUInt32LE_SWP32(bytes.slice(7, 11));
            decoded.Signal_strength = readUInt8LE(bytes.slice(11, 12));
            decoded.Timestamp = readInt32LE_SWP32(bytes.slice(12, 16));
            decoded.Time = dateFormat(decoded.Timestamp);

        }
        else if (bytes[4] === 0x03 && bytes.length === 29)//Uplink GPS location
        {
            decoded.lon = readDoubleLE(bytes.slice(5, 13));
            decoded.lat = readDoubleLE(bytes.slice(13, 21));
            decoded.north_south = String.fromCharCode(readUInt8LE(bytes.slice(21, 22)));
            decoded.east_west = String.fromCharCode((bytes.slice(22, 23)));
            decoded.status = String.fromCharCode(readUInt8LE(bytes.slice(23, 24)));
            decoded.Timestamp = readInt32LE_SWP32(bytes.slice(24, 28));
            decoded.Time = dateFormat(decoded.Timestamp);
        }
        else if (bytes[4] === 0xC2 && bytes.length === 16)//blood pressure
        {
            decoded.bp_high = readUInt16LE_SWP16(bytes.slice(5, 7));
            decoded.bp_low = readUInt16LE_SWP16(bytes.slice(7, 9));
            decoded.Bp_heart = readUInt16LE_SWP16(bytes.slice(9, 11));
            decoded.timestamp = readUInt32LE_SWP32(bytes.slice(11, 15));
            decoded.Time = dateFormat(decoded.timestamp);


        }
        else if (bytes[4] === 0x17 && bytes.length === 34)//Set periodic positioning
        {
            decoded.times = [];
            for (var i = 0; i < 4; i++) {
                decoded.times[i] = {};
                decoded.times[i].enable = readUInt8LE(bytes.slice(5 + 7 * i, 6 + 7 * i));
                decoded.times[i].Interval = readUInt16LE_SWP16(bytes.slice(6 + 7 * i, 8 + 7 * i));
                decoded.times[i].time_start_h = readUInt8LE(bytes.slice(8 + 7 * i, 9 + 7 * i));
                decoded.times[i].time_start_m = readUInt8LE(bytes.slice(9 + 7 * i, 10 + 7 * i));
                decoded.times[i].time_end_h = readUInt8LE(bytes.slice(10 + 7 * i, 11 + 7 * i));
                decoded.times[i].time_end_m = readUInt8LE(bytes.slice(11 + 7 * i, 12 + 7 * i));
            }
        }
        else if (bytes[4] === 0xB5 && bytes.length === 11)//SOS upload
        {
            decoded.Status = readUInt8LE(bytes.slice(5, 6));
            decoded.timestamp = readInt32LE_SWP32(bytes.slice(6, 10));
            decoded.Time = dateFormat(decoded.timestamp);
        }
        else if (bytes[4] === 0xD6 && bytes.length === 33)//Bluetooth location
        {
            decoded.type = readUInt8LE(bytes.slice(5, 6));
            decoded.Total_groups = readUInt8LE(bytes.slice(6, 7));
            decoded.utc = readInt32LE_SWP32(bytes.slice(7, 11));
            decoded.Total_PackCount = readUInt8LE(bytes.slice(11, 12));
            decoded.Major0 = bytes[13];
            decoded.Major1 = bytes[14];
            decoded.Minor0 = bytes[15];
            decoded.Minor1 = bytes[16];
            decoded.Rssi0 = readUInt8LE(bytes.slice(16, 17));
            decoded.Major1 = bytes[18];
            decoded.Major0 = bytes[19];
            decoded.Minor1 = bytes[20];
            decoded.Minor0 = bytes[21];
            decoded.Rssi1 = readUInt8LE(bytes.slice(21, 22));
            decoded.utc = readInt32LE_SWP32(bytes.slice(22, 26));
            decoded.Total_PackCount = readUInt8LE(bytes.slice(26, 27));
            decoded.Major0 = bytes[28];
            decoded.Major1 = bytes[29];
            decoded.Minor0 = bytes[30];
            decoded.Minor1 = bytes[31];
            decoded.Rssi0 = readUInt8LE(bytes.slice(31, 32));
        }
        else if (bytes[4] === 0x02 && bytes.length === 12)//Uplink alerting message
        {
            decoded.UpI_warn = (readX16LE_SWP32(bytes.slice(5, 7))).toString(2);
            decoded.timestamp = readInt32LE_SWP32(bytes.slice(7, 11));
            decoded.Time = dateFormat(decoded.timestamp);
        }
        else if (bytes[4] === 0xC7 && bytes.length === 12)//location info
        {
            decoded.Status = readUInt16LE_SWP16(bytes.slice(5, 7));
            decoded.timestamp = readInt32LE_SWP32(bytes.slice(7, 11));
            decoded.Time = dateFormat(decoded.timestamp);
        }
        else if (bytes[4] === 0xBA)//information packet
        {

            decoded.Timestamp_identification = readUInt8LE(bytes.slice(5, 6));
            if (decoded.Timestamp_identification === 0) {
                decoded.Timestamp = readInt32LE_SWP32(bytes.slice(6, 10));
                decoded.Temperature_type = readUInt8LE(bytes.slice(10, 11));
                if (decoded.Temperature_type === 1) {
                    decoded.Body_surface_temperature = readS16LE_SWP32(bytes.slice(11, 13)) / 10;
                    decoded.body_temperature = readS16LE_SWP32(bytes.slice(13, 15)) / 10;
                }
                else if (decoded.Temperature_type === 2) {
                    decoded.Body_surface_temperature = readS16LE_SWP32(bytes.slice(11, 13)) / 10;
                    decoded.body_temperature = readS16LE_SWP32(bytes.slice(13, 15)) / 10;
                    decoded.Ambient_temperature = readS16LE_SWP32(bytes.slice(15, 17)) / 10;
                }

            }
            else {
                decoded.Temperature_type = readUInt8LE(bytes.slice(6, 7));
                if (decoded.Temperature_type === 1) {
                    decoded.Body_surface_temperature = readS16LE_SWP32(bytes.slice(7, 9)) / 10;
                    decoded.body_temperature = readS16LE_SWP32(bytes.slice(9, 11)) / 10;
                }
                else if (decoded.Temperature_type === 2) {
                    decoded.Body_surface_temperature = readS16LE_SWP32(bytes.slice(7, 9)) / 10;
                    decoded.body_temperature = readS16LE_SWP32(bytes.slice(9, 11)) / 10;
                    decoded.Ambient_temperature = readS16LE_SWP32(bytes.slice(11, 13)) / 10;
                }

            }

        }
        else if (bytes[4] === 0x16 && bytes.length === 17)//Upload health alarm data information
        {
            decoded.Type = readUInt8LE(bytes.slice(5, 6));
            decoded.Heart = readUInt16LE_SWP16(bytes.slice(6, 8));
            decoded.temperature = readUInt16LE_SWP16(bytes.slice(8, 10));
            decoded.Pa = readUInt16LE_SWP16(bytes.slice(10, 12));
            decoded.expand = readUInt32LE_SWP32(bytes.slice(12, 16));
        }

    }
    else if (bytes[0] === 0xff && bytes[1] === 0x10 && bytes.length === 10)//Reply to time synchronization request
    {
        decoded.Years = readUInt16LE(bytes.slice(2, 4));
        decoded.Month = readUInt8LE(bytes.slice(4, 5));
        decoded.Day = readUInt8LE(bytes.slice(5, 6));
        decoded.Hour = readUInt8LE(bytes.slice(6, 7));
        decoded.Minute = readUInt8LE(bytes.slice(7, 8));
        decoded.Seconds = readUInt8LE(bytes.slice(8, 9));
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
    var Time = 0;
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = (date.getHours() + 8 >= 24 ? date.getDate() + 1 : date.getDate()) + ' ';
    h = (date.getHours() + 8 >= 24 ? '0' + (date.getHours() - 16) : date.getHours() + 8) + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    utc = '   +08:00'
    Time = Y + M + D + h + m + s + utc;
    return Time;
}

function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}
