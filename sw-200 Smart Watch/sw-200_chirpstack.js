/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-SW-200
 */

function easy_decode(bytes) {
    var decoded = {};

    decide_L = bytes.length;
    while (decide_L >= 2) {
        if (bytes[0] === 0xBD) {
            if (bytes[1] === 0xF9) {
                decoded.Bat_type = readUInt8LE(bytes.slice(2, 3));
                decoded.Bat_volt = (bytes[3] + (bytes[4] << 8));
                decoded.Signal_type = readUInt8LE(bytes.slice(5, 6));
                decoded.Signal_strength = (bytes[6] + (bytes[7] << 8));
                decoded.other_type = readUInt8LE(bytes.slice(8, 9));
                decoded.num = (bytes[9] + (bytes[10] << 8) + (bytes[11] << 16) + (bytes[12] << 24));
                decoded.timestamp = dateFormat(bytes[13] + (bytes[14] << 8) + (bytes[15] << 16) + (bytes[16] << 24));
                bytes.splice(1, 18);
            }
            else if (bytes[1] === 0x03) {
                decoded.lon = readDoubleLE(bytes.slice(2, 10));
                decoded.lat = readDoubleLE(bytes.slice(10, 18));
                decoded.north_south = String.fromCodePoint(readUInt8LE(bytes.slice(18, 19)));
                decoded.east_west = String.fromCodePoint(readUInt8LE(bytes.slice(19, 20)));
                decoded.status = String.fromCodePoint(readUInt8LE(bytes.slice(20, 21)));
                decoded.timestamp = dateFormat(bytes[21] + (bytes[22] << 8) + (bytes[23] << 16) + (bytes[24] << 24));
                bytes.splice(1, 26);
            }
            else if (bytes[1] === 0xC2) {
                decoded.bp_high = readUInt16LE_SWP16(bytes.slice(2, 4));
                decoded.bp_low = readUInt16LE_SWP16(bytes.slice(4, 6));
                decoded.Bp_heart = (bytes[6] + (bytes[7] << 8));
                decoded.timestamp = dateFormat(bytes[8] + (bytes[9] << 8) + (bytes[10] << 16) + (bytes[11] << 24));
                bytes.splice(1, 13);
            }
            else if (bytes[1] === 0xC6) {

                decoded.BloodOxygen = (bytes[2] + (bytes[3] << 8));
                decoded.timestamp = dateFormat(bytes[4] + (bytes[5] << 8) + (bytes[6] << 16) + (bytes[7] << 24));
                bytes.splice(1, 9);
            }
            else if (bytes[1] === 0x17) {
                decoded.enable_1 = readUInt8LE(bytes.slice(2, 3));
                decoded.Interval_1 = (bytes[3] + (bytes[4] << 8));
                decoded.time_start_h_1 = readUInt8LE(bytes.slice(5, 6));
                decoded.time_start_m_1 = readUInt8LE(bytes.slice(6, 7));
                decoded.time_end_h_1 = readUInt8LE(bytes.slice(7, 8));
                decoded.time_end_m_1 = readUInt8LE(bytes.slice(8, 9));

                decoded.enable_2 = readUInt8LE(bytes.slice(9, 10));
                decoded.Interval_2 = (bytes[10] + (bytes[11] << 8));
                decoded.time_start_h_2 = readUInt8LE(bytes.slice(12, 13));
                decoded.time_start_m_2 = readUInt8LE(bytes.slice(13, 14));
                decoded.time_end_h_2 = readUInt8LE(bytes.slice(14, 15));
                decoded.time_end_m_2 = readUInt8LE(bytes.slice(15, 16));

                decoded.enable_3 = readUInt8LE(bytes.slice(16, 17));
                decoded.Interval_3 = (bytes[17] + (bytes[18] << 8));
                decoded.time_start_h_3 = readUInt8LE(bytes.slice(19, 20));
                decoded.time_start_m_3 = readUInt8LE(bytes.slice(20, 21));
                decoded.time_end_h_3 = readUInt8LE(bytes.slice(21, 22));
                decoded.time_end_m_3 = readUInt8LE(bytes.slice(22, 23));

                decoded.enable_4 = readUInt8LE(bytes.slice(23, 24));
                decoded.Interval_4 = (bytes[24] + (bytes[25] << 8));
                decoded.time_start_h_4 = readUInt8LE(bytes.slice(26, 27));
                decoded.time_start_m_4 = readUInt8LE(bytes.slice(27, 28));
                decoded.time_end_h_4 = readUInt8LE(bytes.slice(28, 29));
                decoded.time_end_m_4 = readUInt8LE(bytes.slice(29, 30));
                bytes.splice(1, 31);
            }
            else if (bytes[1] === 0xB5) {
                decoded.Status = readUInt8LE(bytes.slice(2, 3));
                decoded.timestamp = dateFormat(bytes[3] + (bytes[4] << 8) + (bytes[5] << 16) + (bytes[6] << 24));
                bytes.splice(1, 8);
            }
            else if (bytes[1] === 0xBA) {
                var N = 0;
                decoded.with_without = readUInt8LE(bytes.slice(2, 3));
                if (decoded.with_without === 0x00) {
                    N = 4;
                    decoded.timestamp = dateFormat(bytes[3] + (bytes[4] << 8) + (bytes[5] << 16) + (bytes[6] << 24));
                }
                else {
                    N = 0;
                }
                decoded.Temp_type = readUInt8LE(bytes.slice(3 + N, 4 + N));
                decoded.wrist_Temp = (bytes[4 + N] + (bytes[5 + N] << 8)) / 10;
                decoded.Body_Temp = (bytes[6 + N] + (bytes[7 + N] << 8)) / 10;
                if (decoded.Temp_type === 0x02) {
                    decoded.environment_temperature = (bytes[8 + N] + (bytes[9 + N] << 8)) / 10;
                    bytes.splice(1, 11 + N);
                }
                else {
                    bytes.splice(1, 9 + N);
                }
            }
            else if (bytes[1] === 0xD6) {
                decoded.Type = readUInt8LE(bytes.slice(2, 3));
                decoded.Total_groups = readUInt8LE(bytes.slice(3, 4));
                var N1 = decoded.Total_groups;
                decoded.ALL = [];
                while (N1 >= 1) {
                    decoded.timestamp = dateFormat(bytes[4] + (bytes[5] << 8) + (bytes[6] << 16) + (bytes[7] << 24));
                    decoded.Total_PackCount = readUInt8LE(bytes.slice(8, 9));
                    var N2 = decoded.Total_PackCount;
                    var all = [];
                    var data = {};
                    while (N2 >= 1) {
                        data.Major0 = (bytes[9] + (bytes[10] << 8));//Major
                        data.Minor0 = (bytes[11] + (bytes[12] << 8));//Minor0
                        data.Rssi0 = readInt8LE(bytes.slice(13, 14));//Rssi0
                        all[N2] = data;
                        console.table(all[N2]);
                        N2--;
                        bytes.splice(9, 5);
                    }
                    decoded.ALL[N1] = all;
                    bytes.splice(4, 4);
                    N1--;
                }
                bytes.splice(1, 6);
            }
            else if (bytes[1] === 0x02) {
                decoded.Upl_warn = (bytes[3] + (bytes[2] << 8)).toString(16);//Bitfield see below
                decoded.timestamp = dateFormat(bytes[4] + (bytes[5] << 8) + (bytes[6] << 16) + (bytes[7] << 24));
                bytes.splice(1, 9);
            }
        }
        else if (bytes[0] === 0xFF) {
            if (bytes[1] === 0x00 && bytes[2] === 0xFF) {
                decoded.time_request = 1;
            }
            else if (bytes[1] === 0x10 && bytes[9] === 0xFF) {
                decoded.Year = (bytes[3] + (bytes[2] << 8)).toString(16);//Year
                decoded.Month = readUInt8LE(bytes.slice(4, 5));//Month
                decoded.Day = readUInt8LE(bytes.slice(5, 6));//Day
                decoded.Hour = readUInt8LE(bytes.slice(6, 7));//Hour
                decoded.Minitus = readUInt8LE(bytes.slice(7, 8));//Minitus
                decoded.Second = readUInt8LE(bytes.slice(8, 9));//Second
            }
        }
        decide_L = bytes.length;
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

function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}