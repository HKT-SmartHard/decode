/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SW-200
 */

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] == 0xBD) {
        switch (bytes[1]) {
            case 0xF9:
                decoded.battery_type = bytes[2];
                decoded.battery_volt = readUInt16LE_SWP16(bytes.slice(3, 5));
                decoded.signal_type = bytes[5];
                decoded.signal_strength = readUInt16LE_SWP16(bytes.slice(6, 8));
                decoded.other_type = bytes[8];
                decoded.num = readUInt32LE_SWP32(bytes.slice(9, 13));
                decoded.timestamp = readUInt32LE_SWP32(bytes.slice(13, 17));
                break;

            case 0x03:
                decoded.lon = readDoubleLE(bytes.slice(2, 10));
                decoded.lat = readDoubleLE(bytes.slice(10, 18));
                decoded.north_south = String.fromCodePoint(bytes[18]);
                decoded.east_west = String.fromCodePoint(bytes[19]);
                decoded.status = String.fromCodePoint(bytes[20]);
                decoded.timestamp = readUInt32LE_SWP32(bytes.slice(21, 25));
                break;

            case 0x32:
                decoded.bp_high = bytes[2];
                decoded.bp_low = bytes[3];
                decoded.bp_heart = bytes[4];
                decoded.blood_oxygen = bytes[5];
                decoded.wrist_temperature = readUInt16LE_SWP16(bytes.slice(6, 8)) / 10;
                decoded.body_temperature = readUInt16LE_SWP16(bytes.slice(8, 10)) / 10;
                decoded.step = readUInt32LE_SWP32(bytes.slice(10, 14));
                decoded.battery_level = bytes[14];
                decoded.signal_strength = bytes[15];
                decoded.timestamp = readUInt32LE_SWP32(bytes.slice(16, 20));
                break;

            case 0xC2:
                decoded.bp_high = readUInt16LE_SWP16(bytes.slice(2, 4));
                decoded.bp_low = readUInt16LE_SWP16(bytes.slice(4, 6));
                decoded.bp_heart = readUInt16LE_SWP16(bytes.slice(6, 8));
                decoded.timestamp = readUInt32LE_SWP32(bytes.slice(8, 12));
                break;

            case 0xC6:
                decoded.blood_oxygen = readUInt16LE_SWP16(bytes.slice(2, 4));
                decoded.timestamp = readUInt32LE_SWP32(bytes.slice(4, 8));
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
                break;

            case 0xB5:
                decoded.status = bytes[2];
                decoded.timestamp = readUInt32LE_SWP32(bytes.slice(3, 7));
                break;

            case 0xBA:
                var N = 0;
                decoded.with_without = bytes[2];
                if (decoded.with_without == 0x00) {
                    N = 4;
                    decoded.timestamp = readUInt32LE_SWP32(bytes.slice(3, 7));
                }
                decoded.temperature_type = readUInt8LE(bytes.slice(3 + N, 4 + N));
                decoded.wrist_temperature = readUInt16LE_SWP16(bytes.slice(4 + N, 6 + N)) / 10;
                decoded.body_temperature = readUInt16LE_SWP16(bytes.slice(6 + N, 8 + N)) / 10;
                if (decoded.temperature_type == 0x02) {
                    decoded.environment_temperature = readUInt16LE_SWP16(bytes.slice(6 + N, 8 + N)) / 10;
                }
                break;

            case 0xD6:
                decoded.Type = bytes[2];
                decoded.group = bytes[3];
                decoded.BLE = [];
                var pack_count = 0;
                var Timestamp = 0;
                var count = 0;
                for (var group = 0; group < decoded.group; group++) { //bd d6 00 01 f7f2d964 03 0800 8504 21 0805 6305 be 0807 0605 b5c4
                    count = pack_count;
                    pack_count = bytes[8 + count * 5 + group * 5];
                    Timestamp = readUInt32LE_SWP32(bytes.slice(4 + count * 5 + group * 5, 8 + count * 5 + group * 5));

                    decoded.BLE.push("PackCount: " + pack_count);
                    decoded.BLE.push("Timestamp: " + Timestamp);

                    for (var pack = 0; pack < pack_count; pack++) {
                        var data = {};
                        data.Major = readUInt16LE_SWP16(bytes.slice(9 + pack * 5, 11 + pack * 5));//Major
                        data.Minor = readUInt16LE_SWP16(bytes.slice(11 + pack * 5, 13 + pack * 5));//Minor
                        data.Rssi = readInt8LE(bytes[13 + pack * 5]);//Rssi
                        decoded.BLE.push(data);
                    }
                }
                // console.table(decoded.BLE);
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
                decoded.timestamp = readUInt32LE_SWP32(bytes.slice(4, 8));
                break;
            default:
                break;

        }
    }
    else if (bytes[0] == 0xFF) {
        if (bytes[1] == 0x00) {
            decoded.time_request = 1;
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
