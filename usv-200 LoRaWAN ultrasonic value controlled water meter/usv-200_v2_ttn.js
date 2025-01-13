/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product USV-200
 */


function easy_decode(bytes) {
    var decoded = {};
    var len = bytes.length
    var i = 0;
    var type;

    if (bytes[0] != 0x24)
        return decoded;

    var crc = 0;
    for (i = 0; i < len - 1; i++) {
        crc += bytes[i];
    }
    crc %= 256;
    if (crc != bytes[len - 1]) {
        decoded.crc = "Error"
        return decoded;
    }


    // decoded.packet_len = bytes[1];
    // decoded.packet_type = bytes[2];
    len -= 4;
    i = 3;

    do {
        type = bytes[i];
        switch (type) {
            case 0x16:
                decoded.meter_number = bytesToHexString(bytes.slice(i + 1, i + 5));
                len -= 5;
                i += 5;
                break;
            case 0x14:
                var unit = bytes[i + 1];
                if (unit > 1 && unit < 6)
                    decoded.pulse_unit = Math.pow(10, unit - 1) + "L";
                else if (unit == 1)
                    decoded.pulse_unit = 1 + "L";
                else if (unit == 6)
                    decoded.pulse_unit = 5 + "L";
                len -= 2;
                i += 2;
                break;
            case 0x1b:
                var meter_type = bytes[i + 1];
                switch (meter_type) {
                    case 0:
                        decoded.meter_type = "Water meter";
                        break;
                    case 1:
                        decoded.meter_type = "Gas meter";
                        break;
                    case 2:
                        decoded.meter_type = "Heat meter";
                        break;
                    case 3:
                        decoded.meter_type = "Electricity meter";
                        break;
                    default:
                        break;
                }
                len -= 2;
                i += 2;
                break;
            case 0x12:
                var metering_mode = bytes[i + 1];
                switch (metering_mode) {
                    case 0:
                        decoded.metering_mode = "Dual pulse measurement";
                        break;
                    case 1:
                        decoded.metering_mode = "Single pulse measurement";
                        break;
                    case 2:
                        decoded.metering_mode = "Hall measurement";
                        break;
                    case 3:
                        decoded.metering_mode = "ADC collection meter";
                        break;
                    case 4:
                        decoded.metering_mode = "Photoelectric direct reading meter";
                        break;
                    default:
                        break;
                }
                len -= 2;
                i += 2;
            case 0x0B:
                decoded.pulse_count = readUInt32LE(bytes.slice(i + 1, i + 5));
                len -= 5;
                i += 5;
                break;
            case 0x0C:
                decoded.daily_cumulative_flow = readUInt32LE(bytes.slice(i + 1, i + 5));
                len -= 5;
                i += 5;
                break;
            case 0x1A:
                decoded.battery = (readUInt16LE(bytes.slice(i + 1, i + 3)) / 16.4).toFixed(2) + "V";
                len -= 3;
                i += 3;
                break;
            case 0x33:
                decoded.upl_warn = [];
                var warn_data = {};
                warn_data.warn = readUInt16LE_SWP16(bytes.slice(i + 1, i + 3));
                warn_data.warn_hex = warn_data.warn.toString(16);
                warn_data.warn_bit = warn_data.warn.toString(2);

                if ((warn_data.warn >> 15) & 0x01) {
                    warn_data.valve_fault = 1;
                }
                if ((warn_data.warn >> 14) & 0x01) {
                    warn_data.battery_low = 1;
                }
                if ((warn_data.warn >> 13) & 0x01) {
                    warn_data.water_temperature_alarm = 1;
                }
                if ((warn_data.warn >> 12) & 0x01) {
                    warn_data.battery_removed = 1;
                }
                if ((warn_data.warn >> 11) & 0x01) {
                    warn_data.DER = 1;
                }
                if ((warn_data.warn >> 10) & 0x01) {
                    warn_data.valve_status = "Off";
                } else {
                    warn_data.valve_status = "Open";
                }
                if ((warn_data.warn >> 9) & 0x01) {
                    warn_data.ee_fault = 1;
                }
                if ((warn_data.warn >> 7) & 0x01) {
                    warn_data.water_inlet_alarm = 1;
                }
                if ((warn_data.warn >> 6) & 0x01) {
                    warn_data.back_water_alarm = 1;
                }
                if ((warn_data.warn >> 5) & 0x01) {
                    warn_data.orAL = 1;
                }
                if ((warn_data.warn >> 4) & 0x01) {
                    warn_data.water_status = "Blank pipe";
                }
                if ((warn_data.warn >> 3) & 0x01) {
                    warn_data.drip = 1;
                }
                if ((warn_data.warn >> 2) & 0x01) {
                    warn_data.cartridge_igniter = 1;
                }
                if ((warn_data.warn >> 1) & 0x01) {
                    warn_data.back_flow_alarm = 1;
                }
                if ((warn_data.warn) & 0x01) {
                    warn_data.remote_flag = "Remote data";
                } else {
                    warn_data.remote_flag = "Module data";
                }
                decoded.upl_warn.push(warn_data);
                len -= 3;
                i += 3;
                break;
            case 0x23:
                var src = bytes[i + 1];
                if (src == 0) {
                    decoded.trigger_src = "Magnetic trigger";
                } else if (src == 1) {
                    decoded.trigger_src = "Period";
                } else if (src == 2) {
                    decoded.trigger_src = "Magnetic attack";
                } else if (src == 3) {
                    decoded.trigger_src = "Valve control";
                }
                else if (src == 4 || src == 5 || src == 6) {
                    decoded.trigger_src = "Remote";
                }
                len -= 2;
                i += 2;
                break;
            default:
                len = 0;
                break;
        }
    } while (len);
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

function convertBCD2BIN(bytes) {
    return (((((bytes) & 0xF0) >> 4) * 10) + ((bytes) & 0x0F));
}

function reverseBytes(bytes) {
    return ((bytes > 4) & 0x0F) | ((bytes << 4) & 0xF0);
}

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


function Decoder(bytes, port) {
    return easy_decode(bytes);
}

