/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product HKT-SW-100
 */

function easy_decode(bytes) {
    var decoded = {};

    var len = bytes.length;

    do {
        if (bytes[0] == 0xBD) {
            switch (bytes[1]) {
                case 0xF6:
                    decoded.bat_volt = readUInt16LE_SWP16(bytes.slice(2, 4));
                    decoded.step_num = readUInt32LE_SWP32(bytes.slice(4, 8));
                    decoded.signal_strength = readUInt8LE(bytes.slice(8, 9));
                    bytes = bytes.slice(10, len);
                    len -= 10;
                    break;

                case 0x03:
                    decoded.lon = readDoubleLE(bytes.slice(2, 10));
                    decoded.lat = readDoubleLE(bytes.slice(10, 18));
                    decoded.north_south = String.fromCodePoint(bytes[18]);
                    decoded.east_west = String.fromCodePoint(bytes[19]);
                    decoded.status = String.fromCodePoint(bytes[20]);
                    bytes = bytes.slice(22, len);
                    len -= 22;
                    break;

                case 0x1F:
                    decoded.bp_high = bytes[2];
                    decoded.bp_low = bytes[3];
                    decoded.bp_heart = bytes[4];
                    decoded.wrist_temperature = readUInt16LE_SWP16(bytes.slice(5, 7)) / 10;
                    decoded.body_temperature = readUInt16LE_SWP16(bytes.slice(7, 9)) / 10;
                    decoded.battery_level = readUInt16LE_SWP16(bytes.slice(9, 11));
                    decoded.step = readUInt32LE_SWP32(bytes.slice(11, 15));
                    decoded.signal_strength = bytes[15];
                    bytes = bytes.slice(17, len);
                    len -= 17;
                    break;
                
                case 0x17:
                    decoded.enable_1 = bytes[2];
                    decoded.Interval_1 = readUInt16LE_SWP16(bytes.slice(3, 5));
                    decoded.time_start_h_1 = bytes[5];
                    decoded.time_start_m_1 = bytes[6];
                    decoded.time_end_h_1 = bytes[7];
                    decoded.time_end_m_1 = bytes[8];

                    decoded.enable_2 = readUInt8LE(bytes.slice(9, 10));
                    decoded.Interval_2 = readUInt16LE_SWP16(bytes.slice(10, 12));
                    decoded.time_start_h_2 = bytes[12];
                    decoded.time_start_m_2 = bytes[13];
                    decoded.time_end_h_2 = bytes[14];
                    decoded.time_end_m_2 = bytes[15];

                    decoded.enable_3 = bytes[16];
                    decoded.Interval_3 = readUInt16LE_SWP16(bytes.slice(17, 19));
                    decoded.time_start_h_3 = bytes[19];
                    decoded.time_start_m_3 = bytes[20];
                    decoded.time_end_h_3 = bytes[21];
                    decoded.time_end_m_3 = bytes[22];

                    decoded.enable_4 = bytes[23];
                    decoded.Interval_4 = readUInt16LE_SWP16(bytes.slice(24, 26));
                    decoded.time_start_h_4 = bytes[26];
                    decoded.time_start_m_4 = bytes[27];
                    decoded.time_end_h_4 = bytes[28];
                    decoded.time_end_m_4 = bytes[29];
                    bytes = bytes.slice(31, len);
                    len -= 31;
                    break;

                case 0xB5:
                    decoded.sos = bytes[2];
                    bytes = bytes.slice(4, len);
                    len -= 4;
                    break;
    
                case 0xD6:
                    decoded.Type = bytes[2];
                    decoded.group = bytes[3];
                    decoded.BLE = [];
                    var pack_count = 0;
                    var Timestamp = 0;
                    var count = 0;
                    var data_len = 0;
                    for (var group = 0; group < decoded.group; group++) {
                        count = pack_count;
                        pack_count = bytes[4 + count * 5 + group * 5];
                        data_len += 5;

                        decoded.BLE.push("PackCount: " + pack_count);
                        for (var pack = 0; pack < pack_count; pack++) {
                            var data = {};
                            data.Major = readUInt16LE_SWP16(bytes.slice(5 + pack * 5, 7 + pack * 5));//Major
                            data.Minor = readUInt16LE_SWP16(bytes.slice(7 + pack * 5, 9 + pack * 5));//Minor
                            data.Rssi = readInt8LE(bytes[9 + pack * 5]);//Rssi
                            decoded.BLE.push(data);
                        }
                        data_len += (1 + pack_count * 5);
                    }
                    bytes = bytes.slice((4 + data_len), len);
                    len -= (4 + data_len);
                    break;

                case 0x02:
                    decoded.upl_warn = [];
                    var warn_data = {};
                    warn_data.warn = readUInt16LE_SWP16(bytes.slice(2, 4));
                    warn_data.warn_hex = warn_data.warn.toString(16);
                    warn_data.warn_bit = warn_data.warn.toString(2);
                    if ((warn_data.warn >> 14) & 0x01) {
                        warn_data.fall_alarm = 1;
                    }

                    if ((warn_data.warn >> 8) & 0x01) {
                        warn_data.wear = 1;
                    }

                    if ((warn_data.warn >> 7) & 0x01) {
                        warn_data.dis_sos = 1;
                    }

                    if ((warn_data.warn >> 4) & 0x01) {
                        warn_data.wear = 0;
                    }

                    if ((warn_data.warn >> 2) & 0x01) {
                        warn_data.power_off = 1;
                    }

                    if ((warn_data.warn >> 1) & 0x01) {
                        warn_data.sos = 1;
                    }

                    if ((warn_data.warn) & 0x01) {
                        warn_data.power_low = 1;
                    }
                    decoded.upl_warn.push(warn_data);
                    bytes = bytes.slice(5, len);
                    len -= 5;
                    break;
                default:
                    len = 0;
                    break;

            }
        }
        else if (bytes[0] == 0xFF) {
            if (bytes[1] == 0x00) {
                decoded.time_request = 1;
            }
            bytes = bytes.slice(3, len);
            len -= 3;
        }
        else {
            len = 0;
        }
    }
    while (len);
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
